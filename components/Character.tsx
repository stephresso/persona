import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Sticker, { Face, StickerId } from './Sticker';

// Vecteezy hippie sticker characters (9214253). Shape kept for API compat.

export type { Face };
export type Shape = 'tall' | 'round' | 'egg' | 'bean';

interface CharacterProps {
  /** Body fill — warm palette color */
  color?: string;
  size?: number;
  face?: Face;
  /** Direct sticker override (preferred when you know the piece) */
  sticker?: StickerId;
  shape?: Shape;
  style?: StyleProp<ViewStyle>;
}

const Character: React.FC<CharacterProps> = ({
  color,
  size = 96,
  face = 'happy',
  sticker,
  style,
}) => (
  <Sticker id={sticker} face={face} color={color} size={size} style={style} />
);

export default Character;
