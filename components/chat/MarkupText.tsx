import React from "react";
import { Text } from "react-native";
import { theme } from "@/constants/theme";

// ⚙️ Simple markdown-like inline parser using Unicode-friendly approach
export const MarkupText = ({ content }: { content: string }) => {
  // Breaks text into parts: **bold**, _italic_, or plain
  const tokens = content.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);

  return (
    <Text style={{ color: theme.colors.text, lineHeight: 22 }}>
      {tokens.map((token, idx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <Text key={idx} style={{ fontWeight: "700", color: "#fff" }}>
              {token.slice(2, -2)}
            </Text>
          );
        }
        if (token.startsWith("_") && token.endsWith("_")) {
          return (
            <Text key={idx} style={{ fontStyle: "italic", color: "#7dd3fc" }}>
              {token.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={idx}>{token}</Text>;
      })}
    </Text>
  );
};
