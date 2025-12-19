//zoomableimage.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ZoomableImage({
  uri,
  height = 250,
}: {
  uri: string;
  height?: number;
}) {
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(e.scale, 1), 3);
    })
    .onEnd(() => {
      if (scale.value < 1) scale.value = withTiming(1);
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translationX.value = e.translationX;
        translationY.value = e.translationY;
      }
    })
    .onEnd(() => {
      translationX.value = withTiming(0);
      translationY.value = withTiming(0);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(scale.value > 1 ? 1 : 2, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  return (
    <View style={[styles.wrapper, { height }]}>
      <GestureDetector gesture={Gesture.Simultaneous(pinch, pan, doubleTap)}>
        <Animated.Image
          source={{ uri }}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1f26",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: SCREEN_WIDTH - 40,
    height: "100%",
    borderRadius: 12,
  },
});
