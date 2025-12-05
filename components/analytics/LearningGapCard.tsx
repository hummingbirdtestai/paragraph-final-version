import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform } from 'react-native';
import { SubjectLearningGap } from '@/types/learning-gap';
import { Clock, AlertTriangle } from 'lucide-react-native';

interface LearningGapCardProps {
  subjectName: string;
  data: SubjectLearningGap;
}

export default function LearningGapCard({ subjectName, data }: LearningGapCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpanded(!expanded);
  };

  const getStressColor = (index: number) => {
    if (index < 0.5) return '#25D366';
    if (index < 1.5) return '#FFA500';
    return '#FF6B6B';
  };

  const stressColor = getStressColor(data.time_stress_index);

  const totalErrors = Object.values(data.error_type_breakdown).reduce((sum, val) => sum + val, 0);
  const errorTypes = [
    { name: 'Factual', value: data.error_type_breakdown.factual, color: '#ef4444' },
    { name: 'Interpretation', value: data.error_type_breakdown.interpretation, color: '#f59e0b' },
    { name: 'Careless', value: data.error_type_breakdown.careless, color: '#eab308' },
    { name: 'Time Pressure', value: data.error_type_breakdown.time_pressure, color: '#8b5cf6' },
  ];

  const timeRatio = data.avg_time_per_mcq / data.avg_expected_time;
  const timeRatioPercent = Math.min(timeRatio * 100, 100);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.card}
      android_ripple={{ color: '#374151' }}>
      <View style={styles.cardContent}>
        <Text style={styles.subjectName}>{subjectName}</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Clock size={16} color="#94a3b8" />
            <Text style={styles.metricValue}>{data.avg_time_per_mcq.toFixed(2)}m</Text>
            <Text style={styles.metricLabel}>Avg Time</Text>
          </View>

          <View style={styles.metricBox}>
            <Clock size={16} color="#64748b" />
            <Text style={styles.metricValue}>{data.avg_expected_time.toFixed(2)}m</Text>
            <Text style={styles.metricLabel}>Expected</Text>
          </View>

          <View style={styles.metricBox}>
            <AlertTriangle size={16} color={stressColor} />
            <Text style={[styles.metricValue, { color: stressColor }]}>
              {data.time_stress_index.toFixed(2)}
            </Text>
            <Text style={styles.metricLabel}>Stress Index</Text>
          </View>
        </View>

        <View style={styles.timeBar}>
          <View style={styles.timeBarTrack}>
            <View
              style={[
                styles.timeBarFill,
                {
                  width: `${timeRatioPercent}%`,
                  backgroundColor: stressColor,
                }
              ]}
            />
          </View>
          <Text style={styles.timeBarLabel}>
            {(timeRatio * 100).toFixed(0)}% of expected time
          </Text>
        </View>

        <View style={styles.errorSummary}>
          <Text style={styles.errorTitle}>Error Distribution ({totalErrors} total)</Text>
          <View style={styles.errorBars}>
            {errorTypes.map((error) => {
              if (error.value === 0) return null;
              const percent = (error.value / totalErrors) * 100;
              return (
                <View key={error.name} style={styles.errorBarRow}>
                  <View style={styles.errorBarTrack}>
                    <View
                      style={[
                        styles.errorBarFill,
                        {
                          width: `${percent}%`,
                          backgroundColor: error.color,
                        }
                      ]}
                    />
                  </View>
                  <View style={styles.errorBarInfo}>
                    <Text style={styles.errorBarLabel}>{error.name}</Text>
                    <Text style={styles.errorBarValue}>{error.value}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {expanded && (
          <View style={styles.expandedChart}>
            <View style={styles.divider} />
            <Text style={styles.chartTitle}>Detailed Breakdown</Text>

            <View style={styles.chartBars}>
              {errorTypes.map((error) => {
                const percent = totalErrors > 0 ? (error.value / totalErrors) * 100 : 0;
                return (
                  <View key={error.name} style={styles.chartRow}>
                    <Text style={styles.chartLabel}>{error.name}</Text>
                    <View style={styles.chartBarContainer}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            width: `${percent}%`,
                            backgroundColor: error.color,
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.chartValue}>{error.value}</Text>
                    <Text style={styles.chartPercent}>{percent.toFixed(1)}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Text style={styles.tapHint}>{expanded ? 'Tap to collapse' : 'Tap for details'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  cardContent: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d1d5db',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  timeBar: {
    marginBottom: 16,
  },
  timeBarTrack: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  timeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeBarLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  errorSummary: {
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 12,
  },
  errorBars: {
    gap: 8,
  },
  errorBarRow: {
    gap: 6,
  },
  errorBarTrack: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  errorBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  errorBarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBarLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  errorBarValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d1d5db',
  },
  expandedChart: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 12,
  },
  chartBars: {
    gap: 12,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartLabel: {
    width: 90,
    fontSize: 11,
    color: '#9ca3af',
  },
  chartBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    width: 30,
    fontSize: 12,
    fontWeight: '600',
    color: '#d1d5db',
    textAlign: 'right',
  },
  chartPercent: {
    width: 45,
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
  },
  tapHint: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});
