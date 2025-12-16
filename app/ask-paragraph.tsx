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
  question: string;
  options: Array<{ id: string; text: string }>;
  correctAnswerId: string;
  feedback: string;
}

export default function AskParagraphScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [conversation, setConversation] = useState<Dialog[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mcqData, setMcqData] = useState<MCQData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.session_id && params.phase_json && params.dialogs) {
      try {
        setSessionId(params.session_id as string);

        const phaseJson = typeof params.phase_json === 'string'
          ? JSON.parse(params.phase_json)
          : params.phase_json;
        setMcqData(phaseJson);

        const dialogs = typeof params.dialogs === 'string'
          ? JSON.parse(params.dialogs)
          : params.dialogs;
        setConversation(dialogs || []);

        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing params:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversation, isTyping]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !sessionId) return;

    const studentMessage: Dialog = {
      role: 'student',
      content: message,
    };

    setConversation(prev => [...prev, studentMessage]);
    setIsSending(true);
    setIsTyping(true);

    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api-endpoint.com';

      const response = await fetch(`${API_BASE_URL}/ask-paragraph/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          student_message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const mentorMessage: Dialog = {
        role: 'mentor',
        content: data.mentor_reply || data.content || 'I apologize, I could not process that.',
      };

      setConversation(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Dialog = {
        role: 'mentor',
        content: 'I apologize, but I encountered an error. Please try again.',
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading discussion...</Text>
      </View>
    );
  }

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

            {isTyping && (
              <MentorBubbleReply markdownText="💬 *Dr. Murali Bharadwaj is typing…*" />
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.inputContainer}>
          <MessageInput
            onSend={handleSendMessage}
            disabled={isSending}
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
