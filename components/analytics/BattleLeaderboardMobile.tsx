import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BattleLeaderboard } from '@/types/battle';
import { Trophy, Medal, Award, Crown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BattleLeaderboardMobileProps {
  battles: BattleLeaderboard[];
}

export default function BattleLeaderboardMobile({ battles }: BattleLeaderboardMobileProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} color="#fbbf24" />;
      case 2:
        return <Medal size={20} color="#94a3b8" />;
      case 3:
        return <Award size={20} color="#cd7f32" />;
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
      {battles.map((battle, index) => {
        const { student_summary, leaderboard, battle_title, battle_date } = battle;

        return (
          <Animated.View
            key={battle.battle_id}
            entering={FadeInDown.delay(index * 100)}
            style={styles.battleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.battleTitle}>{battle_title}</Text>
                <Text style={styles.battleDate}>
                  {new Date(battle_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.summarySection}>
              <View style={styles.summaryHeader}>
                <Crown size={18} color="#fbbf24" />
                <Text style={styles.summaryTitle}>Your Performance</Text>
              </View>

              <View style={styles.summaryStats}>
                <View style={styles.statBadge}>
                  <Text style={styles.statLabel}>Rank</Text>
                  <Text style={[styles.statValue, { color: getRankColor(student_summary.rank) }]}>
                    #{student_summary.rank}
                  </Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statLabel}>Score</Text>
                  <Text style={[
                    styles.statValue,
                    student_summary.score >= 0 ? styles.positiveScore : styles.negativeScore
                  ]}>
                    {student_summary.score >= 0 ? '+' : ''}{student_summary.score}
                  </Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statLabel}>Percentile</Text>
                  <Text style={[styles.statValue, { color: '#06b6d4' }]}>
                    {student_summary.percentile}th
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.leaderboardSection}>
              <Text style={styles.leaderboardTitle}>Leaderboard</Text>
              <Text style={styles.leaderboardSubtitle}>
                {student_summary.total_students} {student_summary.total_students === 1 ? 'student' : 'students'}
              </Text>

              {leaderboard.map((entry, idx) => {
                const isCurrentUser = entry.student_id === student_summary.student_id;
                return (
                  <View
                    key={entry.student_id}
                    style={[styles.leaderboardEntry, isCurrentUser && styles.currentUserEntry]}>
                    <View style={styles.entryLeft}>
                      <View style={[styles.rankCircle, { borderColor: getRankColor(entry.rank) }]}>
                        {entry.rank <= 3 ? (
                          getRankIcon(entry.rank)
                        ) : (
                          <Text style={[styles.rankNumber, { color: getRankColor(entry.rank) }]}>
                            {entry.rank}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.studentName, isCurrentUser && styles.currentUserName]}>
                        {entry.student_name}
                        {isCurrentUser && <Text style={styles.youBadge}> (You)</Text>}
                      </Text>
                    </View>
                    <Text style={[
                      styles.entryScore,
                      entry.score >= 0 ? styles.positiveScore : styles.negativeScore
                    ]}>
                      {entry.score >= 0 ? '+' : ''}{entry.score}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        );
      })}
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
  battleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  battleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  summarySection: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadge: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  leaderboardSection: {
    marginTop: 4,
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 12,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  currentUserEntry: {
    borderColor: '#06b6d4',
    borderWidth: 2,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
  },
  currentUserName: {
    color: '#06b6d4',
  },
  youBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#06b6d4',
  },
  entryScore: {
    fontSize: 18,
    fontWeight: '800',
  },
});
