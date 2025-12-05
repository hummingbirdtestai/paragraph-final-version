import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MediaViewerScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const [scale, setScale] = useState(1);

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={() => router.back()} />

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <View style={styles.closeButtonBg}>
          <X size={24} color="#e5e7eb" />
        </View>
      </Pressable>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: decodeURIComponent(url || '') }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 16,
    zIndex: 10,
  },
  closeButtonBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
