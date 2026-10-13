import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { FORMATS, LAB_SECONDS, SpringCard, type Format } from '../compositions/SpringCard';
import { useT } from '../i18n';
import { Label, Reveal, Segmented } from './ui';

export function Lab() {
  const { t, lang } = useT();
  const playerRef = useRef<PlayerRef>(null);
  const [bounce, setBounce] = useState(7);
  const [speed, setSpeed] = useState(3);
  const [format, setFormat] = useState<Format>('16:9');
  const [business, setBusiness] = useState(t.lab.defaultBusiness);
  const [offer, setOffer] = useState(t.lab.defaultOffer);
  const fps = 30;
  const dur = LAB_SECONDS * fps;
  const { width, height } = FORMATS[format];
  // Friendly knobs mapped onto spring() physics.
  const damping = 32 - bounce * 3;
  const stiffness = 40 + speed * 36;

  // Keep the default offer in the active language until the visitor edits it.
  const edited = useRef(false);
  useEffect(() => {
    if (!edited.current) setOffer(t.lab.defaultOffer);
  }, [lang, t.lab.defaultOffer]);

  const replay = () => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
  };

  // Back to the default knobs, then play from frame 0.
  const reset = () => {
    setBounce(7);
    setSpeed(3);
    setFormat('16:9');
    replay();
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

  // Restart from frame 0 whenever the knobs change, so the effect is visible.
  useEffect(() => {
    const id = setTimeout(replay, 120);
    return () => clearTimeout(id);
  }, [bounce, speed, format]);

  return (
    <section id="lab" ref={sectionRef} className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Label tone="magenta">{t.lab.label}</Label>
          <h2 className="mt-6 text-[clamp(34px,4.6vw,68px)] font-semibold leading-[0.98] tracking-[-0.045em]">{t.lab.title}</h2>
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid grid-cols-[minmax(0,1fr)] border border-line bg-panel lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 border-b border-line p-3 sm:p-5 lg:border-b-0 lg:border-r">
              <div className="relative h-[clamp(320px,48vw,520px)] bg-paper">
                <Player
                  ref={playerRef}
                  component={SpringCard}
                  inputProps={{ damping, mass: 0.8, stiffness, business, offer, kicker: t.lab.cardKicker }}
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
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6 p-5 sm:p-6">
              <Segmented<Format> options={['16:9', '9:16', '1:1']} value={format} onChange={setFormat} ariaLabel="Format" />
              <Fader label={t.lab.damping} value={bounce} min={1} max={10} step={1} onChange={setBounce} />
              <Fader label={t.lab.stiffness} value={speed} min={1} max={10} step={1} onChange={setSpeed} />
              <div className="space-y-2">
                <TextField label={t.lab.business} value={business} onChange={setBusiness} />
                <TextField
                  label={t.lab.offer}
                  value={offer}
                  onChange={(v) => {
                    edited.current = true;
                    setOffer(v);
                  }}
                />
              </div>
              <button
                onClick={reset}
                className="mt-auto self-start rounded-[3px] border border-line-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg transition-transform duration-300 ease-[var(--ease-spring)] hover:border-sky/60 active:scale-90"
              >
                ↺ {t.lab.replay}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
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
