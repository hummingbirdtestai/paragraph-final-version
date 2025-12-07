import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import MentorBubbleReplyAnalytics from "@/components/analytics/MentorBubbleReplyAnalytics";



interface MasteryData {
  subject_id: string;
  total_decks: number;
  subject_name: string;
  last_activity: string | null;
  completed_decks: number;
  total_bookmarks: number;
  completion_percent: number;
  average_time_per_deck_minutes: number;
  estimated_time_to_complete_all_minutes: number;
}
const API_URL = "https://progress-analysis-api-production.up.railway.app/flashcards/mastery";


export default function MasteryScreen() {
  const router = useRouter();
  const [data, setData] = useState<MasteryData[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
  const [mentorComment, setMentorComment] = useState<string | null>(null);



 useEffect(() => {
  fetchMasteryData();
}, []);

async function fetchMasteryData() {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setError("User not logged in");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: user.id,
        student_name: user.user_metadata?.full_name ?? "Student",
      }),
    });

   const result = await response.json();
setData(result.data ?? []);
setMentorComment(result.mentor_comment ?? null);
  } catch (e) {
    setError("Failed to load data");
  } finally {
    setLoading(false);
  }
}


  const totalDecks = data.reduce((sum, item) => sum + item.total_decks, 0);
  const totalCompleted = data.reduce((sum, item) => sum + item.completed_decks, 0);
  const totalBookmarks = data.reduce((sum, item) => sum + item.total_bookmarks, 0);
  const overallCompletion = totalDecks > 0 ? ((totalCompleted / totalDecks) * 100).toFixed(1) : '0.0';

  const formatTime = (minutes: number) => {
    if (minutes === 0) return '0h';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (loading) {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white', marginTop: 60, textAlign: 'center'}}>Loading...</Text>
    </View>
  );
}

if (error) {
  return (
    <View style={styles.container}>
      <Text style={{color: 'red', marginTop: 60, textAlign: 'center'}}>{error}</Text>
    </View>
  );
}


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#25D366" strokeWidth={2.5} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Flashcard Mastery</Text>
        <Text style={styles.headerSubtitle}>Track your progress across all subjects</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{totalDecks}</Text>
            <Text style={styles.kpiLabel}>Total Decks</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{totalCompleted}</Text>
            <Text style={styles.kpiLabel}>Completed</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#25D366' }]}>{overallCompletion}%</Text>
            <Text style={styles.kpiLabel}>Overall</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{totalBookmarks}</Text>
            <Text style={styles.kpiLabel}>Bookmarks</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colSubject]}>Subject</Text>
            <Text style={[styles.tableHeaderText, styles.colProgress]}>Progress</Text>
            <Text style={[styles.tableHeaderText, styles.colDecks]}>Decks</Text>
            <Text style={[styles.tableHeaderText, styles.colTime]}>Avg Time</Text>
          </View>

          {data.map((item) => (
            <View key={item.subject_id} style={styles.tableRow}>
              <View style={styles.subjectCell}>
                <Text style={styles.subjectName}>{item.subject_name}</Text>
                {item.last_activity && (
                  <Text style={styles.lastActivity}>
                    Last: {new Date(item.last_activity).toLocaleDateString()}
                  </Text>
                )}
              </View>

              <View style={styles.progressCell}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(item.completion_percent, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{item.completion_percent.toFixed(1)}%</Text>
              </View>

              <View style={styles.decksCell}>
                <Text style={styles.decksCompleted}>{item.completed_decks}</Text>
                <Text style={styles.decksDivider}>/</Text>
                <Text style={styles.decksTotal}>{item.total_decks}</Text>
              </View>

              <View style={styles.timeCell}>
                <Text style={styles.timeText}>
                  {formatTime(item.average_time_per_deck_minutes)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Detailed Breakdown</Text>
          {data.map((item) => (
            <View key={item.subject_id} style={styles.summaryItem}>
              <Text style={styles.summarySubject}>{item.subject_name}</Text>
              <View style={styles.summaryDetails}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Decks:</Text>
                  <Text style={styles.summaryValue}>{item.total_decks}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Completed:</Text>
                  <Text style={styles.summaryValue}>{item.completed_decks}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Bookmarks:</Text>
                  <Text style={styles.summaryValue}>{item.total_bookmarks}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Avg Time/Deck:</Text>
                  <Text style={styles.summaryValue}>
                    {formatTime(item.average_time_per_deck_minutes)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Est. Completion:</Text>
                  <Text style={styles.summaryValue}>
                    {formatTime(item.estimated_time_to_complete_all_minutes)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Mentor Feedback */}
{mentorComment && (
  <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
    <MentorBubbleReplyAnalytics markdownText={mentorComment} />
  </View>
)}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#25D366',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  colSubject: {
    flex: 2,
  },
  colProgress: {
    flex: 2,
  },
  colDecks: {
    flex: 1,
    textAlign: 'center',
  },
  colTime: {
    flex: 1,
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  subjectCell: {
    flex: 2,
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: 11,
    color: '#64748B',
  },
  progressCell: {
    flex: 2,
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#25D366',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  decksCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  decksCompleted: {
    fontSize: 14,
    fontWeight: '600',
    color: '#25D366',
  },
  decksDivider: {
    fontSize: 14,
    color: '#64748B',
  },
  decksTotal: {
    fontSize: 14,
    color: '#94A3B8',
  },
  timeCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  summarySubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#25D366',
    marginBottom: 12,
  },
  summaryDetails: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
