import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react-native';

interface SubjectAnalytics {
  subject: string;
  attempted: number;
  correct: number;
  accuracy_percent: number;
  total_mcqs: number;
  coverage_percent: number;
  hours_completed: number;
  hours_remaining: number;
  urgency_score: number;
  accuracy_band: 'none' | 'weak' | 'average' | 'good';
  status_label: 'Not Started' | 'Weak Area' | 'Needs Revision' | 'Strong';
}

const STATUS_COLORS = {
  'Not Started': '#6B7280',
  'Weak Area': '#EF4444',
  'Needs Revision': '#F59E0B',
  'Strong': '#10B981',
};

const ACCURACY_BAND_COLORS = {
  none: '#6B7280',
  weak: '#EF4444',
  average: '#F59E0B',
  good: '#10B981',
};

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<SubjectAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        'get_student_mcq_subject_analytics_v2',
        { p_student_id: user.id }
      );

      if (rpcError) {
        throw rpcError;
      }

      setAnalytics(data || []);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAnalytics();
    }, [user?.id])
  );

  const hasAnyAttempts = analytics.some((s) => s.attempted > 0);

  if (loading) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Loading your analytics...</Text>
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubText}>Please try again later</Text>
        </View>
      </MainLayout>
    );
  }

  if (!hasAnyAttempts) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <Target size={64} color="#6B7280" />
          <Text style={styles.emptyTitle}>Analytics Not Started</Text>
          <Text style={styles.emptyDescription}>
            Start practicing MCQs to see your{'\n'}subject-wise performance analytics
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Analytics</Text>
          <Text style={styles.subtitle}>
            Subject-wise performance ranked by priority
          </Text>
        </View>

        <View style={styles.subjectsContainer}>
          {analytics.map((subject, index) => (
            <SubjectCard key={subject.subject} subject={subject} rank={index + 1} />
          ))}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

function SubjectCard({ subject, rank }: { subject: SubjectAnalytics; rank: number }) {
  const statusColor = STATUS_COLORS[subject.status_label];
  const accuracyColor = ACCURACY_BAND_COLORS[subject.accuracy_band];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{rank}</Text>
          </View>
          <Text style={styles.subjectName}>{subject.subject}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {subject.status_label}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Attempted</Text>
          <Text style={styles.metricValue}>
            {subject.attempted} / {subject.total_mcqs}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Correct</Text>
          <Text style={[styles.metricValue, { color: accuracyColor }]}>
            {subject.correct}
          </Text>
        </View>
      </View>

      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Accuracy</Text>
          <Text style={[styles.barValue, { color: accuracyColor }]}>
            {subject.accuracy_percent.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(subject.accuracy_percent, 100)}%`,
                backgroundColor: accuracyColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Coverage</Text>
          <Text style={styles.barValue}>{subject.coverage_percent.toFixed(1)}%</Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(subject.coverage_percent, 100)}%`,
                backgroundColor: '#3B82F6',
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.timeSection}>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Hours Completed</Text>
          <Text style={styles.timeValue}>{subject.hours_completed.toFixed(1)}h</Text>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Hours Remaining</Text>
          <Text style={[styles.timeValue, { color: '#F59E0B' }]}>
            {subject.hours_remaining.toFixed(1)}h
          </Text>
        </View>
      </View>

      {subject.urgency_score > 15 && (
        <View style={styles.urgencyBanner}>
          <TrendingUp size={16} color="#EF4444" />
          <Text style={styles.urgencyText}>High Priority</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9A9A9A',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9A9A9A',
    textAlign: 'center',
  },
  emptyTitle: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: '700',
    color: '#E5E5E5',
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: 12,
    fontSize: 16,
    color: '#9A9A9A',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E5E5E5',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9A9A9A',
    lineHeight: 24,
  },
  subjectsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    backgroundColor: '#25D36620',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#25D366',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E5E5E5',
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  metricLabel: {
    fontSize: 13,
    color: '#9A9A9A',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E5E5E5',
  },
  barSection: {
    marginBottom: 16,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A9A9A',
  },
  barValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E5E5E5',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeSection: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  urgencyBanner: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});
