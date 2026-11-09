import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const ro = {
  nav: {
    work: 'Lucrări',
    services: 'Servicii',
    contact: 'Contact',
    cta: 'Cere o ofertă',
  },
  hero: {
    metaA: 'Creative Automation și video programatic',
    metaB: 'Randat din cod, legat la date',
    status: 'rendering',
    line1: 'Infrastructură video',
    line2: 'scrisă în cod.',
    lead: 'Generare automată de reclame video randate din cod. Dinamice, scalabile și legate direct la datele afacerii.',
    ctaPrimary: 'Cere o ofertă',
    ctaSecondary: 'Vezi lucrările',
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
  services: {
    label: 'Servicii',
    title: 'Trei module, un singur pipeline.',
    body: 'Video, web și integrări rulează pe același cod, așa că o schimbare în date ajunge peste tot.',
    items: [
      {
        title: 'Randare Programatică',
        body: 'Prețul, data sau oferta vin din date: modifici un payload JSON și clipul se re-randează instant în toate formatele.',
        more: 'Prețul, data sau oferta vin din date: modifici un payload JSON și clipul se re-randează instant în toate formatele.',
        tags: ['9:16 · 1:1 · 16:9', 'Payload JSON', 'Variante A/B', 'HyperFrames'],
      },
      {
        title: 'Frontend-uri de Mare Viteză',
        body: 'Site-uri prerandate care se încarcă sub o secundă și convertesc bine pe mobil.',
        more: 'Site-uri prerandate care se încarcă sub o secundă și convertesc bine pe mobil.',
        tags: ['React', 'Core Web Vitals', 'SEO', 'RO / EN'],
      },
      {
        title: 'API & Integrări Custom',
        body: 'Legăm sursele tale de date de site și de clipuri, ca totul să rămână sincronizat.',
        more: 'Legăm sursele tale de date de site și de clipuri, ca totul să rămână sincronizat.',
        tags: ['REST API', 'Scrapere', 'Webhooks', 'Render workers'],
      },
    ],
    hoverHint: 'Mișcă cursorul',
    all: 'Toate serviciile',
    quote: 'Detalii',
    preview: 'Cere o ofertă',
    chapters: ['Video', 'Web', 'API'],
    work: 'Vezi lucrările',
  },
  lab: {
    title: 'Mișcarea e o funcție.',
    body: 'Clipurile nu sunt desenate cadru cu cadru, sunt calculate. Schimbă parametrii de mai jos și compoziția se recalculează pe loc.',
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
    label: 'Cum lucrăm',
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
        name: 'Scripting',
        body: 'Generare de scenarii dinamice și structurate, de orice durată.',
        out: ['Storyboard', 'Scenariu', 'Variante'],
      },
      {
        name: 'Compilare',
        body: 'Randare instantanee.',
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
    label: 'Contact',
    title: 'Spune-ne ce ai de făcut.',
    body: 'Câteva rânduri despre proiect ne ajung. Revenim cu o ofertă.',
    name: 'Nume',
    email: 'Email sau telefon',
    needs: 'Module',
    needOptions: ['Video programatic', 'Frontend web', 'API & integrări'],
    message: 'Mesaj',
    messagePh: 'Ex: avem 300 de clinici partenere și vrem câte un video pentru fiecare, cu rating-ul și recenziile trase automat.',
    submit: 'Trimite cererea',
    sending: 'Se randează',
    done: 'Cerere primită. Revenim cu o ofertă.',
    failed: 'Nu s-a trimis. Încearcă din nou sau scrie-ne la',
    pickNeed: 'Alege cel puțin un modul.',
    deadline: 'Până când (opțional)',
    deadlinePh: 'Ex: înainte de 1 decembrie',
    direct: 'Direct',
  },
  footer: {
    tagline: 'Agenție de video programatic, site-uri rapide și integrări API.',
    top: 'Înapoi la cadrul 0',
    rights: 'Exedria',
    pages: 'Pagini',
    legal: 'Legal',
  },
  portfolio: {
    label: 'Lucrări',
    title: 'Template-uri randate din date reale.',
    body: 'Clipuri, frontend-uri și pipeline-uri care rulează în producție.',
    filters: { all: 'Toate', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Slot disponibil',
    slotBody: 'Următorul template poate porni din datele tale.',
    slotCta: 'Cere o ofertă',
    open: 'Studiul de caz',
    all: 'Toate lucrările',
  },
  caseStudy: {
    next: 'Template-ul următor',
    service: 'Modul folosit',
    back: 'Toate lucrările',
    ask: 'Vrei același clip, randat din datele tale?',
    cta: 'Cere o ofertă',
  },
  workDoor: {
    label: 'Lucrări',
    title: 'Vezi ce am construit pentru alții.',
    body: 'Studii de caz.',
  },
  audience: {
    label: 'Pentru cine',
    title: 'Pentru cine lucrăm.',
    items: [
      { title: 'Rețele și francize', body: 'Câte un video pentru fiecare locație, cu datele și recenziile ei.' },
      { title: 'Agenții și platforme', body: 'Clipuri pentru fiecare client din portofoliu, randate în serie.' },
      { title: 'Afaceri locale', body: 'Un video de prezentare făcut din pozele și recenziile pe care le ai deja.' },
    ],
  },
  homeCta: {
    title: 'Spune-ne ce ai de făcut.',
    body: 'Câteva rânduri despre proiect ne ajung. Revenim cu o ofertă.',
    button: 'Cere o ofertă',
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
  webDemo: {
    label: 'Arhitectură Web & Conversie',
    title: 'Reclama aduce click-ul. Viteza paginii decide vânzarea.',
    body: 'Construim landing page-uri și site-uri prerandate, optimizate să se deschidă instant pe mobil.',
    telemetry: 'Live Telemetry • Optimized Edge',
    metrics: {
      ttfb: ['TTFB', 'Time to First Byte'],
      dcl: ['DOM Ready', 'DOMContentLoaded'],
      mount: ['Client Hydration', 'hydrateRoot'],
      render: ['Client Render', 'createRoot'],
      fps: ['Live FPS', 'requestAnimationFrame'],
    },
    excellent: 'Excelent',
    pending: 'se măsoară',
    note: 'Telemetrie live extrasă direct din browserul tău, folosind standardul window.performance. Aceasta este viteza reală a infrastructurii noastre.',
    architecture: 'Arhitectura de conversie',
    layers: [
      { title: 'Edge Caching & Zero-Bloat', body: 'Cod React curat, fără teme greoaie sau plugin-uri inutile.' },
      { title: 'Continuitate Vizuală', body: 'Pagina web preia automat stilul, fonturile și oferta din reclama video, eliminând ruptura vizuală după click.' },
      { title: 'In-App Browser Ready', body: 'Optimizat special pentru WebView-ul intern din TikTok, Instagram și Facebook.' },
    ],
  },
  apiDemo: {
    label: 'Modulul 03 • Data Pipelines & Automatizare',
    title: 'O singură modificare în API. Actualizare simultană în Site și Reclame.',
    body: 'Construim backend-ul, webhook-urile și integrările care leagă stocurile sau prețurile tale direct la website și la motorul video. Schimbi o cifră în baza de date și tot ecosistemul se regenerează automat.',
    presets: [
      {
        tab: 'E-commerce Drop',
        data: { product: 'Exedria Runner X1', price: '540 RON', badge: '-25% FLASH SALE', stock: 6, cta: 'Cumpără Acum' },
      },
      {
        tab: 'Evenimente & Tickets',
        data: { product: 'Tech Summit — VIP Pass', price: '140 EUR', badge: 'ULTIMELE LOCURI', stock: 12, cta: 'Rezervă Locul' },
      },
      {
        tab: 'B2B / SaaS Metrics',
        data: { product: 'Plan Enterprise Automatizat', price: '290 EUR/lună', badge: '+42% EFICIENȚĂ', stock: 100, cta: 'Cere Demo' },
      },
    ],
    payload: 'Raw API Payload',
    editHint: 'Click pe o valoare și tastează.',
    outputs: 'Synchronized Outputs · 0 ms latency',
    web: '[A] Web Component',
    ad: '[B] 9:16 Ad Compositor',
    left: (n: number) => (n <= 0 ? 'Stoc epuizat' : n < 10 ? `Doar ${n} rămase` : `${n} disponibile`),
  },
  menu: 'Meniu',
  hud: 'Pagina',
};

type Copy = typeof ro;

const en: Copy = {
  nav: {
    work: 'Work',
    services: 'Services',
    contact: 'Contact',
    cta: 'Get a quote',
  },
  hero: {
    metaA: 'Creative automation and programmatic video',
    metaB: 'Rendered from code, wired to data',
    status: 'rendering',
    line1: 'Programmatic video',
    line2: 'infrastructure.',
    lead: 'Automated video ads rendered from code. Dynamic, scalable and wired straight to your business data.',
    ctaPrimary: 'Get a quote',
    ctaSecondary: 'See the work',
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
  services: {
    label: 'Services',
    title: 'Three modules, one pipeline.',
    body: 'Video, web and integrations run on the same codebase, so a change in your data propagates everywhere.',
    items: [
      {
        title: 'Programmatic Video Rendering',
        body: 'Price, date or offer come from data: change a JSON payload and the clip re-renders in every format.',
        more: 'Price, date or offer come from data: change a JSON payload and the clip re-renders in every format.',
        tags: ['9:16 · 1:1 · 16:9', 'JSON payload', 'A/B variants', 'HyperFrames'],
      },
      {
        title: 'High-Performance Web Frontends',
        body: 'Prerendered sites that load in under a second and convert well on mobile.',
        more: 'Prerendered sites that load in under a second and convert well on mobile.',
        tags: ['React', 'Core Web Vitals', 'SEO', 'RO / EN'],
      },
      {
        title: 'API & Custom Pipelines',
        body: 'We wire your data sources into the site and the clips, so everything stays in sync.',
        more: 'We wire your data sources into the site and the clips, so everything stays in sync.',
        tags: ['REST API', 'Scrapers', 'Webhooks', 'Render workers'],
      },
    ],
    hoverHint: 'Move your cursor',
    all: 'All services',
    quote: 'Details',
    preview: 'Get a quote',
    chapters: ['Video', 'Web', 'API'],
    work: 'See the work',
  },
  lab: {
    title: 'Motion defined as code.',
    body: 'Clips are not drawn frame by frame, they are computed. Change the parameters below and the composition recalculates instantly.',
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
    label: 'How we work',
    title: 'From raw data to automated render.',
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
        name: 'Scripting',
        body: 'Dynamic, structured scripts of any length.',
        out: ['Storyboard', 'Script', 'Variants'],
      },
      {
        name: 'Compile',
        body: 'Instant rendering.',
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
    label: 'Contact',
    title: 'Tell us what you need.',
    body: "A few lines about the project are enough. We'll get back to you with a quote.",
    name: 'Name',
    email: 'Email or phone',
    needs: 'Modules',
    needOptions: ['Programmatic video', 'Web frontend', 'API & pipelines'],
    message: 'Message',
    messagePh: 'E.g. we have 300 partner clinics and want one video for each, with ratings and reviews pulled in automatically.',
    submit: 'Send request',
    sending: 'Rendering',
    done: "Request received. We'll get back to you with a quote.",
    failed: 'It did not send. Try again or write to us at',
    pickNeed: 'Pick at least one module.',
    deadline: 'By when (optional)',
    deadlinePh: 'E.g. before December 1',
    direct: 'Direct',
  },
  footer: {
    tagline: 'An agency for programmatic video, fast websites and API integrations.',
    top: 'Back to frame 0',
    rights: 'Exedria',
    pages: 'Pages',
    legal: 'Legal',
  },
  portfolio: {
    label: 'Work',
    title: 'Templates rendered from real data.',
    body: 'Videos, frontends and pipelines running in production.',
    filters: { all: 'All', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Open slot',
    slotBody: 'The next template could run on your data.',
    slotCta: 'Get a quote',
    open: 'Case study',
    all: 'All work',
  },
  caseStudy: {
    next: 'Next template',
    service: 'Module used',
    back: 'All work',
    ask: 'Want this rendered from your own data?',
    cta: 'Get a quote',
  },
  workDoor: {
    label: 'Work',
    title: 'See what we’ve built for others.',
    body: 'Case studies.',
  },
  audience: {
    label: 'Who it’s for',
    title: 'Who we work with.',
    items: [
      { title: 'Chains and franchises', body: 'One video per location, built from its own data and reviews.' },
      { title: 'Agencies and platforms', body: 'A clip for every client in the portfolio, rendered in batches.' },
      { title: 'Local businesses', body: 'A showcase video made from the photos and reviews you already have.' },
    ],
  },
  homeCta: {
    title: 'Tell us what you need.',
    body: "A few lines about the project are enough. We'll get back to you with a quote.",
    button: 'Get a quote',
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
  webDemo: {
    label: 'Web Architecture & Conversion',
    title: 'The ad earns the click. Page speed closes the sale.',
    body: 'We build prerendered landing pages and websites, tuned to open instantly on mobile.',
    telemetry: 'Live Telemetry • Optimized Edge',
    metrics: {
      ttfb: ['TTFB', 'Time to First Byte'],
      dcl: ['DOM Ready', 'DOMContentLoaded'],
      mount: ['Client Hydration', 'hydrateRoot'],
      render: ['Client Render', 'createRoot'],
      fps: ['Live FPS', 'requestAnimationFrame'],
    },
    excellent: 'Excellent',
    pending: 'measuring',
    note: 'Live telemetry read straight from your browser through the window.performance standard. This is the real speed of our infrastructure.',
    architecture: 'Conversion architecture',
    layers: [
      { title: 'Edge Caching & Zero-Bloat', body: 'Clean React code. No heavy themes, no plugins you do not need.' },
      { title: 'Visual Continuity', body: 'The page inherits the style, fonts and offer of the video ad, so nothing breaks after the click.' },
      { title: 'In-App Browser Ready', body: 'Tuned for the in-app WebViews of TikTok, Instagram and Facebook.' },
    ],
  },
  apiDemo: {
    label: 'Module 03 • Data Pipelines & Automation',
    title: 'One change in the API. Site and ads update together.',
    body: 'We build the backend, webhooks and integrations that wire your stock and pricing straight into the website and the video engine. Change one number in the database and the whole stack regenerates.',
    presets: [
      {
        tab: 'E-commerce Drop',
        data: { product: 'Exedria Runner X1', price: '540 RON', badge: '-25% FLASH SALE', stock: 6, cta: 'Buy Now' },
      },
      {
        tab: 'Events & Tickets',
        data: { product: 'Tech Summit — VIP Pass', price: '140 EUR', badge: 'LAST SEATS', stock: 12, cta: 'Reserve a Seat' },
      },
      {
        tab: 'B2B / SaaS Metrics',
        data: { product: 'Automated Enterprise Plan', price: '290 EUR/mo', badge: '+42% EFFICIENCY', stock: 100, cta: 'Request Demo' },
      },
    ],
    payload: 'Raw API Payload',
    editHint: 'Click a value and type.',
    outputs: 'Synchronized Outputs · 0 ms latency',
    web: '[A] Web Component',
    ad: '[B] 9:16 Ad Compositor',
    left: (n: number) => (n <= 0 ? 'Sold out' : n < 10 ? `Only ${n} left` : `${n} available`),
  },
  menu: 'Menu',
  hud: 'Page',
};

export type Lang = 'ro' | 'en';
const dict: Record<Lang, Copy> = { ro, en };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Copy }>({
  lang: 'ro',
  setLang: () => {},
  t: ro,
});

export function readLang(): Lang {
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
