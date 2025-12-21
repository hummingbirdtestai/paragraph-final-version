//analyticspage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { TrendingUp, TrendingDown, AlertCircle, Target, ChevronLeft, Clock } from 'lucide-react-native';

type TabType = 'practice' | 'mockTests';

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

interface MockTestListItem {
  exam_serial: number;
  exam_title: string;
  exam_date: string;
  total_questions: number;
  attempted: number;
  skipped: number;
  correct: number;
  incorrect: number;
  total_score: number;
}

interface MockTestListResponse {
  mocks: MockTestListItem[];
}

interface MockTestSubject {
  subject_name: string;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  score: number;
  smart_revision_priority: number;
  negative_marking_damage_index: number;
}

interface MockTestSummary {
  total_score: number;
  predicted_rank: number;
}

interface MockTestDetail {
  exam_serial: number;
  summary: MockTestSummary;
  subjects: MockTestSubject[];
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
  const [activeTab, setActiveTab] = useState<TabType>('practice');

  return (
    <MainLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'practice' && styles.activeTab]}
              onPress={() => setActiveTab('practice')}
            >
              <Text style={[styles.tabText, activeTab === 'practice' && styles.activeTabText]}>
                PYQ Concepts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'mockTests' && styles.activeTab]}
              onPress={() => setActiveTab('mockTests')}
            >
              <Text style={[styles.tabText, activeTab === 'mockTests' && styles.activeTabText]}>
                Mock Tests
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'practice' && <PracticeAnalytics />}
        {activeTab === 'mockTests' && <MockTestsAnalytics />}
      </View>
    </MainLayout>
  );
}

function PracticeAnalytics() {
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading your analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Please try again later</Text>
      </View>
    );
  }

  if (!hasAnyAttempts) {
    return (
      <View style={styles.centerContainer}>
        <Target size={64} color="#6B7280" />
        <Text style={styles.emptyTitle}>Analytics Not Started</Text>
        <Text style={styles.emptyDescription}>
          Start practicing MCQs to see your{'\n'}subject-wise performance analytics
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>
        Subject-wise performance ranked by priority
      </Text>

      <View style={styles.subjectsContainer}>
        {analytics.map((subject, index) => (
          <SubjectCard key={subject.subject} subject={subject} rank={index + 1} />
        ))}
      </View>
    </ScrollView>
  );
}

function MockTestsAnalytics() {
  const { user } = useAuth();
  const [mockList, setMockList] = useState<MockTestListItem[]>([]);
  const [selectedMock, setSelectedMock] = useState<number | null>(null);
  const [mockDetail, setMockDetail] = useState<MockTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMockTestList = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        'get_mock_test_list_v1',
        { p_student_id: user.id }
      );

      if (rpcError) {
        throw rpcError;
      }

      setMockList(data?.mocks || []);
    } catch (err: any) {
      console.error('Mock test list fetch error:', err);
      setError(err.message || 'Failed to load mock test list');
    } finally {
      setLoading(false);
    }
  };

  const fetchMockTestDetail = async (examSerial: number) => {
    if (!user?.id) return;

    try {
      setDetailLoading(true);

      const { data, error: rpcError } = await supabase.rpc(
        'get_mock_test_subject_analytics_v1',
        {
          p_student_id: user.id,
          p_exam_serial: examSerial
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setMockDetail(data);
    } catch (err: any) {
      console.error('Mock test detail fetch error:', err);
      setError(err.message || 'Failed to load mock test details');
    } finally {
      setDetailLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMockTestList();
      setSelectedMock(null);
      setMockDetail(null);
    }, [user?.id])
  );

  useEffect(() => {
    if (selectedMock !== null) {
      fetchMockTestDetail(selectedMock);
    }
  }, [selectedMock]);

  const handleBackToList = () => {
    setSelectedMock(null);
    setMockDetail(null);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading mock test analytics...</Text>
      </View>
    );
  }

  if (error && mockList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Please try again later</Text>
      </View>
    );
  }

  if (mockList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Target size={64} color="#6B7280" />
        <Text style={styles.emptyTitle}>No Mock Tests Attempted</Text>
        <Text style={styles.emptyDescription}>
          Start attempting mock tests to see your{'\n'}performance analytics
        </Text>
      </View>
    );
  }

  if (mockDetail && selectedMock !== null) {
    if (detailLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Loading mock test details...</Text>
        </View>
      );
    }
    return <MockTestDetailView mockTest={mockDetail} onBack={handleBackToList} />;
  }

  const sortedMocks = [...mockList].sort((a, b) => b.exam_serial - a.exam_serial);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>
        Your mock test performance history
      </Text>

      <View style={styles.subjectsContainer}>
        {sortedMocks.map((mockTest) => (
          <MockTestListCard
            key={mockTest.exam_serial}
            mockTest={mockTest}
            onPress={() => setSelectedMock(mockTest.exam_serial)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function MockTestListCard({ mockTest, onPress }: { mockTest: MockTestListItem; onPress: () => void }) {
  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return '#6B7280';
    if (score >= 500) return '#10B981';
    if (score >= 400) return '#F59E0B';
    return '#EF4444';
  };

  const getAccuracyColor = (accuracy: number | null | undefined) => {
    if (!accuracy) return '#6B7280';
    if (accuracy >= 75) return '#10B981';
    if (accuracy >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(mockTest.total_score);
  const accuracy = mockTest.attempted > 0 ? (mockTest.correct / mockTest.attempted) * 100 : 0;
  const accuracyColor = getAccuracyColor(accuracy);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{mockTest.exam_serial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subjectName}>{mockTest.exam_title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Clock size={12} color="#9A9A9A" />
              <Text style={[styles.metricLabel, { fontSize: 12 }]}>{formatDate(mockTest.exam_date)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Total Score</Text>
          <Text style={[styles.metricValue, { color: scoreColor }]}>
            {mockTest.total_score ?? 0}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Attempted</Text>
          <Text style={styles.metricValue}>
            {mockTest.correct} / {mockTest.attempted}
          </Text>
        </View>
      </View>

      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Accuracy</Text>
          <Text style={[styles.barValue, { color: accuracyColor }]}>
            {accuracy.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.min(accuracy, 100)}%`,
                backgroundColor: accuracyColor,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MockTestDetailView({ mockTest, onBack }: { mockTest: MockTestDetail; onBack: () => void }) {
  const getAccuracyColor = (accuracy: number | null | undefined) => {
    if (!accuracy) return '#6B7280';
    if (accuracy >= 75) return '#10B981';
    if (accuracy >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return '#6B7280';
    if (score >= 500) return '#10B981';
    if (score >= 400) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(mockTest.summary?.total_score);
  const sortedSubjects = [...(mockTest.subjects || [])].sort(
    (a, b) => (b.smart_revision_priority ?? 0) - (a.smart_revision_priority ?? 0)
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 4 }}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <ChevronLeft size={20} color="#25D366" />
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#25D366' }}>Back to List</Text>
      </TouchableOpacity>

      <Text style={[styles.subjectName, { marginBottom: 20 }]}>Mock Test {mockTest.exam_serial}</Text>

      <View style={styles.card}>
        <Text style={[styles.barLabel, { marginBottom: 16 }]}>Overall Performance</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Total Score</Text>
            <Text style={[styles.metricValue, { color: scoreColor }]}>
              {mockTest.summary?.total_score ?? 0}
            </Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Predicted Rank</Text>
            <Text style={styles.metricValue}>
              {mockTest.summary?.predicted_rank?.toLocaleString() ?? '0'}
            </Text>
          </View>
        </View>
      </View>

      {sortedSubjects.length > 0 && (
        <>
          <Text style={[styles.subtitle, { marginTop: 24, marginBottom: 16 }]}>
            Subject-wise Analytics (by Priority)
          </Text>

          <View style={styles.subjectsContainer}>
            {sortedSubjects.map((subject, index) => {
              const subjectAccuracyColor = getAccuracyColor(subject.accuracy);
              const subjectScoreColor = getScoreColor(subject.score);
              return (
                <View key={subject.subject_name} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleRow}>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                      </View>
                      <Text style={styles.subjectName}>{subject.subject_name}</Text>
                    </View>
                  </View>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Score</Text>
                      <Text style={[styles.metricValue, { color: subjectScoreColor }]}>
                        {subject.score ?? 0}
                      </Text>
                    </View>

                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Revision Priority</Text>
                      <Text style={styles.metricValue}>
                        {subject.smart_revision_priority?.toFixed(1) ?? '0.0'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Attempted</Text>
                      <Text style={styles.metricValue}>
                        {subject.attempted ?? 0}
                      </Text>
                    </View>

                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Correct</Text>
                      <Text style={[styles.metricValue, { color: '#10B981' }]}>
                        {subject.correct ?? 0}
                      </Text>
                    </View>

                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>Incorrect</Text>
                      <Text style={[styles.metricValue, { color: '#EF4444' }]}>
                        {subject.incorrect ?? 0}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.barSection}>
                    <View style={styles.barLabelRow}>
                      <Text style={styles.barLabel}>Accuracy</Text>
                      <Text style={[styles.barValue, { color: subjectAccuracyColor }]}>
                        {subject.accuracy?.toFixed(1) ?? '0.0'}%
                      </Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${Math.min(subject.accuracy ?? 0, 100)}%`,
                            backgroundColor: subjectAccuracyColor,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.timeSection}>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeLabel}>Negative Marking Impact</Text>
                      <Text style={[styles.timeValue, { color: '#EF4444' }]}>
                        {subject.negative_marking_damage_index?.toFixed(2) ?? '0.00'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#25D366',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9A9A9A',
  },
  activeTabText: {
    color: '#0D0D0D',
  },
  subtitle: {
    fontSize: 16,
    color: '#9A9A9A',
    lineHeight: 24,
    marginBottom: 16,
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
