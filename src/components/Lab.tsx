import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { measureSpring } from 'remotion';
import { FORMATS, LAB_SECONDS, SpringCard, type Format } from '../compositions/SpringCard';
import { useT } from '../i18n';
import { Transport } from './Transport';
import { Corners, Label, Reveal, Segmented } from './ui';

const FPS_OPTIONS = ['24', '30', '60'] as const;
type Fps = (typeof FPS_OPTIONS)[number];

export function Lab() {
  const { t, lang } = useT();
  const playerRef = useRef<PlayerRef>(null);
  const [damping, setDamping] = useState(11);
  const [mass, setMass] = useState(0.8);
  const [stiffness, setStiffness] = useState(140);
  const [fpsStr, setFps] = useState<Fps>('30');
  const [format, setFormat] = useState<Format>('16:9');
  const [business, setBusiness] = useState(t.lab.defaultBusiness);
  const [offer, setOffer] = useState(t.lab.defaultOffer);
  const fps = Number(fpsStr);
  const dur = LAB_SECONDS * fps;
  const { width, height } = FORMATS[format];

  // Keep the default offer in the active language until the visitor edits it.
  const edited = useRef(false);
  useEffect(() => {
    if (!edited.current) setOffer(t.lab.defaultOffer);
  }, [lang, t.lab.defaultOffer]);

  const settle = measureSpring({ fps, config: { damping, mass, stiffness } });

  const replay = () => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
  };

  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) playerRef.current?.play();
      else playerRef.current?.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Restart from frame 0 whenever physics change, so the effect is visible.
  useEffect(() => {
    const id = setTimeout(replay, 120);
    return () => clearTimeout(id);
  }, [damping, mass, stiffness, fps]);

  return (
    <section id="lab" ref={sectionRef} className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Label tone="magenta">{t.lab.label}</Label>
            <h2 className="mt-6 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.lab.title}</h2>
          </Reveal>
          <Reveal delay={120} className="flex items-end lg:col-span-5">
            <p className="text-[16.5px] leading-[1.6] text-dim">{t.lab.body}</p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="grid grid-cols-[minmax(0,1fr)] border border-line bg-panel lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 border-b border-line p-3 sm:p-5 lg:border-b-0 lg:border-r">
              <div className="relative h-[clamp(320px,52vw,560px)] bg-paper">
                <Player
                  ref={playerRef}
                  component={SpringCard}
                  inputProps={{ damping, mass, stiffness, business, offer, kicker: t.lab.cardKicker }}
                  durationInFrames={dur}
                  compositionWidth={width}
                  compositionHeight={height}
                  fps={fps}
                  autoPlay
                  loop
                  controls={false}
                  clickToPlay={false}
                  initiallyMuted
                  numberOfSharedAudioTags={0}
                  acknowledgeRemotionLicense
                  style={{ width: '100%', height: '100%' }}
                />
                <Corners className="text-fg/30" size={10} />
                <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  {width}×{height} · {fps} fps
                </span>
              </div>
              <Transport className="mt-3" playerRef={playerRef} durationInFrames={dur} fps={fps} markers={settle < dur ? [settle] : []} />
            </div>

            <div className="flex min-w-0 flex-col divide-y divide-line">
              <Group title={t.lab.physics}>
                <Fader label={t.lab.damping} value={damping} min={2} max={40} step={1} onChange={setDamping} />
                <Fader label={t.lab.mass} value={mass} min={0.2} max={4} step={0.1} onChange={setMass} />
                <Fader label={t.lab.stiffness} value={stiffness} min={20} max={400} step={5} onChange={setStiffness} />
              </Group>
              <Group title={t.lab.format}>
                <div className="flex flex-wrap gap-2">
                  <Segmented<Format> options={['16:9', '9:16', '1:1']} value={format} onChange={setFormat} ariaLabel="Format" />
                  <Segmented<Fps> options={FPS_OPTIONS} value={fpsStr} onChange={setFps} render={(v) => `${v}`} ariaLabel="FPS" />
                </div>
              </Group>
              <Group title={t.lab.data}>
                <TextField label={t.lab.business} value={business} onChange={setBusiness} />
                <TextField
                  label={t.lab.offer}
                  value={offer}
                  onChange={(v) => {
                    edited.current = true;
                    setOffer(v);
                  }}
                />
              </Group>
              <div className="flex-1 p-5">
                <pre className="overflow-x-auto font-mono text-[12px] leading-[1.7] text-dim">
                  <span className="text-sky-ink">spring</span>({'{'}
                  {'\n  '}frame,
                  {'\n  '}fps: <span className="text-magenta">{fps}</span>,
                  {'\n  '}config: {'{'}
                  {'\n    '}damping: <span className="text-magenta">{damping}</span>,
                  {'\n    '}mass: <span className="text-magenta">{mass.toFixed(1)}</span>,
                  {'\n    '}stiffness: <span className="text-magenta">{stiffness}</span>,
                  {'\n  '}
                  {'},'}
                  {'\n'}
                  {'})'}
                </pre>
                <div className="mt-4 flex items-center justify-between gap-3 font-mono text-[11px]">
                  <span className="text-dim">
                    {t.lab.settles} <span className="tabular-nums text-sky-ink">{settle}</span>
                    <span className="text-faint"> · {(settle / fps).toFixed(2)}s</span>
                  </span>
                  <button
                    onClick={replay}
                    className="shrink-0 whitespace-nowrap rounded-[3px] border border-line-strong px-3 py-1.5 uppercase tracking-[0.12em] text-fg transition-transform duration-300 ease-[var(--ease-spring)] hover:border-sky/60 active:scale-90"
                  >
                    ↺ {t.lab.replay}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{title}</div>
      {children}
    </div>
  );
}

function Fader({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-mono text-[11.5px]">
        <span className="text-dim">{label}</span>
        <span className="tabular-nums text-fg">{step < 1 ? value.toFixed(1) : value}</span>
      </span>
      <input
        type="range"
        className="fader"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--p': `${p}%` } as CSSProperties}
      />
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-[3px] border border-line bg-paper px-3 py-2 transition-colors focus-within:border-sky/60">
      <span className="w-[72px] shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">{label}</span>
      <input
        value={value}
        maxLength={28}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] text-fg outline-none"
      />
    </label>
  );
}
