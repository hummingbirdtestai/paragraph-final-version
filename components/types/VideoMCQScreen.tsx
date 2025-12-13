import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { supabase } from "@/lib/supabaseClient";

interface MCQData {
  id: string;
  stem: string;
  options: { [key: string]: string } | string[];
  feedback: {
    wrong: string;
    correct: string;
  };
  learning_gap: string;
  correct_answer: string;
}

export default function VideoMCQScreen({
  item,
  studentId,
  mcqId,
  correctAnswer,
  phaseUniqueId,
  reviewMode = false,
  studentSelected = null,
}: {
  item: MCQData;
  studentId: string;
  mcqId: string;
  correctAnswer?: string;
  phaseUniqueId: string; // video phase id
  reviewMode?: boolean;
  studentSelected?: string | null;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log("🎥 [VideoMCQ] Mounted", {
      mcqId,
      phaseUniqueId,
    });
  }, []);

  useEffect(() => {
    if (selectedOption) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [selectedOption]);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption) return;

    setSelectedOption(option);

    const correct_answer = correctAnswer || item.correct_answer;
    const is_correct = option === correct_answer;

    console.log("📤 VIDEO MCQ → submit_video_mcq_answer_v1", {
      mcqId,
      phaseUniqueId,
      option,
      is_correct,
    });

    try {
      const { error } = await supabase.rpc(
        "submit_video_mcq_answer_v1",
        {
          p_student_id: studentId,
          p_video_mcq_id: mcqId,
          p_student_answer: option,
          p_is_correct: is_correct,
          p_correct_answer: correct_answer,
          p_video_mcq_unique_id: phaseUniqueId,
        }
      );

      if (error) {
        console.error("❌ submit_video_mcq_answer_v1 error:", error);
      }
    } catch (err) {
      console.error("🔥 submit_video_mcq_answer_v1 exception:", err);
    }
  };

  const isCorrect = selectedOption === item.correct_answer;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={styles.mcqCard}>
          {renderMarkupText(item.stem, styles.mcqStem)}
        </Animated.View>

        <OptionsGrid
          options={item.options}
          selectedOption={reviewMode ? studentSelected : selectedOption}
          correctAnswer={item.correct_answer}
          onSelect={handleOptionSelect}
          reviewMode={reviewMode}
        />

        {(reviewMode || selectedOption) && (
          <FeedbackSection
            feedback={
              reviewMode
                ? item.feedback.correct
                : isCorrect
                ? item.feedback.correct
                : item.feedback.wrong
            }
            learningGap={item.learning_gap}
            correctAnswer={item.correct_answer}
          />
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- UI BELOW IS IDENTICAL ---------- */

function OptionsGrid({
  options,
  selectedOption,
  correctAnswer,
  onSelect,
  reviewMode = false,
}: any) {
  const optionEntries = Array.isArray(options)
    ? options.map((opt: string, i: number) => [
        String.fromCharCode(65 + i),
        opt,
      ])
    : Object.entries(options);

  return (
    <View style={styles.optionsContainer}>
      {optionEntries.map(([key, value]: any) => {
        const isCorrect = selectedOption && key === correctAnswer;
        const isWrong = selectedOption === key && key !== correctAnswer;

        return (
          <Pressable
            key={key}
            style={[
              styles.optionButton,
              isCorrect && styles.correct,
              isWrong && styles.wrong,
            ]}
            onPress={() => !reviewMode && onSelect(key)}
          >
            <Text style={styles.optionLabel}>{key}</Text>
            {renderMarkupText(value, styles.optionText)}
          </Pressable>
        );
      })}
    </View>
  );
}

function FeedbackSection({ feedback, learningGap, correctAnswer }: any) {
  return (
    <View style={styles.feedbackContainer}>
      {renderMarkupText(feedback, styles.feedbackText)}
      {renderMarkupText(learningGap, styles.learningGapText)}
      <Text style={styles.correctAnswer}>
        Correct Answer: {correctAnswer}
      </Text>
    </View>
  );
}

/* ---------- MARKUP ---------- */

function renderMarkupText(content: string, baseStyle: any) {
  if (!content) return null;
  return <Text style={baseStyle}>{content}</Text>;
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { backgroundColor: "#0d0d0d" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  mcqCard: {
    backgroundColor: "#1a3a2e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mcqStem: { color: "#e1e1e1", fontSize: 15 },
  optionsContainer: { marginBottom: 16 },
  optionButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    marginBottom: 10,
  },
  optionLabel: { color: "#25D366", fontWeight: "700" },
  optionText: { color: "#e1e1e1" },
  correct: { borderColor: "#25D366", borderWidth: 2 },
  wrong: { borderColor: "#d32f2f", borderWidth: 2 },
  feedbackContainer: { marginTop: 12 },
  feedbackText: { color: "#e1e1e1" },
  learningGapText: { color: "#b0b0b0" },
  correctAnswer: { color: "#25D366", marginTop: 8 },
});
