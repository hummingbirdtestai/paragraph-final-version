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
} from 'react-native';
import { Send } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  type: 'mentor' | 'concept' | 'student';
  content: string;
  title?: string;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'concept',
      title: item?.Concept || '',
      content: item?.Explanation || '',
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
  reviewMode,           // ⭐ ADD THIS
  phaseUniqueId         // ⭐ ADD THIS
}: {
  message: Message;
  index: number;
  studentId: string;
  isBookmarked: boolean;
  reviewMode: boolean;           // ⭐
  phaseUniqueId: string;         // ⭐
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
      {/* Bookmark removed */}
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



/* --- your renderMarkupText and parseInlineMarkup stay the same --- */

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
