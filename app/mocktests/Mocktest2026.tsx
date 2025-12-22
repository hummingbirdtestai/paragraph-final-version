// app/mocktests/Mocktest2026.tsxa
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Clock, Grid3x3, ChevronRight, SkipForward } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { supabase } from "@/lib/supabaseClient";
import MainLayout from "@/components/MainLayout";
import QuestionNavigationScreenNew from "@/components/types/QuestionNavigationScreennew";

export default function Mocktest2026() {
  /* ---------------------------------
     CORE STATE
  --------------------------------- */
  const [feed, setFeed] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(42 * 60);
  const [showPalette, setShowPalette] = useState(false);

  const currentMCQ = feed[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [examSerial, setExamSerial] = useState<number | null>(null);

  /* ---------------------------------
     UTILS
  --------------------------------- */
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  /* ---------------------------------
     LOAD AUTH USER
  --------------------------------- */
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("👤 Loaded session:", session);

      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    loadUser();
  }, []);

  /* ---------------------------------
     AUTO LOAD FIRST SECTION
  --------------------------------- */
  useEffect(() => {
    if (!userId) return;

    const DEFAULT_EXAM_SERIAL = 1; // TODO: route param later

    console.log("🚀 Auto loading mocktest", {
      userId,
      DEFAULT_EXAM_SERIAL,
    });

    loadSection(userId, DEFAULT_EXAM_SERIAL);
  }, [userId]);

  /* ---------------------------------
     LOAD SECTION FEED
  --------------------------------- */
  const loadSection = async (studentId: string, examSerial: number) => {
    console.log("📥 Loading section feed", { studentId, examSerial });

    setExamSerial(examSerial);

    const { data, error } = await supabase.rpc(
      "get_mocktest_section_mcqs",
      {
        p_student_id: studentId,
        p_exam_serial: examSerial,
      }
    );

    if (error) {
      console.error("❌ get_mocktest_section_mcqs failed", error);
      return;
    }

    console.log("📦 Section feed received", data);

    setFeed(data.mcqs || []);
    setCurrentIndex(0);

    if (data?.time_left) {
      const [h, m, s] = data.time_left.split(":").map(Number);
      setRemainingTime(h * 3600 + m * 60 + s);
    }
  };

  /* ---------------------------------
     SECTION TIMER
  --------------------------------- */
  useEffect(() => {
    if (!feed.length) return;

    console.log("⏱ Starting section timer");

    timerRef.current && clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          console.warn("⏰ Section timer expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      console.log("⏹ Clearing timer");
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [feed]);
  /* ---------------------------------
     SUBMIT HELPERS
  --------------------------------- */
  const submit = async ({
    student_answer,
    is_skipped,
    is_review,
  }: {
    student_answer: string | null;
    is_skipped: boolean;
    is_review: boolean;
  }) => {
    if (!userId || !examSerial || !currentMCQ) {
      console.warn("⚠️ submit blocked — missing state");
      return;
    }

    console.log("📤 Submitting answer", {
      react_order: currentMCQ.react_order,
      student_answer,
      is_skipped,
      is_review,
      time_left: formatTime(remainingTime),
    });

    const correctAnswer = currentMCQ?.phase_json?.correct_answer ?? null;

    const { error } = await supabase.rpc("submit_mocktest_answer", {
      p_student_id: userId,
      p_exam_serial: examSerial,
      p_react_order_final: currentMCQ.react_order,
      p_correct_answer: correctAnswer,
      p_student_answer: student_answer,
      p_is_correct:
        student_answer && correctAnswer
          ? student_answer === correctAnswer
          : null,
      p_is_skipped: is_skipped,
      p_is_review: is_review,
      p_time_left: formatTime(remainingTime),
    });

    if (error) {
      console.error("❌ submit_mocktest_answer failed", error);
      return;
    }

    console.log("✅ Answer saved");

    setFeed((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        student_answer,
        is_skipped,
        is_review,
      };
      return copy;
    });
  };

  /* ---------------------------------
     ACTION HANDLERS
  --------------------------------- */
  const handleNext = async () => {
    await submit({
      student_answer: currentMCQ.student_answer,
      is_skipped: false,
      is_review: false,
    });
    setCurrentIndex((i) => i + 1);
  };

  const handleSkip = async () => {
    await submit({
      student_answer: null,
      is_skipped: true,
      is_review: false,
    });
    setCurrentIndex((i) => i + 1);
  };

  const handleReview = async () => {
    await submit({
      student_answer: null,
      is_skipped: false,
      is_review: true,
    });
  };

  /* ---------------------------------
     HARD GUARD — INVALID MCQ
  --------------------------------- */
  if (
    !currentMCQ ||
    !currentMCQ.phase_json ||
    !currentMCQ.phase_json.stem
  ) {
    console.warn("⚠️ Invalid MCQ payload", currentMCQ);
    return (
      <MainLayout>
        <SafeAreaView style={styles.container}>
          <Text style={{ color: "#999" }}>Loading question…</Text>
        </SafeAreaView>
      </MainLayout>
    );
  }

  const options =
    currentMCQ.phase_json.options &&
    typeof currentMCQ.phase_json.options === "object"
      ? currentMCQ.phase_json.options
      : {};

  /* ---------------------------------
     RENDER
  --------------------------------- */
  return (
    <MainLayout>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerTop}>
          <Text style={styles.sectionText}>
            Section {currentMCQ.sections}
          </Text>

          <View style={styles.timer}>
            <Clock size={16} />
            <Text>{formatTime(remainingTime)}</Text>
          </View>

          <TouchableOpacity onPress={() => setShowPalette(true)}>
            <Grid3x3 size={18} />
          </TouchableOpacity>
        </View>

        {/* QUESTION */}
        <Markdown>{currentMCQ.phase_json.stem}</Markdown>

        {/* OPTIONS — ✅ SAFE */}
        {Object.entries(options).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => {
              console.log("🟦 Option selected", key);
              setFeed((f) => {
                const c = [...f];
                c[currentIndex].student_answer = key;
                return c;
              });
            }}
          >
            <Text>{key}. {value}</Text>
          </TouchableOpacity>
        ))}

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSkip}>
            <SkipForward size={18} />
            <Text>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReview}>
            <Text>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Text>Next</Text>
            <ChevronRight size={18} />
          </TouchableOpacity>
        </View>

        {/* PALETTE */}
        <QuestionNavigationScreenNew
          isVisible={showPalette}
          onClose={() => setShowPalette(false)}
          mcqs={feed}
          currentQuestion={currentMCQ.react_order}
          onSelectQuestion={(ro) => {
            const idx = feed.findIndex((m) => m.react_order === ro);
            if (idx !== -1) setCurrentIndex(idx);
          }}
        />
      </SafeAreaView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionText: { color: "#4ade80", fontWeight: "700" },
  timer: { flexDirection: "row", gap: 6 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
});
