import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MockTestLeaderboard } from '@/types/leaderboard';
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface LeaderboardMobileProps {
  data: MockTestLeaderboard;
}

export default function LeaderboardMobile({ data }: LeaderboardMobileProps) {
  const { student_summary, leaderboard, mock_test_name, mock_test_date } = data;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color="#fbbf24" />;
      case 2:
        return <Medal size={24} color="#94a3b8" />;
      case 3:
        return <Award size={24} color="#cd7f32" />;
      default:
        return null;
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(0)} style={styles.headerCard}>
        <Text style={styles.testTitle}>{mock_test_name}</Text>
        <Text style={styles.testDate}>{mock_test_date}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.rankBadge}>
            {getRankIcon(student_summary.actual_rank)}
            <Text style={styles.rankText}>Rank {student_summary.actual_rank}</Text>
          </View>
          <View style={styles.percentileBadge}>
            <Text style={styles.percentileValue}>{student_summary.percentile}th</Text>
            <Text style={styles.percentileLabel}>Percentile</Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreValue}>{student_summary.score}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={18} color="#10b981" />
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{student_summary.best_subject}</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingDown size={18} color="#ef4444" />
            <Text style={styles.statLabel}>Needs Work</Text>
            <Text style={styles.statValue}>{student_summary.worst_subject}</Text>
          </View>
        </View>

        <View style={styles.predictionCard}>
          <Text style={styles.predictionLabel}>Predicted Rank</Text>
          <Text style={styles.predictionValue}>{student_summary.predicted_rank.toLocaleString()}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionSubtitle}>{student_summary.total_students} students</Text>

        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.student_id === student_summary.student_id;
          return (
            <Animated.View
              key={entry.student_id}
              entering={FadeInDown.delay(300 + index * 50)}
              style={[styles.leaderboardCard, isCurrentUser && styles.currentUserCard]}>
              <View style={styles.leaderboardLeft}>
                <View style={[styles.rankCircle, { borderColor: getRankColor(entry.actual_rank) }]}>
                  {entry.actual_rank <= 3 ? (
                    getRankIcon(entry.actual_rank)
                  ) : (
                    <Text style={[styles.rankNumber, { color: getRankColor(entry.actual_rank) }]}>
                      {entry.actual_rank}
                    </Text>
                  )}
                </View>
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, isCurrentUser && styles.currentUserName]}>
                    {entry.student_name}
                    {isCurrentUser && <Text style={styles.youBadge}> (You)</Text>}
                  </Text>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectLabel}>Best: </Text>
                    <Text style={styles.subjectValue}>{entry.best_subject}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.leaderboardRight}>
                <Text style={styles.entryScore}>{entry.score}</Text>
                <Text style={styles.entryScoreLabel}>score</Text>
              </View>
            </Animated.View>
          );
        })}
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
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
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
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fbbf24',
  },
  percentileBadge: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  percentileValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#06b6d4',
  },
  percentileLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#f8fafc',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
  },
  predictionCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  predictionLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f59e0b',
  },
  leaderboardSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
  },
  leaderboardCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  currentUserCard: {
    borderColor: '#06b6d4',
    borderWidth: 2,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rankCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  currentUserName: {
    color: '#06b6d4',
  },
  youBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#06b6d4',
  },
  subjectRow: {
    flexDirection: 'row',
  },
  subjectLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  subjectValue: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  leaderboardRight: {
    alignItems: 'center',
  },
  entryScore: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  entryScoreLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
});
