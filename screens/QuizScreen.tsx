import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { fetchQuestions, submitQuizResponses } from '../utils/api';
import { Question, QuestionOption } from '../types';
import { COLORS, SPACING, FONT, RADIUS } from '../constants/theme';
import Screen from '../components/Screen';
import OptionCard from '../components/OptionCard';

interface QuizScreenProps {
  navigation: any;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      setQuestions(await fetchQuestions());
    } catch {
      setError('Something went wrong loading the quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: QuestionOption) => {
    const next = [...responses, option];
    setResponses(next);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitting(true);
      try {
        const { archetype } = await submitQuizResponses(next);
        navigation.replace('Results', { archetype });
      } catch {
        setError('Could not score your quiz. Please try again.');
        setSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResponses(responses.slice(0, -1));
    } else {
      navigation.goBack();
    }
  };

  if (loading || submitting || error) {
    return (
      <Screen background={COLORS.background} center>
        <View style={styles.centered}>
          {error ? (
            <>
              <Text style={styles.loadingText}>{error}</Text>
              <TouchableOpacity style={styles.retry} onPress={loadQuestions}>
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ActivityIndicator color={COLORS.ink} size="large" />
              <Text style={styles.loadingText}>
                {submitting ? 'Reading your vibe…' : 'Loading…'}
              </Text>
            </>
          )}
        </View>
      </Screen>
    );
  }

  const q = questions[currentIndex];

  return (
    <Screen background={COLORS.background}>
      <View style={styles.segments}>
        {questions.map((_, i) => (
          <View key={i} style={styles.segTrack}>
            <View
              style={[
                styles.segFill,
                { width: i <= currentIndex ? '100%' : '0%' },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.topRow}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}>
          <View style={styles.backCircle}>
            <Text style={styles.back}>‹</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.counter}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.questionWrap}>
          <Text style={styles.question}>{q.question}</Text>
        </View>

        <View style={styles.options}>
          {q.options.map((option, index) => (
            <OptionCard
              key={index}
              index={index}
              emoji={option.emoji}
              label={option.text}
              onPress={() => handleAnswer(option)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center' },
  loadingText: {
    color: COLORS.ink,
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  retry: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.ink,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  retryText: {
    color: COLORS.white,
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.body,
  },
  segments: { flexDirection: 'row', gap: 4, marginTop: SPACING.sm },
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { color: COLORS.ink, fontSize: 28, marginTop: -2 },
  counter: {
    color: COLORS.inkSoft,
    fontFamily: FONT.bodySemi,
    fontSize: FONT.size.caption,
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.xl,
  },
  questionWrap: {
    paddingBottom: SPACING.lg,
  },
  question: {
    color: COLORS.ink,
    fontFamily: FONT.display,
    fontSize: 28,
    lineHeight: 40,
    textTransform: 'uppercase',
    paddingTop: 4,
  },
  options: { gap: 12, marginTop: SPACING.sm },
});

export default QuizScreen;
