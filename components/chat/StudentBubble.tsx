import { View, StyleSheet, Text } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import MarkdownText from "../types/MarkdownText";

interface StudentBubbleProps {
  text: string;
}

export function StudentBubble({ text }: StudentBubbleProps) {
  let content;

  try {
    if (!text || typeof text !== "string") throw new Error("Invalid text");
    content = <MarkdownText style={styles.text}>{text}</MarkdownText>;
  } catch (e) {
    console.log("🔥 StudentBubble render failed:", e, text);
    content = <Text style={styles.text}>{String(text)}</Text>;
  }

  return (
    <Animated.View entering={FadeInRight.springify().damping(15)} style={styles.container}>
      <View style={styles.tail} />
      <View style={styles.bubble}>{content}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "flex-end",
    flexDirection: "row-reverse",
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "#25D366",
    borderBottomWidth: 10,
    borderBottomColor: "transparent",
    position: "absolute",
    right: 16,
    top: 18,
  },
  bubble: {
    backgroundColor: "#102A17",
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#25D366",
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "85%",
    marginRight: 8,
  },
  text: {
    color: "#E6FFE6",
    fontSize: 16,
    lineHeight: 22,
    fontStyle: "italic",
    fontWeight: "500",
  },
});
