import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { fetchTopFieldMatches, FieldMatch } from '../utils/api';
import { Archetype, Career } from '../types';
import { COLORS, SPACING, FONT, RADIUS, LAYOUT, shadow } from '../constants/theme';
import Character from '../components/Character';
import ColorCard from '../components/ColorCard';
import { WavyBadge } from '../components/Shapes';
import Sticker from '../components/Sticker';
import {
  CHARACTER,
  cardAccent,
  characterTintForCard,
} from '../constants/characters';

interface ResultsScreenProps {
  route: any;
  navigation: any;
}

const CareerCards: React.FC<{
  items: Career[];
  startIndex: number;
  navigation: any;
}> = ({ items, startIndex, navigation }) => (
  <View style={styles.cards}>
    {items.map((career, i) => {
      const c = cardAccent(startIndex + i);
      const cc = CHARACTER[career.primaryArchetype];
      return (
        <ColorCard
          key={career.id}
          color={c}
          title={career.title}
          subtitle={career.salary.mid}
          height={200}
          onPress={() => navigation.navigate('CareerDetails', { career, accent: c })}>
          <Character
            sticker={cc.piece}
            color={characterTintForCard(c)}
            size={68}
          />
        </ColorCard>
      );
    })}
  </View>
);

const ResultsScreen: React.FC<ResultsScreenProps> = ({ route, navigation }) => {
  const { archetype } = route.params as { archetype: Archetype };
  const persona = CHARACTER[archetype.id];
  const scores = archetype.scores ?? { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  const [matches, setMatches] = useState<FieldMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const washColor = COLORS.sticker.peach;
  const badgeColor = COLORS.sticker.mustard;
  const charColor = characterTintForCard(washColor);

  useEffect(() => {
    (async () => {
      try {
        setMatches(await fetchTopFieldMatches(scores));
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  let cardIndex = 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        <View style={styles.hero}>
          <WavyBadge label="Your persona" color={badgeColor} />

          <View style={styles.heroCharWrap}>
            <Sticker
              id="scallop"
              faceLess
              color={washColor}
              size={160}
              opacity={0.95}
              style={styles.heroWash}
            />
            <Character sticker={persona.piece} color={charColor} size={112} />
          </View>

          <Text style={styles.heroName}>{archetype.name}</Text>
          <Text style={styles.heroTagline}>{archetype.tagline}</Text>
          <View style={styles.traits}>
            {archetype.traits.map((t) => (
              <View key={t} style={styles.traitChip}>
                <Text style={styles.traitText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heroDesc}>{archetype.description}</Text>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.ink} />
          ) : matches.length === 0 ? (
            <Text style={styles.empty}>No matches found. Try retaking the quiz.</Text>
          ) : (
            matches.map((field) => {
              const start = cardIndex;
              cardIndex += field.careers.length;
              return (
                <View key={field.category} style={styles.fieldBlock}>
                  <Text style={styles.sectionTitle}>{field.category}</Text>
                  <CareerCards
                    items={field.careers}
                    startIndex={start}
                    navigation={navigation}
                  />
                </View>
              );
            })
          )}

          <View style={[styles.retakeCard, shadow(4)]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.retakeTitle}>Not feeling it?</Text>
              <Text style={styles.retakeSub}>Retake the quiz and explore again.</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.retakePill}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
              <Text style={styles.retakePillText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    alignItems: 'flex-start',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: LAYOUT.gutter,
  },
  heroCharWrap: {
    marginVertical: SPACING.lg,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  heroWash: {
    position: 'absolute',
  },
  heroName: {
    fontFamily: FONT.display,
    fontSize: FONT.size.display,
    lineHeight: Math.round(FONT.size.display * 1.4),
    color: COLORS.ink,
    textTransform: 'uppercase',
    alignSelf: 'stretch',
  },
  heroTagline: {
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkSoft,
    marginTop: SPACING.sm,
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  traitChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  traitText: {
    color: COLORS.ink,
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    fontWeight: FONT.weight.semibold as any,
  },
  section: {
    paddingHorizontal: LAYOUT.gutter,
    maxWidth: LAYOUT.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heroDesc: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 24,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkSoft,
    marginBottom: SPACING.xl,
  },
  fieldBlock: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONT.display,
    fontSize: FONT.size.title,
    lineHeight: Math.round(FONT.size.title * 1.35),
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginBottom: SPACING.lg,
  },
  empty: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    color: COLORS.inkSoft,
    marginTop: SPACING.lg,
  },
  cards: { gap: SPACING.md },
  retakeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  retakeTitle: {
    fontFamily: FONT.display,
    fontSize: 14,
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  retakeSub: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkSoft,
    marginTop: 4,
  },
  retakePill: {
    backgroundColor: COLORS.ink,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    marginLeft: SPACING.md,
  },
  retakePillText: {
    color: COLORS.white,
    fontFamily: FONT.body,
    fontWeight: FONT.weight.semibold as any,
    fontSize: FONT.size.body,
  },
});

export default ResultsScreen;
