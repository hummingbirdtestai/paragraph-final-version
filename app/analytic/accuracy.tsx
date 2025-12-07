import { useState, useEffect,useRef  } from 'react';
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
import { supabase } from '@/lib/supabase';
import { AccuracyPerformanceData } from '@/types/accuracy';
import SubjectBubble from '@/components/analytics/SubjectBubble';
import { Target, ArrowLeft } from 'lucide-react-native';
import { useAuth } from "@/contexts/AuthContext";
import MentorBubbleReplyAnalytics from "@/components/analytics/MentorBubbleReplyAnalytics";

export default function AccuracyScreen() {
  const router = useRouter();
  const [accuracyData, setAccuracyData] = useState<AccuracyPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();
  const [mentorComment, setMentorComment] = useState<string | null>(null);
  
  const studentId = user?.id;
  const studentName = user?.full_name || user?.email || "Student";


useEffect(() => {
  if (!user) {
    console.log("⏳ Waiting for user...");
    return;
  }
  fetchAccuracyData();
}, [user]);


  useEffect(() => {
    if (accuracyData) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [accuracyData]);

async function fetchAccuracyData() {
  try {
    console.log("🚀 Fetching accuracy data from API...");
    setLoading(true);
    setError(null);

    const response = await fetch(
      "https://progress-analysis-api-production.up.railway.app/accuracy/analysis",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
        }),
      }
    );

    console.log("📥 API Status:", response.status);
    const json = await response.json();
    console.log("📥 Parsed JSON:", json);

    if (!response.ok) {
      throw new Error(json.detail || "API Error");
    }

    setAccuracyData(json.data);
    setMentorComment(json.mentor_comment);
    setLoading(false);
  } catch (err) {
    console.error("🔥 Fetch Failed:", err);
    setError(err instanceof Error ? err.message : "Failed to load accuracy data");
    setLoading(false);
  }
}


  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Loading your performance...</Text>
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

if (!accuracyData || Object.keys(accuracyData).length === 0) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>No accuracy data available</Text>
    </View>
  );
}


  const subjects = Object.entries(accuracyData).sort((a, b) =>
    b[1].overall_accuracy_percent - a[1].overall_accuracy_percent
  );

  const totalAttempted = subjects.reduce((sum, [_, data]) => sum + data.attempted_mcqs, 0);
  const totalCorrect = subjects.reduce((sum, [_, data]) => sum + data.correct_mcqs, 0);
  const overallAccuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;


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
            <Target size={28} color="#25D366" />
            <Text style={styles.title}>Your Performance</Text>
          </View>
          <Text style={styles.subtitle}>Here's how you're doing across subjects</Text>
        </View>

        <View style={styles.overallCard}>
          <View style={styles.overallStats}>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallValue}>{overallAccuracy.toFixed(1)}%</Text>
              <Text style={styles.overallLabel}>Overall Accuracy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.overallStatItem}>
              <Text style={styles.overallValue}>{totalCorrect}/{totalAttempted}</Text>
              <Text style={styles.overallLabel}>Total MCQs</Text>
            </View>
          </View>
        </View>
      </View>

      <Animated.View style={[styles.scrollContainer, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bubbleContainer}>
          <Text style={styles.sectionHeader}>Subject Performance</Text>

          {subjects.map(([subjectName, subjectData], index) => (
            <SubjectBubble
              key={subjectName}
              subjectName={subjectName}
              data={subjectData}
              delay={index * 50}
            />
          ))}

          {mentorComment && (
  <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
    <MentorBubbleReplyAnalytics markdownText={mentorComment} />
  </View>
)}


          <View style={{ height: 16 }} />
        </ScrollView>
      </Animated.View>
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
  headerContent: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 40,
  },
  overallCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
  overallValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#25D366',
    marginBottom: 4,
  },
  overallLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  scrollContainer: {
    flex: 1,
  },
  bubbleContainer: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginHorizontal: 16,
    marginBottom: 12,
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
