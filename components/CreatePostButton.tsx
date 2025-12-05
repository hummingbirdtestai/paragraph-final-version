import React from 'react';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

export function CreatePostButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/feed/create');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handlePress}>
      <Plus size={28} color="#0b141a" strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'web' ? 20 : 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
