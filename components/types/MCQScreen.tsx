//mcqscreen.tsx
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

export default function MCQChatScreen({
  item,
  onNext,
  studentId,
  conceptId,
  mcqId,
  correctAnswer,
  reactOrderFinal,
  onAnswered,
  hideInternalNext = false,
  disabled = false,
  reviewMode = false,
  isBookmarked = false,
  studentSelected = null,
  phaseUniqueId,
  practicecardId,
  subject,
}: {
  item: MCQData;
  onNext?: () => void;
  studentId: string;
  conceptId?: string;
  mcqId?: string;
  correctAnswer?: string;
  reactOrderFinal?: number;
  onAnswered?: () => void;
  hideInternalNext?: boolean;
  disabled?: boolean;
  reviewMode?: boolean;
  isBookmarked: boolean;
  studentSelected?: string | null;
  phaseUniqueId: string;
  practicecardId?: string;
  subject?: string;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 🟦 Log when MCQ screen mounts
  useEffect(() => {
    console.log("🟦 [MCQScreen] Mounted MCQ", {
      mcqId,
      conceptId,
      correctAnswer,
      mcqData: item,
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

  // 🟧 Log when an option is selected
  console.log("🟧 [MCQScreen] Option Selected", {
    selected: option,
    mcqId,
    conceptId,
  });

  setSelectedOption(option);
  onAnswered?.();

  const correct_answer = correctAnswer || item.correct_answer;
  const is_correct = option === correct_answer;

  // ⭐ PRACTICE MODE — no RPC
  if (!studentId) {
    console.log("🧠 Practice Mode → Local Save", {
      mcq_id: mcqId || item.id,
      selected: option,
      correct_answer,
      is_correct,
    });
    return;
  }

// ⭐ NORMAL MODE — Call new RPC: my_answers
console.log("📤 [MCQScreen] Submitting MCQ RPC → my_answers", {
  p_student_id: studentId,
  p_mcq_id: mcqId,
  p_student_answer: option,
  p_is_correct: is_correct,
  p_correct_answer: correct_answer,
});

try {
  const { data, error } = await supabase.rpc("my_answers", {
    p_student_id: studentId,
    p_mcq_id: mcqId,
    p_student_answer: option,
    p_is_correct: is_correct,
    p_correct_answer: correct_answer,
  });

  if (error) {
    console.log("❌ [MCQScreen] RPC ERROR my_answers:", error);
    return;
  }

  console.log("🟢 [MCQScreen] RPC SUCCESS → my_answers submitted");
} catch (exception) {
  console.log("🔥 [MCQScreen] EXCEPTION during my_answers submit:", exception);
}

// ✅ CLOSE the handleOptionSelect function
};
  const isCorrect = selectedOption === item.correct_answer;

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        <MCQQuestion
          mcq={item}
          studentId={studentId}
          isBookmarked={isBookmarked}
          reviewMode={reviewMode}
          phaseUniqueId={phaseUniqueId}
          practicecardId={practicecardId}
          subject={subject}
        />

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

function MentorMessage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.mentorBubble, { opacity: fadeAnim }]}>
      <Text style={styles.mentorText}>
        Let's test your understanding with this question. Take your time and choose the best answer.
      </Text>
    </Animated.View>
  );
}

function MCQQuestion({
  mcq,
  studentId,
  isBookmarked,
  reviewMode,
  phaseUniqueId,
  practicecardId,
  subject,
}: {
  mcq: MCQData;
  studentId: string;
  isBookmarked: boolean;
  reviewMode: boolean;
  phaseUniqueId: string;
  practicecardId?: string;
  subject?: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }).start();
  }, []);

  async function toggleBookmarkInLearningMode() {
  try {
    console.log("📌 Learning Mode MCQ Bookmark Toggle");

    const { data, error } = await supabase.rpc("toggle_latest_bookmark", {
      p_student_id: studentId,
      p_phase_unique_id: phaseUniqueId
    });

    if (error) {
      console.error("❌ Learning bookmark RPC error:", error);
    } else {
      console.log("🟢 Bookmark toggled:", data);
    }
  } catch (err) {
    console.error("🔥 toggleBookmarkInLearningMode failed:", err);
  }
}


  return (
    <Animated.View style={[styles.mcqCard, { opacity: fadeAnim }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          {renderMarkupText(mcq.stem, styles.mcqStem)}
        </View>
      </View>
    </Animated.View>
  );
}

function OptionsGrid({
  options,
  selectedOption,
  correctAnswer,
  onSelect,
  reviewMode = false,
}: {
  options: MCQData["options"] | string[];
  selectedOption: string | null;
  correctAnswer: string;
  onSelect: (option: string) => void;
  reviewMode?: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }).start();
  }, []);

  const optionEntries = Array.isArray(options)
    ? options.map((opt, i) => {
        const label = String.fromCharCode(65 + i);
        const cleanText = opt.replace(/^([A-D]\)\s*)/, "");
        return [label, cleanText];
      })
    : Object.entries(options);

  return (
    <Animated.View style={[styles.optionsContainer, { opacity: fadeAnim }]}>
      {optionEntries.map(([key, value]) => {
        const text = value as string;

        let isCorrect = false;
        let isWrong = false;
        let isDisabled = true;

        if (reviewMode) {
          isCorrect = key === correctAnswer;
          isWrong = selectedOption === key && key !== correctAnswer;
        } else {
          isCorrect = selectedOption !== null && key === correctAnswer;
          isWrong = selectedOption === key && key !== correctAnswer;
          isDisabled = selectedOption !== null;
        }

        return (
          <OptionButton
            key={key}
            label={key}
            text={text}
            isSelected={selectedOption === key}
            isCorrect={isCorrect}
            isWrong={isWrong}
            disabled={isDisabled}
            onPress={() => !reviewMode && onSelect(key)}
          />
        );
      })}
    </Animated.View>
  );
}

function OptionButton({
  label,
  text,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  onPress,
}: {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const bg = isCorrect
    ? "#1a4d2e"
    : isWrong
    ? "#4d1a1a"
    : isSelected
    ? "#2a2a2a"
    : isHovered && !disabled
    ? "#2a2a2a"
    : "#1f1f1f";

  const border = isCorrect
    ? "#25D366"
    : isWrong
    ? "#d32f2f"
    : isSelected
    ? "#404040"
    : "#2a2a2a";

  return (
    <Pressable
      style={[
        styles.optionButton,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 2,
          opacity: disabled && !isSelected && !isCorrect ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      {renderMarkupText(text, styles.optionText)}
    </Pressable>
  );
}

function FeedbackSection({
  feedback,
  learningGap,
  correctAnswer,
}: {
  feedback: string;
  learningGap: string;
  correctAnswer: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
      <View style={styles.feedbackBubble}>{renderMarkupText(feedback, styles.feedbackText)}</View>

      <View style={styles.learningGapCard}>
        <Text style={styles.learningGapTitle}>Learning Gap</Text>
        {renderMarkupText(learningGap, styles.learningGapText)}
      </View>

      <View style={styles.correctAnswerCard}>
        <Text style={styles.correctAnswerText}>
          Correct Answer:{" "}
          <Text style={styles.correctAnswerBold}>{correctAnswer}</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

/* MARKUP PARSER */
function renderMarkupText(content: string, baseStyle: any) {
  const lines = content.split("\n");

  return (
    <Text style={baseStyle}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {parseInlineMarkup(line)}
          {lineIndex < lines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </Text>
  );
}

function parseInlineMarkup(text: string) {
  const parts: React.ReactNode[] = [];
  let key = 0;

  const regex = /(\*_[^_]+_\*|\*[^*]+\*|_[^_]+_)/g;
  const segments = text.split(regex);

  segments.forEach((segment) => {
    if (segment.startsWith("*_") && segment.endsWith("_*")) {
      parts.push(
        <Text key={key++} style={styles.boldItalic}>
          {segment.slice(2, -2)}
        </Text>
      );
    } else if (segment.startsWith("*") && segment.endsWith("*")) {
      parts.push(
        <Text key={key++} style={styles.bold}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else if (segment.startsWith("_") && segment.endsWith("_")) {
      parts.push(
        <Text key={key++} style={styles.italic}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else {
      parts.push(<Text key={key++}>{segment}</Text>);
    }
  });

  return <>{parts}</>;
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  mentorBubble: {
    maxWidth: "85%",
    alignSelf: "flex-start",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  mentorText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#e1e1e1",
  },
  mcqCard: {
    backgroundColor: "#1a3a2e",
    borderLeftWidth: 4,
    borderLeftColor: "#25D366",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mcqStem: {
    fontSize: 15,
    lineHeight: 24,
    color: "#e1e1e1",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25D366",
    marginRight: 12,
    minWidth: 24,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#e1e1e1",
  },
  feedbackContainer: {
    marginTop: 8,
  },
  feedbackBubble: {
    maxWidth: "85%",
    alignSelf: "flex-start",
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#e1e1e1",
  },
  learningGapCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 14,
    marginBottom: 12,
  },
  learningGapTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888888",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  learningGapText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#b0b0b0",
  },
  correctAnswerCard: {
    backgroundColor: "#1a2a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#25D366",
    padding: 12,
    marginBottom: 12,
  },
  correctAnswerText: {
    fontSize: 14,
    color: "#b0b0b0",
  },
  correctAnswerBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25D366",
  },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  boldItalic: { fontWeight: "700", fontStyle: "italic" },
});

