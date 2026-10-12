import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const ro = {
  nav: {
    work: 'Lucrări',
    services: 'Servicii',
    lab: 'Laborator',
    process: 'Proces',
    contact: 'Contact',
    cta: 'Pornește un proiect',
  },
  hero: {
    metaA: 'Studio de video programatic și software',
    metaB: 'Pentru afaceri din România',
    status: 'rendering',
    line1: 'Video scris',
    line2: 'în cod.',
    lead: 'Clipuri promo scrise în cod, plus site-ul, rezervările și software-ul din spatele lor. Cu suport în română.',
    ctaPrimary: 'Pornește un proiect',
    ctaSecondary: 'Vezi un clip',
    scrubHint: 'Trage de riglă. Fiecare punct e o funcție de cadru.',
  },
  work: {
    label: 'Lucrare selectată',
    client: 'Marina Park · Vama Veche',
    title: 'Un camping din Vama Veche, spus în 40 de secunde.',
    body: 'Promo vertical pentru Reels și TikTok. Fiecare scenă e un component.',
    tracks: 'Piste',
    scenes: 'Scene',
    text: 'Text',
    audio: 'Audio',
    hintTrack: 'Apasă pe o scenă ca să sari la ea.',
    meta: [
      ['Format', '9:16 · 1080×1920'],
      ['Durată', '00:40 · 1200 cadre'],
      ['Livrare', 'Reels, TikTok, Stories'],
    ] as [string, string][],
  },
  scenes: [
    { name: 'Logo', note: 'Litere din lemn, construite cadru cu cadru.' },
    { name: 'Casa', note: 'Stil dobrogean, din 2000. Etichetele de material apar pe rând.' },
    { name: 'Căsuțe din lemn', note: 'Bungalouri cu terasă. Cameră în travelling lateral.' },
    { name: 'Foișor', note: 'Cafea, prieteni, umbră. Text italic: „la umbră, sub stuf…”' },
    { name: 'Soare', note: 'Tranziție radială: „…și ieși la soare”.' },
    { name: 'Rulote și corturi', note: 'Loc generos, la umbră de copaci. „STAI. RESPIRĂ.”' },
    { name: 'Marea, la 400 m', note: 'Seara, pe nisip. „CALD. LIBER. VAMA.”' },
    { name: 'Final', note: 'Cadru de final cu adresa, servicii și site.' },
  ],
  services: {
    label: 'Servicii',
    title: 'Începem cu un video. Rămânem pentru tot ce vine după.',
    body: 'Un singur echipaj pentru clip, site, rezervări și software. Totul e cod, deci totul se poate actualiza.',
    items: [
      {
        title: 'Video promo în Remotion',
        body: 'Schimbi prețul, clipul se re-randează singur.',
        tags: ['9:16 · 1:1 · 16:9', 'Subtitrări', 'Variante A/B', 'HyperFrames'],
      },
      {
        title: 'Site-uri de prezentare',
        body: 'Rapide, ușor de găsit, ușor de editat.',
        tags: ['Next.js', 'SEO', 'CMS', 'RO / EN'],
      },
      {
        title: 'Rezervări online',
        body: 'Calendar, plăți și confirmări prin SMS.',
        tags: ['Calendar', 'Plăți', 'SMS / Email', 'Admin'],
      },
      {
        title: 'Software custom și suport',
        body: 'Aplicații interne și integrări, cu suport real.',
        tags: ['API', 'Integrări', 'Mentenanță', 'Suport RO'],
      },
    ],
    hoverHint: 'Mișcă cursorul',
  },
  lab: {
    label: 'Laborator',
    title: 'Mișcarea e o funcție.',
    body: 'Clipurile noastre nu sunt desenate cadru cu cadru, sunt calculate. Schimbă parametrii de mai jos și compoziția Remotion se recalculează pe loc.',
    physics: 'Fizică',
    format: 'Format',
    data: 'Date',
    damping: 'Elasticitate',
    mass: 'Masă',
    stiffness: 'Viteză',
    business: 'Afacere',
    offer: 'Ofertă',
    defaultBusiness: 'Pensiunea Dor',
    defaultOffer: '-20% în octombrie',
    settles: 'se stabilizează la cadrul',
    replay: 'Din nou',
    cardKicker: 'Rezervă acum',
  },
  process: {
    label: 'Proces',
    title: 'De la brief la randare, apoi suport.',
    body: 'Un proiect tipic, văzut ca o cronologie. Apasă pe un clip ca să vezi ce primești.',
    weeks: 'săpt.',
    ongoing: 'continuu',
    steps: [
      {
        name: 'Brief',
        body: 'Un apel și o propunere clară.',
        out: ['Scop', 'Termen', 'Preț fix'],
      },
      {
        name: 'Scenariu și design',
        body: 'Aprobi direcția înainte de cod.',
        out: ['Storyboard', 'Wireframe', 'Direcție vizuală'],
      },
      {
        name: 'Cod și randare',
        body: 'Link de preview la fiecare pas.',
        out: ['Link de preview', 'Variante', 'QA'],
      },
      {
        name: 'Lansare și suport',
        body: 'Publicăm și rămânem alături.',
        out: ['Suport RO', 'Mentenanță', 'Re-randare'],
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: 'Hai să randăm ceva.',
    body: 'Spune-ne ce afacere ai. Îți răspundem cu o propunere.',
    name: 'Nume',
    email: 'Email sau telefon',
    needs: 'Ce ai nevoie',
    needOptions: ['Video promo', 'Site', 'Rezervări', 'Software', 'Suport'],
    timeline: 'Termen',
    timelineOptions: ['Urgent', 'O lună', 'Flexibil'],
    message: 'Mesaj',
    messagePh: 'Ex: pensiune în Bran, vrem un clip pentru Instagram și rezervări direct pe site.',
    submit: 'Trimite în coadă',
    sending: 'Se randează',
    done: 'Mesajul e pregătit în aplicația de email. Dacă nu s-a deschis, scrie-ne direct la',
    direct: 'Direct',
  },
  footer: {
    built: 'Construit cu React și Remotion',
    top: 'Înapoi la cadrul 0',
    rights: 'Exedria',
  },
  hud: 'Pagina',
};

type Copy = typeof ro;

const en: Copy = {
  nav: {
    work: 'Work',
    services: 'Services',
    lab: 'Lab',
    process: 'Process',
    contact: 'Contact',
    cta: 'Start a project',
  },
  hero: {
    metaA: 'Programmatic video and software studio',
    metaB: 'For businesses in Romania',
    status: 'rendering',
    line1: 'Video, written',
    line2: 'in code.',
    lead: 'Promo videos written in code, plus the website, bookings and software behind them. With support in Romanian.',
    ctaPrimary: 'Start a project',
    ctaSecondary: 'Watch a clip',
    scrubHint: 'Drag the ruler. Every dot is a function of the frame.',
  },
  work: {
    label: 'Selected work',
    client: 'Marina Park · Vama Veche',
    title: 'A campsite in Vama Veche, told in 40 seconds.',
    body: 'A vertical promo for Reels and TikTok. Every scene is a component.',
    tracks: 'Tracks',
    scenes: 'Scenes',
    text: 'Text',
    audio: 'Audio',
    hintTrack: 'Click a scene to jump to it.',
    meta: [
      ['Format', '9:16 · 1080×1920'],
      ['Length', '00:40 · 1200 frames'],
      ['Delivered', 'Reels, TikTok, Stories'],
    ],
  },
  scenes: [
    { name: 'Logo', note: 'Wooden letters, built frame by frame.' },
    { name: 'The house', note: 'Dobrogean style, since 2000. Material labels appear one by one.' },
    { name: 'Wooden cabins', note: 'Bungalows with terraces. Lateral tracking camera.' },
    { name: 'Gazebo', note: 'Coffee, friends, shade. Italic line: “in the shade, under the reed…”' },
    { name: 'Sun', note: 'Radial transition: “…and step out into the sun”.' },
    { name: 'Campers and tents', note: 'Plenty of room, shaded by trees. “STAY. BREATHE.”' },
    { name: 'The sea, 400 m away', note: 'Evenings on the sand. “WARM. FREE. VAMA.”' },
    { name: 'End card', note: 'Closing frame with address, amenities and website.' },
  ],
  services: {
    label: 'Services',
    title: 'We start with a video. We stay for everything after.',
    body: 'One crew for the clip, the site, the bookings and the software. It is all code, so all of it can be updated.',
    items: [
      {
        title: 'Remotion promo videos',
        body: 'Change the price, the clip re-renders itself.',
        tags: ['9:16 · 1:1 · 16:9', 'Captions', 'A/B variants', 'HyperFrames'],
      },
      {
        title: 'Business websites',
        body: 'Fast, easy to find, easy to edit.',
        tags: ['Next.js', 'SEO', 'CMS', 'RO / EN'],
      },
      {
        title: 'Online booking',
        body: 'Calendar, payments and SMS confirmations.',
        tags: ['Calendar', 'Payments', 'SMS / Email', 'Admin'],
      },
      {
        title: 'Custom software and support',
        body: 'Internal tools and integrations, with real support.',
        tags: ['API', 'Integrations', 'Maintenance', 'RO support'],
      },
    ],
    hoverHint: 'Move your cursor',
  },
  lab: {
    label: 'Lab',
    title: 'Motion is a function.',
    body: 'Our clips are not drawn frame by frame, they are computed. Change the parameters below and the Remotion composition recalculates instantly.',
    physics: 'Physics',
    format: 'Format',
    data: 'Data',
    damping: 'Bounce',
    mass: 'Mass',
    stiffness: 'Speed',
    business: 'Business',
    offer: 'Offer',
    defaultBusiness: 'Pensiunea Dor',
    defaultOffer: '20% off in October',
    settles: 'settles at frame',
    replay: 'Replay',
    cardKicker: 'Book now',
  },
  process: {
    label: 'Process',
    title: 'From brief to render, then support.',
    body: 'A typical project, laid out as a timeline. Click a clip to see what you get.',
    weeks: 'wk',
    ongoing: 'ongoing',
    steps: [
      {
        name: 'Brief',
        body: 'One call and a clear proposal.',
        out: ['Scope', 'Deadline', 'Fixed price'],
      },
      {
        name: 'Script and design',
        body: 'You approve the direction before code.',
        out: ['Storyboard', 'Wireframes', 'Visual direction'],
      },
      {
        name: 'Code and render',
        body: 'A preview link at every step.',
        out: ['Preview link', 'Variants', 'QA'],
      },
      {
        name: 'Launch and support',
        body: 'We ship, then we stick around.',
        out: ['RO support', 'Maintenance', 'Re-render'],
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: "Let's render something.",
    body: 'Tell us about your business. We reply with a proposal.',
    name: 'Name',
    email: 'Email or phone',
    needs: 'What you need',
    needOptions: ['Promo video', 'Website', 'Booking', 'Software', 'Support'],
    timeline: 'Timeline',
    timelineOptions: ['Urgent', 'One month', 'Flexible'],
    message: 'Message',
    messagePh: 'E.g. a guesthouse in Bran, we want an Instagram clip and direct bookings on our site.',
    submit: 'Send to queue',
    sending: 'Rendering',
    done: 'Your message is ready in your email app. If it did not open, write to us at',
    direct: 'Direct',
  },
  footer: {
    built: 'Built with React and Remotion',
    top: 'Back to frame 0',
    rights: 'Exedria',
  },
  hud: 'Page',
};

export type Lang = 'ro' | 'en';
const dict: Record<Lang, Copy> = { ro, en };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Copy }>({
  lang: 'ro',
  setLang: () => {},
  t: ro,
});

function readLang(): Lang {
  try {
    const v = localStorage.getItem('exedria-lang');
    if (v === 'ro' || v === 'en') return v;
  } catch {
    /* storage unavailable */
  }
  return 'ro';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('exedria-lang', l);
    } catch {
      /* storage unavailable */
    }
  };
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);
