import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MockTestLeaderboard } from '@/types/leaderboard';
import { Trophy, Medal, Award } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LeaderboardTableProps {
  data: MockTestLeaderboard;
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { student_summary, leaderboard, mock_test_name, mock_test_date } = data;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} color="#fbbf24" />;
      case 2:
        return <Medal size={20} color="#94a3b8" />;
      case 3:
        return <Award size={20} color="#cd7f32" />;
      default:
        return <Text style={styles.rankText}>{rank}</Text>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#fbbf24';
      case 2:
        return '#94a3b8';
      case 3:
        return '#cd7f32';
      default:
        return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.testTitle}>{mock_test_name}</Text>
            <Text style={styles.testDate}>{mock_test_date}</Text>
          </View>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Your Rank</Text>
            <Text style={[styles.cardValue, { color: getRankColor(student_summary.actual_rank) }]}>
              {student_summary.actual_rank}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Your Score</Text>
            <Text style={styles.cardValue}>{student_summary.score}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Percentile</Text>
            <Text style={[styles.cardValue, { color: '#06b6d4' }]}>{student_summary.percentile}th</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Predicted Rank</Text>
            <Text style={[styles.cardValue, { fontSize: 20, color: '#f59e0b' }]}>
              {student_summary.predicted_rank.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.subjectCards}>
          <View style={styles.subjectCard}>
            <Text style={styles.subjectCardLabel}>Best Subject</Text>
            <Text style={[styles.subjectCardValue, { color: '#10b981' }]}>
              {student_summary.best_subject}
            </Text>
          </View>
          <View style={styles.subjectCard}>
            <Text style={styles.subjectCardLabel}>Needs Improvement</Text>
            <Text style={[styles.subjectCardValue, { color: '#ef4444' }]}>
              {student_summary.worst_subject}
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.rankColumn]}>Rank</Text>
            <Text style={[styles.tableHeaderCell, styles.nameColumn]}>Student</Text>
            <Text style={[styles.tableHeaderCell, styles.scoreColumn]}>Score</Text>
            <Text style={[styles.tableHeaderCell, styles.subjectColumn]}>Best Subject</Text>
            <Text style={[styles.tableHeaderCell, styles.subjectColumn]}>Needs Work</Text>
            <Text style={[styles.tableHeaderCell, styles.predictedColumn]}>Predicted Rank</Text>
          </View>

          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.student_id === student_summary.student_id;
            return (
              <Animated.View
                key={entry.student_id}
                entering={FadeIn.delay(index * 30)}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowAlt,
                  isCurrentUser && styles.currentUserRow
                ]}>
                <View style={[styles.tableCell, styles.rankColumn, styles.rankCell]}>
                  {getRankIcon(entry.actual_rank)}
                </View>
                <Text style={[styles.tableCell, styles.nameColumn, styles.nameText]}>
                  {entry.student_name}
                  {isCurrentUser && <Text style={styles.youBadge}> (You)</Text>}
                </Text>
                <Text style={[styles.tableCell, styles.scoreColumn, styles.scoreText]}>
                  {entry.score}
                </Text>
                <Text style={[styles.tableCell, styles.subjectColumn, styles.bestSubject]}>
                  {entry.best_subject}
                </Text>
                <Text style={[styles.tableCell, styles.subjectColumn, styles.worstSubject]}>
                  {entry.worst_subject}
                </Text>
                <Text style={[styles.tableCell, styles.predictedColumn]}>
                  {entry.predicted_rank.toLocaleString()}
                </Text>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Total Students: {student_summary.total_students}</Text>
        </View>
      </Animated.View>
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
  header: {
    marginBottom: 24,
  },
  testTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  testDate: {
    fontSize: 16,
    color: '#94a3b8',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subjectCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  subjectCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subjectCardLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  subjectCardValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  tableContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  tableHeaderCell: {
    padding: 16,
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#0f172a',
  },
  currentUserRow: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
  },
  tableCell: {
    padding: 16,
    fontSize: 14,
    color: '#f8fafc',
  },
  rankColumn: {
    width: 100,
  },
  nameColumn: {
    flex: 2,
    minWidth: 180,
  },
  scoreColumn: {
    width: 100,
    textAlign: 'right',
  },
  subjectColumn: {
    flex: 1,
    minWidth: 140,
  },
  predictedColumn: {
    width: 150,
    textAlign: 'right',
  },
  rankCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
  },
  nameText: {
    fontWeight: '600',
  },
  youBadge: {
    color: '#06b6d4',
    fontWeight: '700',
  },
  scoreText: {
    fontWeight: '700',
    fontSize: 16,
  },
  bestSubject: {
    color: '#10b981',
    fontWeight: '600',
  },
  worstSubject: {
    color: '#ef4444',
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
