import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { MockTestResult, SubjectPerformance } from '@/types/test-results';
import { Target, Clock, TrendingUp, ChevronDown, ChevronUp, Zap, BarChart3 } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

interface TestResultsMobileProps {
  tests: MockTestResult[];
}

interface TestCardProps {
  test: MockTestResult;
  index: number;
}

function TestCard({ test, index }: TestCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const heightValue = useSharedValue(index === 0 ? 1 : 0);

  const totalScore = test.subjects.reduce((sum, s) => sum + s.score, 0);
  const avgAccuracy = test.subjects.reduce((sum, s) => sum + s.accuracy_percent, 0) / test.subjects.length;
  const avgAttempt = test.subjects.reduce((sum, s) => sum + s.attempt_rate_percent, 0) / test.subjects.length;
  const avgEffort = test.subjects.reduce((sum, s) => sum + s.effort_eff_percent, 0) / test.subjects.length;

  const animatedStyle = useAnimatedStyle(() => {
    heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    return {
      opacity: heightValue.value,
      maxHeight: isExpanded ? 5000 : 0,
      overflow: 'hidden',
    };
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.testCard}>
      <TouchableOpacity activeOpacity={0.8} onPress={toggleExpand}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.testTitle}>{test.exam_title}</Text>
            <Text style={styles.testDate}>
              {new Date(test.exam_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.chevronContainer}>
            {isExpanded ? (
              <ChevronUp size={24} color="#f8fafc" />
            ) : (
              <ChevronDown size={24} color="#94a3b8" />
            )}
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Score</Text>
            <Text style={[
              styles.summaryValue,
              totalScore >= 0 ? styles.positiveScore : styles.negativeScore
            ]}>
              {totalScore >= 0 ? '+' : ''}{totalScore}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <BarChart3 size={16} color="#06b6d4" />
            <Text style={styles.summaryValueSmall}>{avgAccuracy.toFixed(1)}%</Text>
            <Text style={styles.summaryLabelSmall}>Accuracy</Text>
          </View>
          <View style={styles.summaryItem}>
            <Zap size={16} color="#fbbf24" />
            <Text style={styles.summaryValueSmall}>{avgEffort.toFixed(1)}%</Text>
            <Text style={styles.summaryLabelSmall}>Effort</Text>
          </View>
          <View style={styles.summaryItem}>
            <TrendingUp size={16} color="#10b981" />
            <Text style={styles.summaryValueSmall}>{avgAttempt.toFixed(0)}%</Text>
            <Text style={styles.summaryLabelSmall}>Attempt</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Subject Performance</Text>
            {test.subjects
              .sort((a, b) => b.score - a.score)
              .map((subject, idx) => (
                <SubjectCard key={`${subject.subject_name}-${idx}`} subject={subject} />
              ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

function SubjectCard({ subject }: { subject: SubjectPerformance }) {
  return (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectName}>{subject.subject_name}</Text>
        <Text style={[
          styles.subjectScore,
          subject.score >= 0 ? styles.positiveScore : styles.negativeScore
        ]}>
          {subject.score >= 0 ? '+' : ''}{subject.score}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Target size={14} color="#06b6d4" />
          <Text style={styles.metricLabel}>Accuracy</Text>
          <Text style={styles.metricValue}>{subject.accuracy_percent.toFixed(1)}%</Text>
        </View>
        <View style={styles.metricCard}>
          <TrendingUp size={14} color="#10b981" />
          <Text style={styles.metricLabel}>Attempt</Text>
          <Text style={styles.metricValue}>{subject.attempt_rate_percent.toFixed(0)}%</Text>
        </View>
        <View style={styles.metricCard}>
          <Clock size={14} color="#fbbf24" />
          <Text style={styles.metricLabel}>Avg Time</Text>
          <Text style={styles.metricValue}>{subject.avg_time_per_mcq.toFixed(2)}m</Text>
        </View>
        <View style={styles.metricCard}>
          <Zap size={14} color="#f43f5e" />
          <Text style={styles.metricLabel}>Effort</Text>
          <Text style={styles.metricValue}>{subject.effort_eff_percent.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(subject.accuracy_percent, 100)}%` }
          ]}
        />
      </View>

      <View style={styles.subjectFooter}>
        <Text style={styles.footerText}>
          <Text style={styles.correctText}>{subject.correct_answers}</Text> correct ·
          <Text style={styles.wrongText}> {subject.wrong_answers}</Text> wrong ·
          <Text style={styles.skippedText}> {subject.skipped}</Text> skipped
        </Text>
      </View>
    </View>
  );
}

export default function TestResultsMobile({ tests }: TestResultsMobileProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {tests.map((test, index) => (
        <TestCard key={test.exam_serial} test={test} index={index} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  testCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  testDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  chevronContainer: {
    marginLeft: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 4,
  },
  summaryLabelSmall: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 16,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
  },
  subjectScore: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 3,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f8fafc',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 2,
  },
  subjectFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  correctText: {
    color: '#10b981',
    fontWeight: '600',
  },
  wrongText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  skippedText: {
    color: '#fbbf24',
    fontWeight: '600',
  },
});
