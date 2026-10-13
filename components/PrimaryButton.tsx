import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, RADIUS, SPACING, FONT, shadow } from '../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  loading?: boolean;
  /** Hug label width (not full-bleed) with chunky padding */
  hug?: boolean;
  style?: ViewStyle;
  /** @deprecated — no icons on CTAs */
  showArrow?: boolean;
  tone?: string;
  color?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  loading,
  hug = false,
  style,
}) => {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={loading}
      style={[
        styles.base,
        hug && styles.hug,
        isOutline
          ? {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: COLORS.ink,
            }
          : {
              backgroundColor: COLORS.ink,
              ...shadow(hug ? 4 : 5),
            },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.ink : COLORS.white} />
      ) : (
        <Text style={[styles.label, { color: isOutline ? COLORS.ink : COLORS.white }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.xl + 4,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
    alignSelf: 'stretch',
  },
  hug: {
    alignSelf: 'flex-start',
    minHeight: 0,
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  label: {
    fontFamily: FONT.bodySemi,
    fontSize: 18,
  },
});

export default PrimaryButton;
