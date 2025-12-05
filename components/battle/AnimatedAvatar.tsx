import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { getFaceEmoji } from '@/components/battle/faceEmojis';


interface AnimatedAvatarProps {
  name: string;
  color: string;
  delay?: number;
}

export const AnimatedAvatar = ({ name, color, delay = 0 }: AnimatedAvatarProps) => {
  const emoji = getFaceEmoji(name);

  return (
    <MotiView
      from={{ scale: 0, opacity: 0, rotate: '-180deg' }}
      animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
      transition={{
        type: 'spring',
        damping: 12,
        delay,
      }}
      style={styles.container}
    >
      <MotiView
        animate={{
          shadowOpacity: [0.4, 0.8, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 2000,
        }}
        style={[
          styles.avatarCircle,
          {
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </MotiView>

      <Text style={styles.username} numberOfLines={1}>
        {name}
      </Text>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 34, // make emoji large and centered
    textAlign: 'center',
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 80,
    textAlign: 'center',
  },
});
