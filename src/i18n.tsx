import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const ro = {
  nav: {
    work: 'Showcase',
    services: 'Platformă',
    lab: 'Laborator',
    process: 'Pipeline',
    studio: 'Motor Grafic',
    contact: 'Acces',
    cta: 'Cere Acces Beta',
  },
  hero: {
    metaA: 'Creative Automation și video programatic',
    metaB: 'Randat din cod, legat la date',
    status: 'rendering',
    line1: 'Infrastructură video',
    line2: 'scrisă în cod.',
    lead: 'Generare automată de reclame video randate din cod prin Remotion și AI. Dinamice, scalabile și legate direct la datele afacerii.',
    ctaPrimary: 'Cere Acces Beta',
    ctaSecondary: 'Vezi Demo Interactiv',
    scrubHint: 'Trage de riglă. Fiecare punct e o funcție de cadru.',
  },
  work: {
    label: 'Template în producție',
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
    { name: 'Camping și hamace', note: 'Loc generos, la umbră de copaci. „STAI. RESPIRĂ.”' },
    { name: 'Marea, la 400 m', note: 'Seara, pe nisip. „CALD. LIBER. VAMA.”' },
    { name: 'Final', note: 'Cadru de final cu adresa, facilitățile și site-ul.' },
  ],
  services: {
    label: 'Platformă',
    title: 'Trei module, un singur pipeline.',
    body: 'Video, web și integrări rulează pe același cod, așa că o schimbare în date ajunge peste tot.',
    items: [
      {
        title: 'Randare Programatică în Remotion',
        body: 'Prețul, data sau oferta vin din date: modifici un payload JSON și clipul se re-randează instant în toate formatele.',
        more: 'Prețul, data sau oferta vin din date: modifici un payload JSON și clipul se re-randează instant în toate formatele.',
        tags: ['9:16 · 1:1 · 16:9', 'Payload JSON', 'Variante A/B', 'HyperFrames'],
      },
      {
        title: 'Frontend-uri de Mare Viteză',
        body: 'Aplicații web Next.js construite pentru timpi de încărcare sub o secundă și conversie maximă pe mobil.',
        more: 'Aplicații web Next.js construite pentru timpi de încărcare sub o secundă și conversie maximă pe mobil.',
        tags: ['Next.js', 'Core Web Vitals', 'SEO', 'RO / EN'],
      },
      {
        title: 'API & Integrări Custom',
        body: 'Conectare directă între scrapere, pipeline-uri LLM și motoare de randare video.',
        more: 'Conectare directă între scrapere, pipeline-uri LLM și motoare de randare video.',
        tags: ['REST API', 'Scrapere', 'LLM', 'Render workers'],
      },
    ],
    hoverHint: 'Mișcă cursorul',
    all: 'Toată platforma',
    quote: 'Explorează Modulul',
    work: 'Vezi Template-uri',
  },
  lab: {
    label: 'Laborator',
    title: 'Mișcarea e o funcție.',
    body: 'Clipurile nu sunt desenate cadru cu cadru, sunt calculate. Schimbă parametrii de mai jos și compoziția Remotion se recalculează pe loc.',
    physics: 'Fizică',
    format: 'Format',
    data: 'Date',
    damping: 'Elasticitate',
    mass: 'Masă',
    stiffness: 'Viteză',
    business: 'Afacere',
    offer: 'Ofertă',
    defaultBusiness: 'Sala Forma',
    defaultOffer: 'Prima lună -30%',
    settles: 'se stabilizează la cadrul',
    replay: 'Resetează Parametrii',
    cardKicker: 'Înscrie-te',
  },
  process: {
    label: 'Pipeline',
    title: 'De la date brute la randare automată.',
    body: 'Fiecare clip trece prin aceiași patru pași, de la semnal la livrare.',
    weeks: 'săpt.',
    ongoing: 'continuu',
    steps: [
      {
        name: 'Semnale',
        body: 'Extragere automată a recenziilor și amprentei de brand.',
        out: ['Recenzii', 'Brand', 'Date'],
      },
      {
        name: 'AI Scripting',
        body: 'Generare de scenarii dinamice și structurate de 15 secunde.',
        out: ['Storyboard', 'Scenariu', 'Variante'],
      },
      {
        name: 'Compilare Remotion',
        body: 'Randare instantanee în formatele 9:16 și 1:1.',
        out: ['9:16', '1:1', 'QA'],
      },
      {
        name: 'Distribuție',
        body: 'Export direct sau livrare automată prin API.',
        out: ['Export', 'API', 'Re-randare'],
      },
    ],
  },
  contact: {
    label: 'Acces',
    title: 'Conectează datele. Noi randăm restul.',
    body: 'Spune-ne despre volumul de reclame sau cazul tău de utilizare. Configurăm un preview dedicat.',
    name: 'Nume',
    email: 'Email sau telefon',
    needs: 'Module',
    needOptions: ['Video programatic', 'Frontend web', 'API & integrări'],
    timeline: 'Produs',
    timelineOptions: ['Programmatic Video', 'API Access', 'Enterprise'],
    message: 'Mesaj',
    messagePh: 'Ex: 40 de reclame pe lună pentru 3 locații, cu prețul și recenziile trase automat din feed.',
    submit: 'Solicită Acces la Platformă',
    sending: 'Se randează',
    done: 'Cerere primită. Revenim cu un preview.',
    failed: 'Nu s-a trimis. Încearcă din nou sau scrie-ne la',
    pickNeed: 'Alege cel puțin un modul.',
    direct: 'Direct',
  },
  footer: {
    tagline: 'Infrastructură video programatică scrisă în cod și software integrat.',
    built: 'Construit cu React și Remotion',
    top: 'Înapoi la cadrul 0',
    rights: 'Exedria',
    pages: 'Pagini',
    legal: 'Legal',
  },
  portfolio: {
    label: 'Showcase',
    title: 'Template-uri randate din date reale.',
    body: 'Clipuri, frontend-uri și pipeline-uri care rulează în producție.',
    filters: { all: 'Toate', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Slot disponibil',
    slotBody: 'Următorul template poate porni din datele tale.',
    slotCta: 'Generează un Preview',
    open: 'Studiul de caz',
    all: 'Tot showcase-ul',
  },
  studio: {
    label: 'Motor Grafic',
    title: 'Motorul din spatele fiecărui clip.',
    body: 'Pipeline-ul care transformă datele brute în video randat și laboratorul în care mișcarea devine parametru.',
    teaserTitle: 'Pipeline-ul și laboratorul de mișcare.',
    teaserLink: 'Vezi tehnologia',
  },
  caseStudy: {
    next: 'Template-ul următor',
    service: 'Modul folosit',
    back: 'Tot showcase-ul',
    ask: 'Vrei același clip, randat din datele tale?',
    cta: 'Generează un Preview',
  },
  homeCta: {
    title: 'Conectează datele. Noi randăm restul.',
    body: 'Spune-ne despre volumul de reclame sau cazul tău de utilizare. Configurăm un preview dedicat.',
    button: 'Cere Acces Beta',
  },
  contactPage: {
    privacy: 'Folosim datele din formular doar ca să-ți răspundem. Detalii în',
    privacyLink: 'Politica de confidențialitate',
  },
  legal: {
    terms: 'Termeni și condiții',
    privacy: 'Politica de confidențialitate',
    updated: 'Ultima actualizare',
    contents: 'Cuprins',
    onlyRo: '',
  },
  notFound: {
    title: 'Cadrul ăsta nu există.',
    body: 'Pagina a fost mutată sau linkul e greșit.',
    home: 'Înapoi la cadrul 0',
  },
  menu: 'Meniu',
  hud: 'Pagina',
};

type Copy = typeof ro;

const en: Copy = {
  nav: {
    work: 'Showcase',
    services: 'Platform',
    lab: 'Lab',
    process: 'Pipeline',
    studio: 'Motion Lab',
    contact: 'Access',
    cta: 'Request Beta Access',
  },
  hero: {
    metaA: 'Creative automation and programmatic video',
    metaB: 'Rendered from code, wired to data',
    status: 'rendering',
    line1: 'Programmatic video',
    line2: 'infrastructure.',
    lead: 'Generate dynamic, high-converting video ads rendered directly from code. Automated scripts, brand data, and review feeds powered by Remotion and AI.',
    ctaPrimary: 'Request Beta Access',
    ctaSecondary: 'Interactive Demo',
    scrubHint: 'Drag the ruler. Every dot is a function of the frame.',
  },
  work: {
    label: 'Template in production',
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
    { name: 'Camping and hammocks', note: 'Plenty of room, shaded by trees. “STAY. BREATHE.”' },
    { name: 'The sea, 400 m away', note: 'Evenings on the sand. “WARM. FREE. VAMA.”' },
    { name: 'End card', note: 'Closing frame with address, amenities and website.' },
  ],
  services: {
    label: 'Platform',
    title: 'Three modules, one pipeline.',
    body: 'Video, web and integrations run on the same codebase, so a change in your data propagates everywhere.',
    items: [
      {
        title: 'Programmatic Video Rendering',
        body: 'Dynamic ad rendering via Remotion. Update a single JSON payload and auto-render across every aspect ratio instantly.',
        more: 'Dynamic ad rendering via Remotion. Update a single JSON payload and auto-render across every aspect ratio instantly.',
        tags: ['9:16 · 1:1 · 16:9', 'JSON payload', 'A/B variants', 'HyperFrames'],
      },
      {
        title: 'High-Performance Web Frontends',
        body: 'Next.js applications built for sub-second mobile load speeds and maximum conversion.',
        more: 'Next.js applications built for sub-second mobile load speeds and maximum conversion.',
        tags: ['Next.js', 'Core Web Vitals', 'SEO', 'RO / EN'],
      },
      {
        title: 'API & Custom Pipelines',
        body: 'Scalable backend workers bridging data scrapers, LLMs, and render clusters.',
        more: 'Scalable backend workers bridging data scrapers, LLMs, and render clusters.',
        tags: ['REST API', 'Scrapers', 'LLM', 'Render workers'],
      },
    ],
    hoverHint: 'Move your cursor',
    all: 'Explore the platform',
    quote: 'Explore Module',
    work: 'View Templates',
  },
  lab: {
    label: 'Motion Lab',
    title: 'Motion defined as code.',
    body: 'Clips are not drawn frame by frame, they are computed. Change the parameters below and the Remotion composition recalculates instantly.',
    physics: 'Physics',
    format: 'Format',
    data: 'Data',
    damping: 'Bounce',
    mass: 'Mass',
    stiffness: 'Speed',
    business: 'Business',
    offer: 'Offer',
    defaultBusiness: 'Sala Forma',
    defaultOffer: '30% off your first month',
    settles: 'settles at frame',
    replay: 'Reset Parameters',
    cardKicker: 'Join now',
  },
  process: {
    label: 'Pipeline',
    title: 'From raw data to programmatic render, in seconds.',
    body: 'Every clip runs through the same four stages, from signal to delivery.',
    weeks: 'wk',
    ongoing: 'ongoing',
    steps: [
      {
        name: 'Signal Ingestion',
        body: 'Automated extraction of reviews and brand signals.',
        out: ['Reviews', 'Brand', 'Data'],
      },
      {
        name: 'AI Scripting',
        body: 'Structured 15-second storyboards generated via LLM.',
        out: ['Storyboard', 'Script', 'Variants'],
      },
      {
        name: 'Remotion Compile',
        body: 'Instant programmatic rendering across 9:16 and 1:1.',
        out: ['9:16', '1:1', 'QA'],
      },
      {
        name: 'Automated Dispatch',
        body: 'Direct video export and delivery via API.',
        out: ['Export', 'API', 'Re-render'],
      },
    ],
  },
  contact: {
    label: 'Access',
    title: 'Plug in your data. We render the rest.',
    body: "Tell us about your ad volume or specific use case. We'll set up a live preview instance.",
    name: 'Name',
    email: 'Email or phone',
    needs: 'Modules',
    needOptions: ['Programmatic video', 'Web frontend', 'API & pipelines'],
    timeline: 'Product',
    timelineOptions: ['Programmatic Video', 'API Access', 'Enterprise'],
    message: 'Message',
    messagePh: 'E.g. 40 ads a month across 3 locations, with prices and reviews pulled automatically from our feed.',
    submit: 'Request Platform Access',
    sending: 'Rendering',
    done: "Request received. We'll follow up with a preview.",
    failed: 'It did not send. Try again or write to us at',
    pickNeed: 'Pick at least one module.',
    direct: 'Direct',
  },
  footer: {
    tagline: 'Programmatic video infrastructure and automated creative software.',
    built: 'Built with React and Remotion',
    top: 'Back to frame 0',
    rights: 'Exedria',
    pages: 'Pages',
    legal: 'Legal',
  },
  portfolio: {
    label: 'Showcase',
    title: 'Templates rendered from real data.',
    body: 'Videos, frontends and pipelines running in production.',
    filters: { all: 'All', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Open slot',
    slotBody: 'The next template could run on your data.',
    slotCta: 'Generate Preview',
    open: 'Case study',
    all: 'Full showcase',
  },
  studio: {
    label: 'Motion Lab',
    title: 'The engine behind every render.',
    body: 'The pipeline that turns raw data into rendered video, and the lab where motion becomes a parameter.',
    teaserTitle: 'The pipeline and the motion lab.',
    teaserLink: 'Explore the tech',
  },
  caseStudy: {
    next: 'Next template',
    service: 'Module used',
    back: 'Full showcase',
    ask: 'Want this rendered from your own data?',
    cta: 'Generate Preview',
  },
  homeCta: {
    title: 'Plug in your data. We render the rest.',
    body: "Tell us about your ad volume or specific use case. We'll set up a live preview instance.",
    button: 'Request Beta Access',
  },
  contactPage: {
    privacy: 'We only use what you send to reply to you. Details in the',
    privacyLink: 'Privacy policy',
  },
  legal: {
    terms: 'Terms and conditions',
    privacy: 'Privacy policy',
    updated: 'Last updated',
    contents: 'Contents',
    onlyRo: 'This page is available in Romanian only.',
  },
  notFound: {
    title: 'This frame does not exist.',
    body: 'The page has moved or the link is wrong.',
    home: 'Back to frame 0',
  },
  menu: 'Menu',
  hud: 'Page',
};

export type Lang = 'ro' | 'en';
const dict: Record<Lang, Copy> = { ro, en };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Copy }>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

function readLang(): Lang {
  try {
    const v = localStorage.getItem('exedria-lang');
    if (v === 'ro' || v === 'en') return v;
  } catch {
    /* storage unavailable */
  }
  return 'en';
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
