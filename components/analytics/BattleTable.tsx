import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BattlePerformance } from '@/types/battle';
import Animated, { FadeIn } from 'react-native-reanimated';

interface BattleTableProps {
  battles: BattlePerformance[];
}

export default function BattleTable({ battles }: BattleTableProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Battle Analytics</Text>
          <Text style={styles.pageSubtitle}>Performance across all battles</Text>
        </View>

        {battles.map((battle, index) => {
          const totalScore = battle.subjects.reduce((sum, s) => sum + s.score, 0);

          return (
            <Animated.View
              key={battle.battle_id}
              entering={FadeIn.delay(index * 50)}
              style={styles.battleSection}>
              <View style={styles.battleHeader}>
                <View style={styles.battleInfo}>
                  <Text style={styles.battleTitle}>{battle.battle_title}</Text>
                  <Text style={styles.battleDate}>
                    {new Date(battle.battle_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.totalScoreCard}>
                  <Text style={styles.scoreLabel}>Total Score</Text>
                  <Text style={[
                    styles.totalScore,
                    totalScore >= 0 ? styles.positiveScore : styles.negativeScore
                  ]}>
                    {totalScore >= 0 ? '+' : ''}{totalScore}
                  </Text>
                </View>
              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.subjectColumn]}>Subject</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Score</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Correct</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Wrong</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Total</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Accuracy</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Avg Time</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Effort</Text>
                  <Text style={[styles.tableHeaderCell, styles.numberColumn]}>Attempt Rate</Text>
                </View>

                {battle.subjects.map((subject, idx) => (
                  <View
                    key={idx}
                    style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCell, styles.subjectColumn, styles.subjectName]}>
                      {subject.subject_name}
                    </Text>
                    <Text style={[
                      styles.tableCell,
                      styles.numberColumn,
                      styles.scoreCell,
                      subject.score >= 0 ? styles.positiveScore : styles.negativeScore
                    ]}>
                      {subject.score >= 0 ? '+' : ''}{subject.score}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.correctColor]}>
                      {subject.correct_answers}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn, styles.wrongColor]}>
                      {subject.wrong_answers}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn]}>
                      {subject.total_questions}
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn]}>
                      {subject.accuracy_percent.toFixed(0)}%
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn]}>
                      {subject.avg_time_per_mcq_sec.toFixed(1)}s
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn]}>
                      {subject.effort_eff_percent.toFixed(0)}%
                    </Text>
                    <Text style={[styles.tableCell, styles.numberColumn]}>
                      {subject.attempt_rate_percent}%
                    </Text>
                  </View>
                ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  battleInfo: {
    flex: 1,
  },
  battleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  totalScoreCard: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  totalScore: {
    fontSize: 28,
    fontWeight: '800',
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
    minWidth: 150,
  },
  numberColumn: {
    flex: 1,
    minWidth: 80,
    textAlign: 'right',
  },
  subjectName: {
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
