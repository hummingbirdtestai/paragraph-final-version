import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ExamData } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Target, Clock, Zap, Brain, ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

interface MobileViewProps {
  data: ExamData[];
}

export default function MobileView({ data }: MobileViewProps) {
  const latestExam = data[data.length - 1];
  const [expandedId, setExpandedId] = useState<number>(latestExam.exam_serial);

  const handleToggle = (examSerial: number) => {
    setExpandedId(expandedId === examSerial ? -1 : examSerial);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Mock Test Analytics</Text>
        <Text style={styles.subtitle}>Review your exam performance</Text>
      </View>
      <View style={styles.contentWrapper}>
      {data.slice().reverse().map((exam, index) => {
        const isExpanded = expandedId === exam.exam_serial;
        const previousExam = data.find((e) => e.exam_serial === exam.exam_serial - 1);

        return (
          <ExamCard
            key={exam.exam_serial}
            exam={exam}
            previousExam={previousExam}
            isExpanded={isExpanded}
            onToggle={() => handleToggle(exam.exam_serial)}
            isLatest={index === 0}
          />
        );
      })}
      </View>
    </View>
  );
}

interface ExamCardProps {
  exam: ExamData;
  previousExam?: ExamData;
  isExpanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
}

function ExamCard({ exam, previousExam, isExpanded, onToggle, isLatest }: ExamCardProps) {
  const heightValue = useSharedValue(isExpanded ? 1 : 0);

  const calculateTrend = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    return current - previous;
  };

  const scoreTrend = calculateTrend(exam.score, previousExam?.score);
  const accuracyTrend = calculateTrend(exam.accuracy_percent, previousExam?.accuracy_percent);

  const animatedStyle = useAnimatedStyle(() => {
    heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    return {
      opacity: heightValue.value,
      maxHeight: isExpanded ? 2000 : 0,
      overflow: 'hidden',
    };
  });

  return (
    <View style={[styles.examCard, isLatest && styles.latestCard]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onToggle}>
        <View style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.examTitle}>{exam.exam_title}</Text>
              <Text style={styles.examDate}>
                {new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.chevronContainer}>
              {isExpanded ? <ChevronUp size={24} color="#ffffff" /> : <ChevronDown size={24} color="#ffffff" />}
            </View>
          </View>

          <View style={styles.summaryMetrics}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Score</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{exam.score}</Text>
                {scoreTrend !== null && (
                  <View style={[styles.trendBadge, scoreTrend >= 0 ? styles.trendUp : styles.trendDown]}>
                    {scoreTrend >= 0 ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
                    <Text style={[styles.trendText, scoreTrend >= 0 ? styles.trendUpText : styles.trendDownText]}>
                      {Math.abs(scoreTrend).toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Accuracy</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{exam.accuracy_percent.toFixed(1)}%</Text>
                {accuracyTrend !== null && (
                  <View style={[styles.trendBadge, accuracyTrend >= 0 ? styles.trendUp : styles.trendDown]}>
                    {accuracyTrend >= 0 ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
                    <Text style={[styles.trendText, accuracyTrend >= 0 ? styles.trendUpText : styles.trendDownText]}>
                      {Math.abs(accuracyTrend).toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.summaryMetric}>
              <Text style={styles.summaryLabel}>Correct</Text>
              <Text style={[styles.summaryValue, styles.correctText]}>{exam.correct_answers}</Text>
            </View>
          </View>

          <Animated.View style={animatedStyle}>
            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.metricsGrid}>
                  <MetricCard
                    icon={<Target size={20} color="#60a5fa" />}
                    label="Accuracy"
                    value={`${exam.accuracy_percent.toFixed(1)}%`}
                  />
                  <MetricCard
                    icon={<Zap size={20} color="#fbbf24" />}
                    label="Attempt Rate"
                    value={`${exam.attempt_rate_percent.toFixed(0)}%`}
                  />
                </View>

                <View style={styles.metricsGrid}>
                  <MetricCard
                    icon={<Clock size={20} color="#a78bfa" />}
                    label="Time / MCQ"
                    value={`${exam.avg_time_per_mcq.toFixed(2)}m`}
                  />
                  <MetricCard
                    icon={<Brain size={20} color="#ec4899" />}
                    label="Effort Eff."
                    value={`${exam.effort_eff_percent.toFixed(1)}%`}
                  />
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>Performance Breakdown</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Questions</Text>
                    <Text style={styles.detailValue}>{exam.total_questions}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Answered</Text>
                    <Text style={styles.detailValue}>{exam.answered}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, styles.correctText]}>Correct</Text>
                    <Text style={[styles.detailValue, styles.correctText]}>{exam.correct_answers}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, styles.wrongText]}>Wrong</Text>
                    <Text style={[styles.detailValue, styles.wrongText]}>{exam.wrong_answers}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, styles.skippedText]}>Skipped</Text>
                    <Text style={[styles.detailValue, styles.skippedText]}>{exam.skipped}</Text>
                  </View>

                  <View style={[styles.detailRow, styles.separator]}>
                    <Text style={styles.detailLabel}>Time Spent</Text>
                    <Text style={styles.detailValue}>{exam.time_spent_min.toFixed(1)} min</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time Efficiency</Text>
                    <Text style={styles.detailValue}>{exam.time_eff_percent.toFixed(1)}%</Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>{icon}</View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  contentWrapper: {
    padding: 16,
  },
  examCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  latestCard: {
    borderColor: '#3b82f6',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
    backgroundColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  chevronContainer: {
    marginLeft: 12,
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryMetric: {
    flex: 1,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '500',
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  trendDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  trendUpText: {
    color: '#10b981',
  },
  trendDownText: {
    color: '#ef4444',
  },
  correctText: {
    color: '#10b981',
  },
  wrongText: {
    color: '#ef4444',
  },
  skippedText: {
    color: '#fbbf24',
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'flex-start',
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 6,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  detailsSection: {
    marginTop: 12,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  separator: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailLabel: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#f8fafc',
    fontWeight: '600',
  },
});
