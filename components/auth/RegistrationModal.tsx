import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { theme } from '@/constants/theme';
import { InputField } from '@/components/common/InputField';
import { PrimaryButton } from '@/components/common/PrimaryButton';

interface RegistrationModalProps {
  visible: boolean;
  onClose: () => void; // kept for compatibility but NOT used
  onRegister: (name: string) => void;
}

export function RegistrationModal({ visible, onClose, onRegister }: RegistrationModalProps) {
  const [name, setName] = useState('');
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
      setName('');
      setError('');
    }
  }, [visible]);

  return (
    <Modal
        visible={visible}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => {}}
      >
      {/* ❗ DO NOT ALLOW CLOSING BY TAPPING OUTSIDE */}
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
          {/* Block inside click from bubbling */}
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Registration</Text>
              {/* ❗ X BUTTON REMOVED – forced registration */}
            </View>

            <View style={styles.content}>
              <Text style={styles.description}>
                Welcome! Let's set up your profile to personalize your learning experience.
              </Text>

              <InputField
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                error={error}
                autoCapitalize="words"
                autoFocus
              />

              <Text style={styles.subtext}>
                This will create your profile and get you started with personalized learning.
              </Text>

              <PrimaryButton
  title="Register"
  onPress={() => {
    // required validation
    if (!name.trim()) {
      setError("Full name is required");
      return;
    }

    // clear error
    setError("");

    // proceed
    onRegister(name.trim());
  }}
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
  description: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    marginBottom: theme.spacing.lg,
  },
  subtext: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
    marginBottom: theme.spacing.lg,
  },
});