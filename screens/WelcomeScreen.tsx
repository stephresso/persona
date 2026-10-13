import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SPACING, FONT, displayLineHeight } from '../constants/theme';
import PrimaryButton from '../components/PrimaryButton';
import Screen from '../components/Screen';
import { WavyBadge } from '../components/Shapes';
import FloatingSticker from '../components/FloatingSticker';

interface WelcomeScreenProps {
  navigation: any;
}

const TITLE_LINES = ['What are', 'you meant', 'to do?'];

/** Baristi Heading 5 size + Heading 2 leading (135%) — room for tall O/Q. */
const HERO_SIZE = FONT.size.hero;
const HERO_LH = displayLineHeight(HERO_SIZE, FONT.leading.display);

/**
 * Home collage — Baristi type density + soft badge,
 * stickers rotate in place (orange on the ?).
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const badge = useRef(new Animated.Value(0)).current;
  const lines = useRef(TITLE_LINES.map(() => new Animated.Value(0))).current;
  const sub = useRef(new Animated.Value(0)).current;
  const cta = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(badge, {
      toValue: 1,
      friction: 8,
      tension: 90,
      delay: 80,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      90,
      lines.map(v =>
        Animated.spring(v, {
          toValue: 1,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.timing(sub, {
      toValue: 1,
      duration: 420,
      delay: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.spring(cta, {
      toValue: 1,
      friction: 9,
      tension: 80,
      delay: 520,
      useNativeDriver: true,
    }).start();
  }, [badge, lines, sub, cta]);

  return (
    <Screen contentStyle={styles.screen}>
      <Text style={styles.wordmark} allowFontScaling={false}>
        PERSONA
      </Text>

      <View style={styles.hero}>
        <Animated.View
          style={[
            styles.badge,
            {
              opacity: badge,
              transform: [
                {
                  scale: badge.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
                {
                  rotate: badge.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-5deg', '-3deg'],
                  }),
                },
              ],
            },
          ]}>
          <WavyBadge label="Career quiz" color={COLORS.sticker.sky} />
        </Animated.View>

        <View style={styles.typeBlock}>
          {TITLE_LINES.map((line, i) => {
            const isLast = i === TITLE_LINES.length - 1;
            return (
              <View key={line} style={styles.lineRow}>
                <Animated.Text
                  allowFontScaling={false}
                  style={[
                    styles.titleLine,
                    {
                      opacity: lines[i],
                      transform: [
                        {
                          translateY: lines[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          }),
                        },
                      ],
                    },
                  ]}>
                  {isLast ? 'to do' : line}
                </Animated.Text>
                {isLast ? (
                  <>
                    <Animated.Text
                      allowFontScaling={false}
                      style={[
                        styles.titleLine,
                        {
                          opacity: lines[i],
                          transform: [
                            {
                              translateY: lines[i].interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0],
                              }),
                            },
                          ],
                        },
                      ]}>
                      ?
                    </Animated.Text>
                    <FloatingSticker
                      sticker="scallop"
                      color={COLORS.sticker.coral}
                      size={48}
                      delay={480}
                      tilt={-14}
                      rock={4}
                      style={styles.onQuestion}
                    />
                  </>
                ) : null}
              </View>
            );
          })}

          <FloatingSticker
            sticker="arch"
            color={COLORS.sticker.mustard}
            size={60}
            delay={380}
            tilt={14}
            rock={5}
            style={styles.arch}
          />
        </View>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: sub,
              transform: [
                {
                  translateY: sub.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}>
          A short personality quiz that matches you with careers that feel right.
        </Animated.Text>

        <Animated.View
          style={{
            opacity: cta,
            transform: [
              {
                translateY: cta.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          }}>
          <PrimaryButton
            label="Take the quiz"
            hug
            onPress={() => navigation.navigate('Quiz')}
            style={styles.cta}
          />
        </Animated.View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    overflow: 'visible',
    paddingBottom: 110,
  },
  wordmark: {
    fontFamily: FONT.display,
    fontSize: 14,
    lineHeight: displayLineHeight(14, 1.4),
    color: COLORS.ink,
    marginTop: SPACING.lg,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  badge: {
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  typeBlock: {
    position: 'relative',
    marginRight: 48,
    marginBottom: SPACING.md,
    overflow: 'visible',
    // tiny headroom for first-line Boldonse ink (not per-line padding)
    paddingTop: 2,
  },
  lineRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    overflow: 'visible',
  },
  titleLine: {
    fontFamily: FONT.display,
    fontSize: HERO_SIZE,
    lineHeight: HERO_LH,
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  onQuestion: {
    marginLeft: -10,
    marginTop: -12,
    zIndex: 3,
  },
  arch: {
    position: 'absolute',
    right: -56,
    top: -20,
    zIndex: 2,
  },
  subtitle: {
    fontFamily: FONT.body,
    fontSize: FONT.size.bodyLg,
    lineHeight: displayLineHeight(FONT.size.bodyLg, 1.5),
    color: COLORS.inkSoft,
    maxWidth: 280,
    marginBottom: SPACING.md,
  },
  cta: {
    marginTop: 2,
  },
});

export default WelcomeScreen;
