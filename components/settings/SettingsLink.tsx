import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface SettingsLinkProps {
  label: string;
  onPress: () => void;
}

export function SettingsLink({ label, onPress }: SettingsLinkProps) {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.linkText}>{label}</Text>
      <ChevronRight size={18} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  linkText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
});
