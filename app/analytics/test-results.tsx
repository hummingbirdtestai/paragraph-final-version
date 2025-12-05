import { View, StyleSheet, useWindowDimensions, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react-native';
import TestResultsMobile from '@/components/analytics/TestResultsMobile';
import TestResultsTable from '@/components/analytics/TestResultsTable';
import { supabase } from '@/lib/supabaseClient';
import MentorBubbleReplyAnalytics from "@/components/analytics/MentorBubbleReplyAnalytics";

export default function TestResultsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [tests, setTests] = useState<any[]>([]);
  const [mentorComment, setMentorComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestResults();
  }, []);

  async function fetchTestResults() {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setError("User not logged in");
        return;
      }

      const response = await fetch(
        "https://progress-analysis-api-production.up.railway.app/mocktest/test-results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: user.id,
            student_name: user.user_metadata?.full_name ?? "Student",
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || "API Error");
      }

      setTests(json.data ?? []);
      setMentorComment(json.mentor_comment ?? null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load test results");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
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

        <Text style={styles.headerTitle}>Test Results</Text>
        <Text style={styles.headerSubtitle}>Your mock test performance</Text>
      </View>

      {/* ---------- SCROLLABLE BODY ---------- */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 12 }}
      >
        {/* TABLE OR MOBILE CARDS */}
        <View style={{ paddingHorizontal: 16 }}>
          {isDesktop ? (
            <TestResultsTable tests={tests} />
          ) : (
            <TestResultsMobile tests={tests} />
          )}
        </View>

        {/* ---------- MENTOR COMMENT BUBBLE ---------- */}
        {mentorComment && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <MentorBubbleReplyAnalytics markdownText={mentorComment} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
