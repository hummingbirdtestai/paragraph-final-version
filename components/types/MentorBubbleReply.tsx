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
  let blocks = [];

  try {
    blocks = parseLLMBlocks(markdownText);
  } catch (e) {
    console.log("🔥 LLM block parse failed", e);
    blocks = [{ type: 'TEXT', text: markdownText }];
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
    maxWidth: '85%',
    marginLeft: 8,
  },
});
