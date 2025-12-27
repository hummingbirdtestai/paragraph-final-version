import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { ParsedTable } from '@/lib/markdownTableParser';

interface MarkdownTableProps {
  parsed: ParsedTable;
}

export function MarkdownTable({ parsed }: MarkdownTableProps) {
  const { headers, rows } = parsed;

  if (!headers.length || !rows.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.card,
            rowIndex === rows.length - 1 && styles.lastCard,
          ]}
        >
          {row.map((cell, cellIndex) => (
            <View key={cellIndex} style={styles.field}>
              <Text style={styles.label}>{headers[cellIndex]}</Text>
              <Text style={styles.value}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  lastCard: {
    marginBottom: 0,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 22,
  },
});
