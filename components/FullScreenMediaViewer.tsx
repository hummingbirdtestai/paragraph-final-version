//FullScreenMediaViewer.tsx
import { View, Modal, StyleSheet, Pressable, Image, Dimensions, Platform } from 'react-native';
import { useState, useRef } from 'react';
import { X, Share2, Download, Forward, Info, Smile } from 'lucide-react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  uri: string;
  width?: number;
  height?: number;
}

interface FullScreenMediaViewerProps {
  visible: boolean;
  media: MediaItem;
  allMedia?: MediaItem[];
  onClose: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onForward?: () => void;
  onInfo?: () => void;
  onAddSticker?: () => void;
}

export default function FullScreenMediaViewer({
  visible,
  media,
  allMedia = [],
  onClose,
  onShare,
  onDownload,
  onForward,
  onInfo,
  onAddSticker,
}: FullScreenMediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const mediaList = allMedia.length > 0 ? allMedia : [media];
  const currentMedia = mediaList[currentIndex];

  const handleClose = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    onClose();
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      } else if (scale.value > 4) {
        scale.value = withSpring(4);
      }
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else {
        translateY.value = event.translationY;
        if (Math.abs(event.translationY) > 100) {
          runOnJS(handleClose)();
        }
      }
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = 1;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
    });

  const composed = Gesture.Simultaneous(
    Gesture.Race(doubleTapGesture, pinchGesture),
    panGesture
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={handleClose}>
            <X size={24} color="#e5e7eb" strokeWidth={2} />
          </Pressable>
          <View style={styles.headerButtons}>
            {onAddSticker && (
              <Pressable style={styles.headerButton} onPress={onAddSticker}>
                <Smile size={22} color="#e5e7eb" strokeWidth={2} />
              </Pressable>
            )}
            {onInfo && (
              <Pressable style={styles.headerButton} onPress={onInfo}>
                <Info size={22} color="#e5e7eb" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={{ uri: currentMedia.uri }}
              style={styles.image}
              resizeMode="contain"
              onError={(error) => console.error('Image load error:', error)}
            />
          </Animated.View>
        </GestureDetector>

        <View style={styles.footer}>
          {onShare && (
            <Pressable style={styles.footerButton} onPress={onShare}>
              <Share2 size={24} color="#e5e7eb" strokeWidth={2} />
            </Pressable>
          )}
          {onDownload && (
            <Pressable style={styles.footerButton} onPress={onDownload}>
              <Download size={24} color="#e5e7eb" strokeWidth={2} />
            </Pressable>
          )}
          {onForward && (
            <Pressable style={styles.footerButton} onPress={onForward}>
              <Forward size={24} color="#e5e7eb" strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  footerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
