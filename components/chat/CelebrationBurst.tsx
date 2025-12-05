import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface CelebrationBurstProps {
  visible: boolean;
}

export function CelebrationBurst({ visible }: CelebrationBurstProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1000, withTiming(0, { duration: 300 }))
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.burst, animatedStyle]}>
        {[...Array(8)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { rotate: `${index * 45}deg` },
                  { translateX: 40 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  burst: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
});
