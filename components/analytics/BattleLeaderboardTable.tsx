import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BattleLeaderboard } from '@/types/battle';
import { Trophy, Medal, Award } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface BattleLeaderboardTableProps {
  battles: BattleLeaderboard[];
}

export default function BattleLeaderboardTable({ battles }: BattleLeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} color="#fbbf24" />;
      case 2:
        return <Medal size={20} color="#94a3b8" />;
      case 3:
        return <Award size={20} color="#cd7f32" />;
      default:
        return <Text style={[styles.rankText, { color: '#64748b' }]}>{rank}</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Battle Leaderboards</Text>
          <Text style={styles.pageSubtitle}>Your rankings across all battles</Text>
        </View>

        {battles.map((battle, index) => {
          const { student_summary, leaderboard, battle_title, battle_date } = battle;

          return (
            <Animated.View
              key={battle.battle_id}
              entering={FadeIn.delay(index * 50)}
              style={styles.battleSection}>
              <View style={styles.battleHeader}>
                <View style={styles.battleInfo}>
                  <Text style={styles.battleTitle}>{battle_title}</Text>
                  <Text style={styles.battleDate}>
                    {new Date(battle_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.summaryCards}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Your Rank</Text>
                    <Text style={styles.cardValue}>#{student_summary.rank}</Text>
                  </View>
                  <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Score</Text>
                    <Text style={[
                      styles.cardValue,
                      student_summary.score >= 0 ? styles.positiveScore : styles.negativeScore
                    ]}>
                      {student_summary.score >= 0 ? '+' : ''}{student_summary.score}
                    </Text>
                  </View>
                  <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Percentile</Text>
                    <Text style={[styles.cardValue, { color: '#06b6d4' }]}>
                      {student_summary.percentile}th
                    </Text>
                  </View>
                  <View style={styles.summaryCard}>
                    <Text style={styles.cardLabel}>Students</Text>
                    <Text style={styles.cardValue}>{student_summary.total_students}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.rankColumn]}>Rank</Text>
                  <Text style={[styles.tableHeaderCell, styles.nameColumn]}>Student</Text>
                  <Text style={[styles.tableHeaderCell, styles.scoreColumn]}>Score</Text>
                </View>

                {leaderboard.map((entry, idx) => {
                  const isCurrentUser = entry.student_id === student_summary.student_id;
                  return (
                    <View
                      key={entry.student_id}
                      style={[
                        styles.tableRow,
                        idx % 2 === 0 && styles.tableRowAlt,
                        isCurrentUser && styles.currentUserRow
                      ]}>
                      <View style={[styles.tableCell, styles.rankColumn, styles.rankCell]}>
                        {getRankIcon(entry.rank)}
                      </View>
                      <Text style={[styles.tableCell, styles.nameColumn, styles.nameText]}>
                        {entry.student_name}
                        {isCurrentUser && <Text style={styles.youBadge}> (You)</Text>}
                      </Text>
                      <Text style={[
                        styles.tableCell,
                        styles.scoreColumn,
                        styles.scoreText,
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
  header: {
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
  battleSection: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  battleHeader: {
    padding: 20,
  },
  battleInfo: {
    marginBottom: 16,
  },
  battleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  tableContainer: {
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
    padding: 14,
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
    padding: 14,
    fontSize: 14,
    color: '#f8fafc',
  },
  rankColumn: {
    width: 100,
  },
  nameColumn: {
    flex: 1,
    minWidth: 200,
  },
  scoreColumn: {
    width: 120,
    textAlign: 'right',
  },
  rankCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
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
});
