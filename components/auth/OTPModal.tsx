import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { PrimaryButton } from '@/components/common/PrimaryButton';

interface OTPModalProps {
  visible: boolean;
  phoneNumber: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export function OTPModal({ visible, phoneNumber, onClose, onVerify, onResend }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

 useEffect(() => {
  if (visible) {
    // 💥 Start animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // 💥 Start the 60 second resend timer
    setCooldown(60);

    // ⌨️ Focus first OTP box
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  } else {
    scaleAnim.setValue(0.9);
    opacityAnim.setValue(0);
    setOtp(['', '', '', '', '', '']);
    setError('');
  }
}, [visible, scaleAnim, opacityAnim]);


  useEffect(() => {
  if (cooldown > 0) {
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }
}, [cooldown]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify(otpString);
    }, 1000);
  };

const handleResend = () => {
  if (cooldown > 0) return; // ⛔ prevent spam clicks

  setOtp(['', '', '', '', '', '']);
  setError('');

  if (typeof onResend === 'function') {
    onResend();       // ✅ safely call only if defined
    setCooldown(60);  // ⏱ start 60s timer
  } else {
    console.warn('⚠️ OTPModal: onResend not provided');
  }
};


  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Verify Your Number</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.subtext}>
                Enter the 6-digit OTP sent to {phoneNumber}
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                      error && styles.otpInputError,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <PrimaryButton
                title="Verify OTP"
                onPress={handleVerify}
                loading={loading}
              />

              <TouchableOpacity
              onPress={handleResend}
              disabled={cooldown > 0}
              style={[styles.resendButton, cooldown > 0 && { opacity: 0.6 }]}
            >
              <Text style={styles.resendText}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>

            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  subtext: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: theme.colors.accent,
  },
  otpInputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  resendText: {
    color: theme.colors.accent,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '500',
  },
});
