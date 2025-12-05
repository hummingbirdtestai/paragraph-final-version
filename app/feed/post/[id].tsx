import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ThumbsUp } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import PostPerformanceBanner from '@/components/PostPerformanceBanner';
import ShareBottomSheet from '@/components/ShareBottomSheet';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const post = {
  id: '1',
  author: {
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'AIIMS Delhi',
    year: 'Final Year',
  },
  timestamp: '2h ago',
  content: 'Just finished my cardiology rotation. The experience was incredible and I learned so much about patient care and diagnostics. Special thanks to Dr. Mehta for the guidance.',
  likes: 24,
  comments: 8,
  shares: 3,
};

const comments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Arjun Patel',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
    content: 'Congratulations! Cardiology is such an interesting field.',
    timestamp: '1h ago',
  },
  {
    id: '2',
    author: {
      name: 'Meera Singh',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
    content: 'Would love to hear more about your experience!',
    timestamp: '45m ago',
  },
];

export default function PostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showPerformanceBanner, setShowPerformanceBanner] = useState(false);
  const [performanceType, setPerformanceType] = useState<'good' | 'slow'>('good');
  const [shareSheetVisible, setShareSheetVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isGoodPerformance = post.likes > 20;
      setPerformanceType(isGoodPerformance ? 'good' : 'slow');
      setShowPerformanceBanner(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    setShareSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <PostPerformanceBanner
        visible={showPerformanceBanner}
        onClose={() => setShowPerformanceBanner(false)}
        onShare={() => {}}
        performanceType={performanceType}
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
            <View style={styles.postAuthorInfo}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.authorMeta}>
                {post.author.college} • {post.author.year}
              </Text>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          <View style={styles.postActions}>
            <Pressable style={styles.actionButton}>
              <ThumbsUp size={20} color="#94a3b8" strokeWidth={1.8} />
              <Text style={styles.actionText}>{post.likes}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ShareBottomSheet
        visible={shareSheetVisible}
        onClose={() => setShareSheetVisible(false)}
        postId={id as string}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  content: {
    flex: 1,
  },
  post: {
    backgroundColor: '#111b21',
    paddingVertical: 16,
    marginBottom: 2,
  },
  postHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  authorMeta: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  postContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#e5e7eb',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  commentsSection: {
    backgroundColor: '#111b21',
    paddingVertical: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e5e7eb',
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#64748b',
  },
});
