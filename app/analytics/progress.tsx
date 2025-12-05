import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { ProgressMasteryData } from '@/types/progress';
import ProgressCard from '@/components/analytics/ProgressCard';
import ProgressTable from '@/components/analytics/ProgressTable';
import MentorBubbleReplyAnalytics from "@/components/analytics/MentorBubbleReplyAnalytics";
import { useAuth } from "@/contexts/AuthContext";

export default function ProgressScreen() {
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressMasteryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const [mentorComment, setMentorComment] = useState<string | null>(null);
  const { user } = useAuth();

  const studentId = user?.id;
  const studentName = user?.full_name || user?.email || "Student";

  const isDesktop = width >= 1024;

  useEffect(() => {
    console.log("🔍 Auth Loaded User:", user);

    if (!user) {
      console.log("⏳ Waiting for user to load...");
      return;
    }

    fetchProgressData();
  }, [user]);

  async function fetchProgressData() {
    try {
      console.log("🚀 Fetching progress from API...");
      console.log("📤 Payload:", { studentId, studentName });

      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://progress-analysis-api-production.up.railway.app/progress/analysis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            student_name: studentName,
          }),
        }
      );

      console.log("📥 API Raw Response Status:", response.status);

      const json = await response.json();
      console.log("📥 API Parsed JSON:", json);

      if (!response.ok) {
        console.log("❌ API Error:", json.detail);
        throw new Error(json.detail || "API Error");
      }

      console.log("📊 Progress Data Received:", json.data);
      console.log("💬 Mentor Comment Received:", json.mentor_comment);

      setProgressData(json.data);
      setMentorComment(json.mentor_comment);

      setLoading(false);
    } catch (err) {
      console.log("🔥 Fetch Failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load progress");
      setLoading(false);
    }
  }

  if (loading) {
    console.log("⏳ Loading Screen Render");
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  if (error) {
    console.log("❌ Error Screen Render:", error);
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!progressData) {
    console.log("⚠️ No Progress Data Screen Render");
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No progress data available</Text>
      </View>
    );
  }

  const subjects = Object.entries(progressData).sort((a, b) =>
    b[1].completion_percent - a[1].completion_percent
  );

  console.log("📚 Sorted Subjects Count:", subjects.length);

  return (
  <View style={styles.container}>

    {/* HEADER */}
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
      <Text style={styles.title}>Subject Progress</Text>
      <Text style={styles.subtitle}>Track your mastery across all subjects</Text>
    </View>

    {/* BODY SCROLL */}
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >

      {/* SUBJECT PROGRESS TABLE / CARDS */}
      {isDesktop ? (
        <View style={styles.tableWrapper}>
          <ProgressTable data={progressData} />
        </View>
      ) : (
        <View style={styles.cardGrid}>
          {subjects.map(([subjectName, subjectData], index) => {
            console.log(`📌 Render Card: ${index + 1}. ${subjectName}`);
            return (
              <ProgressCard
                key={subjectName}
                subjectName={subjectName}
                data={subjectData}
              />
            );
          })}
        </View>
      )}

      {/* MENTOR FEEDBACK BUBBLE */}
      {mentorComment && (
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          {console.log("💬 Rendering Mentor Bubble")}
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
    backgroundColor: '#0f172a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1e293b',
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tableWrapper: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  cardGrid: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94a3b8',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
