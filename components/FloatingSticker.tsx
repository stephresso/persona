import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import Character from './Character';
import { StickerId } from '../assets/stickers/stickers';

interface FloatingStickerProps {
  sticker: StickerId;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** Entrance delay ms */
  delay?: number;
  /** Base tilt in degrees */
  tilt?: number;
  /** Idle rock amplitude in degrees (each side of tilt) */
  rock?: number;
  /** @deprecated — stickers rotate only, no bob */
  float?: number;
}

/**
 * Sticker with spring-in + gentle idle rotate (no float / translate).
 */
const FloatingSticker: React.FC<FloatingStickerProps> = ({
  sticker,
  color,
  size = 72,
  style,
  delay = 0,
  tilt = -8,
  rock = 5,
}) => {
  const enter = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(tilt)).current;

  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.delay(delay),
      Animated.spring(enter, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]);

    const tiltLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(spin, {
          toValue: tilt + rock,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(spin, {
          toValue: tilt - rock,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    entrance.start(() => {
      tiltLoop.start();
    });

    return () => {
      entrance.stop();
      tiltLoop.stop();
    };
  }, [delay, tilt, rock, enter, spin]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: enter,
          transform: [
            {
              scale: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
            {
              rotate: spin.interpolate({
                inputRange: [tilt - rock - 1, tilt + rock + 1],
                outputRange: [`${tilt - rock - 1}deg`, `${tilt + rock + 1}deg`],
              }),
            },
          ],
        },
      ]}
      pointerEvents="none">
      <Character sticker={sticker} color={color} size={size} />
    </Animated.View>
  );
};

export default FloatingSticker;
