import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const ro = {
  nav: {
    work: 'Lucrări',
    services: 'Servicii',
    contact: 'Contact',
    cta: 'Cere o ofertă',
  },
  hero: {
    metaA: 'Agenție de video programatic',
    metaB: 'Tu ne dai materialele, noi livrăm clipul',
    status: 'rendering',
    line1: 'Video pentru firme,',
    line2: 'făcut în cod.',
    lead: 'Facem clipuri de prezentare și reclame pentru firme. Fiecare clip e scris în cod, așa că putem face unul sau o sută, fiecare cu pozele și recenziile companiei.',
    ctaPrimary: 'Cere o ofertă',
    ctaSecondary: 'Vezi lucrările',
    scrubHint: 'Trage de riglă. Fiecare punct e o funcție de cadru.',
  },
  work: {
    label: 'Proiect livrat',
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
    title: 'Ce facem.',
    body: 'Video, site-uri și integrări. Le facem noi, de la idee la livrare.',
    items: [
      {
        title: 'Video pentru firme',
        body: 'Facem clipul din pozele, recenziile și oferta ta. Îl primești gata de postat, în toate formatele.',
        more: 'Facem clipul din pozele, recenziile și oferta ta. Îl primești gata de postat, în toate formatele.',
        tags: ['9:16 · 1:1 · 16:9', 'Reels · TikTok', 'Variante A/B'],
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
        tags: ['REST API', 'Scrapere', 'Webhooks'],
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
    body: 'Clipurile nu sunt desenate cadru cu cadru, sunt calculate. Schimbă parametrii de mai jos și compoziția se recalculează pe loc. De asta putem schimba textul sau oferta fără să refacem clipul de la zero.',
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
    title: 'Tu ne dai materialele. Noi facem restul.',
    body: 'Fiecare clip trece prin aceiași patru pași, de la brief la livrare.',
    weeks: 'săpt.',
    ongoing: 'continuu',
    steps: [
      {
        name: 'Brief',
        body: 'Ne trimiți ce ai: logo, poze, oferta. Recenziile și restul le strângem noi.',
        out: ['Logo', 'Poze', 'Ofertă'],
      },
      {
        name: 'Scripting',
        body: 'Scriem scenariul. Îl citești și îl aprobi înainte să facem clipul.',
        out: ['Scenariu', 'Aprobare'],
      },
      {
        name: 'Compilare',
        body: 'Facem clipul în toate formatele. Ceri modificări până îți place.',
        out: ['9:16', '1:1', 'Modificări'],
      },
      {
        name: 'Livrare',
        body: 'Primești fișierele gata de postat pe Reels, TikTok sau site.',
        out: ['Fișiere', 'Reels', 'Site'],
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: 'Spune-ne ce ai de făcut.',
    body: 'Câteva rânduri despre proiect ne ajung. Revenim cu o ofertă.',
    name: 'Nume',
    email: 'Email sau telefon',
    needs: 'Servicii',
    needOptions: ['Video programatic', 'Frontend web', 'API & integrări'],
    message: 'Mesaj',
    messagePh: 'Ex: avem o pensiune în Vama Veche și vrem un clip de prezentare pentru Instagram. Sau: avem 300 de clinici partenere și vrem câte un video pentru fiecare.',
    submit: 'Trimite cererea',
    sending: 'Se randează',
    done: 'Cerere primită. Revenim cu o ofertă.',
    failed: 'Nu s-a trimis. Încearcă din nou sau scrie-ne la',
    pickNeed: 'Alege cel puțin un serviciu.',
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
    title: 'Clipuri și site-uri făcute pentru clienți.',
    body: 'Proiecte livrate și folosite în producție.',
    filters: { all: 'Toate', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Slot disponibil',
    slotBody: 'Următorul proiect poate fi al tău.',
    slotCta: 'Cere o ofertă',
    open: 'Studiul de caz',
    all: 'Toate lucrările',
  },
  caseStudy: {
    next: 'Proiectul următor',
    service: 'Serviciu',
    back: 'Toate lucrările',
    ask: 'Vrei un clip ca ăsta pentru firma ta?',
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
    telemetry: 'Măsurat live, în browserul tău',
    metrics: {
      ttfb: ['TTFB', 'Primul byte de la server'],
      dcl: ['DOM gata', 'DOMContentLoaded'],
      mount: ['Hidratare', 'hydrateRoot'],
      render: ['Randare', 'createRoot'],
      fps: ['FPS live', 'requestAnimationFrame'],
    },
    excellent: 'Excelent',
    pending: 'se măsoară',
    note: 'Telemetrie live extrasă direct din browserul tău, folosind standardul window.performance. Asta e viteza reală a site-ului pe care îl citești.',
    architecture: 'Arhitectura de conversie',
    layers: [
      { title: 'Cod curat, fără balast', body: 'Cod React curat, fără teme greoaie sau plugin-uri inutile.' },
      { title: 'Continuitate vizuală', body: 'Pagina web preia automat stilul, fonturile și oferta din reclama video, eliminând ruptura vizuală după click.' },
      { title: 'Gata pentru browserele din aplicații', body: 'Optimizat special pentru WebView-ul intern din TikTok, Instagram și Facebook.' },
    ],
  },
  apiDemo: {
    label: 'API • Integrări și sincronizare',
    title: 'O singură modificare. Site-ul și clipurile se actualizează împreună.',
    body: 'Construim integrările care leagă stocurile sau prețurile tale de site și de clipuri. Când se schimbă prețul sau stocul, ne ocupăm noi ca site-ul și clipurile să se actualizeze singure.',
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
        tab: 'Restaurant',
        data: { product: 'Meniul zilei', price: '39 RON', badge: 'DOAR AZI', stock: 40, cta: 'Comandă acum' },
      },
    ],
    payload: 'Datele (JSON)',
    editHint: 'Click pe o valoare și tastează.',
    outputs: 'Rezultat · actualizat simultan',
    web: '[A] Pagina web',
    ad: '[B] Clipul 9:16',
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
    metaA: 'Programmatic video agency',
    metaB: 'You send the material, we deliver the clip',
    status: 'rendering',
    line1: 'Video for businesses,',
    line2: 'made in code.',
    lead: 'We make showcase videos and ads for businesses. Every clip is written in code, so we can make one or a hundred, each with the company’s own photos and reviews.',
    ctaPrimary: 'Get a quote',
    ctaSecondary: 'See the work',
    scrubHint: 'Drag the ruler. Every dot is a function of the frame.',
  },
  work: {
    label: 'Delivered project',
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
    title: 'What we do.',
    body: 'Video, websites and integrations. We handle them end to end, from idea to delivery.',
    items: [
      {
        title: 'Video for businesses',
        body: 'We make the clip from your photos, reviews and offer. You get it ready to post, in every format.',
        more: 'We make the clip from your photos, reviews and offer. You get it ready to post, in every format.',
        tags: ['9:16 · 1:1 · 16:9', 'Reels · TikTok', 'A/B variants'],
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
        tags: ['REST API', 'Scrapers', 'Webhooks'],
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
    body: 'Clips are not drawn frame by frame, they are computed. Change the parameters below and the composition recalculates instantly. That is why we can change the text or the offer without remaking the clip from scratch.',
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
    title: 'You send the material. We do the rest.',
    body: 'Every clip goes through the same four steps, from brief to delivery.',
    weeks: 'wk',
    ongoing: 'ongoing',
    steps: [
      {
        name: 'Brief',
        body: 'You send what you have: logo, photos, the offer. We gather the reviews and the rest.',
        out: ['Logo', 'Photos', 'Offer'],
      },
      {
        name: 'Scripting',
        body: 'We write the script. You read it and approve it before we make the clip.',
        out: ['Script', 'Approval'],
      },
      {
        name: 'Compile',
        body: 'We make the clip in every format. Ask for changes until you like it.',
        out: ['9:16', '1:1', 'Changes'],
      },
      {
        name: 'Delivery',
        body: 'You get files ready to post on Reels, TikTok or your site.',
        out: ['Files', 'Reels', 'Site'],
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: 'Tell us what you need.',
    body: "A few lines about the project are enough. We'll get back to you with a quote.",
    name: 'Name',
    email: 'Email or phone',
    needs: 'Services',
    needOptions: ['Programmatic video', 'Web frontend', 'API & pipelines'],
    message: 'Message',
    messagePh: 'E.g. we run a guesthouse in Vama Veche and want a showcase clip for Instagram. Or: we have 300 partner clinics and want one video for each.',
    submit: 'Send request',
    sending: 'Rendering',
    done: "Request received. We'll get back to you with a quote.",
    failed: 'It did not send. Try again or write to us at',
    pickNeed: 'Pick at least one service.',
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
    title: 'Videos and websites made for clients.',
    body: 'Projects delivered and running in production.',
    filters: { all: 'All', video: 'Video', web: 'Web', software: 'Software' },
    slot: 'Open slot',
    slotBody: 'The next project could be yours.',
    slotCta: 'Get a quote',
    open: 'Case study',
    all: 'All work',
  },
  caseStudy: {
    next: 'Next project',
    service: 'Service',
    back: 'All work',
    ask: 'Want a clip like this for your business?',
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
    telemetry: 'Measured live, in your browser',
    metrics: {
      ttfb: ['TTFB', 'Time to First Byte'],
      dcl: ['DOM Ready', 'DOMContentLoaded'],
      mount: ['Client Hydration', 'hydrateRoot'],
      render: ['Client Render', 'createRoot'],
      fps: ['Live FPS', 'requestAnimationFrame'],
    },
    excellent: 'Excellent',
    pending: 'measuring',
    note: 'Live telemetry read straight from your browser through the window.performance standard. This is the real speed of the site you are reading.',
    architecture: 'Conversion architecture',
    layers: [
      { title: 'Clean code, no bloat', body: 'Clean React code. No heavy themes, no plugins you do not need.' },
      { title: 'Visual Continuity', body: 'The page inherits the style, fonts and offer of the video ad, so nothing breaks after the click.' },
      { title: 'In-App Browser Ready', body: 'Tuned for the in-app WebViews of TikTok, Instagram and Facebook.' },
    ],
  },
  apiDemo: {
    label: 'API • Integrations and sync',
    title: 'One change. The site and the clips update together.',
    body: 'We build the integrations that connect your stock and prices to your site and your clips. When a price or stock level changes, we make sure the site and the clips update on their own.',
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
        tab: 'Restaurant',
        data: { product: 'Lunch menu', price: '39 RON', badge: 'TODAY ONLY', stock: 40, cta: 'Order now' },
      },
    ],
    payload: 'The data (JSON)',
    editHint: 'Click a value and type.',
    outputs: 'Output · updated together',
    web: '[A] Web page',
    ad: '[B] 9:16 clip',
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
