//WARROOM
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MotiView, MotiText, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Users, Clock, Trophy } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabaseClient';
import Markdown from "react-native-markdown-display";
import { ArrowLeft } from 'lucide-react-native';

const API_BASE_URL = "https://battlemcqs-production.up.railway.app";

export const APPLAUSE_SOUNDS = [
  "https://paragraph.b-cdn.net/battle/applause/1.mp3",
  "https://paragraph.b-cdn.net/battle/applause/2.mp3",
  "https://paragraph.b-cdn.net/battle/applause/3.mp3",
  "https://paragraph.b-cdn.net/battle/applause/4.mp3",
  "https://paragraph.b-cdn.net/battle/applause/5.mp3",
  "https://paragraph.b-cdn.net/battle/applause/6.mp3",
  "https://paragraph.b-cdn.net/battle/applause/7.mp3",
  "https://paragraph.b-cdn.net/battle/applause/8.mp3",
  "https://paragraph.b-cdn.net/battle/applause/9.mp3",
  "https://paragraph.b-cdn.net/battle/applause/10.mp3",
  "https://paragraph.b-cdn.net/battle/applause/11.mp3",
  "https://paragraph.b-cdn.net/battle/applause/12.mp3",
  "https://paragraph.b-cdn.net/battle/applause/13.mp3",
  "https://paragraph.b-cdn.net/battle/applause/14.mp3",
  "https://paragraph.b-cdn.net/battle/applause/15.mp3",
  "https://paragraph.b-cdn.net/battle/applause/16.mp3",
  "https://paragraph.b-cdn.net/battle/applause/17.mp3",
  "https://paragraph.b-cdn.net/battle/applause/18.mp3",
  "https://paragraph.b-cdn.net/battle/applause/19.mp3",
  "https://paragraph.b-cdn.net/battle/applause/20.mp3",
  "https://paragraph.b-cdn.net/battle/applause/21.mp3",
  "https://paragraph.b-cdn.net/battle/applause/22.mp3",
  "https://paragraph.b-cdn.net/battle/applause/23.mp3",
  "https://paragraph.b-cdn.net/battle/applause/24.mp3",
  "https://paragraph.b-cdn.net/battle/applause/25.mp3",
  "https://paragraph.b-cdn.net/battle/applause/26.mp3",
  "https://paragraph.b-cdn.net/battle/applause/27.mp3",
  "https://paragraph.b-cdn.net/battle/applause/28.mp3",
  "https://paragraph.b-cdn.net/battle/applause/29.mp3",
  "https://paragraph.b-cdn.net/battle/applause/30.mp3",
];

export const QUESTION_MUSIC = [
  "https://paragraph.b-cdn.net/battle/question_music/QM1.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM2.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM3.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM4.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM5.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM6.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM7.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM8.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM9.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM10.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM11.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM12.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM13.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM14.mp3",
  "https://paragraph.b-cdn.net/battle/question_music/QM15.mp3",
];

export const WOOSH_SOUNDS = [
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 1.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 2.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 3.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 4.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 5.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 6.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 7.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 8.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 9.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 10.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 11.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 12.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 13.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 14.mp3",
  "https://paragraph.b-cdn.net/battle/woosh/Woosh 15.mp3",
];

const hashStringToNumber = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type GamePhase = 'lobby' | 'question' | 'results' | 'leaderboard' | 'ended';

interface MCQ {
  id: string;
  stem: string;
  image_url?: string | null;
  is_image_based?: boolean;
  options: { A: string; B: string; C: string; D: string };
  correct_answer?: 'A' | 'B' | 'C' | 'D';
}

interface PlayerScore {
  userId: string;
  username: string;
  score: number;
  rank: number;
  emoji: string;
}

interface AnswerResults {
  A: number;
  B: number;
  C: number;
  D: number;
  correct: 'A' | 'B' | 'C' | 'D';
  correctCount: number;
}

const AVATAR_EMOJIS = ['😀', '🤓', '🧠', '💪', '🔥', '⚡', '🎯', '👑', '🦸', '🚀'];
// ✅ Helper: get player count for a battle
const getPlayerCount = async (battleId: string) => {
  try {
    const { count, error } = await supabase
      .from("battle_participants")
      .select("*", { count: "exact", head: true })
      .eq("battle_id", battleId)
      .eq("status", "joined"); // count only joined players
    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("⚠️ getPlayerCount error:", err);
    return 0;
  }
};




export default function WarroomScreen() {
  const { user } = useAuth();
  const { battleId } = useLocalSearchParams<{ battleId?: string }>();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [phase, setPhase] = useState<GamePhase>('question');

  const [playerCount, setPlayerCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MCQ | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [answerResults, setAnswerResults] = useState<AnswerResults | null>(null);
  const [leaderboard, setLeaderboard] = useState<PlayerScore[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [playerEmoji, setPlayerEmoji] = useState('🧠');
  const [hasJoined, setHasJoined] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  // -------------------------
  // 🧩 REFS (KEEP ONLY ONE COPY)
  // -------------------------
  const battleChannelRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestionRef = useRef<MCQ | null>(null);
  const questionNumberRef = useRef(0);
  const confettiRef = useRef<any>(null);
  const leaderboardConfettiRef = useRef<any>(null);
  const confettiFiredRef = useRef(false);
  const applauseSoundRef = useRef<Audio.Sound | null>(null);
  const questionMusicRef = useRef<Audio.Sound | null>(null);
  const wooshSoundRef = useRef<Audio.Sound | null>(null);
  const selectedQuestionMusicUrlRef = useRef<string | null>(null);
  const selectedWooshUrlRef = useRef<string | null>(null);

  // -------------------------
  // ⏱️ START TIMER
  // -------------------------
  const startTimer = (duration: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeRemaining(duration);
    let remaining = duration;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeRemaining(remaining);

      if (remaining <= 0) clearInterval(timerRef.current!);
    }, 1000);
  };

  // -------------------------
  // 🎵 AUDIO HELPERS
  // -------------------------
  const playQuestionMusic = async () => {
    if (!selectedQuestionMusicUrlRef.current) return;

    try {
      if (questionMusicRef.current) {
        await questionMusicRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: selectedQuestionMusicUrlRef.current },
        { shouldPlay: true, isLooping: true, volume: 0.6 }
      );

      questionMusicRef.current = sound;
    } catch (err) {
      console.warn('Question music failed:', err);
    }
  };

  const stopQuestionMusic = async () => {
    if (questionMusicRef.current) {
      try {
        await questionMusicRef.current.stopAsync();
        await questionMusicRef.current.unloadAsync();
      } catch (e) {
        // ignore safely
      } finally {
        questionMusicRef.current = null;
      }
    }
  };

  const playWoosh = async () => {
    if (!selectedWooshUrlRef.current) return;

    try {
      if (wooshSoundRef.current) {
        await wooshSoundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: selectedWooshUrlRef.current },
        { shouldPlay: true, volume: 0.8 }
      );

      wooshSoundRef.current = sound;
    } catch (err) {
      console.warn('Woosh sound failed:', err);
    }
  };

  const stopWoosh = async () => {
    if (wooshSoundRef.current) {
      try {
        await wooshSoundRef.current.stopAsync();
        await wooshSoundRef.current.unloadAsync();
      } catch (e) {
        // ignore safely
      } finally {
        wooshSoundRef.current = null;
      }
    }
  };

  const playApplause = async () => {
    try {
      if (applauseSoundRef.current) {
        await applauseSoundRef.current.unloadAsync();
        applauseSoundRef.current = null;
      }

      const randomUrl =
        APPLAUSE_SOUNDS[Math.floor(Math.random() * APPLAUSE_SOUNDS.length)];

      const { sound } = await Audio.Sound.createAsync(
        { uri: randomUrl },
        { shouldPlay: true, volume: 1.0 }
      );

      applauseSoundRef.current = sound;
    } catch (err) {
      console.warn('Applause audio failed:', err);
    }
  };

  const stopApplause = async () => {
    if (applauseSoundRef.current) {
      try {
        await applauseSoundRef.current.stopAsync();
        await applauseSoundRef.current.unloadAsync();
      } catch (e) {
        // ignore safely
      } finally {
        applauseSoundRef.current = null;
      }
    }
  };

  // -------------------------
  // 🧠 KEEP REFS IN SYNC
  // -------------------------
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  useEffect(() => {
    questionNumberRef.current = questionNumber;
  }, [questionNumber]);

  // -------------------------
  // 🔊 AUDIO MODE SETUP
  // -------------------------
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  // -------------------------
  // 🎯 SELECT AUDIO ONCE PER QUIZ
  // -------------------------
  useEffect(() => {
    if (!battleId) return;

    const hash = hashStringToNumber(battleId);

    selectedQuestionMusicUrlRef.current =
      QUESTION_MUSIC[hash % QUESTION_MUSIC.length];

    selectedWooshUrlRef.current =
      WOOSH_SOUNDS[hash % WOOSH_SOUNDS.length];

  }, [battleId]);

  // -------------------------
  // 🎮 PHASE-BASED AUDIO CONTROL
  // -------------------------
  useEffect(() => {
    if (phase === "question") playQuestionMusic();
    else stopQuestionMusic();

    if (phase === "results") playWoosh();
    else stopWoosh();

    if (phase === "leaderboard") playApplause();
    else stopApplause();
  }, [phase]);

  // -------------------------
  // ✨ HAPTIC
  // -------------------------
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

useEffect(() => {
  if (!battleId) return;
// -----------------------------------------
// 1️⃣ RESTORE STATE FROM battle_state ON ENTER
// -----------------------------------------
(async () => {
  try {
    const { data: state, error } = await supabase
  .from("battle_state")
  .select("*")
  .eq("battle_id", battleId)
  .maybeSingle();

console.log(
  "🟣 WARROOM: RESTORED BATTLE_STATE",
  "\nphase:", state?.phase,
  "\ncurrent_question_index:", state?.current_question_index,
  "\ntime_left:", state?.time_left,
  "\nquestion_payload:", state?.question_payload,
  "\nstats_payload:", state?.stats_payload,
  "\nleaderboard_payload:", state?.leaderboard_payload,
);


    if (error) console.error("battle_state error:", error);

    if (state) {
      console.log("🔥 Restoring mid-battle state:", state.phase);

      // Set question number (index is 0-based)
      setQuestionNumber((state.current_question_index || 0) + 1);

      // Normalize backend phase "stats" → UI phase "results"
      const normalizedPhase = state.phase === "stats" ? "results" : state.phase;

      // Restore phase
      setPhase(normalizedPhase as GamePhase);

      // Total questions from payload if available
      if (state.question_payload?.total_mcqs) {
        setTotalQuestions(state.question_payload.total_mcqs);
      }

if (state.question_payload) {
  const q = state.question_payload;
  const p = q.phase_json || {};

  const normalized = {
    id: q.mcq_id,
    stem: p.stem || p.Stem || "",
    image_url: p.image_url || null,
    options: (() => {
      const opts = p.options || p.Options || {};
      if (Array.isArray(opts)) {
        return {
          A: opts[0] || "",
          B: opts[1] || "",
          C: opts[2] || "",
          D: opts[3] || "",
        };
      }
      return opts;
    })(),
    correct_answer:
      p.correct_answer ||
      p["Correct Answer"] ||
      q.correct_answer ||
      "A",
  };

  setCurrentQuestion(normalized);

  // restore other metadata
  setQuestionNumber((state.current_question_index || 0) + 1);
  setTotalQuestions(q.total_mcqs || 0);
  startTimer(state.time_left || 0);

  console.log("✅ FIXED RESTORE → normalized question:", normalized);
}


      // Restore stats
      if (normalizedPhase === "results" && state.stats_payload){
        const s = state.stats_payload;

        setAnswerResults({
          A: s.option_a_count || 0,
          B: s.option_b_count || 0,
          C: s.option_c_count || 0,
          D: s.option_d_count || 0,
          correct: state.question_payload?.correct_answer || "A",
          correctCount:
            s[
              `option_${state.question_payload?.correct_answer?.toLowerCase()}_count`
            ] || 0,
        });
      }

      // Restore leaderboard
      if (state.phase === "leaderboard" && state.leaderboard_payload) {
  const restoredLB = (Array.isArray(state.leaderboard_payload)
    ? state.leaderboard_payload
    : []
  ).map((row: any) => ({
    userId: row.student_id || row.user_id || row.o_student_id,
    username: row.username || row.o_username || "Player",
    avatarUrl: row.avatar_url || "",
    score: row.total_score || row.o_total_score || 0,
    scoreChange: row.present_score || row.o_present_score || 0,
    rank: row.present_rank || row.o_present_rank || 0,
    correctAnswers: row.correct_count || row.o_correct_count || 0,
    emoji: "🔥",
  }));

        
  console.log("♻️ Restoring Leaderboard from STATE:", restoredLB);
        setPhase("results"); 
  setLeaderboard(restoredLB);
}

    }
  } catch (err) {
    console.error("❌ restore battle_state failed:", err);
  }
})();


const lateJoinTimeout = setTimeout(() => {
  console.log("⌛ No broadcast yet — staying in waiting mode");
  // DO NOT set lateJoiner here
}, 5000);

  // -----------------------------------------
  // 3️⃣ CHECK IF CHANNEL EXISTS — IF NOT, CREATE IT
  // -----------------------------------------
  let existingChannel = supabase
    .getChannels()
    .find(c => c.topic === `battle:${battleId}`);

  if (!existingChannel) {
    console.log("🟡 WarRoom: No existing channel → creating new");

    existingChannel = supabase.channel(`battle:${battleId}`, {
      config: { broadcast: { ack: false, self: false } },
    });

    existingChannel.subscribe((status) => {
      console.log("🔥 WarRoom Channel subscribed:", status);
    });
  } else {
    console.log("🔵 WarRoom: Found existing channel → attaching listeners");
  }

  // Save ref
  battleChannelRef.current = existingChannel;


  // -----------------------------------------
  // 4️⃣ Attach listener ONLY
  // -----------------------------------------
  const broadcastHandler = (payload: any) => {
    console.log(
  "📡 [BROADCAST]",
  "\nEvent:", payload.payload?.type,
  "\nRaw Payload:", payload.payload,
  "\nMessage Data:", payload.payload?.data
);


    clearTimeout(lateJoinTimeout);
    if (!payload) return;

    const eventType = payload.payload?.type;
    const message = payload.payload?.data || {};

    switch (eventType) {
      case "new_question": {
  const mcq = message;

  const normalized = {
    stem:
      mcq.phase_json?.stem ||
      mcq.phase_json?.Stem ||
      mcq.stem ||
      "",
    image_url:
      mcq.phase_json?.image_url ||
      mcq.image_url ||
      null,

    options: (() => {
      const opts =
        mcq.phase_json?.options ||
        mcq.phase_json?.Options ||
        mcq.options ||
        {};

      // If array → normalize
      if (Array.isArray(opts)) {
        return {
          A: opts[0] || "",
          B: opts[1] || "",
          C: opts[2] || "",
          D: opts[3] || "",
        };
      }
      return opts;
    })(),

    correct_answer:
      mcq.phase_json?.correct_answer ||
      mcq.phase_json?.["Correct Answer"] ||
      mcq.correct_answer,
  };

  // ✅ NOW SAFE TO LOG
  console.log(
    "🟡 NEW_QUESTION RECEIVED",
    "\nRaw MCQ:", mcq,
    "\nNormalized Question:", normalized
  );

  setCurrentQuestion({ id: mcq.mcq_id, ...normalized });
  setQuestionNumber(mcq.react_order || 0);
  setTotalQuestions(mcq.total_mcqs || 0);
  setPhase("question");
  setIsAnswerLocked(false);
  setSelectedOption(null);
  setAnswerResults(null);
  startTimer(20);
  break;
}


      case "show_stats": {
        if (timerRef.current) clearInterval(timerRef.current);
        const graph = Array.isArray(message) ? message[0] : message;

        setAnswerResults({
          A: graph?.option_a_count || 0,
          B: graph?.option_b_count || 0,
          C: graph?.option_c_count || 0,
          D: graph?.option_d_count || 0,
          correct: currentQuestionRef.current?.correct_answer || "A",
          correctCount:
            graph?.[
              `option_${currentQuestionRef.current?.correct_answer?.toLowerCase() || "a"}_count`
            ] || 0,
        });
console.log(
  "🟠 SHOW_STATS RECEIVED",
  "\nGraph Raw:", graph,
  "\nCorrect Answer:", currentQuestionRef.current?.correct_answer,
  "\nComputed AnswerResults:", {
    A: graph?.option_a_count,
    B: graph?.option_b_count,
    C: graph?.option_c_count,
    D: graph?.option_d_count,
  }
);

        setPhase("results");
        break;
      }

    case "update_leaderboard": {
  if (timerRef.current) clearInterval(timerRef.current);

  const leaderboardData = Array.isArray(message)
    ? message
    : [message];

  console.log("RAW leaderboardData:", leaderboardData);

  setLeaderboard(
    leaderboardData.map((row: any) => ({
      userId: row.student_id || row.o_student_id,
      username: row.username || row.o_username || row.o_student_id?.slice(0, 6) || "Player",
      score: row.total_score || row.o_total_score || 0,
      rank: row.present_rank || row.o_present_rank || 0,
      emoji: "🔥",
    }))
  );

  console.log(
    "🟢 UPDATE_LEADERBOARD RECEIVED",
    "\nNormalized LB:",
    leaderboardData.map((row: any) => ({
      user: row.o_username,
      total: row.o_total_score,
      present: row.o_present_score,
      rank: row.o_present_rank,
    }))
  );

  setPhase("leaderboard");
  break;
}



      case "timer_sync": {
        setTimeRemaining(message.seconds_left || 0);
        console.log("⏱️ TIMER_SYNC:", message.seconds_left);
        if ((message.seconds_left || 0) <= 0) setIsAnswerLocked(true);
        break;
      }

      case "battle_end": {
        setPhase("ended");
        break;
      }

      default:
        console.log("⚪ Unrecognized event:", eventType);
    }
  };

  existingChannel.on("broadcast", { event: "*" }, broadcastHandler);

  // -----------------------------------------
  // 5️⃣ Cleanup for WarRoom - PROPERLY UNSUBSCRIBE
  // -----------------------------------------
  return () => {
    if (battleChannelRef.current) {
      supabase.removeChannel(battleChannelRef.current);
      battleChannelRef.current = null;
    }
    clearTimeout(lateJoinTimeout);
    console.log("🧹 WarRoom channel removed cleanly");
  };
}, [battleId]);


  // -------------------------
  // 👥 PLAYER COUNT LISTENER
  // -------------------------
  useEffect(() => {
    if (!battleId) return;

    getPlayerCount(battleId).then(setPlayerCount);

    const channel = supabase
      .channel("battle_participants_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "battle_participants",
          filter: `battle_id=eq.${battleId}`,
        },
        async () => setPlayerCount(await getPlayerCount(battleId))
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [battleId]);

  // -------------------------
  // 🎉 CONFETTI TRIGGER
  // -------------------------
  useEffect(() => {
    if (phase === "leaderboard" && !confettiFiredRef.current) {
      confettiFiredRef.current = true;

      setTimeout(() => {
        leaderboardConfettiRef.current?.start();
      }, 120);
    }

    if (phase !== "leaderboard") {
      confettiFiredRef.current = false;
    }
  }, [phase]);

  // -------------------------
  // 🧹 CLEANUP ALL AUDIO ON UNMOUNT
  // -------------------------
  useEffect(() => {
    return () => {
      (async () => {
        await stopQuestionMusic();
        await stopWoosh();
        await stopApplause();
      })();
    };
  }, []);

const handleJoinLeave = async () => {
  if (!battleId || !user) return;
  console.log("⚔️ [WarRoom] handleJoinLeave() → hasJoined =", hasJoined);

  try {
    if (hasJoined) {
      const { error } = await supabase
        .from('battle_participants')
        .update({ status: 'left' })
        .eq('battle_id', battleId)
        .eq('user_id', user.id);
      if (error) throw error;
      console.log("🟥 [WarRoom] Left battle successfully");
      setHasJoined(false);
    } else {
      const { data: userProfile } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      const displayName = userProfile?.name || user?.phone || 'Anonymous';
      const { error } = await supabase
        .from('battle_participants')
        .upsert({
          battle_id: battleId,
          user_id: user.id,
          username: displayName,
          avatar_url: '',
          status: 'joined',
        });
      if (error) throw error;
      console.log("🟩 [WarRoom] Joined battle successfully:", displayName);
      setHasJoined(true);
    }
  } catch (err) {
    console.error("❌ [WarRoom] handleJoinLeave error:", err);
  }
};

const fetchLeaderboard = async () => {
  try {
    const { data, error } = await supabase.rpc("get_leader_board", {
      battle_id_input: battleId,
    });

    if (error) throw error;

    const list = Array.isArray(data) ? data : [];

    setLeaderboard(
      list.map((row: any) => ({
        userId: row.student_id || row.o_student_id,
        username: row.username || row.o_username || row.o_student_id?.slice(0, 6) || "Player",
        avatarUrl: row.avatar_url || row.o_avatar_url || "",
        score: row.total_score || row.o_total_score || 0,
        scoreChange: row.present_score || row.o_present_score || 0,
        rank: row.present_rank || row.o_present_rank || 0,
        correctAnswers: row.correct_count || row.o_correct_count || 0,
        emoji: "🔥",
      }))
    );

    setPhase("leaderboard");

  } catch (err) {
    console.error("❌ get_leader_board error:", err);
  }
};


const fetchNextQuestion = async () => {
  try {
    const { data, error } = await supabase.rpc('get_next_mcq', {
      battle_id_input: battleId,
      react_order_input: questionNumberRef.current, // ✅ use ref, not stale state
    });
    if (error) throw error;

    const next = data?.[0];
    if (!next) {
      setPhase('ended');
      return;
    }

    const normalizedNext = {
      stem: next.phase_json?.stem || next.phase_json?.Stem || '',
      image_url: next.phase_json?.image_url || null,
      options: next.phase_json?.options || next.phase_json?.Options || {},
      correct_answer:
        next.phase_json?.correct_answer ||
        next.phase_json?.['Correct Answer'] ||
        next.correct_answer,
    };

    setCurrentQuestion({
      id: next.mcq_id,
      ...normalizedNext,
    });

    questionNumberRef.current += 1; // ✅ increment ref manually
    setQuestionNumber(questionNumberRef.current); // update state too

    setSelectedOption(null);
    setAnswerResults(null);
    setIsAnswerLocked(false);
    setPhase('question');
  } catch (err) {
    console.error('❌ get_next_mcq error:', err);
  }
};



const handleOptionSelect = async (option: string) => {
  if (isAnswerLocked) return;

  console.log('🖱️ Option tapped:', option);

  triggerHaptic();
  setSelectedOption(option);
  setIsAnswerLocked(true);

  const isCorrect = option === currentQuestion?.correct_answer;
  const timeTaken = Math.max(0, 20 - timeRemaining);


  try {
    await supabase.rpc('submit_answer_battle', {
      student_id_input: user?.id,
      battle_id_input: battleId,
      mcq_id_input: currentQuestion?.id,
      student_answer_input: option,
      is_correct_input: isCorrect,
      correct_answer_input: currentQuestion?.correct_answer,
      time_to_answer_input: `${timeTaken} seconds` as any,
    });
  } catch (err) {
    console.error('❌ submit_answer_battle error:', err);
  }
};


  const handlePlayAgain = () => {
    setPhase('lobby');
    setQuestionNumber(0);
    setSelectedOption(null);
    setAnswerResults(null);
    setCurrentQuestion(null);
  };

  const handleExit = () => {
    // ✅ Go back to the Battle tab
    router.replace('/battle');
  };

  const getOptionColor = (option: string): string => {
    const colors: Record<string, string> = {
      A: '#FF6B9D',
      B: '#4ECDC4',
      C: '#FFA07A',
      D: '#9B9EFF',
    };
    return colors[option] || '#888888';
  };


  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const progress = timeRemaining / 20;

    return (
      <View style={styles.phaseContainer}>
        <View style={styles.questionHeader}>
          <View style={styles.questionMeta}>
            <Text style={styles.questionMetaText}>
              Question {questionNumber}/{totalQuestions}
            </Text>
          </View>

          <MotiView
            animate={{
              backgroundColor: timeRemaining <= 5 ? '#ef4444' : '#00D9FF',
            }}
            style={styles.timerCircle}
          >
            <Clock size={20} color="#FFFFFF" />
            <Text style={styles.timerText}>{timeRemaining}s</Text>
          </MotiView>
        </View>

        <ScrollView style={styles.questionScrollView} contentContainerStyle={styles.questionContent}>
          {currentQuestion.image_url && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              style={styles.imageBox}
            >
              <Image source={{ uri: currentQuestion.image_url }} style={styles.questionImage} resizeMode="cover" />
            </MotiView>
          )}

          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.questionBubble}
          >
            <LinearGradient colors={['#1A4D2E', '#2D5F3F']} style={styles.questionBubbleGradient}>
              <Markdown style={markdownStyles}>{currentQuestion.stem}</Markdown>
            </LinearGradient>
          </MotiView>

          <View style={styles.optionsContainer}>
  {currentQuestion?.options && typeof currentQuestion.options === 'object' ? (
    Object.entries(currentQuestion.options).map(([key, value], index) => {
      const optionColor = getOptionColor(key);
      const isSelected = selectedOption === key;
      return (
        <MotiView key={key} from={{ opacity: 0, translateX: -30 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: index * 80 }}>
          <TouchableOpacity
            onPress={() => handleOptionSelect(key)}
            disabled={isAnswerLocked}
            activeOpacity={0.8}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonSelected,
              { borderColor: optionColor },
            ]}
          >
            <View style={[styles.optionLabel, { backgroundColor: optionColor }]}>
              <Text style={styles.optionLabelText}>{key}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {typeof value === "string"
                    ? value.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1') // strip markdown
                    : ""}
                </Text>
              </View>
            {isSelected && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                style={styles.selectedCheck}
              >
                <Text style={styles.selectedCheckText}>✓</Text>
              </MotiView>
            )}
          </TouchableOpacity>
        </MotiView>
      );
    })
  ) : (
    <Text style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>
      ⚠️  No options available for this question
    </Text>
  )}
</View>

        </ScrollView>
      </View>
    );
  };

  const renderResults = () => {
    if (!answerResults || !currentQuestion) return null;
    console.log(
  "🔍 renderResults OPTIONS DEBUG",
  "\ncurrentQuestion.options:", currentQuestion.options,
  "\ncorrect:", answerResults.correct
);


    const maxCount = Math.max(answerResults.A, answerResults.B, answerResults.C, answerResults.D);
    const totalAnswers = answerResults.A + answerResults.B + answerResults.C + answerResults.D;

    return (
      <View style={styles.phaseContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.resultsCard}
        >
          <Text style={styles.resultsTitle}>📊 Results</Text>

          <View style={styles.barChartContainer}>
            {(['A', 'B', 'C', 'D'] as const).map((option, index) => {
              const count = answerResults[option];
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const optionColor = getOptionColor(option);
              const isCorrect = option === answerResults.correct;
              const isWrong = selectedOption === option && !isCorrect;

              return (
                <MotiView
                  key={option}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 400, delay: index * 100 }}
                  style={styles.barChartRow}
                >
                  <View style={styles.barChartLabel}>
                    <View style={[styles.barLabelCircle, { backgroundColor: optionColor }]}>
                      <Text style={styles.barLabelText}>{option}</Text>
                    </View>
                    <Text style={styles.barOptionText}>
                      {currentQuestion?.options &&
                       typeof currentQuestion.options === 'object' &&
                       typeof currentQuestion.options[option] === 'string'
                        ? currentQuestion.options[option]
                            .replace(/\*\*(.*?)\*\*/g, '$1')
                            .replace(/\*(.*?)\*/g, '$1')
                            .replace(/__([^_]+)__/g, '$1')
                            .replace(/_([^_]+)_/g, '$1')
                        : '—'}

                    </Text>
                  </View>

                  <View style={styles.barWrapper}>
                    <MotiView
                      from={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ type: 'timing', duration: 800, delay: index * 100 }}
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: isCorrect ? '#4ade80' : isWrong ? '#ef4444' : optionColor,
                        },
                      ]}
                    >
                      <Text style={styles.barCountText}>{count}</Text>
                    </MotiView>
                  </View>
                </MotiView>
              );
            })}
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 800 }}
            style={[styles.correctAnswerBadge, { backgroundColor: '#4ade8020' }]}
          >
            <View style={{ width: "100%" }}>
                <Markdown
                  style={{
                    ...markdownStyles,
                    body: {
                      ...markdownStyles.body,
                      color: "#4ade80", // ✅ keep your green theme
                      fontSize: 16,
                      fontWeight: "700",
                    },
                  }}
                >
                  {`✅ **Correct answer:** ${answerResults.correct}) ${currentQuestion.options[
                    answerResults.correct
                  ]}`}
                </Markdown>
              </View>

            <Text style={styles.correctAnswerSubtext}>
              {answerResults.correctCount} players got it right!
            </Text>
          </MotiView>
        </MotiView>
      </View>
    );
  };

  const renderLeaderboard = () => {
    const lb = Array.isArray(leaderboard) ? leaderboard : [];
    const topPlayers = lb.slice(0, 100);


    return (
      <View style={styles.phaseContainer}>
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.leaderboardHeader}
        >
          <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
          <Text style={styles.leaderboardSubtitle}>{playerCount} players</Text>
        </MotiView>

        <ScrollView style={styles.leaderboardScroll} contentContainerStyle={styles.leaderboardContent}>
          {topPlayers.map((player, index) => {
            const isMe = player.userId === user?.id;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

            return (
<MotiView
  key={player.userId}
  animate={{ opacity: 1, translateY: 0 }}
  style={[
    styles.lbCard,
    isMe && styles.lbCardMe,
    index === 0 && styles.lbCardFirst,
  ]}
>
  {/* Left Cluster: Rank → Emoji → Name */}
  <View style={styles.lbLeftCluster}>
    <View style={styles.lbRankCircle}>
      <Text style={styles.lbRankText}>{index + 1}</Text>
    </View>
    <Text style={styles.lbEmoji}>{player.emoji}</Text>
    <Text
      numberOfLines={1}
      style={[styles.lbName, isMe && { color: '#FFD93D' }]}
    >
      {player.username}
    </Text>
  </View>

  {/* Right Cluster: Score */}
  <View style={styles.lbRightCluster}>
    <Text style={styles.lbTotal}>{player.score} pts</Text>
  </View>
</MotiView>


            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderEnded = () => {
    const me = leaderboard.find((p) => p.userId === user?.id);

    const myRank = me?.rank ?? leaderboard.findIndex((p) => p.userId === user?.id) + 1;
    const myScore = me?.score ?? 0;

    const topThree = leaderboard.slice(0, 3);

    return (
      <View style={styles.phaseContainer}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.endCard}
        >
          <Text style={styles.endTitle}>🎉 Battle Ended!</Text>

          <View style={styles.podium}>
            {topThree.map((player, index) => (
              <MotiView
                key={player.userId}
                from={{ opacity: 0, translateY: 100 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 12, delay: index * 200 }}
                style={[
                  styles.podiumSlot,
                  index === 0 ? styles.podiumFirst : index === 1 ? styles.podiumSecond : styles.podiumThird,
                ]}
              >
                <Text style={styles.podiumMedal}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Text>
                <Text style={styles.podiumEmoji}>{player.emoji}</Text>
                <Text style={styles.podiumName} numberOfLines={1}>
                  {player.username}
                </Text>
                <Text style={styles.podiumScore}>{player.score}p</Text>
              </MotiView>
            ))}
          </View>

          <View style={styles.myStatsCard}>
            <Text style={styles.myStatsTitle}>Your Performance</Text>
            <View style={styles.myStatsRow}>
              <View style={styles.myStatItem}>
                <Text style={styles.myStatLabel}>Rank</Text>
                <Text style={styles.myStatValue}>#{myRank}</Text>
              </View>
              <View style={styles.myStatItem}>
                <Text style={styles.myStatLabel}>Score</Text>
                <Text style={styles.myStatValue}>{myScore} pts</Text>
              </View>
            </View>
          </View>

          <View style={styles.endButtons}>
            {/* 🧩 Hide Play Again if battle truly ended */}
            {phase !== 'ended' && (
              <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
                <Text style={styles.playAgainButtonText}>🔄 Play Again</Text>
              </TouchableOpacity>
            )}
          
            {/* ✅ Exit always visible */}
            <TouchableOpacity
              style={styles.exitButton}
              onPress={async () => {
                // 🧹 Mark participant as left
                if (battleId && user) {
                  await supabase
                    .from('battle_participants')
                    .update({ status: 'left' })
                    .eq('battle_id', battleId)
                    .eq('user_id', user.id);
                }
          
          
                // ✅ Navigate back to Battle List
                router.replace('/battle');
              }}
            >
              <Text style={styles.exitButtonText}>Exit Room</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <ConfettiCannon
        ref={leaderboardConfettiRef}
        count={220}
        origin={{ x: screenWidth / 2, y: 0 }}
        autoStart={false}
        fadeOut
        colors={['#FFD93D', '#4ADE80', '#60A5FA', '#F472B6', '#A78BFA']}
      />
      {/* 🔙 Small Top-Left Back Button */}
{/* 🔙 Simple Back Button */}
{/* 🔙 Icon Back Button (Lucide) */}
<TouchableOpacity
  style={{
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    zIndex: 100,
    padding: 8,
  }}
  onPress={() => {
    // Optional: mark player as left before navigation
    if (hasJoined) {
      supabase
        .from('battle_participants')
        .update({ status: 'left' })
        .eq('battle_id', battleId)
        .eq('user_id', user?.id);
    }

    // ✅ Go back to Battles list screen
    router.replace('/battle');
  }}
>
  <ArrowLeft color="#EF4444" size={26} strokeWidth={3} />
</TouchableOpacity>

      <AnimatePresence exitBeforeEnter={false}>
        {phase === 'question' && renderQuestion()}
        {phase === 'results' && renderResults()}
        {phase === 'leaderboard' && renderLeaderboard()}
        {phase === 'ended' && renderEnded()}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  phaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lobbyCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    gap: 20,
    borderWidth: 2,
    borderColor: '#2D2D2D',
    maxWidth: 500,
    width: '100%',
  },
  lobbyEmoji: {
    fontSize: 64,
  },
  lobbyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  playerCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#00D9FF20',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  playerCountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00D9FF',
  },
  waitingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888888',
    marginTop: 20,
  },
  leaderboardNameBox: {
  flex: 1,
  marginHorizontal: 12,
},
  questionHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questionMetaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  leaderboardScoreBox: {
  alignItems: 'flex-end',
  minWidth: 60,
},
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFD93D20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD93D',
  },
  timerCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  questionScrollView: {
    flex: 1,
    width: '100%',
  },
  questionContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  imageBox: {
    width: '100%',
    maxWidth: 500,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2D2D2D',
  },
lbPresent: {
  fontSize: 16,
  fontWeight: '700',
},
lbCard: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#141414',
  borderRadius: 14,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 1.5,
  borderColor: '#2E2E2E',
  width: '100%',
  gap: 12,
},
lbLeftCluster: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  flexShrink: 1,
  minWidth: 0,
},
lbRightCluster: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flexShrink: 0,
},
lbCardMe: {
  borderColor: '#FFD93D',
  backgroundColor: '#1E1E0A',
},
lbCardFirst: {
  borderColor: '#FFD93D',
  backgroundColor: '#332D00',
},
lbRankCircle: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: '#2E2E2E',
  justifyContent: 'center',
  alignItems: 'center',
},
lbRankText: {
  color: '#FFF',
  fontWeight: '700',
  fontSize: 14,
},
lbEmoji: {
  fontSize: 22,
},
lbScoreRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  minWidth: 80,
  justifyContent: 'flex-end',
},
lbName: {
  fontSize: 16,
  fontWeight: '700',
  color: '#EAEAEA',
  flexShrink: 1,
},
lbTotal: {
  fontSize: 16,
  fontWeight: '800',
  color: '#FFFFFF',
},
lbScoreGroup: {
  alignItems: 'flex-end',
  width: 55,
},

lbScore: {
  color: '#FFF',
  fontWeight: '800',
  fontSize: 16,
},

lbDelta: {
  fontWeight: '700',
  fontSize: 13,
  marginTop: 2,
},

  questionImage: {
    width: '100%',
    height: '100%',
  },
  questionBubble: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  questionBubbleGradient: {
    padding: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 600,
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#2D2D2D',
  },
  optionLabel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  selectedCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resultsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 700,
    borderWidth: 2,
    borderColor: '#2D2D2D',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  barChartContainer: {
    gap: 16,
    marginBottom: 24,
  },
  barChartRow: {
    gap: 8,
  },
  barChartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  barLabelCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLabelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  barOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CCCCCC',
    flex: 1,
  },
  barWrapper: {
    height: 40,
    backgroundColor: '#0F0F0F',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 40,
  },
  barCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  correctAnswerBadge: {
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ade80',
  },
  correctAnswerSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  leaderboardHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 60,
  },
  leaderboardTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  leaderboardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
    marginTop: 4,
  },
  leaderboardScroll: {
    flex: 1,
    width: '100%',
  },
  leaderboardContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 100,
  },
leaderboardRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#1A1A1A',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderWidth: 2,
  borderColor: '#2D2D2D',
},
  leaderboardRowMe: {
    borderColor: '#FFD93D',
    backgroundColor: '#FFD93D10',
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D2D2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardEmoji: {
    fontSize: 24,
  },
  leaderboardBar: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
leaderboardName: {
  fontSize: 16,
  fontWeight: '700',
  color: '#FFFFFF',
},
  leaderboardScore: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
leaderboardScoreText: {
  fontSize: 18,
  fontWeight: '800',
  color: '#FFFFFF',
},
leaderboardScoreChange: {
  fontSize: 13,
  fontWeight: '700',
  marginTop: 2,
},
  endCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 700,
    borderWidth: 2,
    borderColor: '#2D2D2D',
    gap: 24,
  },
  endTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    paddingVertical: 20,
  },
  podiumSlot: {
    alignItems: 'center',
    backgroundColor: '#2D2D2D',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    minWidth: 100,
  },
  podiumFirst: {
    backgroundColor: '#FFD93D30',
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  podiumSecond: {
    backgroundColor: '#C0C0C030',
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  podiumThird: {
    backgroundColor: '#CD7F3230',
    borderWidth: 2,
    borderColor: '#CD7F32',
  },
  podiumMedal: {
    fontSize: 32,
  },
  podiumEmoji: {
    fontSize: 28,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00D9FF',
  },
  myStatsCard: {
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  myStatsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  myStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  myStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  myStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 4,
  },
  myStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00D9FF',
  },
  endButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: '#00D9FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F0F0F',
  },
  exitButton: {
    flex: 1,
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
    participantsListContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 600,
    borderRadius: 12,
    backgroundColor: '#2D2D2D',
    padding: 16,
    marginTop: 20,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  participantItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#444444',
  },
  participantName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  participantPhone: {
    fontSize: 14,
    color: '#888888',
  },
});
const markdownStyles = {
  body: {
    color: "#FFFFFF",
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: "700",
    lineHeight: 26,
  },
  strong: {
    color: "#FFD93D",  // yellow highlight for bolds
    fontWeight: "800",
  },
  em: {
    color: "#FFD93D",
    fontStyle: "italic",
  },
  waitContainer: {
  flex: 1,
  backgroundColor: '#0F0F0F',
  justifyContent: 'center',
  alignItems: 'center',
},
waitCard: {
  backgroundColor: '#1A1A1A',
  borderRadius: 20,
  padding: 40,
  borderWidth: 2,
  borderColor: '#FFD93D40',
  alignItems: 'center',
  gap: 16,
  maxWidth: 400,
},
waitTitle: {
  fontSize: 22,
  fontWeight: '800',
  color: '#FFD93D',
  textAlign: 'center',
},
waitSub: {
  fontSize: 15,
  color: '#AAAAAA',
  textAlign: 'center',
  lineHeight: 22,
},
}
