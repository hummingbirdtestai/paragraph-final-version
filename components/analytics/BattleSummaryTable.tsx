import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BattleSummary } from '@/types/battle';
import { Trophy, Target, Award } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface BattleSummaryTableProps {
  battles: BattleSummary[];
}

export default function BattleSummaryTable({ battles }: BattleSummaryTableProps) {
  const totalBattles = battles.length;
  const totalScore = battles.reduce((sum, b) => sum + b.score, 0);
  const avgAccuracy = battles.reduce((sum, b) => sum + b.accuracy_percent, 0) / totalBattles;
  const wins = battles.filter(b => b.score > 0).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Battle Performance</Text>
          <Text style={styles.pageSubtitle}>Complete battle history and statistics</Text>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Trophy size={24} color="#fbbf24" />
            <Text style={styles.cardLabel}>Wins</Text>
            <Text style={styles.cardValue}>{wins}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Award size={24} color="#06b6d4" />
            <Text style={styles.cardLabel}>Total Battles</Text>
            <Text style={styles.cardValue}>{totalBattles}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Target size={24} color="#10b981" />
            <Text style={styles.cardLabel}>Avg Accuracy</Text>
            <Text style={[styles.cardValue, { color: '#10b981' }]}>{avgAccuracy.toFixed(1)}%</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Total Score</Text>
            <Text style={[
              styles.cardValue,
              { fontSize: 32 },
              totalScore >= 0 ? styles.positiveScore : styles.negativeScore
            ]}>
              {totalScore >= 0 ? '+' : ''}{totalScore}
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.titleColumn]}>Battle</Text>
            <Text style={[styles.tableHeaderCell, styles.dateColumn]}>Date</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Score</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Correct</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Wrong</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Total Q</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Accuracy</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Time</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Avg/Q</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Effort</Text>
            <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Attempt</Text>
          </View>

          {battles.map((battle, index) => (
            <Animated.View
              key={battle.battle_id}
              entering={FadeIn.delay(index * 30)}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.titleColumn, styles.battleTitle]}>
                {battle.battle_title}
              </Text>
              <Text style={[styles.tableCell, styles.dateColumn]}>
                {new Date(battle.battle_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <Text style={[
                styles.tableCell,
                styles.numberColumn,
                styles.scoreCell,
                battle.score >= 0 ? styles.positiveScore : styles.negativeScore
              ]}>
                {battle.score >= 0 ? '+' : ''}{battle.score}
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn, styles.correctColor]}>
                {battle.correct_answers}
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn, styles.wrongColor]}>
                {battle.wrong_answers}
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.total_questions}
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.accuracy_percent}%
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.time_spent_min.toFixed(2)}m
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.avg_time_per_mcq_sec.toFixed(1)}s
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.effort_eff_percent}%
              </Text>
              <Text style={[styles.tableCell, styles.numberColumn]}>
                {battle.attempt_rate_percent}%
              </Text>
            </Animated.View>
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
  header: {
    marginBottom: 24,
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
  summaryCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 10,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 28,
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
    padding: 14,
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
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#0f172a',
  },
  tableCell: {
    padding: 14,
    fontSize: 13,
    color: '#f8fafc',
  },
  titleColumn: {
    flex: 2,
    minWidth: 180,
  },
  dateColumn: {
    width: 100,
  },
  numberColumn: {
    width: 85,
    textAlign: 'right',
  },
  battleTitle: {
    fontWeight: '600',
  },
  scoreCell: {
    fontWeight: '700',
    fontSize: 15,
  },
  correctColor: {
    color: '#10b981',
  },
  wrongColor: {
    color: '#ef4444',
  },
});
