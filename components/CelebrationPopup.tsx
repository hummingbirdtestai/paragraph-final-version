//CelebrationPopup.tsx
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
import ConfettiCannon from 'react-native-confetti-cannon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  console.log("🎉 CelebrationPopup rendered. visible =", visible, "message =", message);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);
  const confettiRef = useRef(null);

  useEffect(() => {
    console.log("👀 useEffect triggered. visible =", visible);

    if (visible) {
      console.log("🚀 Starting SHOW animation. Message:", message);

      // Haptics only on mobile (web-safe fallback)
      if (Platform.OS !== 'web') {
        console.log("📳 Triggering haptics");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        console.log("🌐 Running on web - skipping haptics");
      }

      // Confetti works on both mobile and web
      if (confettiRef.current) {
        console.log("🎊 Triggering confetti");
        confettiRef.current.start();
      }

      console.log("🌟 Animating opacity to 1");
      opacity.value = withTiming(1, { duration: 200 }, () => {
        runOnJS(console.log)("✔ opacity animation complete");
      });

      console.log("🌟 Animating scale bounce");
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );

      console.log("✨ Sparkle 1 animation start");
      sparkle1.value = withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 })
      );

      setTimeout(() => {
        console.log("✨ Sparkle 2 animation start");
        sparkle2.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        );
      }, 200);

      setTimeout(() => {
        console.log("✨ Sparkle 3 animation start");
        sparkle3.value = withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 })
        );
      }, 100);

      console.log("⏳ Auto-dismiss timer set for", autoDismissDelay, "ms");
      const timer = setTimeout(() => {
        console.log("⏰ Auto-dismiss firing handleClose()");
        handleClose();
      }, autoDismissDelay);

      return () => {
        console.log("🧹 Clearing timer");
        clearTimeout(timer);
      };
    } else {
      console.log("🔻 Starting HIDE animation");
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const handleClose = () => {
    console.log("🔒 handleClose() invoked");

    opacity.value = withTiming(0, { duration: 200 }, () => {
      console.log("✔ opacity hide complete");
    });

    scale.value = withTiming(0.8, { duration: 200 }, () => {
      console.log("✔ scale hide complete → calling onClose()");
      runOnJS(onClose)();
    });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    console.log("🎬 animatedContainerStyle frame → scale:", scale.value, "opacity:", opacity.value);
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const animatedSparkle1Style = useAnimatedStyle(() => {
    console.log("✨ sparkle1 frame opacity:", sparkle1.value);
    return {
      opacity: sparkle1.value,
      transform: [
        { scale: sparkle1.value },
        { translateY: -sparkle1.value * 20 },
      ],
    };
  });

  const animatedSparkle2Style = useAnimatedStyle(() => {
    console.log("⭐ sparkle2 frame opacity:", sparkle2.value);
    return {
      opacity: sparkle2.value,
      transform: [
        { scale: sparkle2.value },
        { translateY: -sparkle2.value * 30 },
      ],
    };
  });

  const animatedSparkle3Style = useAnimatedStyle(() => {
    console.log("✨ sparkle3 frame opacity:", sparkle3.value);
    return {
      opacity: sparkle3.value,
      transform: [
        { scale: sparkle3.value },
        { translateY: -sparkle3.value * 25 },
      ],
    };
  });

  if (!visible) {
    console.log("🙈 Popup not visible → returning null");
    return null;
  }

  console.log("🎉 Popup visible → rendering modal");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalWrapper}>
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
                          resizeMode="contain"
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

        {visible && (
          <View style={styles.confettiContainer} pointerEvents="none">
            <ConfettiCannon
              ref={confettiRef}
              count={150}
              origin={{ x: SCREEN_WIDTH / 2, y: -10 }}
              autoStart={false}
              fadeOut={true}
              fallSpeed={3000}
              explosionSpeed={350}
              colors={['#25D366', '#FFFFFF', '#FFD700', '#FF6B6B', '#4ECDC4']}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    maxHeight: SCREEN_HEIGHT * 0.8,
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
    backgroundColor: '#0F1922',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37, 211, 102, 0.2)',
  },
  gif: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
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
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
  },
});
