import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2 } from 'lucide-react-native';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    college: string;
    year: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const savedPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Ananya Iyer',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'CMC Vellore',
      year: '2nd Year',
    },
    timestamp: '1d ago',
    content: 'Sharing my notes on anatomy for anyone preparing for exams. DM me if you need them!',
    likes: 67,
    comments: 23,
    shares: 12,
  },
  {
    id: '2',
    author: {
      name: 'Rahul Verma',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'JIPMER Puducherry',
      year: '3rd Year',
    },
    timestamp: '3d ago',
    content: 'Complete guide to pharmacology drug mechanisms. This helped me ace my exam!',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    likes: 89,
    comments: 31,
    shares: 24,
  },
  {
    id: '3',
    author: {
      name: 'Meera Singh',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'CMC Vellore',
      year: 'Final Year',
    },
    timestamp: '1w ago',
    content: 'Important tips for clinical rotations. Wish I knew these when I started!',
    likes: 124,
    comments: 45,
    shares: 18,
  },
];

export default function SavedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Saved Items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedPosts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.post}
            onPress={() => router.push(`/feed/post/${post.id}`)}>
            <Pressable
              style={styles.postHeader}
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/feed/profile/${post.author.name}`);
              }}>
              <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
              <View style={styles.postAuthorInfo}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.authorMeta}>
                  {post.author.college} • {post.author.year}
                </Text>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
            </Pressable>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.image && (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`/feed/media?url=${encodeURIComponent(post.image!)}`);
                }}>
                <Image source={{ uri: post.image }} style={styles.postImage} />
              </Pressable>
            )}

            <View style={styles.postActions}>
              <Pressable style={styles.actionButton}>
                <ThumbsUp size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <MessageCircle size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Share2 size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.shares}</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
    marginBottom: 2,
    paddingVertical: 16,
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
    lineHeight: 22,
    color: '#e5e7eb',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 240,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
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
});
