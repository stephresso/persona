import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { COLORS, FONT, RADIUS } from '../constants/theme';

const ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  Home: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke={active ? COLORS.ink : COLORS.inkSoft}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  ),
  Careers: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={7}
        width={18}
        height={13}
        rx={2}
        stroke={active ? COLORS.ink : COLORS.inkSoft}
        strokeWidth={1.8}
      />
      <Path
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
        stroke={active ? COLORS.ink : COLORS.inkSoft}
        strokeWidth={1.8}
      />
    </Svg>
  ),
  You: (active) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={9}
        r={3.5}
        stroke={active ? COLORS.ink : COLORS.inkSoft}
        strokeWidth={1.8}
      />
      <Path
        d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"
        stroke={active ? COLORS.ink : COLORS.inkSoft}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  ),
};

/** Floating iOS-style liquid-glass tab bar. */
const GlassTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.shell}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={22}
            reducedTransparencyFallbackColor="rgba(249,241,221,0.55)"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidFallback]} />
        )}
        <View style={styles.glassTint} />
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : options.title ?? route.name;
            const focused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={[styles.item, focused && styles.itemActive]}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}>
                {ICONS[route.name]?.(focused) ?? null}
                <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shell: {
    alignSelf: 'center',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  androidFallback: {
    backgroundColor: 'rgba(249,241,221,0.55)',
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 2,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    gap: 3,
    minWidth: 64,
  },
  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  label: {
    fontFamily: FONT.bodySemi,
    fontSize: 11,
    color: COLORS.inkSoft,
  },
  labelActive: {
    color: COLORS.ink,
  },
});

export default GlassTabBar;
