import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface FeedSkeletonLoaderProps {
  count?: number;
}

export default function FeedSkeletonLoader({ count = 3 }: FeedSkeletonLoaderProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </View>
  );
}

function PostSkeleton() {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.3 + shimmer.value * 0.4,
    };
  });

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Animated.View style={[styles.avatar, animatedStyle]} />
        <View style={styles.authorInfo}>
          <Animated.View style={[styles.authorName, animatedStyle]} />
          <Animated.View style={[styles.authorMeta, animatedStyle]} />
        </View>
      </View>

      <Animated.View style={[styles.contentLine1, animatedStyle]} />
      <Animated.View style={[styles.contentLine2, animatedStyle]} />
      <Animated.View style={[styles.contentLine3, animatedStyle]} />

      <View style={styles.tagsContainer}>
        <Animated.View style={[styles.tag, animatedStyle]} />
        <Animated.View style={[styles.tag, animatedStyle]} />
      </View>

      <Animated.View style={[styles.image, animatedStyle]} />

      <View style={styles.actions}>
        <Animated.View style={[styles.actionButton, animatedStyle]} />
        <Animated.View style={[styles.actionButton, animatedStyle]} />
        <Animated.View style={[styles.actionButton, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  postCard: {
    backgroundColor: '#1a2329',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2a3942',
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
    gap: 6,
  },
  authorName: {
    height: 16,
    width: 120,
    borderRadius: 4,
    backgroundColor: '#2a3942',
  },
  authorMeta: {
    height: 12,
    width: 180,
    borderRadius: 4,
    backgroundColor: '#2a3942',
  },
  contentLine1: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#2a3942',
    marginBottom: 8,
  },
  contentLine2: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#2a3942',
    marginBottom: 8,
    width: '90%',
  },
  contentLine3: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#2a3942',
    marginBottom: 12,
    width: '70%',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    height: 24,
    width: 80,
    borderRadius: 12,
    backgroundColor: '#2a3942',
  },
  image: {
    height: 200,
    borderRadius: 8,
    backgroundColor: '#2a3942',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    height: 20,
    width: 50,
    borderRadius: 4,
    backgroundColor: '#2a3942',
  },
});
