import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { theme } from '@/constants/theme';
import { InputField } from '@/components/common/InputField';
import { PrimaryButton } from '@/components/common/PrimaryButton';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSendOTP: (phoneNumber: string) => void;
}

export function LoginModal({ visible, onClose, onSendOTP }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      setPhoneNumber('');
      setError('');
    }
  }, [visible, scaleAnim, opacityAnim]);

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = () => {
    setError('');

    if (!phoneNumber) {
      setError('Please enter your mobile number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSendOTP(phoneNumber);
    }, 1000);
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
              <Text style={styles.title}>Login or Sign Up</Text>
            </View>

            <View style={styles.content}>
              <InputField
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                error={error}
              />

              <Text style={styles.subtext}>
                We'll send you a verification code via SMS.
              </Text>

              <PrimaryButton
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
              />
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
    marginBottom: theme.spacing.lg,
  },
});
