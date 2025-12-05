import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface SubjectFilterBubbleProps {
  subject: string;
  selected: boolean;
  onPress: () => void;
}

export function SubjectFilterBubble({ subject, selected, onPress }: SubjectFilterBubbleProps) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {subject}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#1a2329',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  chipSelected: {
    backgroundColor: '#25D366',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#25D366',
  },
  chipTextSelected: {
    color: '#0b141a',
  },
});
