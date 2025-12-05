import { View, StyleSheet, useWindowDimensions, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import LeaderboardMobile from '@/components/analytics/LeaderboardMobile';
import LeaderboardTable from '@/components/analytics/LeaderboardTable';
import { MOCK_LEADERBOARD_DATA } from '@/data/leaderboardData';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const leaderboardData = MOCK_LEADERBOARD_DATA[0].get_all_mock_test_leaderboards_for_student[0];

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
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Your rank among peers</Text>
      </View>
      {isDesktop ? (
        <LeaderboardTable data={leaderboardData} />
      ) : (
        <LeaderboardMobile data={leaderboardData} />
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
