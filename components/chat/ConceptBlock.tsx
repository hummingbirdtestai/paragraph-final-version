import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';

interface ConceptData {
  concept: string;
  explanation: string;
  examples?: string[];
  formulas?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

interface ConceptBlockProps {
  data: ConceptData;
}

export function ConceptBlock({ data }: ConceptBlockProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.heading}>{data.concept}</Text>
        <Text style={styles.explanation}>{data.explanation}</Text>

        {data.examples && data.examples.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examples</Text>
            {data.examples.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        )}

        {data.formulas && data.formulas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formulas</Text>
            {data.formulas.map((formula, index) => (
              <View key={index} style={styles.formulaBox}>
                <Text style={styles.formulaText}>{formula}</Text>
              </View>
            ))}
          </View>
        )}

        {data.table && (
          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {data.table.headers.map((header, index) => (
                  <View key={index} style={[styles.tableCell, styles.tableHeader]}>
                    <Text style={styles.tableHeaderText}>{header}</Text>
                  </View>
                ))}
              </View>
              {data.table.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((cell, cellIndex) => (
                    <View key={cellIndex} style={styles.tableCell}>
                      <Text style={styles.tableCellText}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
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
  heading: {
    color: theme.colors.accent,
    fontSize: theme.typography.heading.fontSize,
    lineHeight: theme.typography.heading.lineHeight,
    fontWeight: theme.typography.heading.fontWeight,
    marginBottom: theme.spacing.md,
  },
  explanation: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: theme.typography.body.fontWeight,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  exampleItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    color: theme.colors.accent,
    fontSize: theme.typography.body.fontSize,
    marginRight: theme.spacing.sm,
  },
  exampleText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
  formulaBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  formulaText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontFamily: 'monospace',
  },
  table: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableCell: {
    flex: 1,
    padding: theme.spacing.sm,
    justifyContent: 'center',
  },
  tableHeader: {
    backgroundColor: theme.colors.background,
  },
  tableHeaderText: {
    color: theme.colors.accent,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  tableCellText: {
    color: theme.colors.text,
    fontSize: theme.typography.bodySmall.fontSize,
  },
});
