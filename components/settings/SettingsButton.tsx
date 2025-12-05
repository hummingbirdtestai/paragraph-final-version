import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface SettingsButtonProps {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  variant?: 'default' | 'danger';
}

export function SettingsButton({ label, onPress, Icon, variant = 'default' }: SettingsButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      style={[styles.button, isDanger && styles.buttonDanger]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {Icon && (
        <Icon
          size={20}
          color={isDanger ? theme.colors.error : theme.colors.accent}
          style={styles.icon}
        />
      )}
      <Text style={[styles.buttonText, isDanger && styles.buttonTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDanger: {
    borderColor: theme.colors.error + '40',
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
  buttonTextDanger: {
    color: theme.colors.error,
  },
});
