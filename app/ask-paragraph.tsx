//ask-paragraph.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { StudentBubble } from '@/components/chat/StudentBubble';
import MentorBubbleReply from '@/components/types/MentorBubbleReply';
import { MessageInput } from '@/components/chat/MessageInput';
import LLMMCQCard from '@/components/chat/llm/LLMMCQCard';
// 🔒 Hide internal control + diagnostic labels (UI only)
function stripControlBlocks(text: string) {
  return text
    // ❌ Remove diagnostic headings but KEEP content
    .replace(
  /\[(CORE_CONCEPT|GAP|EXPLANATION|COMMON_CONFUSION|MEMORY_HOOK|SUB_CONCEPT)\]:\s*/gi,
  ""
)


    // ❌ Hide control tokens
    .replace(/\[STUDENT_REPLY_REQUIRED\]/g, "")
    .replace(/\[FEEDBACK_CORRECT\]/g, "")
    .replace(/\[FEEDBACK_WRONG\]/g, "")
    .replace(/\[SYSTEM_RETRY\]/g, "")

    // ❌ Hide MCQ internals
    .replace(/^Correct:\s*[A-D]\s*$/gim, "")

    .trim();
}



interface Dialog {
  role: 'student' | 'mentor';
  content: string;
  streaming?: boolean;
}

interface MCQData {
  stem?: string;
  question?: string;
  options: any;
  correct_answer?: string;
  correctAnswerId?: string;
  feedback: any;
}


export default function AskParagraphScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mcqData, setMcqData] = useState<MCQData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextSuggestions, setNextSuggestions] = useState<any[]>([]);
  
// 1️⃣ Parse MCQ JSON from router
useEffect(() => {
  if (!params.mcq_json) return;

  try {
    const parsed = JSON.parse(params.mcq_json as string);
    setMcqData(parsed);
  } catch (e) {
    console.error("❌ Failed to parse mcq_json from params", e);
  }
}, [params.mcq_json]);

// 2️⃣ Debug MCQ shape (SAFE)
useEffect(() => {
  if (!mcqData) return;

  console.log("🧠 [AskParagraph] FULL MCQ JSON", {
    mcqData,
    stem: mcqData.stem,
    options: mcqData.options,
    correct_answer: mcqData.correct_answer,
    feedback: mcqData.feedback,
    learning_gap: mcqData.learning_gap,
  });
}, [mcqData]);


  useEffect(() => {
  if (!params.session_id) return;

  const sessionId = params.session_id as string;
  setSessionId(sessionId);

  const fetchSession = async () => {
    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
      const res = await fetch(`${API_BASE_URL}/ask-paragraph/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!res.ok) throw new Error("Failed to load session");

      const data = await res.json();
      const dialogs = data.dialogs || [];
      const suggestions = data.next_suggestions || [];

      setConversation(dialogs);
      setNextSuggestions(suggestions);

    } catch (e) {
      console.error("Failed to load session", e);
    } finally {
      setLoading(false);
    }
  };

  fetchSession();
}, [params.session_id]);


  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversation, isTyping]);

  const handleSendMessage = async (message: string) => {
  if (!message.trim() || !sessionId || isTyping) return;

  // 1️⃣ Immediately append student message
 // ✅ ONLY append student message
setConversation(prev => [
  ...prev,
  { role: "student", content: message }
]);


  setIsTyping(true);

  try {
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

    const res = await fetch(`${API_BASE_URL}/ask-paragraph/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: params.student_id,
        mcq_id: params.mcq_id,
        message,
      }),
    });

    if (!res.body) throw new Error("No stream body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });

        // 2️⃣ Append streamed text to last mentor bubble
       // ✅ CREATE mentor bubble only when stream starts
setConversation(prev => {
  const updated = [...prev];
  const last = updated[updated.length - 1];

  if (!last || last.role !== "mentor") {
    updated.push({ role: "mentor", content: chunk });
  } else {
    updated[updated.length - 1] = {
      ...last,
      content: last.content + chunk,
    };
  }

  return updated;
});
      }
    }
  } catch (e) {
    console.error("Chat error", e);
  } finally {
    setIsTyping(false);
  }
};



// Allow MCQ to render even while chat loads


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask Paragraph</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {mcqData && (
  <View style={styles.mcqContainer}>
    <LLMMCQCard mcq={mcqData} />
  </View>
)}


          <View style={styles.conversationContainer}>
{conversation
  .filter(msg => msg.role !== "system")   // 🔥 KEY LINE
  .map((msg, index) =>
    msg.role === 'student' ? (
      <StudentBubble key={index} text={msg.content} />
    ) : (
     <MentorBubbleReply
  key={index}
  markdownText={
    typeof msg.content === "string"
      ? stripControlBlocks(msg.content)
      : ""
  }
/>

    )
)}


            {/* ✅ ADD THIS BLOCK — EXACT LOCATION */}
  {loading && (
    <View style={{ paddingVertical: 20, alignItems: "center" }}>
      <ActivityIndicator size="small" color={theme.colors.accent} />
      <Text style={styles.loadingText}>Loading discussion...</Text>
    </View>
  )}


            {isTyping && (
              <MentorBubbleReply markdownText="💬 *Paragraph Mentor is typing…*" />
            )}

            {nextSuggestions?.length > 0 && (
              <View style={styles.suggestionRow}>
                {nextSuggestions.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionChip}
                  >
                    <Text style={styles.suggestionText}>{s.label || s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <MessageInput
            onSend={(message) => {
              if (isTyping) return;
              handleSendMessage(message);
            }}
            placeholder="Answer or ask anything…"
            disabled={isTyping}
          />

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 56 : theme.spacing.lg,
    backgroundColor: theme.colors.mentorBubble,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  mcqContainer: {
    marginBottom: theme.spacing.xl,
  },
  conversationContainer: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    backgroundColor: theme.colors.mentorBubble,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  suggestionText: {
    fontSize: 13,
    color: theme.colors.text,
  },
});
