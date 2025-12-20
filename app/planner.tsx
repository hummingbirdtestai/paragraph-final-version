import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Clock, TrendingUp, AlertCircle, Target, CheckCircle } from 'lucide-react-native';

interface PlannerSummary {
  exam_date: string;
  days_left: number;
  total_hours_remaining: number;
  required_hours_per_day: number;
  pressure_level: 'tight' | 'moderate' | 'comfortable';
}

interface TodayPlanItem {
  subject: string;
  planned_hours: number;
  mcqs_today: number;
  mcqs_remaining: number;
  urgency_score: number;
  accuracy_band: 'none' | 'weak' | 'average' | 'good';
  status_label: 'Not Started' | 'Weak Area' | 'Needs Revision' | 'Strong';
}

interface TodayActual {
  subject: string;
  hours_spent: number;
}

interface Past7DayItem {
  study_date: string;
  hours_completed: number;
}

interface Projection {
  estimated_completion_date: string;
}

interface PlannerData {
  summary: PlannerSummary;
  today_plan: TodayPlanItem[] | null;
  today_actuals: TodayActual[] | null;
  past_7_days: Past7DayItem[] | null;
  projection: Projection;
}

const PRESSURE_COLORS = {
  tight: '#EF4444',
  moderate: '#F59E0B',
  comfortable: '#10B981',
};

const STATUS_COLORS = {
  'Not Started': '#6B7280',
  'Weak Area': '#EF4444',
  'Needs Revision': '#F59E0B',
  'Strong': '#10B981',
};

export default function PlannerScreen() {
  const { user } = useAuth();
  const [plannerData, setPlannerData] = useState<PlannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanner = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_student_planner_v1', {
        p_student_id: user.id,
      });

      if (rpcError) {
        throw rpcError;
      }

      setPlannerData(data);
    } catch (err: any) {
      console.error('Planner fetch error:', err);
      setError(err.message || 'Failed to load planner');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPlanner();
    }, [user?.id])
  );

  if (loading) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Loading your study plan...</Text>
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

  if (!plannerData) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <Calendar size={64} color="#6B7280" />
          <Text style={styles.emptyTitle}>Planner Not Available</Text>
          <Text style={styles.emptyDescription}>
            Start practicing to generate your personalized study plan
          </Text>
        </View>
      </MainLayout>
    );
  }

  const { summary, today_plan, today_actuals, past_7_days, projection } = plannerData;
  const pressureColor = PRESSURE_COLORS[summary.pressure_level];

  return (
    <MainLayout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Study Planner</Text>
          <Text style={styles.subtitle}>Personalized daily plan for NEET-PG 2026</Text>
        </View>

        <SummarySection summary={summary} pressureColor={pressureColor} />

        <TodayPlanSection todayPlan={today_plan} />

        <TodayActualsSection todayActuals={today_actuals} />

        <Past7DaysSection past7Days={past_7_days} />

        <ProjectionSection
          projection={projection}
          examDate={summary.exam_date}
          daysLeft={summary.days_left}
        />
      </ScrollView>
    </MainLayout>
  );
}

function SummarySection({
  summary,
  pressureColor,
}: {
  summary: PlannerSummary;
  pressureColor: string;
}) {
  const examDate = new Date(summary.exam_date);
  const formattedExamDate = examDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Calendar size={20} color="#25D366" />
        <Text style={styles.sectionTitle}>Exam Overview</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Exam Date</Text>
          <Text style={styles.summaryValue}>{formattedExamDate}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Days Left</Text>
          <Text style={[styles.summaryValue, { color: pressureColor }]}>
            {summary.days_left} days
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Hours Remaining</Text>
          <Text style={styles.summaryValue}>{summary.total_hours_remaining.toFixed(1)}h</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Required Daily Hours</Text>
          <Text style={[styles.summaryValue, { color: pressureColor, fontWeight: '700' }]}>
            {summary.required_hours_per_day.toFixed(1)}h/day
          </Text>
        </View>

        <View style={[styles.pressureBadge, { backgroundColor: `${pressureColor}20` }]}>
          <Text style={[styles.pressureText, { color: pressureColor }]}>
            {summary.pressure_level.charAt(0).toUpperCase() + summary.pressure_level.slice(1)}{' '}
            Schedule
          </Text>
        </View>
      </View>
    </View>
  );
}

function TodayPlanSection({ todayPlan }: { todayPlan: TodayPlanItem[] | null }) {
  const safePlan = todayPlan || [];
  const activePlan = safePlan.filter((item) => item.planned_hours > 0);

  if (activePlan.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={20} color="#25D366" />
          <Text style={styles.sectionTitle}>Today's Plan</Text>
        </View>
        <View style={styles.emptyPlanCard}>
          <CheckCircle size={48} color="#10B981" />
          <Text style={styles.emptyPlanText}>No pending study for today</Text>
          <Text style={styles.emptyPlanSubText}>You're all caught up!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Target size={20} color="#25D366" />
        <Text style={styles.sectionTitle}>Today's Plan</Text>
      </View>

      {activePlan.map((item, index) => (
        <View key={item.subject} style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planTitleRow}>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>#{index + 1}</Text>
              </View>
              <Text style={styles.planSubject}>{item.subject}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${STATUS_COLORS[item.status_label]}20` },
              ]}
            >
              <Text style={[styles.statusText, { color: STATUS_COLORS[item.status_label] }]}>
                {item.status_label}
              </Text>
            </View>
          </View>

          <View style={styles.planTimeRow}>
            <Clock size={16} color="#9A9A9A" />
            <Text style={styles.planTime}>{item.planned_hours.toFixed(1)} hours</Text>
          </View>

          <View style={styles.mcqRow}>
            <Text style={styles.mcqLabel}>Today: {item.mcqs_today} MCQs</Text>
            <Text style={styles.mcqLabel}>Remaining: {item.mcqs_remaining} MCQs</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function TodayActualsSection({ todayActuals }: { todayActuals: TodayActual[] | null }) {
  const safeActuals = todayActuals || [];
  const totalHours = safeActuals.reduce((sum, item) => sum + item.hours_spent, 0);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <CheckCircle size={20} color="#25D366" />
        <Text style={styles.sectionTitle}>Today's Progress</Text>
      </View>

      <View style={styles.actualsCard}>
        <View style={styles.totalHoursRow}>
          <Text style={styles.actualsLabel}>Total Hours Today</Text>
          <Text style={styles.totalHoursValue}>{totalHours.toFixed(1)}h</Text>
        </View>

        {safeActuals.length > 0 ? (
          <View style={styles.actualsList}>
            {safeActuals.map((item) => (
              <View key={item.subject} style={styles.actualItem}>
                <Text style={styles.actualSubject}>{item.subject}</Text>
                <Text style={styles.actualHours}>{item.hours_spent.toFixed(1)}h</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noActivityText}>No activity recorded yet today</Text>
        )}
      </View>
    </View>
  );
}

function Past7DaysSection({ past7Days }: { past7Days: Past7DayItem[] | null }) {
  const safePast7Days = past7Days || [];
  const maxHours = Math.max(...safePast7Days.map((d) => d.hours_completed), 1);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TrendingUp size={20} color="#25D366" />
        <Text style={styles.sectionTitle}>Past 7 Days</Text>
      </View>

      <View style={styles.past7DaysCard}>
        {safePast7Days.length === 0 ? (
          <Text style={styles.noActivityText}>No recent activity</Text>
        ) : (
          safePast7Days.map((day) => {
          const date = new Date(day.study_date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const barWidth = (day.hours_completed / maxHours) * 100;

          return (
            <View key={day.study_date} style={styles.dayRow}>
              <View style={styles.dayLabelContainer}>
                <Text style={styles.dayName}>{dayName}</Text>
                <Text style={styles.dayDate}>{dateStr}</Text>
              </View>
              <View style={styles.dayBarContainer}>
                <View style={styles.dayBarTrack}>
                  <View style={[styles.dayBarFill, { width: `${barWidth}%` }]} />
                </View>
                <Text style={styles.dayHours}>{day.hours_completed.toFixed(1)}h</Text>
              </View>
            </View>
          );
        })
        )}
      </View>
    </View>
  );
}

function ProjectionSection({
  projection,
  examDate,
  daysLeft,
}: {
  projection: Projection;
  examDate: string;
  daysLeft: number;
}) {
  const estimatedDate = new Date(projection.estimated_completion_date);
  const exam = new Date(examDate);
  const isOnTrack = estimatedDate <= exam;
  const formattedEstimatedDate = estimatedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const daysDiff = Math.ceil(
    (estimatedDate.getTime() - exam.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TrendingUp size={20} color="#25D366" />
        <Text style={styles.sectionTitle}>Projection</Text>
      </View>

      <View style={styles.projectionCard}>
        <Text style={styles.projectionLabel}>Estimated Completion</Text>
        <Text style={[styles.projectionDate, { color: isOnTrack ? '#10B981' : '#F59E0B' }]}>
          {formattedEstimatedDate}
        </Text>

        {isOnTrack ? (
          <View style={styles.projectionMessage}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={[styles.projectionText, { color: '#10B981' }]}>
              On track to complete before exam day
            </Text>
          </View>
        ) : (
          <View style={styles.projectionMessage}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={[styles.projectionText, { color: '#F59E0B' }]}>
              {Math.abs(daysDiff)} days behind schedule
            </Text>
          </View>
        )}
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E5E5',
  },
  summaryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  pressureBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pressureText: {
    fontSize: 13,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  planHeader: {
    marginBottom: 12,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    backgroundColor: '#25D36620',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#25D366',
  },
  planSubject: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E5E5',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A9A9A',
  },
  mcqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  mcqLabel: {
    fontSize: 13,
    color: '#9A9A9A',
    fontWeight: '500',
  },
  emptyPlanCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  emptyPlanText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  emptyPlanSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9A9A9A',
  },
  actualsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  totalHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  actualsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  totalHoursValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#25D366',
  },
  actualsList: {
    gap: 8,
  },
  actualItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actualSubject: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  actualHours: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  noActivityText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  past7DaysCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayLabelContainer: {
    width: 60,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E5E5',
  },
  dayDate: {
    fontSize: 11,
    color: '#9A9A9A',
    marginTop: 2,
  },
  dayBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  dayBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dayBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  dayHours: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E5E5',
    marginLeft: 12,
    width: 40,
    textAlign: 'right',
  },
  projectionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  projectionLabel: {
    fontSize: 14,
    color: '#9A9A9A',
    marginBottom: 8,
  },
  projectionDate: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  projectionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
