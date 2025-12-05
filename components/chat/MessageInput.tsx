// components/chat/MessageInput.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean; // ✅ new prop for disabling input
}

export function MessageInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View
      style={[styles.container, disabled && { opacity: 0.5 }]} // 👈 dim entire input bar when disabled
      pointerEvents={disabled ? 'none' : 'auto'} // 👈 block touch interactions when disabled
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          multiline={false}            // ✅ convert to single-line input
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend} // ✅ Enter key will now send
          blurOnSubmit={true} 
          editable={!disabled} // 👈 disable text editing
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || disabled} // 👈 disable button when input is empty or disabled
          activeOpacity={0.7}
        >
          <Send
            size={20}
            color={
              !message.trim() || disabled
                ? theme.colors.textSecondary
                : theme.colors.accent
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingBottom: Platform.OS === 'web' ? theme.spacing.md : theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    maxHeight: 100,
    paddingVertical: theme.spacing.xs,
  },
  sendButton: {
    padding: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
