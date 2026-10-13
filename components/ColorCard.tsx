import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, FONT, shadow, displayLineHeight } from '../constants/theme';

interface ColorCardProps {
  color: string;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  height?: number;
  textColor?: string;
  style?: ViewStyle;
}

/**
 * Soft pastel career card — badge up top with real air, title anchored below.
 * Taller by default so the match pill never kisses the headline.
 */
const ColorCard: React.FC<ColorCardProps> = ({
  color,
  title,
  subtitle,
  badge,
  onPress,
  children,
  height = 196,
  textColor = COLORS.ink,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.9 : 1}
      onPress={onPress}
      style={[styles.card, { backgroundColor: color, minHeight: height }, shadow(5), style]}>
      <View style={styles.top}>
        {!!badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : (
          <View />
        )}
        <View style={styles.art} pointerEvents="none">
          {children}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 1, paddingRight: SPACING.sm }}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {!!onPress && (
          <View style={styles.chev}>
            <Text style={[styles.chevText, { color: textColor }]}>›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 72,
  },
  art: {
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    marginTop: 4,
  },
  badgeText: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.caption,
    color: COLORS.ink,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: SPACING.lg,
  },
  title: {
    fontFamily: FONT.display,
    fontSize: FONT.size.title,
    lineHeight: displayLineHeight(FONT.size.title, FONT.leading.display),
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    marginTop: 4,
    opacity: 0.75,
  },
  chev: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 36, 56, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  chevText: {
    fontSize: 24,
    fontWeight: FONT.weight.bold as any,
    marginTop: -2,
  },
});

export default ColorCard;
