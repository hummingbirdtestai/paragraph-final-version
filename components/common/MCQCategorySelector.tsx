import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type CategoryType = 'all' | 'correct' | 'wrong' | 'skipped' | 'marked' | 'unanswered';

interface CategoryCounts {
  all: number;
  correct: number;
  wrong: number;
  skipped: number;
  marked: number;
  unanswered: number;
}

interface MCQCategorySelectorProps {
  activeCategory: CategoryType;
  counts: CategoryCounts;
  onCategoryChange: (category: CategoryType) => void;
}

export default function MCQCategorySelector({
  activeCategory,
  counts,
  onCategoryChange,
}: MCQCategorySelectorProps) {

  const categories: { key: CategoryType; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: '#64748b' },
    { key: 'correct', label: 'Correct', color: '#10b981' },
    { key: 'wrong', label: 'Wrong', color: '#ef4444' },
    { key: 'skipped', label: 'Skipped', color: '#fb923c' },
    { key: 'marked', label: 'Marked', color: '#f59e0b' },
    { key: 'unanswered', label: 'Unanswered', color: '#64748b' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.key;
        const count = counts[category.key];

        return (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryPill,
              isActive && styles.categoryPillActive,
              isActive && { borderColor: category.color },
            ]}
            onPress={() => onCategoryChange(category.key)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.colorDot,
                { backgroundColor: category.color },
              ]}
            />
            <Text
              style={[
                styles.categoryLabel,
                isActive && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
            <Text
              style={[
                styles.categoryCount,
                isActive && styles.categoryCountActive,
              ]}
            >
              {count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 42,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1f26',
    borderWidth: 1,
    borderColor: '#2a2f36',
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryLabelActive: {
    color: '#e5e7eb',
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  categoryCountActive: {
    color: '#94a3b8',
  },
});
