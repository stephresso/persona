import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, FONT, shadow, displayLineHeight } from '../constants/theme';
import Sticker, { StickerId } from './Sticker';

/**
 * Optional soft washes. Prefer scallop/star — never hex (reads as a clipped slab).
 */
export const FloatingShapes: React.FC<{
  variant?: 'top' | 'full';
  top?: StickerId | null;
  bottom?: StickerId | null;
}> = ({ top = null, bottom = null }) => {
  if (!top && !bottom) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {top ? (
        <Sticker
          id={top}
          faceLess
          size={180}
          opacity={0.22}
          style={{ position: 'absolute', top: -64, right: -48 }}
        />
      ) : null}
      {bottom ? (
        <Sticker
          id={bottom}
          faceLess
          size={120}
          opacity={0.2}
          style={{ position: 'absolute', bottom: 28, left: -52 }}
        />
      ) : null}
    </View>
  );
};

/**
 * Soft cloud-pill like Baristi “OUR MENU”:
 * round capsule ends + few large scallops on top & bottom only.
 * No radial star / stretch spikes.
 */
function cloudPillPath(w: number, h: number): string {
  const r = h / 2;
  const amp = Math.min(5, h * 0.14);
  const waves = 5; // spread, soft
  const f = (n: number) => n.toFixed(2);

  const left = r;
  const right = w - r;

  const topWave = () => {
    let s = '';
    const span = right - left;
    for (let i = 0; i < waves; i++) {
      const x0 = left + (span * i) / waves;
      const x1 = left + (span * (i + 1)) / waves;
      const mx = (x0 + x1) / 2;
      // Smooth quadratic scallops (round crests)
      s += ` Q ${f(mx)} ${f(-amp)} ${f(x1)} ${f(0)}`;
    }
    return s;
  };

  const bottomWave = () => {
    let s = '';
    const span = right - left;
    for (let i = 0; i < waves; i++) {
      const x0 = right - (span * i) / waves;
      const x1 = right - (span * (i + 1)) / waves;
      const mx = (x0 + x1) / 2;
      s += ` Q ${f(mx)} ${f(h + amp)} ${f(x1)} ${f(h)}`;
    }
    return s;
  };

  // Start top-left of capsule body; pad viewBox for wave peaks separately
  return [
    `M ${f(left)} 0`,
    topWave(),
    `A ${f(r)} ${f(r)} 0 0 1 ${f(right)} ${f(h)}`,
    bottomWave(),
    `A ${f(r)} ${f(r)} 0 0 1 ${f(left)} 0`,
    'Z',
  ].join(' ');
}

const PAD_X = 20;
const PAD_Y = 14;
const WAVE_PAD = 6;

/**
 * Soft scalloped label badge (Baristi OUR MENU style).
 */
export const WavyBadge: React.FC<{
  label: string;
  color?: string;
  style?: ViewStyle;
}> = ({ label, color = COLORS.sticker.sky, style }) => {
  const [textSize, setTextSize] = useState({ w: 88, h: 16 });

  const onTextLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (
      width > 0 &&
      height > 0 &&
      (Math.abs(width - textSize.w) > 0.5 || Math.abs(height - textSize.h) > 0.5)
    ) {
      setTextSize({ w: width, h: height });
    }
  };

  // Compact Baristi “OUR MENU” proportions — hug label, not a stretched ribbon
  const h = Math.ceil(Math.max(38, textSize.h + PAD_Y * 2));
  const w = Math.ceil(textSize.w + PAD_X * 2 + 8);
  const svgH = h + WAVE_PAD * 2;

  const path = useMemo(() => cloudPillPath(w, h), [w, h]);

  return (
    <View style={[styles.badgeWrap, { width: w, height: svgH }, shadow(3), style]}>
      <Svg
        width={w}
        height={svgH}
        viewBox={`0 ${-WAVE_PAD} ${w} ${svgH}`}
        style={StyleSheet.absoluteFill}
        pointerEvents="none">
        <Path d={path} fill={color} />
      </Svg>
      <Text style={styles.badgeText} onLayout={onTextLayout} allowFontScaling={false}>
        {label}
      </Text>
    </View>
  );
};

export const Flower: React.FC<{
  color?: string;
  size?: number;
  style?: ViewStyle;
}> = ({ size = 64, style, color }) => (
  <Sticker id="flower" color={color} size={size} style={style} opacity={0.95} />
);

export const Blob: React.FC<{
  color: string;
  size: number;
  style?: ViewStyle;
  rounded?: number;
  opacity?: number;
}> = ({ size, style, opacity = 0.35, color }) => (
  <Sticker id="scallop" faceLess color={color} size={size} opacity={opacity} style={style} />
);

export const Sparkle = () => null;
export const Ring = () => null;
export const Squiggle = () => null;

const styles = StyleSheet.create({
  badgeWrap: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONT.display,
    fontSize: 11,
    lineHeight: displayLineHeight(11, 1.4),
    color: COLORS.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    zIndex: 1,
  },
});
