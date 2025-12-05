import { View, Text, StyleSheet } from 'react-native';
import { WeeklySummary } from '@/types/focus';

interface WeeklyBarChartProps {
  data: WeeklySummary[];
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const maxDecks = Math.max(...data.map(w => w.decks_completed), 1);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Activity</Text>

      <View style={styles.chartContainer}>
        {data.map((week, index) => {
          const heightPercent = maxDecks > 0 ? (week.decks_completed / maxDecks) * 100 : 0;
          const barColor = week.decks_completed > 0 ? '#25D366' : '#374151';

          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                {week.decks_completed > 0 && (
                  <Text style={styles.barValue}>{week.decks_completed}</Text>
                )}
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(heightPercent, 8)}%`,
                      backgroundColor: barColor,
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{formatDate(week.week_start)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  barWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 8,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#25D366',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});
