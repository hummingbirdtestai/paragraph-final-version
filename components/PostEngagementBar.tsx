import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ThumbsUp } from 'lucide-react-native';

interface PostEngagementBarProps {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  loading?: boolean;
}

export function PostEngagementBar({
  likesCount,
  commentsCount,
  sharesCount,
  isLiked,
  onLike,
  onComment,
  onShare,
  loading = false,
}: PostEngagementBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onLike}
        disabled={loading}>
        <ThumbsUp
          size={20}
          color={isLiked ? '#25D366' : '#94a3b8'}
          strokeWidth={2}
          fill={isLiked ? '#25D366' : 'none'}
        />
        <Text style={[styles.count, isLiked && styles.countActive]}>
          {likesCount}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  count: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  countActive: {
    color: '#25D366',
  },
});
