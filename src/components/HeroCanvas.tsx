import { useEffect, useRef } from 'react';

/** The composition the ribbon is drawn in; the box below cover-scales it into the hero. */
const W = 1600;
const H = 900;
/** One loop, in ms (300 frames at 30 FPS). */
const LOOP = 10_000;
/** Frame interval: the ribbon moves slowly, 30 FPS is enough and halves the GPU work. */
const FRAME = 1000 / 30;

/*
 * A dot-matrix ribbon, computed per pixel on the GPU: each pixel finds its grid cell, evaluates the
 * ribbon at the cell centre and decides whether it falls inside that cell's square. The main thread
 * only sets the loop phase, so the animation costs no layout, no React renders and no long tasks.
 */
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_offset;
uniform float u_scale;
uniform float u_height;
uniform float u_phase;
const float W = ${W}.0;
const float H = ${H}.0;
const float STEP = 12.0;

float field(vec2 c, float t) {
  float u = c.x / W;
  float center = H * 0.98 - u * H * 0.95 + sin(u * 5.2 + t) * 70.0 + sin(u * 11.0 - t * 2.0) * 22.0;
  float s = sin(u * 3.1 + t);
  float width = 70.0 + 55.0 * s * s + u * 40.0;
  float twist = cos(u * 7.0 - t) * 0.5 + 0.5;
  float centerB = center - 120.0 - 60.0 * sin(u * 4.0 - t);
  float d = (c.y - center) / width;
  float dB = (c.y - centerB) / (width * 0.55);
  float v = exp(-d * d) * (0.55 + 0.45 * twist) + exp(-dB * dB) * 0.35 * (1.0 - twist);
  // fade the ribbon in from the left so the headline stays readable
  return v * clamp((u - 0.08) * 2.4, 0.0, 1.0);
}

void main() {
  vec2 p = (vec2(gl_FragCoord.x, u_height - gl_FragCoord.y) - u_offset) / u_scale;
  float px = 1.0 / u_scale;
  float t = u_phase * 6.2831853;
  float scanX = (u_phase * 1.3 - 0.15) * W;
  vec2 c = floor(p / STEP) * STEP + STEP * 0.5;
  vec4 col = vec4(0.0);
  if (c.x > 0.0 && c.x < W && c.y > 0.0 && c.y < H) {
    float v = field(c, t);
    float size = 1.5;
    vec3 rgb = vec3(11.0, 18.0, 32.0) / 255.0;
    float a = 0.12;
    if (v >= 0.06) {
      float lvl = min(5.0, floor(v * 6.0));
      size = 2.0 + lvl / 5.0 * (STEP - 4.0);
      a = 0.34 + lvl / 5.0 * 0.66;
      if (abs(c.x - scanX) < 26.0) {
        rgb = vec3(224.0, 23.0, 158.0) / 255.0;
        a = min(1.0, a + 0.15);
      } else {
        rgb = vec3(34.0, 174.0, 245.0) / 255.0;
      }
    }
    vec2 q = abs(p - c) - size * 0.5;
    float cover = clamp(0.5 - q.x / px, 0.0, 1.0) * clamp(0.5 - q.y / px, 0.0, 1.0);
    col = vec4(rgb, 1.0) * a * cover;
  }
  // the render scan column, 1 unit wide
  float sx = floor(scanX + 0.5);
  float line = clamp((min(p.x + px * 0.5, sx + 1.0) - max(p.x - px * 0.5, sx)) / px, 0.0, 1.0);
  line *= 0.6 * step(0.0, p.y) * step(p.y, H);
  col = vec4(224.0, 23.0, 158.0, 255.0) / 255.0 * line + col * (1.0 - line);
  gl_FragColor = col;
}`;

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

function compile(gl: WebGLRenderingContext) {
  const prog = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, VERT],
    [gl.FRAGMENT_SHADER, FRAG],
  ] as const) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

/** WebGL drawn on the CPU (SwiftShader, llvmpipe): animating there would cost the main thread. */
function isSoftware(gl: WebGLRenderingContext) {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  return /swiftshader|llvmpipe|softpipe|software/i.test(name);
}

/**
 * The hero's dot ribbon. Starts once the browser is idle after load, draws only while on screen and
 * the tab is visible, and holds a single frame for reduced motion or software rendering. Without
 * WebGL the hero stays plain.
 */
export function HeroCanvas() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const bx = box.current;
    if (!cv || !bx) return;
    let still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    let stop = () => {};

    const init = () => {
      const gl = cv.getContext('webgl', { antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
      const prog = gl && compile(gl);
      if (!gl || !prog) return;
      still ||= isSoftware(gl);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const loc = (n: string) => gl.getUniformLocation(prog, n);
      const [uOffset, uScale, uHeight, uPhase] = ['u_offset', 'u_scale', 'u_height', 'u_phase'].map(loc);

      const draw = (now: number) => {
        gl.uniform1f(uPhase, still ? 0 : (now % LOOP) / LOOP);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      let last = 0;
      const loop = (now: number) => {
        if (now - last >= FRAME - 1) {
          last = now;
          draw(now);
        }
        raf = requestAnimationFrame(loop);
      };
      const play = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (still) draw(0);
        else if (visible && !document.hidden) raf = requestAnimationFrame(loop);
      };

      // Map the cover-scaled composition box onto the canvas, at up to 1.5 device pixels per CSS pixel
      // (the composition itself is 1600 px wide, so this is already sharper than the dots need).
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const c = cv.getBoundingClientRect();
        const b = bx.getBoundingClientRect();
        cv.width = Math.max(1, Math.round(c.width * dpr));
        cv.height = Math.max(1, Math.round(c.height * dpr));
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(uOffset, (b.left - c.left) * dpr, (b.top - c.top) * dpr);
        gl.uniform1f(uScale, (b.width / W) * dpr);
        gl.uniform1f(uHeight, cv.height);
        draw(performance.now());
      };
      fit();
      cv.style.opacity = '1';

      const ro = new ResizeObserver(fit);
      ro.observe(cv);
      ro.observe(bx);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        play();
      });
      io.observe(cv);
      document.addEventListener('visibilitychange', play);
      play();
      stop = () => {
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', play);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };

    // Shader compilation stays out of the way of the first paint and hydration.
    const idle = window.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 200));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    let id = 0;
    const schedule = () => (id = idle(init, { timeout: 1500 }) as number);
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      cancelIdle(id);
      cancelAnimationFrame(raf);
      stop();
    };
  }, []);

  return (
    <>
      <div
        ref={box}
        className="absolute left-1/2 top-1/2"
        style={{ width: 'max(100%, calc((100svh - 4rem) * 16 / 9))', aspectRatio: '16 / 9', transform: 'translate(-50%, -50%)' }}
      />
      <canvas ref={canvas} className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
    </>
  );
}
