import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onHide: () => void;
  duration?: number;
}

export function Toast({ visible, message, type, onHide, duration = 2000 }: ToastProps) {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, translateY, opacity]);

  if (!visible) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const iconColor = isSuccess ? theme.colors.success : theme.colors.error;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, isSuccess ? styles.toastSuccess : styles.toastError]}>
        <Icon size={20} color={iconColor} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
    maxWidth: 400,
  },
  toastSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  toastError: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  message: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
});
