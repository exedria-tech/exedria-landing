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
  facts: { k: L; v: L }[];
  sections: { title: L; body: L }[];
};

/**
 * Delivered projects, newest first. To add one: copy the Marina Park entry,
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
    slug: 'exedria-showreel',
    category: 'video',
    client: 'Exedria',
    place: { ro: 'Showreel', en: 'Showreel' },
    title: {
      ro: 'De la un link de produs la zeci de reclame, în câteva minute.',
      en: 'From one product link to dozens of ads, in minutes.',
    },
    summary: {
      ro: 'Pipeline-ul complet în 15 secunde: citire, script, compilare, variante, optimizare.',
      en: 'The full pipeline in 15 seconds: read, script, compile, multiply, learn.',
    },
    format: '16:9 · 00:15',
    duration: 15,
    fps: 30,
    aspect: 16 / 9,
    poster: '/media/exedria-showreel-poster.jpg',
    strip: { src: '/media/exedria-showreel-strip.jpg', frames: 15 },
    video: '/media/exedria-showreel.mp4',
    facts: [
      { k: { ro: 'Input', en: 'Input' }, v: { ro: 'Un URL de produs', en: 'One product URL' } },
      { k: { ro: 'Format', en: 'Format' }, v: { ro: '16:9 · 1920×1080', en: '16:9 · 1920×1080' } },
      { k: { ro: 'Durată', en: 'Length' }, v: { ro: '00:15', en: '00:15' } },
      { k: { ro: 'Output', en: 'Output' }, v: { ro: '40 de variante · 9:16 și 1:1', en: '40 variants · 9:16 and 1:1' } },
    ],
    sections: [
      {
        title: { ro: 'Read → Script', en: 'Read → Script' },
        body: {
          ro: 'Claude Haiku extrage din pagina produsului propunerea de valoare, publicul și unghiurile. Claude Sonnet scrie apoi reclama cadru cu cadru, ca JSON strict: hook, problemă, soluție, CTA, formate.',
          en: 'Claude Haiku pulls the value proposition, audience and angles out of the product page. Claude Sonnet then writes the ad frame by frame as strict JSON: hook, problem, solution, CTA, formats.',
        },
      },
      {
        title: { ro: 'Compile → Multiply → Learn', en: 'Compile → Multiply → Learn' },
        body: {
          ro: 'Remotion și Hyperframes compilează JSON-ul direct în MP4. Din același script ies 40 de variante în 9:16 și 1:1, publicate pe Meta și TikTok; cele obosite se reîmprospătează, cele câștigătoare primesc buget.',
          en: 'Remotion and Hyperframes compile the JSON straight to MP4. The same script yields 40 variants in 9:16 and 1:1, pushed to Meta and TikTok; fatigued ads refresh, winners get the budget.',
        },
      },
    ],
  },
];

/** Empty frames shown after the real projects, one per category not covered yet. Remove one when you add a project. */
export const OPEN_SLOTS: Category[] = ['web', 'software'];

export const findProject = (slug: string | undefined) => PROJECTS.find((p) => p.slug === slug);
