import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, LAYOUT } from '../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  background?: string; // full-bleed color (e.g. quiz stories)
  footer?: React.ReactNode; // pinned to the bottom, inside the gutter
  barStyle?: 'light-content' | 'dark-content';
  contentStyle?: ViewStyle;
  center?: boolean; // vertically center non-scrolling content
  /** Default omits bottom so floating glass tabs stay over content. */
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

/**
 * The single layout spine. Owns the safe area, status bar, and the one page
 * GUTTER so every screen has identical margins — the backbone of the system.
 */
const Screen: React.FC<ScreenProps> = ({
  children,
  scroll,
  background = COLORS.background,
  footer,
  barStyle = 'dark-content',
  contentStyle,
  center,
  edges = ['top', 'left', 'right'],
}) => {
  const inner = (
    <View style={[styles.content, center && styles.center, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <StatusBar barStyle={barStyle} />
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          inner
        )}
        {!!footer && <View style={styles.footer}>{footer}</View>}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: LAYOUT.gutter,
    width: '100%',
    maxWidth: LAYOUT.maxWidth,
    alignSelf: 'center',
  },
  center: { justifyContent: 'center' },
  scrollContent: {
    paddingHorizontal: LAYOUT.gutter,
    width: '100%',
    maxWidth: LAYOUT.maxWidth,
    alignSelf: 'center',
  },
  footer: {
    paddingHorizontal: LAYOUT.gutter,
    paddingTop: 12,
    paddingBottom: 8,
  },
});

export default Screen;
