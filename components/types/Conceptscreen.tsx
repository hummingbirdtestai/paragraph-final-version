import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import Markdown from 'react-native-markdown-display';

interface Message {
  id: string;
  type: 'mentor' | 'concept' | 'student';
  content: string;
  title?: string;
  conceptMarkdown?: string;
}

function extractMarkdownFromConcept(conceptField: string): string {
  if (!conceptField) return '';

  let cleaned = conceptField.trim();

  if (cleaned.startsWith('```markdown\n')) {
    cleaned = cleaned.replace(/^```markdown\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '');
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }

  return cleaned.trim();
}

export default function ConceptChatScreen({
  item,
  studentId,
  isBookmarked = false, 
  reviewMode = false,          // ⭐ ADD THIS
  phaseUniqueId   
}: {
  item: any;
  studentId: string;
  isBookmarked?: boolean;
  reviewMode?: boolean;         // ⭐ ADD THIS
  phaseUniqueId: string;        // ⭐ ADD THIS
}) {
  const conceptContent = extractMarkdownFromConcept(item?.Concept || '');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'concept',
      title: '',
      content: '',
      conceptMarkdown: conceptContent,
    },
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            index={index}
            studentId={studentId}
            isBookmarked={isBookmarked} 
            reviewMode={reviewMode}
            phaseUniqueId={phaseUniqueId}
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({
  message,
  index,
  studentId,
  isBookmarked,
  reviewMode,
  phaseUniqueId
}: {
  message: Message;
  index: number;
  studentId: string;
  isBookmarked: boolean;
  reviewMode: boolean;
  phaseUniqueId: string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const isStudent = message.type === 'student';
  const isConcept = message.type === 'concept';

  async function toggleBookmarkInLearningMode() {
    try {
      console.log("📌 Learning Mode Bookmark Toggle");

      const { data, error } = await supabase.rpc("toggle_latest_bookmark", {
        p_student_id: studentId,
        p_phase_unique_id: phaseUniqueId
      });

      if (error) {
        console.error("❌ Learning bookmark RPC error:", error);
      } else {
        console.log("🟢 Bookmark toggled:", data);
      }
    } catch (err) {
      console.error("🔥 toggleBookmarkInLearningMode failed:", err);
    }
  }

  if (isConcept && message.conceptMarkdown) {
    return (
      <Animated.View
        style={[
          styles.conceptContainer,
          isMobile ? styles.conceptContainerMobile : styles.conceptContainerWeb,
          { opacity: fadeAnim },
        ]}
      >
        <Markdown
          style={isMobile ? markdownStylesMobile : markdownStylesWeb}
        >
          {message.conceptMarkdown}
        </Markdown>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isStudent ? styles.studentBubble : styles.mentorBubble,
        isConcept && styles.conceptBubble,
        { opacity: fadeAnim },
      ]}
    >
      {isConcept && message.title && (
        <View style={styles.conceptHeader}>
          <View style={styles.conceptHeaderRow}>
            <View style={{ flex: 1 }}>
              {renderMarkupText(message.title, styles.conceptTitle)}
            </View>
          </View>
        </View>
      )}

      {renderMarkupText(
        message.content,
        isStudent ? styles.studentText : styles.mentorText
      )}
    </Animated.View>
  );
}

function renderMarkupText(content: string, baseStyle: any) {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <Text style={baseStyle}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {parseInlineMarkup(line)}
          {lineIndex < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Text>
  );
}

function parseInlineMarkup(text: string) {
  const parts: React.ReactNode[] = [];
  let key = 0;

  // Handle **bold**, _italic_, and **_bolditalic_**
  const regex = /(\*\*_[^_]+_\*\*|\*\*[^*]+\*\*|_[^_]+_)/g;
  const segments = text.split(regex);

  segments.forEach((segment) => {
    if (segment.startsWith("**_") && segment.endsWith("_**")) {
      parts.push(
        <Text key={key++} style={{ fontWeight: "700", fontStyle: "italic" }}>
          {segment.slice(3, -3)}
        </Text>
      );
    } else if (segment.startsWith("**") && segment.endsWith("**")) {
      parts.push(
        <Text key={key++} style={{ fontWeight: "700" }}>
          {segment.slice(2, -2)}
        </Text>
      );
    } else if (segment.startsWith("_") && segment.endsWith("_")) {
      parts.push(
        <Text key={key++} style={{ fontStyle: "italic" }}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else {
      parts.push(<Text key={key++}>{segment}</Text>);
    }
  });

  return <>{parts}</>;
}



const markdownStylesMobile = StyleSheet.create({
  body: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    color: '#10b981',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
    lineHeight: 28,
  },
  heading2: {
    color: '#3b82f6',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
    lineHeight: 26,
  },
  heading3: {
    color: '#8b5cf6',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 24,
    color: '#e1e1e1',
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
  },
  bullet_list: {
    marginTop: 8,
    marginBottom: 12,
  },
  ordered_list: {
    marginTop: 8,
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 16,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 14,
    marginRight: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: '#1a1a1a',
  },
  tbody: {},
  tr: {
    borderBottomWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
  },
  th: {
    flex: 1,
    padding: 10,
    fontWeight: '700',
    color: '#10b981',
    fontSize: 14,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  td: {
    flex: 1,
    padding: 10,
    color: '#e1e1e1',
    fontSize: 13,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  code_inline: {
    backgroundColor: '#1a1a1a',
    color: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: '#1a1a1a',
    color: '#10b981',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fence: {
    backgroundColor: '#1a1a1a',
    color: '#e1e1e1',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  blockquote: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 10,
    fontStyle: 'italic',
  },
  hr: {
    backgroundColor: '#333',
    height: 1,
    marginVertical: 16,
  },
});

const markdownStylesWeb = StyleSheet.create({
  body: {
    color: '#e1e1e1',
    fontSize: 16,
    lineHeight: 26,
  },
  heading1: {
    color: '#10b981',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 36,
  },
  heading2: {
    color: '#3b82f6',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 14,
    lineHeight: 32,
  },
  heading3: {
    color: '#8b5cf6',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    lineHeight: 28,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 14,
    fontSize: 16,
    lineHeight: 26,
    color: '#e1e1e1',
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
  },
  bullet_list: {
    marginTop: 10,
    marginBottom: 16,
  },
  ordered_list: {
    marginTop: 10,
    marginBottom: 16,
  },
  list_item: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 18,
    marginRight: 10,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 16,
    marginRight: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    marginVertical: 16,
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: '#1a1a1a',
  },
  tbody: {},
  tr: {
    borderBottomWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
  },
  th: {
    flex: 1,
    padding: 14,
    fontWeight: '700',
    color: '#10b981',
    fontSize: 15,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  td: {
    flex: 1,
    padding: 14,
    color: '#e1e1e1',
    fontSize: 15,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  code_inline: {
    backgroundColor: '#1a1a1a',
    color: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: '#1a1a1a',
    color: '#10b981',
    padding: 16,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fence: {
    backgroundColor: '#1a1a1a',
    color: '#e1e1e1',
    padding: 16,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  blockquote: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 5,
    borderLeftColor: '#3b82f6',
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 14,
    fontStyle: 'italic',
  },
  hr: {
    backgroundColor: '#333',
    height: 1,
    marginVertical: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  conceptContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  conceptContainerMobile: {
    width: '100%',
    maxWidth: '100%',
  },
  conceptContainerWeb: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  mentorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f1f1f',
  },
  conceptBubble: {
    backgroundColor: '#1a3a2e',
    borderLeftWidth: 4,
    borderLeftColor: '#25D366',
    paddingLeft: 16,
  },
  studentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#005c4b',
  },
  conceptHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#25D366',
  },
  conceptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conceptTitle: {
    fontSize: 17,
    lineHeight: 24,
    color: '#25D366',
  },
  mentorText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e1e1e1',
  },
  studentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ffffff',
  },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  boldItalic: { fontWeight: '700', fontStyle: 'italic' },
});
