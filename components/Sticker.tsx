import React, { useMemo } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  FACE_STICKER,
  Face,
  STICKER_SVG,
  StickerId,
} from '../assets/stickers/stickers';
import { COLORS, PALETTE } from '../constants/theme';

/** Default body tint per piece — vivid unisex accents. */
export const STICKER_TINT: Record<StickerId, string> = {
  scallop: COLORS.sticker.coral,
  arch: COLORS.sticker.mustard,
  pill: COLORS.sticker.sky,
  cloud: COLORS.sticker.peach,
  oval: COLORS.sticker.sage,
  hex: COLORS.sticker.coral,
  diamond: COLORS.sticker.lilac,
  cushion: COLORS.sticker.mustard,
  triangle: COLORS.sticker.sage,
  bracket: COLORS.sticker.lilac,
  flower: COLORS.sticker.lilac,
  star: COLORS.sticker.sky,
  notch: COLORS.sticker.mustard,
  devil: COLORS.sticker.coral,
  angel: COLORS.sticker.peach,
  house: COLORS.sticker.sage,
};

const INK = PALETTE.burgundy;
const CREAM_TOOTH = '#FFF7E6';
const FALLBACK = COLORS.sticker.coral;

interface StickerProps {
  id?: StickerId;
  face?: Face;
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  /** Body shape only — no eyes/mouth */
  faceLess?: boolean;
  /** Override body fill */
  color?: string;
}

function aspectFor(xml: string): number {
  const m = xml.match(/viewBox="([^"]+)"/);
  if (!m) return 1;
  const [, , w, h] = m[1].split(/\s+/).map(Number);
  if (!w || !h) return 1;
  return w / h;
}

/** Keep only the outer body path/polygon/ellipse. */
function shapeOnly(xml: string): string {
  const vb = xml.match(/viewBox="([^"]+)"/)?.[0] ?? 'viewBox="0 0 100 100"';
  const body = xml.match(/<(polygon|path|ellipse)\b[^>]*?\/>/)?.[0]
    ?? xml.match(/<(polygon|path|ellipse)\b[^>]*>/)?.[0];
  if (!body) return xml;
  let el = body.endsWith('/>') ? body : `${body.slice(0, -1)} />`;
  return `<svg xmlns="http://www.w3.org/2000/svg" ${vb}>${el}</svg>`;
}

function retint(xml: string, bodyColor: string): string {
  const fill = bodyColor && bodyColor !== 'undefined' ? bodyColor : FALLBACK;
  let firstBodyDone = false;
  return xml.replace(/fill="(#[0-9a-fA-F]{3,8})"/g, (_m, hex: string) => {
    const h = hex.toLowerCase();
    if (h === '#4c3023' || h === '#552d24' || h === '#6b2438' || h === '#1f1f1f') {
      return `fill="${INK}"`;
    }
    if (h === '#fff7e6' || h === '#ffffff' || h === '#fff') {
      return `fill="${CREAM_TOOTH}"`;
    }
    // Mouths / tongues — wine, not muddy brown
    if (h === '#f1792c' || h === '#d45326' || h === '#cc5411' || h === '#aa3111') {
      return `fill="${PALETTE.wine}"`;
    }
    // Star-eye accents
    if (h === '#f4b323' || h === '#f0b328' || h === '#f9e47c') {
      return `fill="${PALETTE.mustard}"`;
    }
    if (!firstBodyDone) {
      firstBodyDone = true;
      return `fill="${fill}"`;
    }
    return `fill="${fill}"`;
  });
}

const Sticker: React.FC<StickerProps> = ({
  id,
  face,
  size = 96,
  style,
  opacity = 1,
  faceLess = false,
  color,
}) => {
  const key: StickerId = id ?? (face ? FACE_STICKER[face] : 'scallop');
  const bodyColor = color ?? STICKER_TINT[key] ?? FALLBACK;

  const xml = useMemo(() => {
    const base = faceLess ? shapeOnly(STICKER_SVG[key]) : STICKER_SVG[key];
    return retint(base, bodyColor);
  }, [key, faceLess, bodyColor]);

  const aspect = aspectFor(xml);
  const width = aspect >= 1 ? size : size * aspect;
  const height = aspect >= 1 ? size / aspect : size;

  return (
    <View style={[{ width, height, opacity }, style]} pointerEvents="none">
      <SvgXml xml={xml} width={width} height={height} />
    </View>
  );
};

export type { StickerId, Face };
export default Sticker;
