import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X, RotateCcw } from 'lucide-react-native';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: SnackbarType;
  duration?: number;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Snackbar({
  visible,
  message,
  type = 'info',
  duration = 4000,
  onDismiss,
  actionLabel,
  onAction,
}: SnackbarProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(100, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [visible]);

  const handleDismiss = () => {
    translateY.value = withTiming(
      100,
      { duration: 250 },
      (finished) => {
        if (finished) {
          runOnJS(onDismiss)();
        }
      }
    );
    opacity.value = withTiming(0, { duration: 250 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#25D366" strokeWidth={2} />;
      case 'error':
        return <XCircle size={20} color="#ef4444" strokeWidth={2} />;
      case 'info':
        return <Info size={20} color="#3b82f6" strokeWidth={2} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#1a3929';
      case 'error':
        return '#3d1f1f';
      case 'info':
        return '#1e293b';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#25D366';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}>
      <View style={styles.iconContainer}>{getIcon()}</View>

      <Text style={styles.message}>{message}</Text>

      {actionLabel && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}

      <Pressable style={styles.closeButton} onPress={handleDismiss}>
        <X size={18} color="#94a3b8" strokeWidth={2} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#25D366',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
