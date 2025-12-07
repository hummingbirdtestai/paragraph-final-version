import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';
import { LearningGapData } from '@/types/learning-gap';
import LearningGapCard from '@/components/analytics/LearningGapCard';
import { Brain, ArrowLeft } from 'lucide-react-native';
import MentorBubbleReplyAnalytics from "@/components/analytics/MentorBubbleReplyAnalytics";


const API_URL = "https://progress-analysis-api-production.up.railway.app/learning-gap/analysis"; // 🔥 Replace with real API domain

export default function LearningGapScreen() {
  const router = useRouter();
  const [learningGapData, setLearningGapData] = useState<LearningGapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorComment, setMentorComment] = useState<string | null>(null);

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchLearningGapData();
  }, []);

  useEffect(() => {
    if (learningGapData) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [learningGapData]);

  async function fetchLearningGapData() {
    try {
      setLoading(true);
      setError(null);

      // 🔥 Get logged-in user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const student_id = user.id;
      const student_name = user.user_metadata?.full_name ?? "Student";

      // 🔥 POST request to FastAPI
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          student_name,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error("API error: " + text);
      }

      const result = await response.json();

setLearningGapData(result.data ?? null);
setMentorComment(result.mentor_comment ?? null);

setLoading(false);


    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load learning gap data');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!learningGapData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No learning gap data available</Text>
      </View>
    );
  }

  const subjects = Object.entries(learningGapData).sort((a, b) =>
    b[1].time_stress_index - a[1].time_stress_index
  );

  const avgTimeStress = subjects.reduce((sum, [_, data]) => sum + data.time_stress_index, 0) / subjects.length;

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

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Brain size={28} color="#25D366" />
            <Text style={styles.title}>Learning Gap Analytics</Text>
          </View>
          <Text style={styles.subtitle}>Time stress and error patterns</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{avgTimeStress.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Avg Stress Index</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{subjects.length}</Text>
            <Text style={styles.summaryLabel}>Subjects Analyzed</Text>
          </View>
        </View>
      </View>

      <Animated.View style={[styles.scrollContainer, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContainer}>
          
          {subjects.map(([subjectName, subjectData]) => (
            <LearningGapCard
              key={subjectName}
              subjectName={subjectName}
              data={subjectData}
            />
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Data-driven insights for targeted improvement
            </Text>
          </View>
          {/* Mentor Feedback */}
          {mentorComment && (
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <MentorBubbleReplyAnalytics markdownText={mentorComment} />
            </View>
          )}

        </ScrollView>
      </Animated.View>
    </View>
  );
}


/* -------------------- STYLES UNCHANGED -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 16, paddingVertical: 8,
    paddingHorizontal: 12, alignSelf: 'flex-start', borderRadius: 8,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
  },
  backText: { fontSize: 16, fontWeight: '600', color: '#25D366' },
  headerContent: { marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#f8fafc' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginLeft: 40 },
  summaryCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: '#374151', marginHorizontal: 12 },
  summaryValue: { fontSize: 28, fontWeight: '700', color: '#25D366', marginBottom: 4 },
  summaryLabel: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  scrollContainer: { flex: 1 },
  cardContainer: { paddingTop: 16, paddingBottom: 32 },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 13, color: '#6b7280' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#94a3b8' },
  errorText: { fontSize: 16, color: '#ef4444', textAlign: 'center', paddingHorizontal: 20 },
});
