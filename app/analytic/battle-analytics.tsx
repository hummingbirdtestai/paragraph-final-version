import { View, StyleSheet, useWindowDimensions, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import BattleMobile from '@/components/analytics/BattleMobile';
import BattleTable from '@/components/analytics/BattleTable';
import { MOCK_BATTLE_DATA } from '@/data/battleData';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function BattleAnalyticsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

const [battles, setBattles] = useState<any[]>([]);
const [mentorComment, setMentorComment] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchBattleStats();
}, []);

async function fetchBattleStats() {
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
      "https://progress-analysis-api-production.up.railway.app/battle/battle_stats",
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

    setBattles(json.data ?? []);
    setMentorComment(json.mentor_comment ?? null);

  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load battle stats");
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
        <Text style={styles.headerTitle}>Battle Stats</Text>
        <Text style={styles.headerSubtitle}>Your battle performance by subject</Text>
      </View>
      {isDesktop ? (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
    <BattleTable battles={battles} />

    {mentorComment && (
      <View
        style={{
          padding: 24,
          marginTop: 24,
          backgroundColor: "#1f2937",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <Text style={{ color: "#e5e7eb", fontSize: 18, lineHeight: 26 }}>
          {mentorComment}
        </Text>
      </View>
    )}
  </ScrollView>
) : (
  <ScrollView style={{ flex: 1 }}>
    <BattleMobile battles={battles} />
    {mentorComment && (
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#fff", fontSize: 16, lineHeight: 22 }}>
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
