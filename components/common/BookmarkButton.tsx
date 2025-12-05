import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Bookmark, BookmarkCheck } from 'lucide-react-native';
import { MotiView } from 'moti';
import { theme } from '@/constants/theme';

interface BookmarkButtonProps {
  initialState?: boolean;
  onToggle?: (newValue: boolean) => void;
}

export default function BookmarkButton({
  initialState = false,
  onToggle
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialState);

  useEffect(() => {
    setIsBookmarked(initialState);
  }, [initialState]);
  
  const handlePress = () => {
    const newValue = !isBookmarked;
    setIsBookmarked(newValue);
    onToggle?.(newValue);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <MotiView
        animate={{
          scale: isBookmarked ? [1, 1.3, 1] : 1,
          rotate: isBookmarked ? '0deg' : '0deg',
        }}
        transition={{
          type: 'timing',
          duration: 400,
        }}
      >
        {isBookmarked ? (
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              damping: 12,
              stiffness: 200,
            }}
          >
            <BookmarkCheck
              size={22}
              color="#E7F527"
              fill="#E7F527"
              strokeWidth={2}
            />
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
          >
            <Bookmark
              size={22}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
          </MotiView>
        )}
      </MotiView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
