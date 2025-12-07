import { View, StyleSheet, useWindowDimensions, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import BattleLeaderboardMobile from '@/components/analytics/BattleLeaderboardMobile';
import BattleLeaderboardTable from '@/components/analytics/BattleLeaderboardTable';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BattleLeaderboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [battles, setBattles] = useState<any[]>([]);
  const [mentorComment, setMentorComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  async function fetchLeaderboards() {
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
        "https://progress-analysis-api-production.up.railway.app/battle/leaderboard",
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
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* -------- Header -------- */}
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

        <Text style={styles.headerTitle}>Battle Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Your rank in battles</Text>
      </View>

      {/* -------- Loading / Error -------- */}
      {loading && <Text style={{ color: "#fff", padding: 20 }}>Loading...</Text>}
      {error && <Text style={{ color: "red", padding: 20 }}>{error}</Text>}

      {/* -------- CONTENT SCROLLVIEW (DESKTOP + MOBILE) -------- */}
      {!loading && !error && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {isDesktop ? (
            <BattleLeaderboardTable battles={battles} />
          ) : (
            <BattleLeaderboardMobile battles={battles} />
          )}

          {/* ---------- Mentor Comment ---------- */}
          {mentorComment && (
            <View
              style={{
                padding: isDesktop ? 24 : 16,
                marginTop: 20,
                backgroundColor: "#1f2937",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#374151",
                marginHorizontal: isDesktop ? 40 : 16,
                marginBottom: 40,
              }}
            >
              <Text style={{ color: "#e5e7eb", fontSize: isDesktop ? 18 : 16, lineHeight: 24 }}>
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
  container: { flex: 1, backgroundColor: '#0f172a' },

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
});
