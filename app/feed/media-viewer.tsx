//media-viewer.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { X } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MediaViewerScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams();
  const imageUrl = Array.isArray(url) ? url[0] : url;

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [currentScale, setCurrentScale] = useState(1);
  const savedScale = useRef(1);
  const savedTranslateX = useRef(0);
  const savedTranslateY = useRef(0);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.current * event.scale;
      scale.setValue(newScale);
      setCurrentScale(newScale);
    })
    .onEnd((event) => {
      const newScale = Math.max(1, Math.min(savedScale.current * event.scale, 5));
      savedScale.current = newScale;
      scale.setValue(newScale);
      setCurrentScale(newScale);

      if (newScale === 1) {
        translateX.setValue(0);
        translateY.setValue(0);
        savedTranslateX.current = 0;
        savedTranslateY.current = 0;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (currentScale > 1) {
        translateX.setValue(savedTranslateX.current + event.translationX);
        translateY.setValue(savedTranslateY.current + event.translationY);
      }
    })
    .onEnd((event) => {
      if (currentScale > 1) {
        savedTranslateX.current = savedTranslateX.current + event.translationX;
        savedTranslateY.current = savedTranslateY.current + event.translationY;
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const handleBackgroundPress = () => {
    router.back();
  };

  const handleClosePress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.background} onPress={handleBackgroundPress}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                opacity,
                transform: [
                  { scale },
                  { translateX },
                  { translateY },
                ],
              },
            ]}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
              onLoad={handleImageLoad}
            />
          </Animated.View>
        </GestureDetector>
      </Pressable>

      <Pressable style={styles.closeButton} onPress={handleClosePress}>
        <View style={styles.closeButtonBackground}>
          <X size={24} color="#FFFFFF" strokeWidth={2} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  closeButtonBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
