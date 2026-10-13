import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import {
  Career,
  CompanySize,
  EntryPath,
  Riasec,
  WorkStyle,
} from '../types';
import { COLORS, SPACING, FONT, RADIUS, shadow, displayLineHeight } from '../constants/theme';
import Screen from '../components/Screen';
import Character from '../components/Character';
import { WavyBadge } from '../components/Shapes';
import { CHARACTER, characterTintForCard } from '../constants/characters';
import { skillDefinition } from '../constants/skills';
import { entryPathLabel, getShiftScenario } from '../utils/api';

const ENTRY_TITLE: Record<EntryPath, string> = {
  degree: 'Usually needs school',
  bootcamp: 'Bootcamp-friendly',
  apprenticeship: 'Apprenticeship path',
  portfolio: 'Portfolio path',
  mixed: 'Multiple ways in',
};

interface CareerDetailsScreenProps {
  route: any;
  navigation: any;
}

const SIZE_LABELS: { key: CompanySize; label: string }[] = [
  { key: 'startup', label: 'Startup' },
  { key: 'mid', label: 'Mid-size' },
  { key: 'enterprise', label: 'Enterprise' },
];

const TOGGLE_PAD = 4;

const workStyleChips = (ws: WorkStyle) => [
  {
    emoji: '🏡',
    label: 'Remote',
    value: { high: 'Very doable', medium: 'Sometimes', low: 'On-site' }[ws.remoteFriendly],
  },
  {
    emoji: '🗓️',
    label: 'Meetings',
    value: { high: 'A lot', medium: 'Some', low: 'Barely any' }[ws.meetingLoad],
  },
  {
    emoji: '⚡',
    label: 'Pace',
    value: { fast: 'Fast', steady: 'Steady', calm: 'Calm' }[ws.pace],
  },
  {
    emoji: '💬',
    label: 'People',
    value: { high: 'People-heavy', medium: 'Balanced', low: 'Heads-down' }[ws.peopleFacing],
  },
];

const CareerDetailsScreen: React.FC<CareerDetailsScreenProps> = ({ route, navigation }) => {
  const { career, accent = COLORS.sticker.yellow } = route.params as {
    career: Career;
    accent?: string;
  };
  const shift = getShiftScenario(career.id);
  const [size, setSize] = useState<CompanySize>('mid');
  const sizeIndex = SIZE_LABELS.findIndex((s) => s.key === size);
  const [trackW, setTrackW] = useState(0);
  const slide = useRef(new Animated.Value(sizeIndex)).current;
  const detail = career.companySize[size];
  const badgeColor = characterTintForCard(accent);

  useEffect(() => {
    Animated.spring(slide, {
      toValue: sizeIndex,
      useNativeDriver: true,
      friction: 9,
      tension: 140,
    }).start();
  }, [sizeIndex, slide]);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  const segmentW = trackW > 0 ? (trackW - TOGGLE_PAD * 2) / SIZE_LABELS.length : 0;

  return (
    <Screen>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <WavyBadge label={career.category} color={badgeColor} />
        </View>

        <View style={[styles.headerCard, { backgroundColor: accent }, shadow(6)]}>
          <View style={styles.stickerWrap}>
            <Character
              sticker={CHARACTER[(career.primaryArchetype as Riasec) ?? 'R']?.piece}
              color={characterTintForCard(accent)}
              size={88}
            />
          </View>
          <Text style={styles.title} allowFontScaling={false}>
            {career.title}
          </Text>
          <Text style={styles.description}>{career.description}</Text>
        </View>

        {!!shift && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.shiftCard, shadow(4)]}
            onPress={() => navigation.navigate('Shift', { career, accent })}>
            <View style={styles.flex}>
              <Text style={styles.shiftTitle}>Try a shift</Text>
              <Text style={styles.shiftSub}>
                Play two minutes of this job and see how it feels.
              </Text>
            </View>
            <View style={styles.shiftPill}>
              <Text style={styles.shiftPillText}>Clock in</Text>
            </View>
          </TouchableOpacity>
        )}

        {!!career.entry && (
          <>
            <Text style={styles.sectionTitle}>How people get in</Text>
            <View style={[styles.entryCard, shadow(2)]}>
              <Text style={styles.entryPath}>
                {ENTRY_TITLE[career.entry.path] ?? entryPathLabel(career.entry.path) ?? 'Entry path'}
              </Text>
              <Text style={styles.entryNote}>{career.entry.note}</Text>
            </View>
          </>
        )}

        {!!career.proofProjects?.length && (
          <>
            <Text style={styles.sectionTitle}>Projects that prove it</Text>
            <View style={styles.projects}>
              {career.proofProjects.map((p) => (
                <View key={p.title} style={[styles.projectRow, shadow(2)]}>
                  <Text style={styles.projectTitle}>{p.title}</Text>
                  <Text style={styles.projectBrief}>{p.brief}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>The day-to-day vibe</Text>
        <View style={styles.chipGrid}>
          {workStyleChips(career.workStyle).map((chip) => (
            <View key={chip.label} style={[styles.vibeChip, shadow(2)]}>
              <Text style={styles.vibeEmoji}>{chip.emoji}</Text>
              <View>
                <Text style={styles.vibeLabel}>{chip.label}</Text>
                <Text style={styles.vibeValue}>{chip.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Skills that help</Text>
        <View style={styles.skills}>
          {career.skills.map((skill) => (
            <View key={skill} style={[styles.skillRow, shadow(2)]}>
              <Text style={styles.skillName}>{skill}</Text>
              <Text style={styles.skillDef}>{skillDefinition(skill)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>By company size</Text>
        <View style={styles.toggle} onLayout={onTrackLayout}>
          {segmentW > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.togglePill,
                {
                  width: segmentW,
                  transform: [
                    {
                      translateX: slide.interpolate({
                        inputRange: SIZE_LABELS.map((_, i) => i),
                        outputRange: SIZE_LABELS.map((_, i) => i * segmentW),
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
          {SIZE_LABELS.map(({ key, label }) => {
            const active = size === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.9}
                style={styles.toggleBtn}
                onPress={() => setSize(key)}>
                <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.detailCard, shadow(3)]}>
          <Text style={styles.detailDesc}>{detail.description}</Text>

          <Text style={styles.detailHeading}>Typical tasks</Text>
          {detail.typicalTasks.map((t) => (
            <Row key={t} bullet="•" text={t} />
          ))}

          <Text style={styles.detailHeading}>Pros</Text>
          {detail.pros.map((p) => (
            <Row key={p} bullet="✓" text={p} />
          ))}

          <Text style={styles.detailHeading}>Cons</Text>
          {detail.cons.map((c) => (
            <Row key={c} bullet="-" text={c} />
          ))}

          <View style={styles.salaryBox}>
            <Text style={styles.salaryLabel}>Typical salary</Text>
            <Text style={styles.salaryValue}>{career.salary[size]}</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const Row: React.FC<{ bullet: string; text: string }> = ({ bullet, text }) => (
  <View style={styles.row}>
    <Text style={styles.bullet}>{bullet}</Text>
    <Text style={styles.rowText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingTop: 52, // clear transparent stack back button
    paddingBottom: SPACING.xxl,
  },
  badgeRow: {
    marginBottom: SPACING.md,
  },
  headerCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  stickerWrap: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONT.display,
    fontSize: FONT.size.headline,
    lineHeight: displayLineHeight(FONT.size.headline, FONT.leading.display),
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    lineHeight: 26,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
    marginTop: SPACING.md,
  },
  shiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  shiftTitle: {
    fontFamily: FONT.display,
    fontSize: FONT.size.title,
    lineHeight: Math.round(FONT.size.title * 1.35),
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  shiftSub: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    lineHeight: 20,
    fontWeight: FONT.weight.medium as any,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  shiftPill: {
    backgroundColor: COLORS.sticker.mustard,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
  },
  shiftPillText: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
    color: COLORS.ink,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  entryPath: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
    color: COLORS.ink,
    marginBottom: 6,
  },
  entryNote: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 22,
    color: COLORS.inkSoft,
  },
  projects: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  projectRow: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  projectTitle: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
    color: COLORS.ink,
    marginBottom: 4,
  },
  projectBrief: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    lineHeight: 20,
    color: COLORS.inkSoft,
  },
  sectionTitle: {
    fontFamily: FONT.display,
    fontSize: FONT.size.title,
    lineHeight: Math.round(FONT.size.title * 1.35),
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    width: '47%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  vibeEmoji: { fontSize: 22 },
  vibeLabel: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkFaint,
  },
  vibeValue: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    fontWeight: FONT.weight.semibold as any,
    color: COLORS.ink,
  },
  skills: {
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  skillRow: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  skillName: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
    color: COLORS.ink,
    marginBottom: 4,
  },
  skillDef: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    lineHeight: 20,
    color: COLORS.inkSoft,
  },
  toggle: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.pill,
    padding: TOGGLE_PAD,
    marginBottom: SPACING.lg,
  },
  togglePill: {
    position: 'absolute',
    top: TOGGLE_PAD,
    bottom: TOGGLE_PAD,
    left: TOGGLE_PAD,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    fontWeight: FONT.weight.semibold as any,
    color: COLORS.inkSoft,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  detailDesc: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 24,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  detailHeading: {
    fontFamily: FONT.display,
    fontSize: 13,
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  bullet: {
    fontSize: FONT.size.body,
    marginRight: SPACING.sm,
    width: 18,
    color: COLORS.inkSoft,
    fontWeight: FONT.weight.bold as any,
  },
  rowText: {
    flex: 1,
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 22,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkSoft,
  },
  salaryBox: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.sticker.yellow,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
  },
  salaryLabel: {
    fontFamily: FONT.body,
    fontSize: FONT.size.caption,
    color: COLORS.inkSoft,
    fontWeight: FONT.weight.semibold as any,
    textTransform: 'uppercase',
  },
  salaryValue: {
    fontFamily: FONT.display,
    fontSize: FONT.size.title,
    color: COLORS.ink,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});

export default CareerDetailsScreen;
