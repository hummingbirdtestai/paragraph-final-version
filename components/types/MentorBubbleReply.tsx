import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import MarkdownText from './MarkdownText';

interface MentorBubbleProps {
  markdownText: string;
}

export default function MentorBubbleReply({ markdownText }: MentorBubbleProps) {
  let content;

  try {
    if (!markdownText || typeof markdownText !== "string")
      throw new Error("Invalid markdownText");

    content = <MarkdownText>{markdownText}</MarkdownText>;
  } catch (e) {
    console.log("🔥 MentorBubbleReply render failed:", e, markdownText);
    content = <Text style={{ color: "#e1e1e1" }}>{String(markdownText)}</Text>;
  }

  return (
    <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
      <View style={styles.tail} />
      <View style={styles.bubble}>
        {content}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: '#1e1e1e',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    left: 16,
    top: 18,
  },
  bubble: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    borderRightWidth: 3,
    borderRightColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%',
    marginLeft: 8,
  },
});
