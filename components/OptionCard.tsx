import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS, SPACING, shadow } from '../constants/theme';

const PASTELS = [
  COLORS.sticker.mustard,
  COLORS.sticker.sky,
  COLORS.sticker.lilac,
  COLORS.sticker.sage,
  COLORS.sticker.coral,
  COLORS.sticker.peach,
];

interface OptionCardProps {
  emoji?: string;
  label: string;
  index: number;
  onPress: () => void;
}

/** Soft pastel quiz option — Baristi sticker-card energy, not generic white list rows. */
const OptionCard: React.FC<OptionCardProps> = ({ emoji, label, index, onPress }) => {
  const fill = PASTELS[index % PASTELS.length];

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, { backgroundColor: fill }, shadow(4)]}>
      {!!emoji && (
        <View style={styles.emojiDisk}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    minHeight: 72,
  },
  emojiDisk: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  label: {
    flex: 1,
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
    lineHeight: 22,
    color: COLORS.ink,
  },
});

export default OptionCard;
