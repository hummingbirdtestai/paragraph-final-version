import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { X } from 'lucide-react-native';

interface TooltipProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  position?: 'top' | 'bottom';
  targetPosition?: { x: number; y: number; width: number; height: number };
}

export default function Tooltip({
  visible,
  message,
  onDismiss,
  position = 'bottom',
  targetPosition,
}: TooltipProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  const getTooltipStyle = () => {
    if (!targetPosition) {
      return position === 'bottom'
        ? styles.tooltipBottom
        : styles.tooltipTop;
    }

    const { x, y, width, height } = targetPosition;
    const tooltipOffset = 8;

    if (position === 'bottom') {
      return {
        position: 'absolute' as const,
        left: x + width / 2,
        top: y + height + tooltipOffset,
        transform: [{ translateX: -150 }],
      };
    } else {
      return {
        position: 'absolute' as const,
        left: x + width / 2,
        bottom: y - tooltipOffset,
        transform: [{ translateX: -150 }],
      };
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Animated.View style={[styles.container, getTooltipStyle(), animatedStyle]}>
          <View style={styles.content}>
            <Text style={styles.message}>{message}</Text>
            <Pressable style={styles.closeButton} onPress={onDismiss}>
              <X size={16} color="#94a3b8" strokeWidth={2} />
            </Pressable>
          </View>
          <View
            style={[
              styles.arrow,
              position === 'bottom' ? styles.arrowTop : styles.arrowBottom,
            ]}
          />
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    maxWidth: 300,
    backgroundColor: '#1a2329',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#25D366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: '#e5e7eb',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  arrowTop: {
    top: -8,
    left: '50%',
    marginLeft: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#25D366',
  },
  arrowBottom: {
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#25D366',
  },
  tooltipBottom: {
    bottom: 80,
    left: 16,
    right: 16,
  },
  tooltipTop: {
    top: 80,
    left: 16,
    right: 16,
  },
});
