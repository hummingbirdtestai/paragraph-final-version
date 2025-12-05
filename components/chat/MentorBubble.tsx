import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface MentorBubbleProps {
  text?: string;
  children?: React.ReactNode;
}

export function MentorBubble({ text, children }: MentorBubbleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {text ? (
          <Text style={styles.text}>{text}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    maxWidth: '85%',
  },
  bubble: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: theme.typography.body.fontWeight,
  },
});
