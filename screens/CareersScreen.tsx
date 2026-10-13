import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT, SPACING, LAYOUT, displayLineHeight } from '../constants/theme';
import Screen from '../components/Screen';
import ColorCard from '../components/ColorCard';
import Character from '../components/Character';
import { WavyBadge } from '../components/Shapes';
import FloatingSticker from '../components/FloatingSticker';
import {
  CHARACTER,
  cardAccent,
  characterTintForCard,
} from '../constants/characters';
import careersData from '../data/careers.json';
import { Career, Riasec } from '../types';
import { entryPathLabel } from '../utils/api';

interface CareersScreenProps {
  navigation: any;
}

/** Careers tab: badge, title, and cards all scroll together. */
const CareersScreen: React.FC<CareersScreenProps> = ({ navigation }) => {
  const careers = useMemo(
    () =>
      [...(careersData.careers as unknown as Career[])].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    [],
  );

  return (
    <Screen>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <WavyBadge label="Browse paths" color={COLORS.sticker.sage} />
          <Text style={styles.title} allowFontScaling={false}>
            Careers
          </Text>
          <Text style={styles.sub}>
            Soft profiles for every wiring. Take the quiz when you want ranked matches.
          </Text>
          <FloatingSticker
            sticker="flower"
            color={COLORS.sticker.lilac}
            size={56}
            delay={200}
            tilt={10}
            rock={4}
            style={styles.heroSticker}
          />
        </View>

        <View style={styles.list}>
          {careers.map((item, index) => {
            const accent = cardAccent(index);
            const piece =
              CHARACTER[(item.primaryArchetype as Riasec) ?? 'R']?.piece ?? 'scallop';
            const pathChip = entryPathLabel(item.entry?.path);
            return (
              <ColorCard
                key={item.id}
                color={accent}
                title={item.title}
                subtitle={
                  pathChip
                    ? `${item.category} · ${pathChip}`
                    : `${item.category} · ${item.salary.mid}`
                }
                height={200}
                onPress={() =>
                  navigation.navigate('CareerDetails', { career: item, accent })
                }>
                <Character
                  sticker={piece}
                  color={characterTintForCard(accent)}
                  size={68}
                />
              </ColorCard>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingBottom: 120,
  },
  hero: {
    position: 'relative',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingRight: 64,
    overflow: 'visible',
  },
  title: {
    fontFamily: FONT.display,
    fontSize: FONT.size.hero,
    lineHeight: displayLineHeight(FONT.size.hero, FONT.leading.display),
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginTop: SPACING.md,
  },
  sub: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: displayLineHeight(FONT.size.body, 1.5),
    color: COLORS.inkSoft,
    marginTop: SPACING.sm,
    maxWidth: 300,
  },
  heroSticker: {
    position: 'absolute',
    right: -4,
    top: 36,
  },
  list: {
    gap: LAYOUT.itemGap + 4,
  },
});

export default CareersScreen;
