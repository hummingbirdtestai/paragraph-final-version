import { View, StyleSheet, useWindowDimensions, ScrollView, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import MobileView from '@/components/analytics/MobileView';
import WebView from '@/components/analytics/WebView';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [examData, setExamData] = useState<any[]>([]);
  const [mentorComment, setMentorComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMockTestPerformance();
  }, []);

  async function fetchMockTestPerformance() {
    try {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://progress-analysis-api-production.up.railway.app/mocktest/performance",
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
      if (!response.ok) throw new Error(json.detail || "API Error");

      setExamData(json.data ?? []);
      setMentorComment(json.mentor_comment ?? null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load performance data");
    } finally {
      setLoading(false);
    }
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

        <Text style={styles.headerTitle}>Performance Analytics</Text>
        <Text style={styles.headerSubtitle}>Mock test performance insights</Text>
      </View>

      {isMobile ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <MobileView data={examData} />

          {mentorComment && (
            <View style={{ padding: 16 }}>
              <Text style={{ color: "#fff", fontSize: 16, lineHeight: 22 }}>
                {mentorComment}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        // ============================
        // ✅ UPDATED DESKTOP VERSION
        // ============================
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          <WebView data={examData} />

          {mentorComment && (
            <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
              <Text
                style={{
                  color: "#e5e7eb",
                  fontSize: 18,
                  lineHeight: 26,
                  backgroundColor: "#1f2937",
                  padding: 20,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#374151",
                }}
              >
                {mentorComment}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
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
  backButtonPressed: { backgroundColor: 'rgba(37, 211, 102, 0.1)' },
  backText: { fontSize: 16, fontWeight: '600', color: '#25D366' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#94a3b8' },
  scrollView: { flex: 1 },
});
