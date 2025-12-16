import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

interface MCQOption {
  id: string;
  text: string;
}

interface MCQData {
  question: string;
  options: MCQOption[];
  correctAnswerId: string;
  feedback: string;
}

interface MCQBlockProps {
  data: MCQData;
  onAnswer?: (isCorrect: boolean) => void;
}

export function MCQBlock({ data, onAnswer }: MCQBlockProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionPress = (optionId: string) => {
    if (showFeedback) return;

    setSelectedOption(optionId);
    setShowFeedback(true);
    const isCorrect = optionId === data.correctAnswerId;
    onAnswer?.(isCorrect);
  };

  const getOptionStyle = (optionId: string) => {
    if (!showFeedback) {
      return selectedOption === optionId ? styles.optionSelected : styles.option;
    }

    if (optionId === data.correctAnswerId) {
      return styles.optionCorrect;
    }

    if (optionId === selectedOption && optionId !== data.correctAnswerId) {
      return styles.optionWrong;
    }

    return styles.optionDisabled;
  };

  const getOptionTextStyle = (optionId: string) => {
    if (!showFeedback) {
      return selectedOption === optionId ? styles.optionTextSelected : styles.optionText;
    }

    if (optionId === data.correctAnswerId) {
      return styles.optionTextCorrect;
    }

    if (optionId === selectedOption && optionId !== data.correctAnswerId) {
      return styles.optionTextWrong;
    }

    return styles.optionTextDisabled;
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.question}>{data.question}</Text>

        <View style={styles.optionsContainer}>
          {Object.entries(data.options).map(([id, text]) => (
            <TouchableOpacity
              key={id}
              style={getOptionStyle(id)}
              onPress={() => handleOptionPress(id)}
              disabled={showFeedback}
              activeOpacity={0.7}
            >
              <Text style={getOptionTextStyle(id)}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.feedbackBadge,
                selectedOption === data.correctAnswerId
                  ? styles.feedbackBadgeCorrect
                  : styles.feedbackBadgeWrong,
              ]}
            >
              <Text style={styles.feedbackBadgeText}>
                {selectedOption === data.correctAnswerId ? 'Correct!' : 'Incorrect'}
              </Text>
            </View>
            <Text style={styles.feedbackText}>{data.feedback}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    maxWidth: '95%',
  },
  bubble: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  question: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: theme.typography.body.fontWeight,
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  option: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  optionCorrect: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  optionWrong: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
  },
  optionDisabled: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    opacity: 0.5,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  optionTextSelected: {
    color: theme.colors.accent,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: theme.colors.success,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '500',
  },
  optionTextWrong: {
    color: theme.colors.error,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '500',
  },
  optionTextDisabled: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  feedbackContainer: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  feedbackBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  feedbackBadgeCorrect: {
    backgroundColor: theme.colors.success + '20',
  },
  feedbackBadgeWrong: {
    backgroundColor: theme.colors.error + '20',
  },
  feedbackBadgeText: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  feedbackText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
});
