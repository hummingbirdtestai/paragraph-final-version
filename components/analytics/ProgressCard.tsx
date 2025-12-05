import { View, Text, StyleSheet } from 'react-native';
import { SubjectProgress } from '@/types/progress';

interface ProgressCardProps {
  subjectName: string;
  data: SubjectProgress;
}

export default function ProgressCard({ subjectName, data }: ProgressCardProps) {
  const timeProgress = (data.minutes_spent / data.minutes_total_time_to_complete) * 100;
  const timeProgressClamped = Math.min(timeProgress, 100);

  return (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{subjectName}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Items</Text>
          <Text style={styles.statValue}>
            {data.completed_items}/{data.total_items}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>
            {Math.round(data.minutes_spent)}m / {Math.round(data.minutes_total_time_to_complete)}m
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Completion Progress</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${data.completion_percent}%` }
            ]}
          />
        </View>
        <Text style={styles.progressPercent}>{data.completion_percent.toFixed(1)}%</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Time Progress</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              styles.timeProgressBar,
              { width: `${timeProgressClamped}%` }
            ]}
          />
        </View>
        <Text style={styles.progressPercent}>{timeProgress.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d1d5db',
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  timeProgressBar: {
    backgroundColor: '#3b82f6',
  },
  progressPercent: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'right',
  },
});
