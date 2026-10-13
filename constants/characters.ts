import { Face, Shape } from '../components/Character';
import { StickerId } from '../assets/stickers/stickers';
import { Riasec } from '../types';
import { COLORS } from './theme';

/** Named pastel keys used for cards + stickers. */
export type PastelKey =
  | 'mustard'
  | 'sky'
  | 'lilac'
  | 'sage'
  | 'coral'
  | 'peach';

export const PASTEL: Record<PastelKey, string> = {
  mustard: COLORS.sticker.mustard,
  sky: COLORS.sticker.sky,
  lilac: COLORS.sticker.lilac,
  sage: COLORS.sticker.sage,
  coral: COLORS.sticker.coral,
  peach: COLORS.sticker.peach,
};

/**
 * Card → character tint pairs (never the same hue).
 * sky→lilac, sage→peach, mustard→coral, etc.
 */
export const CARD_CHARACTER_PAIR: Record<PastelKey, PastelKey> = {
  sky: 'lilac',
  sage: 'peach',
  mustard: 'coral',
  lilac: 'mustard',
  coral: 'sky',
  peach: 'sage',
};

/** Ordered card accents for lists / results. */
export const CARD_PASTEL_KEYS: PastelKey[] = [
  'mustard',
  'sky',
  'lilac',
  'sage',
  'coral',
  'peach',
];

export const cardAccent = (index: number): string =>
  PASTEL[CARD_PASTEL_KEYS[index % CARD_PASTEL_KEYS.length]];

/** Character fill that complements a card/background accent. */
export const characterTintForCard = (cardColor: string): string => {
  const key = (Object.keys(PASTEL) as PastelKey[]).find(
    (k) => PASTEL[k].toLowerCase() === cardColor.toLowerCase(),
  );
  if (!key) {
    // Fallback: if we don't recognize the card, use lilac (pairs with sky/cream)
    return PASTEL.lilac;
  }
  return PASTEL[CARD_CHARACTER_PAIR[key]];
};

/** RIASEC → sticker shape (+ default tint when not on a colored card). */
export const CHARACTER: Record<
  Riasec,
  { shape: Shape; face: Face; sticker: string; piece: StickerId }
> = {
  R: { shape: 'round', face: 'cool', sticker: COLORS.sticker.sage, piece: 'triangle' },
  I: { shape: 'round', face: 'curious', sticker: COLORS.sticker.sky, piece: 'pill' },
  A: { shape: 'round', face: 'grin', sticker: COLORS.sticker.lilac, piece: 'flower' },
  S: { shape: 'round', face: 'happy', sticker: COLORS.sticker.coral, piece: 'scallop' },
  E: { shape: 'round', face: 'wow', sticker: COLORS.sticker.mustard, piece: 'star' },
  C: { shape: 'round', face: 'calm', sticker: COLORS.sticker.peach, piece: 'arch' },
};
