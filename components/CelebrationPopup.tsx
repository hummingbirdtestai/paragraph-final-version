import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CelebrationPopupProps {
  visible: boolean;
  onClose: () => void;
  message?: string;
  gifUrl?: string;
  autoDismissDelay?: number;
}

export default function CelebrationPopup({
  visible,
  onClose,
  message = "🔥 Great job! You hit a streak!",
  gifUrl,
  autoDismissDelay = 2500,
}: CelebrationPopupProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );

      sparkle1.value = withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 })
      );

      setTimeout(() => {
        sparkle2.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        );
      }, 200);

      setTimeout(() => {
        sparkle3.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        );
      }, 100);

      const timer = setTimeout(() => {
        handleClose();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedSparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [
      { scale: sparkle1.value },
      { translateY: -sparkle1.value * 20 },
    ],
  }));

  const animatedSparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [
      { scale: sparkle2.value },
      { translateY: -sparkle2.value * 30 },
    ],
  }));

  const animatedSparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [
      { scale: sparkle3.value },
      { translateY: -sparkle3.value * 25 },
    ],
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={10} style={StyleSheet.absoluteFill} />
          ) : null}

          <TouchableWithoutFeedback>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
              <View style={styles.glowContainer}>
                <View style={styles.popup}>
                  <View style={styles.gifContainer}>
                    {gifUrl ? (
                      <Image
                        source={{ uri: gifUrl }}
                        style={styles.gif}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.gifPlaceholder}>
                        <Text style={styles.placeholderIcon}>🎉</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.messageContainer}>
                    <Text style={styles.message}>{message}</Text>
                  </View>

                  <Animated.View style={[styles.sparkle, styles.sparkle1, animatedSparkle1Style]}>
                    <Text style={styles.sparkleText}>✨</Text>
                  </Animated.View>

                  <Animated.View style={[styles.sparkle, styles.sparkle2, animatedSparkle2Style]}>
                    <Text style={styles.sparkleText}>⭐</Text>
                  </Animated.View>

                  <Animated.View style={[styles.sparkle, styles.sparkle3, animatedSparkle3Style]}>
                    <Text style={styles.sparkleText}>✨</Text>
                  </Animated.View>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Math.min(280, SCREEN_WIDTH - 40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  popup: {
    width: '100%',
    backgroundColor: '#0B141A',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#25D366',
    overflow: 'hidden',
    paddingBottom: 24,
  },
  gifContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#0F1922',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37, 211, 102, 0.2)',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  gifPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 211, 102, 0.05)',
  },
  placeholderIcon: {
    fontSize: 64,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
  },
  sparkleText: {
    fontSize: 24,
  },
  sparkle1: {
    top: 20,
    left: 20,
  },
  sparkle2: {
    top: 30,
    right: 25,
  },
  sparkle3: {
    bottom: 30,
    left: 30,
  },
});
