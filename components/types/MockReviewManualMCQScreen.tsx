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
  stem: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: "A" | "B" | "C" | "D";
  learning_gap?: string;
  high_yield_facts?: string;
  image_description?: string;
}

interface Props {
  mcqJson: MCQData[];
  isMcqImageType?: boolean;
  mcqImage?: string;
}

export default function MockReviewManualMCQScreen({
  mcqJson,
  isMcqImageType = false,
  mcqImage,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selectedOption) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [selectedOption]);

  if (!mcqJson || mcqJson.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No MCQ data available</Text>
      </View>
    );
  }

  const mcq = mcqJson[0];
  const correctAnswer = mcq.correct_answer;

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
  };

  const isCorrect = selectedOption === correctAnswer;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <MCQQuestion stem={mcq.stem} />

        {isMcqImageType && mcqImage && (
          <ImageSection uri={mcqImage} />
        )}

        <OptionsGrid
          options={mcq.options}
          selectedOption={selectedOption}
          correctAnswer={correctAnswer}
          onSelect={handleOptionSelect}
        />

        {selectedOption && (
          <PostAnswerReveal
            correctAnswer={correctAnswer}
            learningGap={mcq.learning_gap}
            highYieldFacts={mcq.high_yield_facts}
            imageDescription={mcq.image_description}
          />
        )}
      </ScrollView>
    </View>
  );
}

function MCQQuestion({ stem }: { stem: string }) {
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
      {renderMarkupText(stem, styles.mcqStem)}
    </Animated.View>
  );
}

function ImageSection({ uri }: { uri: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.imageSection, { opacity: fadeAnim }]}>
      <ZoomableImage uri={uri} height={260} />
    </Animated.View>
  );
}

function OptionsGrid({
  options,
  selectedOption,
  correctAnswer,
  onSelect,
}: {
  options: { A: string; B: string; C: string; D: string };
  selectedOption: string | null;
  correctAnswer: string;
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

  const optionKeys = ["A", "B", "C", "D"] as const;

  return (
    <Animated.View style={[styles.optionsContainer, { opacity: fadeAnim }]}>
      {optionKeys.map((key) => {
        const text = options[key];
        if (!text) return null;

        const isCorrectOption = key === correctAnswer;
        const isWrongSelected = selectedOption === key && key !== correctAnswer;
        const isDisabled = selectedOption !== null;

        return (
          <OptionButton
            key={key}
            label={key}
            text={text}
            isSelected={selectedOption === key}
            isCorrect={isCorrectOption && selectedOption !== null}
            isWrong={isWrongSelected}
            disabled={isDisabled}
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

function PostAnswerReveal({
  correctAnswer,
  learningGap,
  highYieldFacts,
  imageDescription,
}: {
  correctAnswer: string;
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

  return (
    <Animated.View style={[styles.revealContainer, { opacity: fadeAnim }]}>
      <View style={styles.correctAnswerCard}>
        <Text style={styles.correctAnswerText}>
          Correct Answer: <Text style={styles.correctAnswerBold}>{correctAnswer}</Text>
        </Text>
      </View>

      {learningGap && (
        <View style={styles.learningGapCard}>
          <Text style={styles.sectionTitle}>Learning Gap</Text>
          {renderMarkupText(learningGap, styles.sectionText)}
        </View>
      )}

      {highYieldFacts && (
        <View style={styles.highYieldCard}>
          <Text style={styles.sectionTitle}>High Yield Facts</Text>
          {renderMarkupText(highYieldFacts, styles.sectionText)}
        </View>
      )}

      {imageDescription && (
        <View style={styles.imageDescCard}>
          <Text style={styles.sectionTitle}>Image Description</Text>
          {renderMarkupText(imageDescription, styles.sectionText)}
        </View>
      )}
    </Animated.View>
  );
}

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
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
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
  imageSection: {
    marginBottom: 16,
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
  revealContainer: {
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
    color: "#b0b0b0",
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
  highYieldCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 14,
    marginBottom: 12,
  },
  imageDescCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888888",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#b0b0b0",
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  boldItalic: {
    fontWeight: "700",
    fontStyle: "italic",
  },
});
