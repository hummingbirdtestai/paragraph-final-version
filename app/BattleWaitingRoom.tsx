//BATTLEWAITINGROOM
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Flame, Zap, Trophy, Users, Clock, Swords, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { AnimatedAvatar } from '@/components/battle/AnimatedAvatar';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

interface BattleParticipant {
  id: string;
  battle_id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  joined_at: string;
  status: 'joined' | 'left';
}

const { width, height } = Dimensions.get('window');



const AVATAR_COLORS = [
  '#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#6BCF7F',
  '#4ECDC4', '#45B7D1', '#5F27CD', '#A55EEA', '#FF6348'
];

interface BattleMessage {
  id: string;
  username: string;
  message: string;
  message_type: 'join' | 'leave' | 'chat' | 'reaction';
  created_at: string;
}

function getAvatarColor(username: string): string {
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function calculateTimeRemaining(scheduledAt: string | null | undefined) {
  if (!scheduledAt) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const scheduledTime = new Date(scheduledAt).getTime();
  if (isNaN(scheduledTime)) {
    console.warn('⚠️ Invalid scheduledAt:', scheduledAt);
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const now = Date.now();
  const diff = scheduledTime - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total: diff };
}


export default function BattleWaitingRoom() {
  const mountedRef = useRef(false);
  const { battleId, title,status  } = useLocalSearchParams();
  console.log("🟢 [BWR] Mounted with battleId =", battleId);
  const { user, session } = useAuth(); 
  const [battle, setBattle] = useState<any | null>(null);
  const [participants, setParticipants] = useState<BattleParticipant[]>([]);
  const [messages, setMessages] = useState<BattleMessage[]>([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [canJoin, setCanJoin] = useState(false);
  const [isUrgentMode, setIsUrgentMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);

  const confettiRef = useRef<any>(null);
  const tickSoundRef = useRef<Audio.Sound | null>(null);
  const joinSoundRef = useRef<Audio.Sound | null>(null);
  const mockParticipantCounter = useRef(6);
  const userId = user?.id;                      // UUID from Supabase Auth
  const username =
   user?.user_metadata?.name ||
   user?.name ||
   user?.phone ||
   'Anonymous';


useEffect(() => {
  if (mountedRef.current) return;
  mountedRef.current = true;
  if (!battleId) return;


  // ✅ 2️⃣ Auto-join user ONLY if not already joined
  (async () => {
    try {
      if (!userId || !battleId) return;

      const { data: existing } = await supabase
        .from('battle_participants')
        .select('status')
        .eq('battle_id', battleId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing?.status === 'joined') {
        console.log("🟢 Already joined → skip re-upsert");
        setHasJoined(true);
        return;
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      const displayName = userProfile?.name || username || 'Anonymous';
      const { error: joinError } = await supabase
        .from('battle_participants')
        .upsert(
          {
            battle_id: battleId,
            user_id: userId,
            username: displayName,
            avatar_url: '',
            status: 'joined',
          },
          { onConflict: 'battle_id,user_id' }
        );

      if (joinError) throw joinError;
      setHasJoined(true);
      console.log("✅ Auto-joined battle:", battleId);

      // ✅ if active, move to WarRoom
      if (status === 'active') {
        console.log("🚀 [BWR] Battle is ACTIVE → navigating straight to WarRoom");
        router.replace({
          pathname: '/WarRoom',
          params: { battleId, title },
        });
      } else {
        console.log("🕒 [BWR] Battle is UPCOMING → staying in WaitingRoom");
      }

    } catch (error) {
      console.error("❌ [BWR] Auto-join failed:", error);
    }
  })();

  // ✅ 3️⃣ Fetch battle details after subscription
  (async () => {
    try {
      console.log("🧠 [BWR] Step 3: Fetching battle_schedule row for this battle...");
      const { data, error } = await supabase
        .from('battle_schedule')
        .select('*')
        .eq('battle_id', battleId)
        .single();

      if (error) throw error;

      // 🕒 Fix missing ISO timestamps if needed
      let fixedBattle = data;
      if (data && !data.scheduled_at && data.scheduled_date && data.scheduled_time) {
        const localDateTime = `${data.scheduled_date}T${data.scheduled_time}`;
        const isoTime = new Date(localDateTime).toISOString();
        fixedBattle = { ...data, scheduled_at: isoTime };
        console.log('🕒 Reconstructed scheduled_at:', isoTime);
      } else if (!data.scheduled_at) {
        console.error('⚠️ battle.scheduled_at missing or invalid:', data);
      }

      setBattle(fixedBattle);
      console.log("📅 [BWR] Step 4: Battle data set with scheduled_at =", fixedBattle?.scheduled_at);
    } catch (err) {
      console.error('❌ Fetch battle error:', err);
    }
  })();

  // 🧹 Cleanup
  return () => {
  mountedRef.current = false;
};
}, []);  // 👈 empty dependency array

useEffect(() => {

  if (Platform.OS !== 'web') {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }

  return () => {
    tickSoundRef.current?.unloadAsync();
    joinSoundRef.current?.unloadAsync();
  };
}, []);


  const playTickSound = useCallback(async () => {
    if (Platform.OS === 'web') return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
        { shouldPlay: true, volume: 0.3 }
      );
      tickSoundRef.current = sound;
    } catch (error) {
      console.log('Sound play error:', error);
    }
  }, []);


  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const fetchParticipants = useCallback(async (battleId: string) => {
    try {
      const { data, error } = await supabase
        .from('battle_participants')
        .select('*')
        .eq('battle_id', battleId)
        .eq('status', 'joined')
        .order('joined_at', { ascending: true });

      if (error) throw error;
      setParticipants(data || []);

      const userParticipant = data?.find(p => p.user_id === userId);
      setHasJoined(!!userParticipant);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, []);

useEffect(() => {
  if (!battle?.battle_id) return;

  fetchParticipants(battle.battle_id);

  const interval = setInterval(() => {
    fetchParticipants(battle.battle_id);
  }, 10000); // every 10s refresh participants

  return () => clearInterval(interval);
}, [battle]);

useEffect(() => {
  if (!battle) return;
  if (battleStarted) return;

  const interval = setInterval(() => {
    console.log("⏳ [BWR] Step 5: Countdown tick →",     `${String(timeRemaining.hours).padStart(2,"0")}:${String(timeRemaining.minutes).padStart(2,"0")}:${String(timeRemaining.seconds).padStart(2,"0")}`
   );
    const remaining = calculateTimeRemaining(battle.scheduled_at);
    setTimeRemaining(remaining);

    // ⚡ Urgent mode feedback (haptic + ticking)
    if (remaining.total <= 30000 && remaining.total > 0) {
      if (!isUrgentMode) {
        setIsUrgentMode(true);
        triggerHaptic();
      }
      if (remaining.seconds % 5 === 0 && remaining.seconds !== 0) {
        playTickSound();
      }
    }
if (remaining.total <= 0 && !battleStarted) {

  console.log("⏰ Countdown reached zero");

  // ⛔ If no participants → do NOT move to battle
  if (participants.length === 0) {
    console.log("⛔ No participants → staying in waiting room");
    return;
  }

  // ⚔️ Battle time has arrived → move to WarRoom
  console.log("🚀 Countdown zero → navigating to WarRoom");


  router.replace({
    pathname: "/WarRoom",
    params: { battleId: battle.battle_id, title: battle.title },
  });

  clearInterval(interval);
}




  }, 1000);

  return () => clearInterval(interval);
}, [battle, battleStarted, isUrgentMode, playTickSound, triggerHaptic, participants]);


const handleJoinLeave = async () => {
  if (!battle) return;
  console.log("⚔️ [BWR] handleJoinLeave() → hasJoined =", hasJoined);
console.log("👤 [BWR] userId =", userId, "| battleId =", battle?.battle_id);


  try {
    // 🧩 Get user display name from profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.warn('⚠️ Failed to fetch user name:', profileError.message);
    }

    const displayName = userProfile?.name || username || 'Anonymous';
    console.log("🟩 [BWR] Joined battle successfully:", displayName);


    if (hasJoined) {
      // 🟥 LEAVE battle
      const { error: leaveError } = await supabase
        .from('battle_participants')
        .update({ status: 'left' })
        .eq('battle_id', battle.battle_id)
        .eq('user_id', userId);

      if (leaveError) throw leaveError;
      console.log("🟥 [BWR] Left battle successfully");


      setHasJoined(false);
    } else {
      // 🟩 JOIN battle (or rejoin if record already exists)
      const { error: joinError } = await supabase
        .from('battle_participants')
        .upsert({
          battle_id: battle.battle_id,
          user_id: userId,
          username: displayName,
          avatar_url: '',
          status: 'joined',
            },
    { onConflict: 'battle_id,user_id' }  // ✅ prevents duplicate insert
  );

      if (joinError) throw joinError;

      setHasJoined(true);
    }

    // 🎉 UX feedback
    setShowConfetti(true);
    confettiRef.current?.start();
    triggerHaptic();
    setTimeout(() => setShowConfetti(false), 3000);
  } catch (error) {
    console.error('❌ Error joining/leaving battle:', error);
  }
};

  if (!battle) {
    return (
      <View style={styles.container}>
        <MotiView
          style={styles.loadingContainer}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600 }}
        >
          <Flame size={48} color="#FF6B35" />
          <Text style={styles.loadingText}>Loading Battle...</Text>
        </MotiView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={100}
          origin={{ x: width / 2, y: height / 2 }}
          autoStart={false}
          fadeOut={true}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/battle')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <MotiView
          style={styles.header}
          from={{ translateY: -20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <MotiView
            style={styles.titleContainer}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              loop: true,
              type: 'timing',
              duration: 2000,
            }}
          >
            <Swords size={32} color="#FF00FF" strokeWidth={2.5} />
            <Text style={styles.title}>Next Battle</Text>
          </MotiView>
        </MotiView>

        <MotiView
          style={[styles.timerCard, isUrgentMode && styles.urgentCard]}
          animate={{
            borderColor: isUrgentMode ? ['#FF0000', '#FF00FF', '#FF0000'] : '#2D2D2D',
            scale: isUrgentMode ? [1, 1.02, 1] : 1,
          }}
          transition={{
            loop: isUrgentMode,
            type: 'timing',
            duration: isUrgentMode ? 500 : 0,
          }}
        >
          <View style={styles.timerHeader}>
            <Clock size={24} color={isUrgentMode ? '#FF0000' : '#00D9FF'} />
            <Text style={[styles.timerLabel, isUrgentMode && styles.urgentText]}>
              {isUrgentMode ? '⚡ STARTING SOON!' : 'Battle Starts In'}
            </Text>
          </View>

          <View style={styles.timerDisplay}>
            <MotiView
              style={styles.timerUnit}
              animate={{
                scale: isUrgentMode && timeRemaining.hours === 0 && timeRemaining.minutes === 0 ? [1, 1.2, 1] : 1,
              }}
              transition={{
                loop: isUrgentMode,
                type: 'timing',
                duration: 1000,
              }}
            >
              <MotiText
                style={[styles.timerNumber, isUrgentMode && styles.urgentNumber]}
                animate={{
                  color: isUrgentMode ? ['#FFFFFF', '#FF0000', '#FFFFFF'] : '#FFFFFF',
                }}
                transition={{
                  loop: isUrgentMode,
                  type: 'timing',
                  duration: 1000,
                }}
              >
                {String(timeRemaining.hours).padStart(2, '0')}
              </MotiText>
              <Text style={styles.timerUnitLabel}>Hours</Text>
            </MotiView>

            <Text style={styles.timerSeparator}>:</Text>

            <MotiView
              style={styles.timerUnit}
              animate={{
                scale: isUrgentMode && timeRemaining.hours === 0 && timeRemaining.minutes === 0 ? [1, 1.2, 1] : 1,
              }}
              transition={{
                loop: isUrgentMode,
                type: 'timing',
                duration: 1000,
              }}
            >
              <MotiText
                style={[styles.timerNumber, isUrgentMode && styles.urgentNumber]}
                animate={{
                  color: isUrgentMode ? ['#FFFFFF', '#FF0000', '#FFFFFF'] : '#FFFFFF',
                }}
                transition={{
                  loop: isUrgentMode,
                  type: 'timing',
                  duration: 1000,
                }}
              >
                {String(timeRemaining.minutes).padStart(2, '0')}
              </MotiText>
              <Text style={styles.timerUnitLabel}>Minutes</Text>
            </MotiView>

            <Text style={styles.timerSeparator}>:</Text>

            <MotiView
              style={styles.timerUnit}
              animate={{
                scale: isUrgentMode && timeRemaining.hours === 0 && timeRemaining.minutes === 0 ? [1, 1.2, 1] : 1,
              }}
              transition={{
                loop: isUrgentMode,
                type: 'timing',
                duration: 1000,
              }}
            >
              <MotiText
                style={[styles.timerNumber, isUrgentMode && styles.urgentNumber]}
                animate={{
                  color: isUrgentMode ? ['#FFFFFF', '#FF0000', '#FFFFFF'] : '#FFFFFF',
                }}
                transition={{
                  loop: isUrgentMode,
                  type: 'timing',
                  duration: 1000,
                }}
              >
                {String(timeRemaining.seconds).padStart(2, '0')}
              </MotiText>
              <Text style={styles.timerUnitLabel}>Seconds</Text>
            </MotiView>
          </View>

          <View style={styles.battleInfo}>
            <Trophy size={18} color="#FFD700" />
            <Text style={styles.battleTitle}>{battle.title}</Text>
          </View>

          {battle.description && (
            <Text style={styles.battleDescription}>{battle.description}</Text>
          )}
        </MotiView>

        <MotiView
          style={styles.motivationContainer}
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
        >
          <Flame size={20} color="#FF6B35" />
          <Text style={styles.motivationText}>
            {participants.length > 0
              ? `${participants.length} warriors ready to battle!`
              : 'Be the first to join the arena!'}
          </Text>
          <Zap size={20} color="#FFD93D" />
        </MotiView>

        <View style={styles.playersSection}>

          {participants.length === 0 ? (
            <MotiView
              style={styles.emptyState}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600 }}
            >
              <Trophy size={48} color="#4A4A4A" />
              <Text style={styles.emptyStateText}>Waiting for warriors to join...</Text>
            </MotiView>
          ) : (
            <View style={styles.playersGrid}>
              {participants.map((participant, index) => (
                <AnimatedAvatar
                  key={participant.id}
                  name={participant.username}
                  color={getAvatarColor(participant.username)}
                  delay={index * 100}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
       <TouchableOpacity
  style={[
    styles.actionButton,
    hasJoined ? styles.leaveButton : styles.joinButton,
  ]}
  onPress={handleJoinLeave}
  activeOpacity={0.8}
>
  <MotiView
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ loop: true, type: 'timing', duration: 2000 }}
  >
    {!hasJoined && <Zap size={24} color="#FFFFFF" />}
  </MotiView>

  <Text style={styles.actionButtonText}>
    {hasJoined ? 'Leave Battle' : 'Join Battle'}
  </Text>
  <Text style={styles.actionButtonSubtext}>
    {hasJoined ? "You're in!" : 'Tap to enter the arena'}
  </Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  battleStartingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    padding: 40,
  },
  battleStartingText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF00FF',
    textAlign: 'center',
  },
  battleStartingSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00D9FF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timerCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  urgentCard: {
    backgroundColor: '#1A0A0A',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9FF',
  },
  urgentText: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: '800',
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 70,
  },
  timerNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 50,
  },
  urgentNumber: {
    fontSize: 48,
  },
  timerUnitLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888888',
    marginTop: 4,
  },
  timerSeparator: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF00FF',
    marginHorizontal: 8,
  },
  battleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  battleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  battleDescription: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 8,
  },
  joinWindowNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
  },
  joinWindowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD93D',
    textAlign: 'center',
    flex: 1,
  },
  activityFeed: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00D9FF',
  },
  activityMessage: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    marginBottom: 8,
  },
  activityMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  playersSection: {
    marginBottom: 20,
  },
  playersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  playersSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  playerCard: {
    width: (width - 64) / 3,
    maxWidth: 120,
    minWidth: 100,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    position: 'relative',
  },
  playerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  topBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
    padding: 20,
    paddingBottom: 24,
  },
  actionButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  joinButton: {
    backgroundColor: '#222222', // dark neutral tone to match background
    shadowColor: '#000000',
    borderWidth: 1,
    borderColor: '#333333',
  },
  leaveButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  disabledButton: {
    backgroundColor: '#4A4A4A',
    shadowColor: '#000000',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  actionButtonSubtext: {
    position: 'absolute',
    bottom: -18,
    fontSize: 12,
    fontWeight: '500',
    color: '#888888',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#FFD93D',
    fontSize: 16,
    fontWeight: '700',
  },
});