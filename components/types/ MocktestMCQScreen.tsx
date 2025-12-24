//MocktestMCQScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import ZoomableImage from "@/components/common/ZoomableImage";

interface MCQData {
  id?: string;
  stem?: string;
  options?: { [key: string]: string } | string[];
  feedback?: {
    wrong?: string;
    correct?: string;
  };
  learning_gap?: string;
  high_yield_facts?: string;
  correct_answer?: string;
  phase_json?: any;
  is_mcq_image_type?: boolean;
  mcq_image?: string;
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
  onAnswerSelected,
  interactiveReview = false,
}: {
  item: MCQData;
  onNext?: () => void;
  studentId?: string;
  conceptId?: string;
  mcqId?: string;
  correctAnswer?: string;
  reactOrderFinal?: number;
  onAnswered?: () => void;
  hideInternalNext?: boolean;
  disabled?: boolean;
  reviewMode?: boolean;
  isBookmarked?: boolean;
  studentSelected?: string | null;
  phaseUniqueId?: string;
  practicecardId?: string;
  subject?: string;
  onAnswerSelected?: (answer: string, isCorrect: boolean) => void;
  interactiveReview?: boolean;
}) {
  const baseMcqData = item?.phase_json?.[0] ?? item?.phase_json ?? item;
  const mcqData = {
    ...baseMcqData,
    is_mcq_image_type: item?.is_mcq_image_type ?? baseMcqData?.is_mcq_image_type,
    mcq_image: item?.mcq_image ?? baseMcqData?.mcq_image,
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (reviewMode && studentSelected) {
      setSelectedOption(studentSelected);
    }
  }, [reviewMode, studentSelected]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    if (reviewMode && !interactiveReview) return;
    setSelectedOption(option);

    const isCorrect = option === mcqData.correct_answer;
    onAnswerSelected?.(option, isCorrect);
    onAnswered?.();
  };

  const isCorrect = selectedOption === mcqData.correct_answer;

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        <MCQQuestion mcq={mcqData} />

        <OptionsGrid
          options={mcqData.options}
          selectedOption={interactiveReview ? selectedOption : (reviewMode ? studentSelected : selectedOption)}
          correctAnswer={mcqData.correct_answer}
          onSelect={handleOptionSelect}
          reviewMode={interactiveReview ? false : reviewMode}
        />

        {(reviewMode && !interactiveReview) && (
          <FeedbackSection
            learningGap={mcqData.learning_gap}
            highYieldFacts={mcqData.high_yield_facts}
            correctAnswer={mcqData.correct_answer}
          />
        )}

        {!reviewMode && selectedOption && (
          <FeedbackSection
            learningGap={mcqData.learning_gap}
            highYieldFacts={mcqData.high_yield_facts}
            correctAnswer={mcqData.correct_answer}
          />
        )}
      </ScrollView>
    </View>
  );
}

function MCQQuestion({ mcq }: { mcq: MCQData }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.mcqCard, { opacity: fadeAnim }]}>
      <View style={{ flex: 1 }}>
        {renderMarkupText(mcq.stem || "", styles.mcqStem)}
      </View>

      {mcq.is_mcq_image_type && mcq.mcq_image && (
        <View style={{ marginTop: 12 }}>
          <ZoomableImage uri={mcq.mcq_image} height={260} />
        </View>
      )}
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
  options?: MCQData["options"] | string[];
  selectedOption: string | null;
  correctAnswer?: string;
  onSelect: (option: string) => void;
  reviewMode?: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }).start();
  }, []);

  if (!options || (typeof options === 'object' && Object.keys(options).length === 0)) {
    return null;
  }

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

export function FeedbackSection({
  learningGap,
  highYieldFacts,
  correctAnswer,
}: {
  learningGap?: string;
  highYieldFacts?: string;
  correctAnswer?: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }).start();
  }, []);

  const hasContent = learningGap || highYieldFacts || correctAnswer;
  if (!hasContent) return null;

  return (
    <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
      {learningGap && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>Learning Gap</Text>
          {renderMarkupText(learningGap, styles.learningGapText)}
        </View>
      )}

      {highYieldFacts && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>High Yield Facts</Text>
          {renderMarkupText(highYieldFacts, styles.learningGapText)}
        </View>
      )}

      {correctAnswer && (
        <View style={styles.correctAnswerCard}>
          <Text style={styles.correctAnswerText}>
            Correct Answer:{" "}
            <Text style={styles.correctAnswerBold}>{correctAnswer}</Text>
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

/* MARKUP PARSER */
function renderMarkupText(content: string | undefined | null, baseStyle: any) {
  if (!content || typeof content !== "string") {
    return null;
  }

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

