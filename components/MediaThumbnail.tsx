import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { useState } from 'react';
import { Play, ImageOff } from 'lucide-react-native';

interface MediaThumbnailProps {
  type: 'image' | 'video';
  uri: string;
  width?: number;
  height?: number;
  isOwn?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export default function MediaThumbnail({
  type,
  uri,
  width,
  height,
  isOwn = false,
  onPress,
  onLongPress,
}: MediaThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const aspectRatio = width && height ? width / height : 1.5;
  const thumbnailWidth = 250;
  const thumbnailHeight = Math.min(thumbnailWidth / aspectRatio, 350);

  if (imageError) {
    return (
      <View style={[styles.errorContainer, { width: thumbnailWidth, height: thumbnailHeight }]}>
        <ImageOff size={32} color="#94a3b8" strokeWidth={2} />
        <Text style={styles.errorText}>Image unavailable</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
      <Image
        source={{ uri }}
        style={[
          styles.thumbnail,
          {
            width: thumbnailWidth,
            height: thumbnailHeight,
            aspectRatio: aspectRatio,
          },
        ]}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />
      {type === 'video' && (
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Play size={32} color="#fff" fill="#fff" strokeWidth={0} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  thumbnail: {
    borderRadius: 8,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    backgroundColor: '#1a2329',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
