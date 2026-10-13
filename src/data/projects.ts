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
          ro: 'Casa în stil dobrogean, căsuțele din lemn, foișorul, locurile de rulote și corturi și marea la 400 m. Totul trebuia să încapă în 40 de secunde, pe vertical.',
          en: 'The Dobrogean-style house, the wooden cabins, the gazebo, the camper and tent pitches and the sea 400 m away. All of it had to fit into 40 seconds, vertically.',
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
];

/** Empty frames shown after the real projects, one per category not covered yet. Remove one when you add a project. */
export const OPEN_SLOTS: Category[] = ['web', 'software'];

export const findProject = (slug: string | undefined) => PROJECTS.find((p) => p.slug === slug);
