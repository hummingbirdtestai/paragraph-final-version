import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, useWindowDimensions } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Plus } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';


const API_BASE_URL = "https://battlemcqs-production.up.railway.app";

// 🎯 1️⃣ Subject icon pools (rotate daily)
const SHOW_ICON_POOL: Record<string, string[]> = {
  "Anato-Physio Dangal": ["💪", "🫀", "🧠", "🫁", "🦴", "⚡", "🩻"],
  "Biochem Bazaar": ["⚗️", "🧬", "🧪", "🔥", "💧", "🧫", "🔬"],
  "Microbe Mela": ["🦠", "🧫", "🧬", "🧤", "🧪", "🧫", "🧬"],
  "Patho Premier League": ["🔬", "💀", "🧠", "🩸", "🧫", "🧬", "📊"],
  "Pharma Dhamaka": ["💊", "💉", "⚗️", "🧴", "💥", "🧠", "🔬"],
  "ENT-Ophthal Adda": ["👂", "👁️", "🎧", "🕶️", "🔊", "🩺", "📡"],
  "Derma-Radio Showdown": ["📸", "🩻", "💅", "🧴", "🎨", "🧠", "⚡"],
  "Medicine Mahayudh": ["🩺", "🫀", "🫁", "🧠", "💊", "💥", "🧬"],
  "Surgical League": ["⚔️", "🔪", "🏥", "🩸", "🧤", "💉", "🦴"],
  "Ob-Gyn Mahasangram": ["👶", "🤰", "🌸", "🩺", "💖", "🍼", "💞"],
  "Pedo-Ortho Arena": ["🦴", "🧸", "🍼", "💪", "🏋️‍♂️", "🦿", "🎯"],
  "Mind-Mask Mania": ["🧠", "💤", "🎭", "🤯", "🌙", "🧘‍♂️", "⚙️"],
  "Forensic Face-Off": ["🔍", "💀", "🧬", "⚖️", "🕵️‍♂️", "🩸", "🔬"]
};

// ✨ 2️⃣ Clean title helper — strips emojis and extra symbols
const cleanTitle = (title: string) => title.replace(/[^\w\s-]/g, '').trim();

// ✨ 3️⃣ Function to pick today’s icon
const getShowIcon = (title: string): string => {
  const key = cleanTitle(title);
  const icons = SHOW_ICON_POOL[key] || ["🎯"];
  const today = new Date().getDay(); // rotates 0–6
  return icons[today % icons.length];
};


interface Battle {
  id: number; // bigint
  battle_id: string; // uuid
  title: string;
  description: string;
  scheduled_at: string;
  status: 'waiting' | 'active' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
}




const BattleListScreen = ({ onJoinBattle, onBack }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [refreshing, setRefreshing] = useState(false);
  const [battles, setBattles] = useState<Battle[]>([]);
  const { user } = useAuth();
  
  // ✅ Add this helper function
  const getClosestJoinableBattle = (battleList: Battle[]) => {
    const now = new Date();
  
    // Sort chronologically
    const sorted = [...battleList].sort(
      (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    );
  
    // 1️⃣ Prefer active battle
    const active = sorted.find((b) => b.status === 'active');
    if (active) return active;
  
    // 2️⃣ If none active, find the closest upcoming (future) one
    const upcoming = sorted.find((b) => new Date(b.scheduled_at).getTime() > now.getTime());
    return upcoming || null;
  };


// ✅ Fetch battles from Supabase RPC
const fetchBattles = async () => {
  try {
    const { data, error } = await supabase.rpc('get_battle_schedule_for_now');

    if (error) {
      console.error('❌ RPC Error:', error.message);
      return;
    }

    if (data) {
      // Map Supabase response to your Battle type
      const formatted = data.map((item: any, index: number) => ({
         id: item.id, 
        battle_id: item.battle_id || `battle-${index}`,
        title: item.title,
        description: item.title, // no desc in DB, reuse title
        scheduled_at: `${item.scheduled_date}T${item.scheduled_time}`,
        status:
          item.status === 'Active'
            ? 'active'
            : item.status === 'Upcoming'
            ? 'waiting'
            : 'completed',
        difficulty: ['easy', 'medium', 'hard'][index % 3], // mock rotation for now
      }));

      setBattles(formatted);
      
    }
  } catch (e) {
    console.error('🔥 Fetch Battles Error:', e);
  }
};

const onRefresh = async () => {
  setRefreshing(true);
  await fetchBattles();
  setRefreshing(false);
};

useEffect(() => {
  fetchBattles();
}, []);



  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const isStartingSoon = (isoString: string) => {
    const now = new Date().getTime();
    const battleTime = new Date(isoString).getTime();
    const diff = battleTime - now;
    return diff > 0 && diff <= 15 * 60 * 1000;
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🏆';
      case 'medium':
        return '⚔️';
      case 'hard':
        return '🧠';
      default:
        return '⚡';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: '🔥 Active', color: '#FF6348' };
      case 'waiting':
        return { text: '⏳ Upcoming', color: '#00D9FF' };
      default:
        return { text: '✅ Done', color: '#4CAF50' };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FFB800';
      case 'hard':
        return '#FF6348';
      default:
        return '#00D9FF';
    }
  };
const handleBattlePress = async (battle: Battle) => {
  console.log("🖱️ [BattleList] Pressed:", battle.title, battle.battle_id);
  const battleId = battle.battle_id;
  const userId = user?.id;

  if (!userId) {
    console.error("❌ No user found");
    return;
  }

  // Get name from public.users table instead of auth metadata
let displayName = user?.phone || "Anonymous";

const { data: profile } = await supabase
  .from("users")
  .select("name")
  .eq("id", userId)
  .maybeSingle();

if (profile?.name) {
  displayName = profile.name;
}


  // ***************************************
  // 1️⃣ CLEAN HELPER → ensure participant row exists
  // ***************************************
  const ensureParticipant = async () => {
    // 🔍 Check if row exists
    const { data: existing, error: readErr } = await supabase
      .from("battle_participants")
      .select("id, status")
      .eq("battle_id", battleId)
      .eq("user_id", userId)
      .maybeSingle();

    if (readErr) {
      console.error("❌ Read Error:", readErr);
      return;
    }

    // 🟦 If exists but status = left → join again
    if (existing && existing.status === "left") {
      const { error: updateErr } = await supabase
        .from("battle_participants")
        .update({ status: "joined" })
        .eq("id", existing.id);

      if (updateErr) console.error("❌ Update status Error:", updateErr);
      else console.log("🟦 Rejoined existing participant");
      return;
    }

    // 🟩 If row does NOT exist → create fresh
    if (!existing) {
      const { error: insertErr } = await supabase
        .from("battle_participants")
        .insert({
          battle_id: battleId,
          user_id: userId,
          username: displayName,
          status: "joined",
        });

      if (insertErr) console.error("❌ Insert Error:", insertErr);
      else console.log("🟩 New participant created");
    }
  };

  // ***************************************
  // 2️⃣ ACTIVE STATUS — must join WarRoom
  // ***************************************
  if (battle.status === "active") {
  await ensureParticipant();

  router.replace({
    pathname: "/WarRoom",
    params: {
      battleId,
      title: battle.title,
      status: battle.status,
    },
  });
  return;
}


  // ***************************************
  // 3️⃣ WAITING ROOM — normal countdown flow
  // ***************************************
  if (battle.status === "waiting") {
    await ensureParticipant();
    router.push({
      pathname: "/BattleWaitingRoom",
      params: {
        battleId,
        title: battle.title,
        status: battle.status,
      },
    });
    return;
  }

  // ***************************************
  // 4️⃣ COMPLETED — show toast only
  // ***************************************
  if (battle.status === "completed") {
    setToastMessage("🏁 This battle has already ended!");
    setTimeout(() => setToastMessage(null), 3000);
    return;
  }
};




  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity
  onPress={() => {
    router.back();  // 🔥 your subject dropdown list screen
  }}
>
  <Text style={{ color: "#00D9FF", fontSize: 16 }}>⬅ Back</Text>
</TouchableOpacity>

  <Text style={styles.headerTitle}>🕹️ Today's Battles</Text>
</View>


      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D9FF" />}
      >
        {battles.map((battle, index) => {
          const startingSoon = isStartingSoon(battle.scheduled_at);
          const statusBadge = getStatusBadge(battle.status);
          const difficultyColor = getDifficultyColor(battle.difficulty);

          return (
            <MotiView
              key={battle.battle_id}
              from={{ opacity: 0, translateY: 20, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{
                type: 'timing',
                duration: 400,
                delay: index * 80,
              }}
            >
              <TouchableOpacity
                style={styles.battleCard}
                onPress={() => handleBattlePress(battle)}
                activeOpacity={0.7}
              >
                <MotiView
                  animate={{
                    shadowOpacity: startingSoon ? [0.3, 0.7, 0.3] : 0.2,
                    borderColor: startingSoon ? [difficultyColor, '#FFFFFF', difficultyColor] : '#2D2D2D',
                  }}
                  transition={{
                    loop: startingSoon,
                    type: 'timing',
                    duration: 2000,
                  }}
                  style={[
                    styles.cardInner,
                    {
                      shadowColor: difficultyColor,
                      borderColor: startingSoon ? difficultyColor : '#2D2D2D',
                      flexDirection: isMobile ? 'column' : 'row',
                     alignItems: isMobile ? 'center' : 'flex-start',
                      justifyContent: isMobile ? 'center' : 'flex-start',
                      textAlign: isMobile ? 'center' : 'left',


                      padding: isMobile ? 16 : 20,
                      gap: isMobile ? 10 : 20,
                    },
                  ]}
                >
                  {startingSoon && (
  <MotiView
          from={{ opacity: 0.2, scale: 0.95 }}
          animate={{ opacity: 0.6, scale: 1.05 }}
          transition={{ loop: true, duration: 1500 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: difficultyColor,
            opacity: 0.4,
          }}
        />
      )}

                  <View style={[styles.iconCircle, { backgroundColor: `${difficultyColor}20`, alignSelf: isMobile ? 'center' : 'auto' }]}>
                    <Text style={styles.iconEmoji}>
                      {getShowIcon(battle.title)}
                    </Text>
                  </View>

                  <View style={[styles.battleInfo, { alignItems: isMobile ? 'center' : 'flex-start' }]}>
                    <Text style={[styles.battleTitle, { textAlign: isMobile ? 'center' : 'left' }]} numberOfLines={1}>
                      {battle.title}
                    </Text>
                      <View style={[styles.timeContainer, { alignSelf: isMobile ? 'center' : 'auto' }]}>
                        <Text style={styles.timeText}>{formatTime(battle.scheduled_at)}</Text>
                        <Text style={styles.dateText}>{formatDate(battle.scheduled_at)}</Text>
                      </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: `${statusBadge.color}20`, alignSelf: isMobile ? 'center' : 'auto' }]}>
                    <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>{statusBadge.text}</Text>
                  </View>
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          );
        })}
      </ScrollView>

      {toastMessage && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 20 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.toastContainer}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </MotiView>
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0F0F0F',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  battleCard: {
    marginBottom: 16,
  },
  cardInner: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 28,
  },
  battleInfo: {
    flex: 1,
    gap: 4,
  },
  battleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  battleSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888888',
  },
  timeContainer: {
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: 8,
  marginTop: 4,
},

timeText: {
  fontSize: 22,
  fontWeight: '800',
  color: '#00D9FF', // neon cyan
  letterSpacing: 0.5,
},

dateText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFD93D', // warm yellow accent
},
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    color: '#FFD93D',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  activeJoinCard: {
  position: 'absolute',
  bottom: 80,
  left: 20,
  right: 20,
  maxWidth: 480,       // ✅ keeps nice width on wide screens
  alignSelf: 'center',
  backgroundColor: '#1A1A1A',
  borderRadius: 16,
  padding: 20,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#00D9FF40',
  shadowColor: '#00D9FF',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
},
activeJoinTitle: {
  fontSize: 18,
  fontWeight: '800',
  color: '#FFFFFF',
  marginBottom: 6,
},
activeJoinText: {
  fontSize: 14,
  color: '#BBBBBB',
  marginBottom: 20,
  textAlign: 'center',
},
joinButton: {
  backgroundColor: '#00D9FF',
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 30,
  marginBottom: 10,
},
joinText: {
  color: '#0F0F0F',
  fontWeight: '800',
  fontSize: 16,
},
cancelText: {
  color: '#888888',
  fontSize: 14,
  fontWeight: '600',
  marginTop: 4,
},
});

export default BattleListScreen;
