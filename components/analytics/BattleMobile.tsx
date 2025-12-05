import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BattlePerformance } from '@/types/battle';
import { Sword, Target, Clock, Zap, TrendingUp, CheckCircle, XCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BattleMobileProps {
  battles: BattlePerformance[];
}

export default function BattleMobile({ battles }: BattleMobileProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {battles.map((battle, index) => {
        const subject = battle.subjects[0];
        const totalScore = battle.subjects.reduce((sum, s) => sum + s.score, 0);
        const avgAccuracy = battle.subjects.reduce((sum, s) => sum + s.accuracy_percent, 0) / battle.subjects.length;

        return (
          <Animated.View
            key={battle.battle_id}
            entering={FadeInDown.delay(index * 100)}
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
              <View style={styles.scoreCircle}>
                <Text style={[
                  styles.scoreValue,
                  totalScore >= 0 ? styles.positiveScore : styles.negativeScore
                ]}>
                  {totalScore >= 0 ? '+' : ''}{totalScore}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Target size={18} color="#06b6d4" />
                <Text style={styles.statValue}>{avgAccuracy.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={18} color="#fbbf24" />
                <Text style={styles.statValue}>{subject.avg_time_per_mcq_sec.toFixed(1)}s</Text>
                <Text style={styles.statLabel}>Avg Time</Text>
              </View>
              <View style={styles.statCard}>
                <Zap size={18} color="#f43f5e" />
                <Text style={styles.statValue}>{subject.effort_eff_percent.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Effort</Text>
              </View>
            </View>

            {battle.subjects.map((subj, idx) => (
              <View key={idx} style={styles.subjectSection}>
                <Text style={styles.subjectName}>{subj.subject_name}</Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${subj.accuracy_percent}%` }
                    ]}
                  />
                </View>

                <View style={styles.answersRow}>
                  <View style={styles.answerItem}>
                    <CheckCircle size={16} color="#10b981" />
                    <Text style={styles.answerText}>
                      <Text style={styles.answerValue}>{subj.correct_answers}</Text>
                      <Text style={styles.answerLabel}> correct</Text>
                    </Text>
                  </View>
                  <View style={styles.answerItem}>
                    <XCircle size={16} color="#ef4444" />
                    <Text style={styles.answerText}>
                      <Text style={styles.answerValue}>{subj.wrong_answers}</Text>
                      <Text style={styles.answerLabel}> wrong</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricBadge}>
                    <Text style={styles.metricLabel}>Time</Text>
                    <Text style={styles.metricValue}>{subj.time_spent_min.toFixed(2)}m</Text>
                  </View>
                  <View style={styles.metricBadge}>
                    <Text style={styles.metricLabel}>Questions</Text>
                    <Text style={styles.metricValue}>{subj.total_questions}</Text>
                  </View>
                  <View style={styles.metricBadge}>
                    <Text style={styles.metricLabel}>Attempt Rate</Text>
                    <Text style={styles.metricValue}>{subj.attempt_rate_percent}%</Text>
                  </View>
                </View>
              </View>
            ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  battleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  battleDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0f172a',
    borderWidth: 3,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  positiveScore: {
    color: '#10b981',
  },
  negativeScore: {
    color: '#ef4444',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  subjectSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
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
  answersRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  answerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  answerText: {
    fontSize: 13,
  },
  answerValue: {
    fontWeight: '700',
    color: '#f8fafc',
  },
  answerLabel: {
    color: '#94a3b8',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBadge: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
});
