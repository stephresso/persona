import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Career,
  ShiftBeat,
  ShiftChoice,
  ShiftMessage,
  ShiftPaper,
  ShiftQuality,
  ShiftScenario,
  ShiftTicket,
} from '../types';
import { COLORS, SPACING, FONT, RADIUS, shadow, displayLineHeight } from '../constants/theme';
import Screen from '../components/Screen';
import OptionCard from '../components/OptionCard';
import PrimaryButton from '../components/PrimaryButton';
import { WavyBadge } from '../components/Shapes';
import { getShiftScenario } from '../utils/api';
import { characterTintForCard } from '../constants/characters';

interface ShiftScreenProps {
  route: any;
  navigation: any;
}

const QUALITY_META: Record<ShiftQuality, { label: string; color: string }> = {
  best: { label: 'Pro move', color: COLORS.sticker.sage },
  ok: { label: 'Fair call', color: COLORS.sticker.mustard },
  bad: { label: 'Risky call', color: COLORS.sticker.coral },
};

/** Receipt-printer type for the paper tickets. */
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Urgency is a stamped word, not a colored card. Only "dying" earns color. */
const TICKET_STAMP: Record<ShiftTicket['status'], string> = {
  new: COLORS.inkFaint,
  cooking: COLORS.inkSoft,
  dying: COLORS.sticker.coral,
};

/** photoStory beat: what you're looking at. The emoji disk is a stand-in;
 * when a generated render (Krea etc.) is bundled, it replaces this card's art. */
const SceneCard: React.FC<{ beat: ShiftBeat; accent: string }> = ({ beat, accent }) => (
  <View style={[styles.sceneCard, { backgroundColor: accent }, shadow(4)]}>
    <View style={styles.sceneArt}>
      <Text style={styles.sceneEmoji}>{beat.sceneEmoji ?? '📍'}</Text>
    </View>
    <Text style={styles.sceneText}>{beat.scene}</Text>
  </View>
);

const ticketAge = (minutes: number): string => {
  if (minutes === 0) return 'JUST IN';
  if (minutes >= 60) return `${Math.round(minutes / 60)} HR AGO`;
  return `${minutes} MIN AGO`;
};

/** sequencing beat: the order board, mocked as the real thing. Paper tickets
 * in receipt type hang a little crooked from clips on the expo rail. */
const TicketRail: React.FC<{ tickets: ShiftTicket[] }> = ({ tickets }) => (
  <View style={styles.rail}>
    <View style={styles.railBar} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.railRow}>
      {tickets.map((t, i) => (
        <View
          key={`${t.item}-${t.age}`}
          style={[
            styles.ticketWrap,
            { transform: [{ rotate: i % 2 === 0 ? '-1.6deg' : '1.2deg' }] },
          ]}>
          <View style={[styles.paper, shadow(2)]}>
            <Text style={styles.paperTime}>{ticketAge(t.age)}</Text>
            <View style={styles.paperRule} />
            <Text style={styles.paperItem}>{t.item.toUpperCase()}</Text>
            <Text style={styles.paperMeta}>
              {t.station.toUpperCase()}
              {t.note ? `\n${t.note.toUpperCase()}` : ''}
            </Text>
            <Text style={[styles.paperStamp, { color: TICKET_STAMP[t.status] }]}>
              {t.status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.clip} />
        </View>
      ))}
    </ScrollView>
  </View>
);

/** dialogue beat: the conversation, mocked as a message thread. */
const ChatThread: React.FC<{ messages: ShiftMessage[] }> = ({ messages }) => (
  <View style={styles.chat}>
    {messages.map((m, i) => (
      <View
        key={i}
        style={[
          styles.bubble,
          m.from === 'you' ? styles.bubbleYou : styles.bubbleThem,
          m.from !== 'you' && shadow(2),
        ]}>
        {m.from !== 'you' && !!m.name && <Text style={styles.bubbleName}>{m.name}</Text>}
        <Text style={[styles.bubbleText, m.from === 'you' && styles.bubbleTextYou]}>
          {m.text}
        </Text>
      </View>
    ))}
  </View>
);

/** printout beat: the document in your hands, same clipped-paper language
 * as the chef tickets. */
const Printout: React.FC<{ paper: ShiftPaper }> = ({ paper }) => (
  <View style={styles.sheetWrap}>
    <View style={[styles.sheet, shadow(2)]}>
      <Text style={styles.sheetTitle}>{paper.title.toUpperCase()}</Text>
      <View style={styles.paperRule} />
      {paper.lines.map((line, i) => (
        <Text key={i} style={styles.sheetLine}>
          {line}
        </Text>
      ))}
    </View>
    <View style={styles.clip} />
  </View>
);

const verdictTitle = (bestCount: number, total: number): string => {
  if (bestCount >= total - 1) return 'You moved like a pro';
  if (bestCount >= Math.ceil(total / 2)) return "You'd pick this up fast";
  return 'Now you know what it takes';
};

const ShiftScreen: React.FC<ShiftScreenProps> = ({ route, navigation }) => {
  const { career, accent = COLORS.sticker.yellow } = route.params as {
    career: Career;
    accent?: string;
  };
  const scenario: ShiftScenario | undefined = getShiftScenario(career.id);

  const [stage, setStage] = useState<'intro' | 'play' | 'done'>('intro');
  const [beatIndex, setBeatIndex] = useState(0);
  const [picked, setPicked] = useState<ShiftChoice | null>(null);
  const [results, setResults] = useState<ShiftQuality[]>([]);

  if (!scenario) {
    // Shouldn't be reachable; the entry button only renders when one exists.
    return (
      <Screen center>
        <Text style={styles.sceneText}>No shift available for this career yet.</Text>
      </Screen>
    );
  }

  const beat = scenario.beats[beatIndex];
  const lastBeat = beatIndex === scenario.beats.length - 1;
  const badgeColor = characterTintForCard(accent);

  const choose = (choice: ShiftChoice) => {
    setPicked(choice);
    setResults([...results, choice.quality]);
  };

  const advance = () => {
    setPicked(null);
    if (lastBeat) {
      setStage('done');
    } else {
      setBeatIndex(beatIndex + 1);
    }
  };

  if (stage === 'intro') {
    return (
      <Screen>
        <View style={styles.intro}>
          <WavyBadge label="Try a shift" color={badgeColor} />
          <Text style={styles.introTitle}>{scenario.title}</Text>
          <Text style={styles.introSetting}>{scenario.setting}</Text>
          <Text style={styles.introHint}>
            A couple of minutes inside the job. You make the calls, no grades.
            Just a feel for how this work actually thinks.
          </Text>
          <PrimaryButton label="Clock in" onPress={() => setStage('play')} />
        </View>
      </Screen>
    );
  }

  if (stage === 'done') {
    const bestCount = results.filter((q) => q === 'best').length;
    return (
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <WavyBadge label="Shift complete" color={badgeColor} />
          <Text style={styles.introTitle}>{verdictTitle(bestCount, scenario.beats.length)}</Text>
          <Text style={styles.verdictStat}>
            {bestCount} of {scenario.beats.length} pro moves
          </Text>
          <View style={[styles.debriefCard, shadow(3)]}>
            <Text style={styles.debriefText}>{scenario.debrief}</Text>
          </View>
          <PrimaryButton label="Back to the career" onPress={() => navigation.goBack()} />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.segments}>
          {scenario.beats.map((b, i) => (
            <View key={b.id} style={styles.segTrack}>
              <View style={[styles.segFill, { width: i <= beatIndex ? '100%' : '0%' }]} />
            </View>
          ))}
        </View>

        {scenario.mechanic === 'photoStory' ? (
          <SceneCard beat={beat} accent={accent} />
        ) : scenario.mechanic === 'sequencing' ? (
          <TicketRail tickets={beat.tickets ?? []} />
        ) : scenario.mechanic === 'dialogue' ? (
          <ChatThread messages={beat.messages ?? []} />
        ) : (
          <Printout paper={beat.paper ?? { title: '', lines: [] }} />
        )}

        <Text style={styles.prompt}>{beat.prompt}</Text>

        {picked ? (
          <>
            <View
              style={[
                styles.outcomeCard,
                { backgroundColor: QUALITY_META[picked.quality].color },
                shadow(4),
              ]}>
              <Text style={styles.qualityLabel}>{QUALITY_META[picked.quality].label}</Text>
              <Text style={styles.outcomeText}>{picked.outcome}</Text>
            </View>
            <PrimaryButton label={lastBeat ? 'Clock out' : 'Next'} onPress={advance} />
          </>
        ) : (
          <View style={styles.options}>
            {beat.choices.map((choice, index) => (
              <OptionCard
                key={choice.text}
                index={index}
                label={choice.text}
                onPress={() => choose(choice)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 52, // clear transparent stack back button
    paddingBottom: SPACING.xxl,
  },
  intro: {
    flex: 1,
    paddingTop: 52,
    gap: SPACING.lg,
    alignItems: 'flex-start',
  },
  introTitle: {
    fontFamily: FONT.display,
    fontSize: FONT.size.display,
    lineHeight: displayLineHeight(FONT.size.display, FONT.leading.display),
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginTop: SPACING.sm,
  },
  introSetting: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.bodyLg,
    lineHeight: 26,
    color: COLORS.ink,
  },
  introHint: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 24,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.inkSoft,
    marginBottom: SPACING.md,
  },
  segments: { flexDirection: 'row', gap: 4, marginBottom: SPACING.lg },
  segTrack: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceAlt,
    overflow: 'hidden',
  },
  segFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.ink,
  },
  sceneCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sceneArt: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  sceneEmoji: { fontSize: 36 },
  sceneText: {
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    lineHeight: 26,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
  },
  rail: {
    marginBottom: SPACING.lg,
  },
  railBar: {
    height: 10,
    borderRadius: 3,
    backgroundColor: COLORS.ink,
    marginBottom: -5,
    zIndex: 0,
  },
  railRow: {
    paddingTop: 0,
    paddingBottom: SPACING.sm,
    paddingHorizontal: 2,
    gap: SPACING.md,
  },
  ticketWrap: {
    width: 148,
  },
  clip: {
    position: 'absolute',
    top: -2,
    alignSelf: 'center',
    width: 34,
    height: 12,
    borderRadius: 3,
    backgroundColor: COLORS.ink,
  },
  paper: {
    backgroundColor: COLORS.white,
    borderRadius: 3,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm + 4,
    marginTop: 6,
  },
  paperTime: {
    fontFamily: MONO,
    fontSize: 10,
    color: COLORS.inkFaint,
    letterSpacing: 0.5,
  },
  paperRule: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  paperItem: {
    fontFamily: MONO,
    fontSize: 12,
    fontWeight: FONT.weight.bold as any,
    color: COLORS.ink,
    lineHeight: 17,
  },
  paperMeta: {
    fontFamily: MONO,
    fontSize: 10,
    color: COLORS.inkSoft,
    lineHeight: 15,
    marginTop: 4,
  },
  paperStamp: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: FONT.weight.bold as any,
    letterSpacing: 1.5,
    marginTop: SPACING.sm,
    transform: [{ rotate: '-3deg' }],
  },
  chat: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 6,
  },
  bubbleYou: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.ink,
    borderBottomRightRadius: 6,
  },
  bubbleName: {
    fontFamily: FONT.bodySemi,
    fontSize: 11,
    color: COLORS.inkFaint,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 22,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
  },
  bubbleTextYou: {
    color: COLORS.white,
  },
  sheetWrap: {
    marginBottom: SPACING.lg,
    transform: [{ rotate: '-0.8deg' }],
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: 3,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginTop: 6,
  },
  sheetTitle: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: FONT.weight.bold as any,
    letterSpacing: 1,
    color: COLORS.ink,
  },
  sheetLine: {
    fontFamily: MONO,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.ink,
  },
  prompt: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.bodyLg,
    lineHeight: 26,
    color: COLORS.ink,
    marginBottom: SPACING.md,
  },
  options: { gap: 12 },
  outcomeCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  qualityLabel: {
    fontFamily: FONT.display,
    fontSize: 14,
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  outcomeText: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 24,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
  },
  verdictStat: {
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.bodyLg,
    color: COLORS.inkSoft,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  debriefCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  debriefText: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    lineHeight: 24,
    fontWeight: FONT.weight.medium as any,
    color: COLORS.ink,
  },
});

export default ShiftScreen;
