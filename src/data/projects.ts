import type { Lang } from '../i18n';
import { MARINA } from './marina';

/** A string in both site languages. */
export type L = Record<Lang, string>;

export type Category = 'video' | 'web' | 'software';
export const CATEGORIES: Category[] = ['video', 'web', 'software'];

export type Project = {
  slug: string;
  category: Category;
  client: string;
  place: L;
  title: L;
  summary: L;
  /** Short mono line on the card, e.g. "9:16 · 00:40". */
  format: string;
  /** Length in seconds and frame rate, for the timecode shown while scrubbing the card. */
  duration: number;
  fps: number;
  /** Card frame ratio (width / height). */
  aspect: number;
  poster: string;
  /** Horizontal thumbnail strip used for hover-scrubbing the card. */
  strip?: { src: string; frames: number };
  video?: string;
  /** Scene cuts in seconds; drive the scrub-bar segments and the thumbnail row on the case study. */
  scenes?: { from: number; to: number; name: L }[];
  facts: { k: L; v: L }[];
  sections: { title: L; body: L }[];
};

/**
 * Delivered projects, in showcase order. To add one: copy the Marina Park entry,
 * put its media in public/media/ and remove one of the OPEN_SLOTS below.
 */
export const PROJECTS: Project[] = [
  {
    slug: 'marina-park',
    category: 'video',
    client: 'Marina Park',
    place: { ro: 'Vama Veche', en: 'Vama Veche' },
    title: {
      ro: 'Un camping din Vama Veche, spus în 40 de secunde.',
      en: 'A campsite in Vama Veche, told in 40 seconds.',
    },
    summary: {
      ro: 'Promo vertical pentru Reels și TikTok. Fiecare scenă e un component.',
      en: 'A vertical promo for Reels and TikTok. Every scene is a component.',
    },
    format: '9:16 · 00:40',
    duration: MARINA.duration,
    fps: MARINA.fps,
    aspect: 9 / 16,
    poster: MARINA.poster,
    strip: { src: MARINA.strip, frames: MARINA.stripFrames },
    video: MARINA.src,
    scenes: [
      { from: 0, to: 4, name: { ro: 'Logo', en: 'Logo' } },
      { from: 4, to: 14, name: { ro: 'Casa', en: 'The house' } },
      { from: 14, to: 18, name: { ro: 'Căsuțe din lemn', en: 'Wooden cabins' } },
      { from: 18, to: 22.3, name: { ro: 'Foișor', en: 'Gazebo' } },
      { from: 22.3, to: 24, name: { ro: 'Soare', en: 'Sun' } },
      { from: 24, to: 27, name: { ro: 'Camping și hamace', en: 'Camping and hammocks' } },
      { from: 27, to: 35, name: { ro: 'Marea, la 400 m', en: 'The sea, 400 m away' } },
      { from: 35, to: 40, name: { ro: 'Final', en: 'End card' } },
    ],
    facts: [
      { k: { ro: 'Client', en: 'Client' }, v: { ro: 'Marina Park, Vama Veche', en: 'Marina Park, Vama Veche' } },
      { k: { ro: 'Format', en: 'Format' }, v: { ro: '9:16 · 1080×1920', en: '9:16 · 1080×1920' } },
      { k: { ro: 'Durată', en: 'Length' }, v: { ro: '00:40 · 1200 cadre', en: '00:40 · 1200 frames' } },
      { k: { ro: 'Livrare', en: 'Delivered' }, v: { ro: 'Reels, TikTok, Stories', en: 'Reels, TikTok, Stories' } },
    ],
    sections: [
      {
        title: { ro: 'Input', en: 'Input' },
        body: {
          ro: 'Casa în stil dobrogean, căsuțele din lemn, foișorul, locul de camping cu hamace și marea la 400 m. Totul trebuia să încapă în 40 de secunde, pe vertical.',
          en: 'The Dobrogean-style house, the wooden cabins, the gazebo, the camping ground with hammocks and the sea 400 m away. All of it had to fit into 40 seconds, vertically.',
        },
      },
      {
        title: { ro: 'Ce randează motorul', en: 'What the engine renders' },
        body: {
          ro: 'Opt scene, fiecare un component Remotion: text animat cadru cu cadru, tranziții calculate și un cadru de final cu adresa. Textul și ordinea scenelor vin din date, deci clipul se poate re-randa oricând.',
          en: 'Eight scenes, each a Remotion component: type animated frame by frame, computed transitions and an end card with the address. Copy and scene order come from data, so the clip can be re-rendered any time.',
        },
      },
    ],
  },
  {
    slug: 'flip-finder',
    category: 'video',
    client: 'Flip Finder',
    place: { ro: 'Imobiliare', en: 'Real estate' },
    title: {
      ro: 'Oferta de sub piață, găsită înaintea tuturor.',
      en: 'The below-market deal, found before anyone else.',
    },
    summary: {
      ro: 'Ad vertical pentru o aplicație care găsește apartamente sub prețul pieței. Fiecare cifră din video vine din date.',
      en: 'A vertical ad for an app that finds apartments priced below market. Every number in the video comes from data.',
    },
    format: '9:16 · 00:20',
    duration: 20,
    fps: 30,
    aspect: 9 / 16,
    poster: '/media/flip-finder-v1-poster.jpg',
    strip: { src: '/media/flip-finder-v1-strip.jpg', frames: 20 },
    video: '/media/flip-finder-v1.mp4',
    scenes: [
      { from: 0, to: 2, name: { ro: 'Eticheta de preț', en: 'Price tag' } },
      { from: 2, to: 6.5, name: { ro: 'Sub valoarea de piață', en: 'Below market value' } },
      { from: 6.5, to: 10, name: { ro: 'Harta ofertelor', en: 'Deal map' } },
      { from: 10, to: 14, name: { ro: 'Dashboard', en: 'Dashboard' } },
      { from: 14, to: 18, name: { ro: 'Notificarea de dimineață', en: 'Morning notification' } },
      { from: 18, to: 20, name: { ro: 'Final', en: 'End card' } },
    ],
    facts: [
      { k: { ro: 'Client', en: 'Client' }, v: { ro: 'Flip Finder', en: 'Flip Finder' } },
      { k: { ro: 'Format', en: 'Format' }, v: { ro: '9:16 · 1080×1920', en: '9:16 · 1080×1920' } },
      { k: { ro: 'Durată', en: 'Length' }, v: { ro: '00:20 · 60 fps', en: '00:20 · 60 fps' } },
      { k: { ro: 'Livrare', en: 'Delivered' }, v: { ro: 'Reels, TikTok, Stories', en: 'Reels, TikTok, Stories' } },
    ],
    sections: [
      {
        title: { ro: 'Input', en: 'Input' },
        body: {
          ro: 'Flip Finder urmărește anunțurile de apartamente din România și semnalează zilnic ce a scăzut sub valoarea de piață. Video-ul trebuia să arate asta pe un singur caz real: un 2 camere în Militari, de la 95.500 € la 89.000 €.',
          en: 'Flip Finder tracks apartment listings across Romania and flags, every day, what has dropped below market value. The video had to show that through one real case: a two-room flat in Militari, from €95,500 down to €89,000.',
        },
      },
      {
        title: { ro: 'Ce randează motorul', en: 'What the engine renders' },
        body: {
          ro: 'Eticheta de preț, graficul de scădere față de valoarea de piață, harta cu ofertele noi, lista din dashboard și notificarea de dimineață. Toate se desenează din aceleași date, deci schimbi anunțul și video-ul se re-randează cu noile cifre.',
          en: 'The price tag, the drop chart against market value, the map of new deals, the dashboard list and the morning notification. All of it is drawn from the same data, so swap the listing and the video re-renders with the new numbers.',
        },
      },
    ],
  },
  {
    slug: 'diagram-ai',
    category: 'video',
    client: 'DiagramAI',
    place: { ro: 'Software', en: 'Software' },
    title: {
      ro: 'O propoziție devine cod, apoi diagramă.',
      en: 'A sentence becomes code, then a diagram.',
    },
    summary: {
      ro: 'Ad vertical pentru o aplicație care transformă textul în diagrame. Video-ul arată tot drumul: text, cod, diagramă.',
      en: 'A vertical ad for an app that turns text into diagrams. The video shows the whole path: text, code, diagram.',
    },
    format: '9:16 · 00:15',
    duration: 15,
    fps: 30,
    aspect: 9 / 16,
    poster: '/media/diagram-ai-v1-poster.jpg',
    strip: { src: '/media/diagram-ai-v1-strip.jpg', frames: 15 },
    video: '/media/diagram-ai-v1.mp4',
    scenes: [
      { from: 0, to: 2.5, name: { ro: 'Propoziția', en: 'The sentence' } },
      { from: 2.5, to: 4, name: { ro: 'Codul', en: 'The code' } },
      { from: 4, to: 6.5, name: { ro: 'Diagrama', en: 'The diagram' } },
      { from: 6.5, to: 11, name: { ro: 'Pas nou din prompt', en: 'New step from a prompt' } },
      { from: 11, to: 15, name: { ro: 'Final', en: 'End card' } },
    ],
    facts: [
      { k: { ro: 'Client', en: 'Client' }, v: { ro: 'DiagramAI', en: 'DiagramAI' } },
      { k: { ro: 'Format', en: 'Format' }, v: { ro: '9:16 · 1080×1920', en: '9:16 · 1080×1920' } },
      { k: { ro: 'Durată', en: 'Length' }, v: { ro: '00:15 · 60 fps', en: '00:15 · 60 fps' } },
      { k: { ro: 'Livrare', en: 'Delivered' }, v: { ro: 'Reels, TikTok, Stories', en: 'Reels, TikTok, Stories' } },
    ],
    sections: [
      {
        title: { ro: 'Input', en: 'Input' },
        body: {
          ro: 'DiagramAI ia o descriere scrisă a unui proces și o transformă în diagramă. Video-ul trebuia să arate asta pe un singur exemplu: „Când un user se înscrie, verifică-i emailul, apoi creează-i workspace-ul.”',
          en: 'DiagramAI takes a written description of a process and turns it into a diagram. The video had to show that through one example: "When a user signs up, verify their email, then create their workspace."',
        },
      },
      {
        title: { ro: 'Ce randează motorul', en: 'What the engine renders' },
        body: {
          ro: 'Propoziția scrisă cuvânt cu cuvânt, aceeași frază rescrisă ca cod, nodurile care se așază în diagramă, un pas nou („Resend link”) adăugat din prompt și cadrul de final cu logo-ul. Textul, codul și nodurile vin din aceleași date, deci schimbi fluxul și video-ul se re-randează.',
          en: 'The sentence typed word by word, the same sentence rewritten as code, the nodes settling into a diagram, a new step ("Resend link") added from a prompt, and the logo end card. Text, code and nodes come from the same data, so change the flow and the video re-renders.',
        },
      },
    ],
  },
];

/** Empty frames shown after the real projects, one per category not covered yet. Remove one when you add a project. */
export const OPEN_SLOTS: Category[] = [];

export const findProject = (slug: string | undefined) => PROJECTS.find((p) => p.slug === slug);
