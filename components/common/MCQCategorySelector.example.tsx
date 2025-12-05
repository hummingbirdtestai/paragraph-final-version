import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MCQCategorySelector from './MCQCategorySelector';

export default function MCQCategorySelectorExample() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'correct' | 'wrong' | 'skipped' | 'marked' | 'unanswered'>('all');

  const mockCounts = {
    all: 200,
    correct: 120,
    wrong: 45,
    skipped: 12,
    marked: 15,
    unanswered: 8,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MCQ Category Selector Example</Text>
      <Text style={styles.subtitle}>Place this below the question counter</Text>

      <MCQCategorySelector
        activeCategory={activeCategory}
        counts={mockCounts}
        onCategoryChange={(category) => {
          console.log('Category changed to:', category);
          setActiveCategory(category);
        }}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Active Category: {activeCategory}</Text>
        <Text style={styles.infoText}>Count: {mockCounts[activeCategory]}</Text>
        <Text style={styles.infoHint}>
          Next button will navigate to the next MCQ in "{activeCategory}" category
        </Text>
      </View>

      <View style={styles.integrationExample}>
        <Text style={styles.exampleTitle}>Integration Example:</Text>
        <Text style={styles.codeText}>
{`<SafeAreaView>
  {/* Question Counter */}
  <View style={styles.headerRow}>
    <Text>Q 42 / 200</Text>
    <PaletteButton />
  </View>

  {/* Category Selector */}
  <MCQCategorySelector
    activeCategory={activeCategory}
    counts={counts}
    onCategoryChange={setActiveCategory}
  />

  {/* MCQ Content */}
  <ScrollView>
    <MCQStem />
    <MCQOptions />
  </ScrollView>
</SafeAreaView>`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2a2f36',
  },
  infoText: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 6,
  },
  infoHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  integrationExample: {
    backgroundColor: '#0f1419',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  exampleTitle: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  codeText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});
