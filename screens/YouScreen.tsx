import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING } from '../constants/theme';
import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import Character from '../components/Character';

interface YouScreenProps {
  navigation: any;
}

/** Profile hub — saved persona later; for now a clear path back into the quiz. */
const YouScreen: React.FC<YouScreenProps> = ({ navigation }) => {
  return (
    <Screen contentStyle={styles.screen}>
      <Text style={styles.title}>You</Text>
      <Text style={styles.sub}>
        Your quiz results and saved careers will live here.
      </Text>

      <View style={styles.card}>
        <Character sticker="angel" color={COLORS.sticker.peach} size={96} />
        <Text style={styles.cardTitle}>No persona yet</Text>
        <Text style={styles.cardBody}>
          Take the career quiz to unlock matches tailored to how you work.
        </Text>
        <PrimaryButton
          label="Take the quiz"
          hug
          onPress={() => navigation.navigate('Quiz')}
          style={styles.cta}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 110,
  },
  title: {
    fontFamily: FONT.display,
    fontSize: 34,
    lineHeight: 44,
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginTop: SPACING.lg,
  },
  sub: {
    fontFamily: FONT.body,
    fontSize: FONT.size.body,
    color: COLORS.inkSoft,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  card: {
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  cardTitle: {
    fontFamily: FONT.display,
    fontSize: 22,
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  cardBody: {
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    lineHeight: 26,
    color: COLORS.inkSoft,
    maxWidth: 300,
  },
  cta: {
    marginTop: SPACING.sm,
  },
});

export default YouScreen;
