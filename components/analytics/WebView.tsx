import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ExamData } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface WebViewProps {
  data: ExamData[];
}

export default function WebView({ data }: WebViewProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Mock Test Performance Analytics</Text>
          <Text style={styles.subtitle}>{data.length} Tests Completed</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.serialCell]}>#</Text>
              <Text style={[styles.headerCell, styles.titleCell]}>Test Name</Text>
              <Text style={[styles.headerCell, styles.dateCell]}>Date</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Score</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Accuracy</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Attempt</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Correct</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Wrong</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Skipped</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Time (min)</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Avg/MCQ</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Time Eff</Text>
              <Text style={[styles.headerCell, styles.numCell]}>Effort Eff</Text>
            </View>

            {data.map((exam, index) => {
              const prevExam = index > 0 ? data[index - 1] : null;
              const scoreTrend = prevExam ? exam.score - prevExam.score : null;
              const accuracyTrend = prevExam ? exam.accuracy_percent - prevExam.accuracy_percent : null;

              return (
                <View key={exam.exam_serial} style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
                  <Text style={[styles.cell, styles.serialCell, styles.boldText]}>{exam.exam_serial}</Text>
                  <Text style={[styles.cell, styles.titleCell]}>{exam.exam_title}</Text>
                  <Text style={[styles.cell, styles.dateCell]}>{new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  <View style={[styles.cell, styles.numCell, styles.cellWithTrend]}>
                    <View style={styles.valueRow}>
                      <Text style={[styles.boldText, styles.numericValue]}>{exam.score}</Text>
                    </View>
                    {scoreTrend !== null && (
                      <View style={[styles.trendIndicator, scoreTrend >= 0 ? styles.trendUp : styles.trendDown]}>
                        {scoreTrend >= 0 ? <TrendingUp size={10} color="#10b981" /> : <TrendingDown size={10} color="#ef4444" />}
                        <Text style={[styles.trendValue, scoreTrend >= 0 ? styles.trendUpText : styles.trendDownText]}>
                          {scoreTrend >= 0 ? '+' : ''}{scoreTrend.toFixed(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.cell, styles.numCell, styles.cellWithTrend]}>
                    <View style={styles.valueRow}>
                      <Text style={[styles.boldText, styles.numericValue]}>{exam.accuracy_percent.toFixed(1)}%</Text>
                    </View>
                    {accuracyTrend !== null && (
                      <View style={[styles.trendIndicator, accuracyTrend >= 0 ? styles.trendUp : styles.trendDown]}>
                        {accuracyTrend >= 0 ? <TrendingUp size={10} color="#10b981" /> : <TrendingDown size={10} color="#ef4444" />}
                        <Text style={[styles.trendValue, accuracyTrend >= 0 ? styles.trendUpText : styles.trendDownText]}>
                          {accuracyTrend >= 0 ? '+' : ''}{accuracyTrend.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.numericValue, styles.singleValue]}>{exam.attempt_rate_percent.toFixed(0)}%</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.correctText, styles.numericValue, styles.singleValue]}>{exam.correct_answers}</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.wrongText, styles.numericValue, styles.singleValue]}>{exam.wrong_answers}</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.skippedText, styles.numericValue, styles.singleValue]}>{exam.skipped}</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.numericValue, styles.singleValue]}>{exam.time_spent_min.toFixed(1)}</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.numericValue, styles.singleValue]}>{exam.avg_time_per_mcq.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.numericValue, styles.singleValue]}>{exam.time_eff_percent.toFixed(1)}%</Text>
                  </View>
                  <View style={[styles.cell, styles.numCell]}>
                    <Text style={[styles.numericValue, styles.singleValue]}>{exam.effort_eff_percent.toFixed(1)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.summarySection}>
          <SummaryCard
            title="Average Score"
            value={calculateAverage(data.map(e => e.score)).toFixed(0)}
            color="#3b82f6"
          />
          <SummaryCard
            title="Average Accuracy"
            value={`${calculateAverage(data.map(e => e.accuracy_percent)).toFixed(1)}%`}
            color="#10b981"
          />
          <SummaryCard
            title="Total Questions"
            value={(data.length * 200).toString()}
            color="#fbbf24"
          />
          <SummaryCard
            title="Total Correct"
            value={data.reduce((sum, e) => sum + e.correct_answers, 0).toString()}
            color="#ec4899"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

function calculateAverage(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

interface SummaryCardProps {
  title: string;
  value: string;
  color: string;
}

function SummaryCard({ title, value, color }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  tableContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e5e7eb',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  evenRow: {
    backgroundColor: '#0f1419',
  },
  cell: {
    fontSize: 14,
    color: '#d1d5db',
    justifyContent: 'center',
  },
  serialCell: {
    width: 50,
  },
  titleCell: {
    width: 280,
  },
  dateCell: {
    width: 120,
  },
  numCell: {
    width: 110,
  },
  cellWithTrend: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: '700',
    color: '#ffffff',
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
  valueRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  numericValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'right',
  },
  singleValue: {
    lineHeight: 20,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  trendUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  trendDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  trendValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendUpText: {
    color: '#10b981',
  },
  trendDownText: {
    color: '#ef4444',
  },
  summarySection: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
  },
});
