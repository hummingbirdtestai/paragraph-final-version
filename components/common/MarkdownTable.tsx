import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '@/constants/theme';
import { ParsedTable } from '@/lib/markdownTableParser';

interface MarkdownTableProps {
  parsed: ParsedTable;
}

export function MarkdownTable({ parsed }: MarkdownTableProps) {
  const { headers, rows } = parsed;
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  if (!headers.length || !rows.length) {
    return null;
  }

  if (isWeb) {
    return (
      <View style={styles.webTableContainer}>
        <View style={styles.webTable}>
          <View style={styles.webHeaderRow}>
            {headers.map((header, index) => (
              <View
                key={index}
                style={[
                  styles.webHeaderCell,
                  { flex: 1 },
                ]}
              >
                <Text style={styles.webHeaderText}>{header}</Text>
              </View>
            ))}
          </View>

          {rows.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.webDataRow,
                rowIndex === rows.length - 1 && styles.webLastRow,
              ]}
            >
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.webDataCell,
                    { flex: 1 },
                  ]}
                >
                  <Text style={styles.webCellText}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
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
  webTableContainer: {
    marginVertical: 20,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  webTable: {
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  webHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#252525',
    borderBottomWidth: 2,
    borderBottomColor: '#3a3a3a',
  },
  webHeaderCell: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: '#2a2a2a',
  },
  webHeaderText: {
    color: '#e1e1e1',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  webDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  webDataCell: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: '#2a2a2a',
    justifyContent: 'center',
  },
  webCellText: {
    color: '#d1d1d1',
    fontSize: 14,
    lineHeight: 20,
  },
  webLastRow: {
    borderBottomWidth: 0,
  },
});
