import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BattleSummary } from '@/types/battle';
import { Trophy, Target, Clock, Zap, TrendingUp, CheckCircle, XCircle, Award } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BattleSummaryMobileProps {
  battles: BattleSummary[];
}

export default function BattleSummaryMobile({ battles }: BattleSummaryMobileProps) {
  const totalBattles = battles.length;
  const totalScore = battles.reduce((sum, b) => sum + b.score, 0);
  const avgAccuracy = battles.reduce((sum, b) => sum + b.accuracy_percent, 0) / totalBattles;
  const wins = battles.filter(b => b.score > 0).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.delay(0)} style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Battle Summary</Text>

        <View style={styles.statsRow}>
          <View style={styles.overviewStat}>
            <Trophy size={20} color="#fbbf24" />
            <Text style={styles.overviewValue}>{wins}</Text>
            <Text style={styles.overviewLabel}>Wins</Text>
          </View>
          <View style={styles.overviewStat}>
            <Award size={20} color="#06b6d4" />
            <Text style={styles.overviewValue}>{totalBattles}</Text>
            <Text style={styles.overviewLabel}>Battles</Text>
          </View>
          <View style={styles.overviewStat}>
            <Target size={20} color="#10b981" />
            <Text style={styles.overviewValue}>{avgAccuracy.toFixed(0)}%</Text>
            <Text style={styles.overviewLabel}>Avg Accuracy</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={[
              styles.overviewValueLarge,
              totalScore >= 0 ? styles.positiveScore : styles.negativeScore
            ]}>
              {totalScore >= 0 ? '+' : ''}{totalScore}
            </Text>
            <Text style={styles.overviewLabel}>Total Score</Text>
          </View>
        </View>
      </Animated.View>

      {battles.map((battle, index) => (
        <Animated.View
          key={battle.battle_id}
          entering={FadeInDown.delay((index + 1) * 100)}
          style={styles.battleCard}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.battleTitle}>{battle.battle_title}</Text>
              <Text style={styles.battleDate}>
                {new Date(battle.battle_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={[
              styles.scoreCircle,
              battle.score >= 0 ? styles.scoreCirclePositive : styles.scoreCircleNegative
            ]}>
              <Text style={[
                styles.scoreValue,
                battle.score >= 0 ? styles.positiveScore : styles.negativeScore
              ]}>
                {battle.score >= 0 ? '+' : ''}{battle.score}
              </Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Target size={16} color="#06b6d4" />
              <Text style={styles.metricValue}>{battle.accuracy_percent}%</Text>
              <Text style={styles.metricLabel}>Accuracy</Text>
            </View>
            <View style={styles.metricCard}>
              <CheckCircle size={16} color="#10b981" />
              <Text style={styles.metricValue}>{battle.correct_answers}</Text>
              <Text style={styles.metricLabel}>Correct</Text>
            </View>
            <View style={styles.metricCard}>
              <XCircle size={16} color="#ef4444" />
              <Text style={styles.metricValue}>{battle.wrong_answers}</Text>
              <Text style={styles.metricLabel}>Wrong</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${battle.accuracy_percent}%` }
              ]}
            />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Questions</Text>
              <Text style={styles.detailValue}>{battle.total_questions}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Answered</Text>
              <Text style={styles.detailValue}>{battle.answered}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{battle.time_spent_min.toFixed(2)}m</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Avg/Q</Text>
              <Text style={styles.detailValue}>{battle.avg_time_per_mcq_sec.toFixed(1)}s</Text>
            </View>
          </View>

          <View style={styles.efficiencyRow}>
            <View style={styles.efficiencyBadge}>
              <Zap size={14} color="#f59e0b" />
              <Text style={styles.efficiencyLabel}>Effort</Text>
              <Text style={styles.efficiencyValue}>{battle.effort_eff_percent}%</Text>
            </View>
            <View style={styles.efficiencyBadge}>
              <TrendingUp size={14} color="#8b5cf6" />
              <Text style={styles.efficiencyLabel}>Attempt</Text>
              <Text style={styles.efficiencyValue}>{battle.attempt_rate_percent}%</Text>
            </View>
          </View>
        </Animated.View>
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
  overviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 6,
    marginBottom: 2,
  },
  overviewValueLarge: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 2,
  },
  overviewLabel: {
    fontSize: 10,
    color: '#94a3b8',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  battleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f172a',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scoreCirclePositive: {
    borderColor: '#10b981',
  },
  scoreCircleNegative: {
    borderColor: '#ef4444',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 6,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 3,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  efficiencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  efficiencyBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  efficiencyLabel: {
    fontSize: 11,
    color: '#94a3b8',
    flex: 1,
  },
  efficiencyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
});
