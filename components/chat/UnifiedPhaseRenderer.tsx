import React from "react";
import { View, Text, Pressable } from "react-native";
import { theme } from "@/constants/theme";
import { MentorBubble } from "@/components/chat/MentorBubble";
import { MCQBlock } from "@/components/chat/MCQBlock";
import { MarkupText } from "@/components/common/MarkupText"; // ← new renderer for bold/italic etc.

export const UnifiedPhaseRenderer = ({
  message,
  onNext,
  onAnswer,
}: {
  message: any;
  onNext: () => void;
  onAnswer?: (isCorrect: boolean) => void;
}) => {
  const phase = message.data;
  const type = message.type?.toLowerCase();

  // 🟢 MENTOR REFLECTION (plain paragraph style)
  if (type === "mentor_reflection") {
    return (
      <MentorBubble key={message.id}>
        <MarkupText content={phase.text} />
      </MentorBubble>
    );
  }

  // 🧠 CONCEPT PHASE (concept + explanation)
  if (type === "concept") {
    return (
      <View key={message.id} style={{ marginBottom: theme.spacing.xl }}>
        <MentorBubble>
          <MarkupText content={phase.Concept} />
        </MentorBubble>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
            marginTop: theme.spacing.sm,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <MarkupText content={phase.Explanation} />
        </View>

        <Text
          style={{
            color: theme.colors.subtleText,
            marginTop: theme.spacing.lg,
            fontSize: 14,
            textDecorationLine: "none",
          }}
          selectable={false}
        >
          Type any questions you have or if all clear, proceed by clicking “Next ➡️”.
        </Text>

        <Pressable
          style={{
            backgroundColor: theme.colors.accent,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            borderRadius: theme.borderRadius.md,
            alignSelf: "flex-start",
            marginTop: theme.spacing.md,
          }}
          onPress={onNext}
        >
          <Text
            style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}
          >
            Next ➡️
          </Text>
        </Pressable>
      </View>
    );
  }

  // 🎯 MCQ PHASE
  if (type === "mcq") {
    return (
      <View key={message.id} style={{ marginBottom: theme.spacing.xl }}>
        <MCQBlock data={phase} onAnswer={onAnswer} />
      </View>
    );
  }

  // fallback
  return null;
};
