import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { MockTestResult, SubjectPerformance } from '@/types/test-results';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

interface TestResultsTableProps {
  tests: MockTestResult[];
}

interface TestRowProps {
  test: MockTestResult;
  index: number;
}

function TestRow({ test, index }: TestRowProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const heightValue = useSharedValue(index === 0 ? 1 : 0);

  const totalScore = test.subjects.reduce((sum, s) => sum + s.score, 0);
  const avgAccuracy = test.subjects.reduce((sum, s) => sum + s.accuracy_percent, 0) / test.subjects.length;
  const avgEffort = test.subjects.reduce((sum, s) => sum + s.effort_eff_percent, 0) / test.subjects.length;
  const avgAttempt = test.subjects.reduce((sum, s) => sum + s.attempt_rate_percent, 0) / test.subjects.length;

  const animatedStyle = useAnimatedStyle(() => {
    heightValue.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    return {
      opacity: heightValue.value,
      maxHeight: isExpanded ? 3000 : 0,
      overflow: 'hidden',
    };
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 50)} style={styles.testSection}>
      <TouchableOpacity style={styles.testHeaderRow} onPress={toggleExpand} activeOpacity={0.7}>
        <View style={styles.testHeaderContent}>
          <View style={styles.expandIcon}>
            {isExpanded ? (
              <ChevronUp size={20} color="#f8fafc" />
            ) : (
              <ChevronDown size={20} color="#94a3b8" />
            )}
          </View>
          <View style={styles.testInfo}>
            <Text style={styles.testTitle}>{test.exam_title}</Text>
            <Text style={styles.testDate}>
              {new Date(test.exam_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.testMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Score</Text>
              <Text style={[
                styles.metricValue,
                totalScore >= 0 ? styles.positiveScore : styles.negativeScore
              ]}>
                {totalScore >= 0 ? '+' : ''}{totalScore}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg Accuracy</Text>
              <Text style={styles.metricValue}>{avgAccuracy.toFixed(1)}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg Effort</Text>
              <Text style={styles.metricValue}>{avgEffort.toFixed(1)}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg Attempt</Text>
              <Text style={styles.metricValue}>{avgAttempt.toFixed(0)}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View style={animatedStyle}>
        {isExpanded && (
          <View style={styles.subjectTableWrapper}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.subjectColumn]}>Subject</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Total</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Correct</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Wrong</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Skipped</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Score</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Accuracy</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Attempt</Text>
              <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Effort</Text>
            </View>

            {test.subjects
              .sort((a, b) => b.score - a.score)
              .map((subject, idx) => (
                <View
                  key={subject.subject_name}
                  style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, styles.subjectColumn, styles.subjectName]}>
                    {subject.subject_name}
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn]}>{subject.total_questions}</Text>
                  <Text style={[styles.tableCell, styles.numberColumn, styles.correctColor]}>
                    {subject.correct_answers}
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn, styles.wrongColor]}>
                    {subject.wrong_answers}
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn, styles.skippedColor]}>
                    {subject.skipped}
                  </Text>
                  <Text style={[
                    styles.tableCell,
                    styles.numberColumn,
                    styles.scoreCell,
                    subject.score >= 0 ? styles.positiveScore : styles.negativeScore
                  ]}>
                    {subject.score >= 0 ? '+' : ''}{subject.score}
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn]}>
                    {subject.accuracy_percent.toFixed(1)}%
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn]}>
                    {subject.attempt_rate_percent.toFixed(0)}%
                  </Text>
                  <Text style={[styles.tableCell, styles.numberColumn]}>
                    {subject.effort_eff_percent.toFixed(1)}%
                  </Text>
                </View>
              ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

export default function TestResultsTable({ tests }: TestResultsTableProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Mock Test Results</Text>
          <Text style={styles.pageSubtitle}>View and analyze performance across all tests</Text>
        </View>

        <View style={styles.testsContainer}>
          {tests.map((test, index) => (
            <TestRow key={test.exam_serial} test={test} index={index} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 32,
  },
  pageHeader: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  testsContainer: {
    gap: 20,
  },
  testSection: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  testHeaderRow: {
    padding: 20,
  },
  testHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  expandIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  testDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  testMetrics: {
    flexDirection: 'row',
    gap: 24,
  },
  metricItem: {
    alignItems: 'flex-end',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  subjectTableWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  tableHeaderCell: {
    padding: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tableRowAlt: {
    backgroundColor: '#0f172a',
  },
  tableCell: {
    padding: 12,
    fontSize: 13,
    color: '#f8fafc',
  },
  subjectColumn: {
    flex: 2,
    minWidth: 160,
  },
  numberColumn: {
    flex: 1,
    minWidth: 70,
    textAlign: 'right',
  },
  subjectName: {
    fontWeight: '600',
  },
  scoreCell: {
    fontWeight: '700',
  },
  correctColor: {
    color: '#10b981',
  },
  wrongColor: {
    color: '#ef4444',
  },
  skippedColor: {
    color: '#fbbf24',
  },
});
