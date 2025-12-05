import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform } from 'react-native';
import { SubjectAccuracy } from '@/types/accuracy';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react-native';

interface SubjectBubbleProps {
  subjectName: string;
  data: SubjectAccuracy;
  delay?: number;
}

export default function SubjectBubble({ subjectName, data, delay = 0 }: SubjectBubbleProps) {
  const [expanded, setExpanded] = useState(false);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 60) return '#25D366';
    if (accuracy >= 40) return '#FFA500';
    return '#FF6B6B';
  };

  const getAccuracyLabel = (accuracy: number) => {
    if (accuracy >= 60) return 'Strong';
    if (accuracy >= 40) return 'Moderate';
    return 'Needs Work';
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpanded(!expanded);
  };

  // Normalize null values safely
const overallAccuracy = data.overall_accuracy_percent ?? 0; 
const accuracy7d = data.accuracy_7d_percent ?? 0;
const accuracy30d = data.accuracy_30d_percent ?? 0;
const improvementDelta = data.improvement_delta_percent ?? 0;
const confidenceGapPercent = data.confidence_gap_percent ?? 0;

const accuracyColor = getAccuracyColor(overallAccuracy);
const accuracyLabel = getAccuracyLabel(overallAccuracy);


  const hasTrend = data.improvement_delta_percent !== null && data.improvement_delta_percent !== 0;
  const isImproving = (data.improvement_delta_percent || 0) > 0;

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.bubble, { opacity: 1 }]}
      android_ripple={{ color: '#374151' }}>
      <View style={styles.bubbleContent}>
        <View style={styles.header}>
          <Text style={styles.subjectName}>{subjectName}</Text>
          {hasTrend && (
            <View style={[styles.trendBadge, { backgroundColor: isImproving ? '#25D36620' : '#FF6B6B20' }]}>
              {isImproving ? (
                <TrendingUp size={14} color="#25D366" />
              ) : (
                <TrendingDown size={14} color="#FF6B6B" />
              )}
              <Text style={[styles.trendText, { color: isImproving ? '#25D366' : '#FF6B6B' }]}>
                {data.improvement_delta_percent && data.improvement_delta_percent > 0 ? '+' : ''}{data.improvement_delta_percent?.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={[styles.accuracyValue, { color: accuracyColor }]}>
              {overallAccuracy.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>{accuracyLabel}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statPill}>
            <Text style={styles.statValue}>
              {data.correct_mcqs}/{data.attempted_mcqs}
            </Text>
            <Text style={styles.statLabel}>Correct/Attempted</Text>
          </View>
        </View>

        {data.confidence_gap_items > 0 && (
          <View style={styles.confidenceAlert}>
            <AlertCircle size={14} color="#FFA500" />
            <Text style={styles.confidenceText}>
              {data.confidence_gap_items} confidence gaps ({data.confidence_gap_percent.toFixed(0)}%)
            </Text>
          </View>
        )}

        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>7-Day Accuracy</Text>
              <Text style={styles.detailValue}>
                {accuracy7d !== 0 ? `${accuracy7d.toFixed(1)}%` : 'Not enough data'}

              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>30-Day Accuracy</Text>
              <Text style={styles.detailValue}>
                {data.accuracy_30d_percent !== null ? `${data.accuracy_30d_percent.toFixed(1)}%` : 'Not enough data'}
              </Text>
            </View>

            {hasTrend && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weekly Change</Text>
                <Text style={[styles.detailValue, { color: isImproving ? '#25D366' : '#FF6B6B' }]}>
                  {data.improvement_delta_percent && data.improvement_delta_percent > 0 ? '+' : ''}{data.improvement_delta_percent?.toFixed(1)}%
                </Text>
              </View>
            )}

            {data.confidence_gap_percent > 70 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence Gap</Text>
                <Text style={styles.detailValue}>{data.confidence_gap_percent.toFixed(0)}% High</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.tapHint}>{expanded ? 'Tap to collapse' : 'Tap for insights'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  bubbleContent: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statPill: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
  accuracyValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  confidenceAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFA50015',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#FFA500',
  },
  expandedContent: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
  },
  tapHint: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});
