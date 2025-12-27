import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { ParsedTable } from '@/lib/markdownTableParser';

interface MarkdownTableProps {
  parsed: ParsedTable;
}

export function MarkdownTable({ parsed }: MarkdownTableProps) {
  const { headers, rows } = parsed;

  console.log("🎨 MarkdownTable rendering");
  console.log("  Headers:", headers);
  console.log("  Rows:", rows);
  console.log("  Headers length:", headers.length);
  console.log("  Rows length:", rows.length);

  if (!headers.length || !rows.length) {
    console.log("❌ Table empty, not rendering");
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          {headers.map((header, index) => (
            <View
              key={index}
              style={[
                styles.headerCell,
                index === 0 && styles.firstCell,
                index === headers.length - 1 && styles.lastCell,
              ]}
            >
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>

        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.dataRow,
              rowIndex === rows.length - 1 && styles.lastRow,
            ]}
          >
            {row.map((cell, cellIndex) => (
              <View
                key={cellIndex}
                style={[
                  styles.dataCell,
                  cellIndex === 0 && styles.firstCell,
                  cellIndex === row.length - 1 && styles.lastCell,
                ]}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: theme.spacing.sm,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 100,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dataCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 100,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  cellText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  firstCell: {
    borderLeftWidth: 0,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});
