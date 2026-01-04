import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import MarkdownText from './MarkdownText';
import { parseLLMBlocks } from '@/components/chat/llm/parseLLMBlocks';
import { ConceptCard } from '@/components/chat/llm/ConceptCard';
import { TableCard } from '@/components/chat/llm/TableCard';
import { MarkdownTable } from '@/components/common/MarkdownTable';

interface MentorBubbleProps {
  markdownText: string;
  streaming?: boolean;
}

const CLEANUP_REGEX = /\[STUDENT_REPLY_REQUIRED\]|\[FEEDBACK_CORRECT\]|\[FEEDBACK_WRONG\]|\[CLARIFICATION\]|\[RECHECK_MCQ.*?\]|\[FINAL_ANSWER\]|\[TAKEAWAYS\]|\[CONCEPT.*?\]|\[MCQ.*?\]/g;
function transformExamBlocks(text: string) {
  return text
    .replace(
      /\[HIGH_YIELD_FACTS\]/gi,
      '### 📌 10 High Yield Facts You Should Memorise for Exam'
    )
    .replace(
      /\[EXAM_COMPARISON_TABLE\]/gi,
      '### 📊 NEETPG Memory Table'
    );
}

function renderBlocks(blocks: any[]) {
  return blocks.map((block, idx) => {
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

      case 'MARKDOWN_TABLE':
        return (
          <View key={idx}>
            <MarkdownTable
              parsed={{ headers: block.headers, rows: block.rows }}
            />
          </View>
        );

      case 'MENTOR':
      case 'FEEDBACK_CORRECT':
      case 'FEEDBACK_WRONG':
      case 'CLARIFICATION':
      case 'RECHECK_MCQ':
      case 'FINAL_ANSWER':
      case 'TAKEAWAYS':
        return (
          <MarkdownText key={idx}>
            {'text' in block ? block.text.replace(CLEANUP_REGEX, '') : ''}
          </MarkdownText>
        );

      default:
        return (
          <MarkdownText key={idx}>
            {'text' in block ? block.text.replace(CLEANUP_REGEX, '') : ''}
          </MarkdownText>
        );
    }
  });
}

export default function MentorBubbleReply({ markdownText, streaming = false }: MentorBubbleProps) {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const rawText =
    typeof markdownText === 'string'
      ? markdownText
      : markdownText == null
      ? ''
      : String(markdownText);

  const isTyping = rawText.startsWith('💬');

  if (isTyping) {
    const cleanedText = rawText.replace(CLEANUP_REGEX, '').trim();
    return (
      <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
        <View style={styles.tail} />
        <View style={styles.bubble}>
          <MarkdownText>{cleanedText}</MarkdownText>
        </View>
      </Animated.View>
    );
  }

let blocks = [];

try {
  const transformedText = transformExamBlocks(rawText);
  blocks = parseLLMBlocks(transformedText);
} catch (e) {
  console.log("🔥 LLM block parse failed", e);
  blocks = [{ type: 'TEXT', text: rawText }];
}

  if (isWeb) {
    const groupedContent: Array<{ type: 'bubble' | 'table'; content: any }> = [];
    let currentBubbleBlocks: any[] = [];

    blocks.forEach((block, idx) => {
      if (block.type === 'MARKDOWN_TABLE') {
        if (currentBubbleBlocks.length > 0) {
          groupedContent.push({ type: 'bubble', content: currentBubbleBlocks });
          currentBubbleBlocks = [];
        }
        groupedContent.push({ type: 'table', content: block });
      } else {
        currentBubbleBlocks.push(block);
      }
    });

    if (currentBubbleBlocks.length > 0) {
      groupedContent.push({ type: 'bubble', content: currentBubbleBlocks });
    }

    return (
      <View style={styles.webContainer}>
        {groupedContent.map((group, groupIdx) => {
          if (group.type === 'table') {
            const block = group.content;
            return (
              <MarkdownTable
                key={`table-${groupIdx}`}
                parsed={{ headers: block.headers, rows: block.rows }}
              />
            );
          } else {
            return (
              <Animated.View
                key={`bubble-${groupIdx}`}
                entering={FadeInLeft.duration(400)}
                style={styles.container}
              >
                <View style={styles.tail} />
                <View style={styles.bubble}>
                  {renderBlocks(group.content)}
                </View>
              </Animated.View>
            );
          }
        })}
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
      <View style={styles.tail} />
      <View style={styles.bubble}>
        {renderBlocks(blocks)}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: '100%',
  },
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
