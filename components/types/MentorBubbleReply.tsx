import { View, StyleSheet, Text } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import MarkdownText from './MarkdownText';
import { parseLLMBlocks } from '@/components/chat/llm/parseLLMBlocks';
import { ConceptCard } from '@/components/chat/llm/ConceptCard';
import { TableCard } from '@/components/chat/llm/TableCard';

interface MentorBubbleProps {
  markdownText: string;
}

export default function MentorBubbleReply({ markdownText }: MentorBubbleProps) {
  const cleanedText = markdownText
    .replace(/\[STUDENT_REPLY_REQUIRED\]/g, '')
    .replace(/\[FEEDBACK_CORRECT\]/g, '')
    .replace(/\[FEEDBACK_WRONG\]/g, '')
    .replace(/\[CLARIFICATION\]/g, '')
    .replace(/\[RECHECK_MCQ.*?\]/g, '')
    .replace(/\[FINAL_ANSWER\]/g, '')
    .replace(/\[TAKEAWAYS\]/g, '')
    .replace(/\[CONCEPT.*?\]/g, '')
    .replace(/\[MCQ.*?\]/g, '')
    .trim();

  const isTyping = markdownText.startsWith('💬');

  if (isTyping) {
    return (
      <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
        <View style={styles.tail} />
        <View style={styles.bubble}>
          <Text style={styles.typingText}>{cleanedText}</Text>
        </View>
      </Animated.View>
    );
  }

  let blocks = [];

  try {
    blocks = parseLLMBlocks(cleanedText);
  } catch (e) {
    console.log("🔥 LLM block parse failed", e);
    blocks = [{ type: 'TEXT', text: cleanedText }];
  }

  return (
    <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
      <View style={styles.tail} />
      <View style={styles.bubble}>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case 'CONCEPT':
              return (
                <ConceptCard
                  key={idx}
                  title={block.title}
                  text={block.text}
                />
              );

            case 'CONCEPT_TABLE':
              return <TableCard key={idx} rows={block.rows} />;

            default:
              return (
                <MarkdownText key={idx}>
                  {'text' in block ? block.text : ''}
                </MarkdownText>
              );
          }
        })}
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
    maxWidth: '80%',
    marginLeft: 8,
  },
  typingText: {
    color: '#e1e1e1',
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.6,
  },
});
