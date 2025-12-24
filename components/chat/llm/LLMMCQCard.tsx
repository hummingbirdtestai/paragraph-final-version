import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

/* ---------------- TYPES ---------------- */

interface MCQData {
  id?: string;
  stem: string;
  options: { [key: string]: string } | string[];
  feedback?: {
    wrong?: string;
    correct?: string;
  };
  learning_gap?: string;
  correct_answer?: string;
}

/* ---------------- COMPONENT ---------------- */

export default function LLMMCQCard({ mcq }: { mcq: MCQData }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* MCQ STEM */}
      <View style={styles.mcqCard}>
        {renderMarkupText(mcq.stem, styles.mcqStem)}
      </View>

      {/* OPTIONS (READ ONLY) */}
      <View style={styles.optionsContainer}>
        {normalizeOptions(mcq.options).map(([key, value]) => (
          <View key={key} style={styles.optionButton}>
            <Text style={styles.optionLabel}>{key}</Text>
            {renderMarkupText(value, styles.optionText)}
          </View>
        ))}
      </View>

      {/* CORRECT ANSWER */}
      {mcq.correct_answer && (
        <View style={styles.correctAnswerCard}>
          <Text style={styles.correctAnswerText}>
            Correct Answer:{" "}
            <Text style={styles.correctAnswerBold}>
              {mcq.correct_answer}
            </Text>
          </Text>
        </View>
      )}

      {/* FEEDBACK */}
      {mcq.feedback?.correct && (
        <View style={styles.feedbackBubble}>
          {renderMarkupText(mcq.feedback.correct, styles.feedbackText)}
        </View>
      )}

      {/* LEARNING GAP */}
      {mcq.learning_gap && (
        <View style={styles.learningGapCard}>
          <Text style={styles.learningGapTitle}>Learning Gap</Text>
          {renderMarkupText(mcq.learning_gap, styles.learningGapText)}
        </View>
      )}
    </Animated.View>
  );
}

/* ---------------- HELPERS ---------------- */

function normalizeOptions(
  options: MCQData["options"]
): [string, string][] {
  if (Array.isArray(options)) {
    return options.map((opt, i) => [
      String.fromCharCode(65 + i),
      opt.replace(/^([A-D]\)\s*)/, ""),
    ]);
  }

  return Object.entries(options);
}

/* ---------------- MARKUP PARSER (REUSED) ---------------- */

function renderMarkupText(
  content: string | undefined | null,
  baseStyle: any
) {
  if (!content || typeof content !== "string") return null;

  const lines = content.split("\n");

  return (
    <Text style={baseStyle}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {parseInlineMarkup(line)}
          {i < lines.length - 1 && "\n"}
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

/* ---------------- STYLES (REUSED / MINIMAL) ---------------- */

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "#2a2a2a",
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
