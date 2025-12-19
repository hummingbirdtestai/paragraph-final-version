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
import { MCQBlock } from '@/components/chat/MCQBlock';

interface Dialog {
  role: 'student' | 'mentor';
  content: string;
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
  
// ✅ READ MCQ DIRECTLY FROM ROUTER PARAMS (SOURCE OF TRUTH)
useEffect(() => {
  if (!params.mcq_json) return;

  try {
    const parsed = JSON.parse(params.mcq_json as string);
    setMcqData(parsed);
  } catch (e) {
    console.error("❌ Failed to parse mcq_json from params", e);
  }
}, [params.mcq_json]);

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
      
      setConversation(dialogs);
      
     
   
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
     // ✅ ADD THIS (LINE 1)
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

    if (!res.ok) throw new Error("Chat failed");

    const data = await res.json();

    // ✅ SERVER IS SOURCE OF TRUTH
    setConversation(data.session.dialogs);
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
              <MCQBlock
                data={mcqData}
                onAnswer={() => {}}
              />
            </View>
          )}

          <View style={styles.conversationContainer}>
            {conversation.map((msg, index) => (
              msg.role === 'student' ? (
                  <StudentBubble key={index} text={msg.content} />
                ) : (
                  <MentorBubbleReply key={index} markdownText={msg.content} />
                )
            ))}
            {/* ✅ ADD THIS BLOCK — EXACT LOCATION */}
  {loading && (
    <View style={{ paddingVertical: 20, alignItems: "center" }}>
      <ActivityIndicator size="small" color={theme.colors.accent} />
      <Text style={styles.loadingText}>Loading discussion...</Text>
    </View>
  )}


            {isTyping && (
              <MentorBubbleReply markdownText="💬 *Dr. Murali Bharadwaj is typing…*" />
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <MessageInput
            onSend={handleSendMessage}
            placeholder="Ask your doubt about this MCQ..."
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
    paddingVertical: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : theme.spacing.xl,
    backgroundColor: theme.colors.mentorBubble,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
});
