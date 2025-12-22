// app/mocktests/Mocktest2026.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
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
  const [feed, setFeed] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(42 * 60);
  const [showPalette, setShowPalette] = useState(false);

  const currentMCQ = feed[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* -------------------------------
     LOAD SECTION FEED
  -------------------------------- */
  const loadSection = async (studentId: string, examSerial: number) => {
    const { data, error } = await supabase.rpc(
      "get_mocktest_section_mcqs",
      {
        p_student_id: studentId,
        p_exam_serial: examSerial,
      }
    );

    if (error) return;

    setFeed(data.mcqs);
    setCurrentIndex(0);

    const [h, m, s] = data.time_left.split(":").map(Number);
    setRemainingTime(h * 3600 + m * 60 + s);
  };

  /* -------------------------------
     SECTION TIMER
  -------------------------------- */
  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSectionTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [feed]);

  const handleSectionTimeout = () => {
    // UI decision only
    // load next section OR finish test
  };

  /* -------------------------------
     SUBMIT HELPERS
  -------------------------------- */
  const submit = async ({
    student_answer,
    is_skipped,
    is_review,
  }: {
    student_answer: string | null;
    is_skipped: boolean;
    is_review: boolean;
  }) => {
    await supabase.rpc("submit_mocktest_answer", {
      p_student_id: /* userId */,
      p_exam_serial: /* examSerial */,
      p_react_order_final: currentMCQ.react_order,
      p_correct_answer: currentMCQ.phase_json.correct_answer,
      p_student_answer: student_answer,
      p_is_correct:
        student_answer != null
          ? student_answer === currentMCQ.phase_json.correct_answer
          : null,
      p_is_skipped: is_skipped,
      p_is_review: is_review,
      p_time_left: formatTime(remainingTime),
    });

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

  if (!currentMCQ) {
    return <Text style={{ color: "#999" }}>Loading…</Text>;
  }

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

        {/* OPTIONS */}
        {Object.entries(currentMCQ.phase_json.options).map(
          ([key, value]) => (
            <TouchableOpacity
              key={key}
              onPress={() =>
                setFeed((f) => {
                  const c = [...f];
                  c[currentIndex].student_answer = key;
                  return c;
                })
              }
            >
              <Text>{key}. {value}</Text>
            </TouchableOpacity>
          )
        )}

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

        <QuestionNavigationScreen
          isVisible={showPalette}
          onClose={() => setShowPalette(false)}
          mcqs={feed}
          currentQuestion={currentMCQ.section_q_number}
          onSelectQuestion={(ro) => {
            const idx = feed.findIndex(
              (m) => m.react_order === ro
            );
            if (idx !== -1) setCurrentIndex(idx);
          }}
        />
      </SafeAreaView>
    </MainLayout>
  );
}
