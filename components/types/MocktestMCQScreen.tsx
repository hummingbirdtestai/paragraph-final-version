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
  image_description?: string;
  phase_json?: any;
  is_mcq_image_type?: boolean;
  mcq_image?: string;
}

interface Props {
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
}

export default function MocktestMCQScreen({
  item,
  onAnswered,
  onAnswerSelected,
}: Props) {
  const baseMcq = item?.phase_json?.[0] ?? item?.phase_json ?? item;

  console.log("🔍 MocktestMCQScreen received:", {
    hasItem: !!item,
    hasStem: !!baseMcq?.stem,
    hasOptions: !!baseMcq?.options,
    optionsType: Array.isArray(baseMcq?.options) ? 'array' : typeof baseMcq?.options,
    baseMcq
  });

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);

    const isCorrect = option === baseMcq.correct_answer;
    onAnswerSelected?.(option, isCorrect);
    onAnswered?.();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const hasAnswered = selectedOption !== null;

  if (!baseMcq || !baseMcq.stem) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>MCQ data is missing or malformed</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <MCQQuestion mcq={baseMcq} />

        <OptionsGrid
          options={baseMcq.options}
          selectedOption={selectedOption}
          correctAnswer={baseMcq.correct_answer}
          onSelect={handleOptionSelect}
        />

        {hasAnswered && (
          <FeedbackSection
            correctAnswer={baseMcq.correct_answer}
            learningGap={baseMcq.learning_gap}
            highYieldFacts={baseMcq.high_yield_facts}
            imageDescription={baseMcq.image_description}
          />
        )}
      </ScrollView>
    </View>
  );
}

function MCQQuestion({ mcq }: { mcq: MCQData }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
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
}: {
  options?: MCQData["options"] | string[];
  selectedOption: string | null;
  correctAnswer?: string;
  onSelect: (option: string) => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!options) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No options available</Text>
      </View>
    );
  }

  if (typeof options === "object" && !Array.isArray(options) && Object.keys(options).length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Options are empty</Text>
      </View>
    );
  }

  const optionEntries = Array.isArray(options)
    ? options.map((opt, i) => {
        const label = String.fromCharCode(65 + i);
        const cleanText = typeof opt === 'string' ? opt.replace(/^([A-D]\)\s*)/, "") : String(opt);
        return [label, cleanText];
      })
    : Object.entries(options);

  return (
    <Animated.View style={[styles.optionsContainer, { opacity: fadeAnim }]}>
      {optionEntries.map(([key, value]) => {
        const text = value as string;
        const isSelected = selectedOption === key;
        const isCorrect = key === correctAnswer;
        const isWrong = isSelected && key !== correctAnswer;
        const hasAnswered = selectedOption !== null;

        return (
          <OptionButton
            key={key}
            label={key}
            text={text}
            isSelected={isSelected}
            isCorrect={hasAnswered && isCorrect}
            isWrong={hasAnswered && isWrong}
            disabled={hasAnswered}
            onPress={() => onSelect(key)}
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
  correctAnswer,
  learningGap,
  highYieldFacts,
  imageDescription,
}: {
  correctAnswer?: string;
  learningGap?: string;
  highYieldFacts?: string;
  imageDescription?: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasContent = correctAnswer || learningGap || highYieldFacts || imageDescription;
  if (!hasContent) return null;

  return (
    <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
      {correctAnswer && (
        <View style={styles.correctAnswerCard}>
          <Text style={styles.correctAnswerText}>
            Correct Answer:{" "}
            <Text style={styles.correctAnswerBold}>{correctAnswer}</Text>
          </Text>
        </View>
      )}

      {learningGap && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>Learning Gap</Text>
          {renderMarkupText(learningGap, styles.learningGapText, true)}
        </View>
      )}

      {highYieldFacts && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>High Yield Facts</Text>
          {renderMarkupText(highYieldFacts, styles.learningGapText, true)}
        </View>
      )}

      {imageDescription && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>Image Description</Text>
          {renderMarkupText(imageDescription, styles.learningGapText, true)}
        </View>
      )}
    </Animated.View>
  );
}

function renderMarkupText(
  content: string | undefined | null,
  baseStyle: any,
  isExplanation: boolean = false
) {
  if (!content || typeof content !== "string") {
    return <Text style={baseStyle}>(No content)</Text>;
  }

  const lines = content.split("\n");

  return (
    <Text style={baseStyle}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {parseInlineMarkup(line, isExplanation)}
          {lineIndex < lines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </Text>
  );
}

function parseInlineMarkup(text: string, isExplanation: boolean = false) {
  const parts: React.ReactNode[] = [];
  let key = 0;

  const regex = /(\*_[^_]+_\*|\*[^*]+\*|_[^_]+_)/g;
  const segments = text.split(regex);

  segments.forEach((segment) => {
    if (segment.startsWith("*_") && segment.endsWith("_*")) {
      parts.push(
        <Text
          key={key++}
          style={isExplanation ? styles.explanationBoldItalic : styles.boldItalic}
        >
          {segment.slice(2, -2)}
        </Text>
      );
    } else if (segment.startsWith("*") && segment.endsWith("*")) {
      parts.push(
        <Text key={key++} style={isExplanation ? styles.explanationBold : styles.bold}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else if (segment.startsWith("_") && segment.endsWith("_")) {
      parts.push(
        <Text key={key++} style={isExplanation ? styles.explanationItalic : styles.italic}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else {
      parts.push(<Text key={key++}>{segment}</Text>);
    }
  });

  return <>{parts}</>;
}

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
    color: "#ffffff",
  },
  correctAnswerBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25D366",
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
    color: "#ffffff",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d32f2f",
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    textAlign: "center",
  },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  boldItalic: { fontWeight: "700", fontStyle: "italic" },
  explanationBold: { fontWeight: "700", color: "#d9f99d" },
  explanationItalic: { fontStyle: "italic", color: "#ffffff" },
  explanationBoldItalic: {
    fontWeight: "700",
    fontStyle: "italic",
    color: "#d9f99d",
  },
});
