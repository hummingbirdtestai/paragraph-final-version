import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface PostHashtagsProps {
  hashtags: string[];
}

export function PostHashtags({ hashtags }: PostHashtagsProps) {
  const router = useRouter();

  if (!hashtags || hashtags.length === 0) {
    return null;
  }

  const handleHashtagPress = (hashtag: string) => {
    router.push(`/feed/tag/${hashtag}`);
  };

  return (
    <View style={styles.container}>
      {hashtags.map((tag, index) => (
        <Pressable
          key={index}
          onPress={() => handleHashtagPress(tag)}
          style={({ pressed }) => [
            styles.hashtag,
            pressed && styles.hashtagPressed,
          ]}>
          <Text style={styles.hashtagText}>#{tag}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  hashtag: {
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  hashtagPressed: {
    opacity: 0.7,
  },
  hashtagText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '500',
  },
});
