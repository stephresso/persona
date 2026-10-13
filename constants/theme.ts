// Persona — cream canvas, burgundy ink, vivid but unisex sticker accents.
// Timeless + fun: wine type, soft-bright pastels (no muddy earth, no neon).

import { FontFamily } from './fonts';

export const PALETTE = {
  background: '#F9F1DD',
  cream: '#E8DFC8',
  // Burgundy — replaces chocolate brown
  title: '#6B2438',
  burgundy: '#6B2438',
  wine: '#8E3A52',
  black: '#1F1F1F',
  white: '#FFFFFF',
  // Clear pastels — bright enough to feel fun, still unisex
  coral: '#F47B5A',
  mustard: '#F5D24A',
  sage: '#B5D96A',
  sky: '#6BB8F0',
  lilac: '#A894F0',
  peach: '#FFB088',
  // Compat aliases
  blue: '#6BB8F0',
  violet: '#A894F0',
  pink: '#F47B5A',
  yellow: '#F5D24A',
  green: '#B5D96A',
  orange: '#F47B5A',
} as const;

export const COLORS = {
  primary: PALETTE.burgundy,
  accent: PALETTE.coral,
  background: PALETTE.background,
  surface: PALETTE.white,
  surfaceAlt: PALETTE.cream,
  dark: PALETTE.black,

  ink: PALETTE.burgundy,
  inkStrong: PALETTE.burgundy,
  inkSoft: 'rgba(107, 36, 56, 0.72)',
  inkFaint: 'rgba(107, 36, 56, 0.45)',
  onColor: PALETTE.white,

  border: 'rgba(107, 36, 56, 0.12)',
  success: '#5A8F4A',
  error: '#FF2244',
  white: PALETTE.white,
  black: PALETTE.black,

  sticker: {
    coral: PALETTE.coral,
    mustard: PALETTE.mustard,
    sage: PALETTE.sage,
    sky: PALETTE.sky,
    lilac: PALETTE.lilac,
    peach: PALETTE.peach,
    cream: PALETTE.cream,
    wine: PALETTE.wine,
    // aliases for existing screens
    blue: PALETTE.sky,
    violet: PALETTE.lilac,
    pink: PALETTE.coral,
    yellow: PALETTE.mustard,
    green: PALETTE.sage,
    sand: PALETTE.mustard,
    clay: PALETTE.coral,
    stone: PALETTE.cream,
    oat: PALETTE.peach,
    slate: PALETTE.sky,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const LAYOUT = {
  gutter: 22,
  sectionGap: 32,
  itemGap: 14,
  maxWidth: 480,
} as const;

export const RADIUS = {
  sm: 14,
  md: 22,
  lg: 28,
  xl: 36,
  pill: 999,
} as const;

export const FONT = {
  display: FontFamily.display,
  body: FontFamily.body,
  bodySemi: FontFamily.bodySemi,
  size: {
    caption: 13,
    body: 16,
    bodyLg: 18,
    title: 22,
    headline: 28,
    display: 36,
    hero: 40, // Baristi Heading 5
  },
  /**
   * Boldonse leading from Baristi Framer styles.json.
   * Font file metrics were patched (hhea/OS/2) so 130% no longer clips in RN.
   */
  leading: {
    tight: 1.3, // Heading 4 — stacked heroes
    display: 1.35, // Heading 2
    loose: 1.5, // Heading 5 / 6
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/** Baristi-style Boldonse line box — size × leading, rounded. */
export const displayLineHeight = (
  size: number,
  leading: number = FONT.leading.tight,
) => Math.round(size * leading);

export const shadow = (elevation = 4) => ({
  shadowColor: PALETTE.burgundy,
  shadowOffset: { width: 0, height: elevation / 2 },
  shadowOpacity: 0.14,
  shadowRadius: elevation,
  elevation: elevation / 2,
});
