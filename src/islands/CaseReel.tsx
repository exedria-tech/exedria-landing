import { Work } from '../components/Work';
import { Label } from '../components/ui';
import { findProject, type Project } from '../data/projects';
import { useT } from '../i18n';

/** The case study player with its write-up beside it. An island: props must be JSON, so it takes the slug. */
export function CaseReel({ slug }: { slug: string }) {
  const p = findProject(slug)!;
  return <Work p={p} id="reel" intro={<Details p={p} />} />;
}

/** Facts table plus the short write-up. */
export function Details({ p }: { p: Project }) {
  const { lang } = useT();
  return (
    <div>
      <dl className="grid grid-cols-2 border-t border-line">
        {p.facts.map((f) => (
          <div key={f.k.ro} className="border-b border-line py-3 pr-4">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{f.k[lang]}</dt>
            <dd className="mt-1 text-[15px] text-fg">{f.v[lang]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10 space-y-8">
        {p.sections.map((s) => (
          <div key={s.title.ro}>
            <Label>{s.title[lang]}</Label>
            <p className="mt-3 max-w-[52ch] text-[16.5px] leading-[1.6] text-dim">{s.body[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
