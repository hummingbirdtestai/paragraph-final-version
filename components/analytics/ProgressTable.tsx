import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SubjectProgress } from '@/types/progress';

interface ProgressTableProps {
  data: { [subjectName: string]: SubjectProgress };
}

export default function ProgressTable({ data }: ProgressTableProps) {
  const subjects = Object.entries(data).sort((a, b) =>
    b[1].completion_percent - a[1].completion_percent
  );

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.tableContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.subjectCell]}>Subject</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Items Done</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Total Items</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Completion %</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Time Spent (m)</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Est. Time (m)</Text>
          <Text style={[styles.headerCell, styles.numberCell]}>Time Progress %</Text>
        </View>

        {subjects.map(([subjectName, subjectData]) => {
          const timeProgress = (subjectData.minutes_spent / subjectData.minutes_total_time_to_complete) * 100;

          return (
            <View key={subjectName} style={styles.dataRow}>
              <Text style={[styles.dataCell, styles.subjectCell]}>{subjectName}</Text>
              <Text style={[styles.dataCell, styles.numberCell]}>{subjectData.completed_items}</Text>
              <Text style={[styles.dataCell, styles.numberCell]}>{subjectData.total_items}</Text>
              <View style={[styles.dataCell, styles.numberCell, styles.progressCell]}>
                <View style={styles.progressBarMini}>
                  <View
                    style={[
                      styles.progressFillMini,
                      { width: `${subjectData.completion_percent}%` }
                    ]}
                  />
                </View>
                <Text style={styles.percentText}>{subjectData.completion_percent.toFixed(1)}%</Text>
              </View>
              <Text style={[styles.dataCell, styles.numberCell]}>
                {Math.round(subjectData.minutes_spent)}
              </Text>
              <Text style={[styles.dataCell, styles.numberCell]}>
                {Math.round(subjectData.minutes_total_time_to_complete)}
              </Text>
              <View style={[styles.dataCell, styles.numberCell, styles.progressCell]}>
                <View style={styles.progressBarMini}>
                  <View
                    style={[
                      styles.progressFillMini,
                      styles.timeProgressFill,
                      { width: `${Math.min(timeProgress, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.percentText}>{timeProgress.toFixed(1)}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    minWidth: 900,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#374151',
  },
  headerCell: {
    padding: 12,
    fontWeight: '600',
    fontSize: 13,
    color: '#f9fafb',
  },
  dataRow: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  dataCell: {
    padding: 12,
    fontSize: 13,
    color: '#d1d5db',
  },
  subjectCell: {
    width: 200,
  },
  numberCell: {
    width: 110,
    textAlign: 'center',
  },
  progressCell: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarMini: {
    width: 80,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFillMini: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  timeProgressFill: {
    backgroundColor: '#3b82f6',
  },
  percentText: {
    fontSize: 11,
    color: '#9ca3af',
  },
});
