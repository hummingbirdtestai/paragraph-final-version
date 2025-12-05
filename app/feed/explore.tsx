import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';

type Tab = 'trending' | 'most-liked';

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
  tags?: string[];
}

const trendingPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Dr. Meera Singh',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'CMC Vellore',
      year: 'Final Year',
    },
    timestamp: '4h ago',
    content: 'Complete guide to ECG interpretation. This saved me during my cardiology rotation!',
    image: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    likes: 342,
    comments: 78,
    shares: 45,
    tags: ['#cardiology', '#NEETPG', '#ECG'],
  },
  {
    id: '2',
    author: {
      name: 'Arjun Patel',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'AIIMS Delhi',
      year: '3rd Year',
    },
    timestamp: '6h ago',
    content: 'Mnemonics that actually work for pharmacology. Share yours in the comments!',
    image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    likes: 289,
    comments: 91,
    shares: 52,
    tags: ['#pharmacology', '#studytips'],
  },
  {
    id: '3',
    author: {
      name: 'Sneha Reddy',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'JIPMER',
      year: '2nd Year',
    },
    timestamp: '8h ago',
    content: 'Anatomy dissection tips that made everything easier. Wish I knew these earlier!',
    image: 'https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    likes: 267,
    comments: 64,
    shares: 38,
    tags: ['#anatomy', '#medschool'],
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('trending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}>
          <TrendingUp size={16} color={activeTab === 'trending' ? '#25D366' : '#64748b'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
            Trending
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'most-liked' && styles.activeTab]}
          onPress={() => setActiveTab('most-liked')}>
          <ThumbsUp size={16} color={activeTab === 'most-liked' ? '#25D366' : '#64748b'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'most-liked' && styles.activeTabText]}>
            Most Liked
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {trendingPosts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.post}
            onPress={() => router.push(`/feed/post/${post.id}`)}>
            {post.image && (
              <Pressable onPress={() => post.image && router.push(`/feed/media?url=${encodeURIComponent(post.image)}`)}>
                {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
              </Pressable>
            )}

            <View style={styles.postBody}>
              <Pressable
                style={styles.postHeader}
                onPress={() => router.push(`/feed/profile/${post.author.name}`)}>
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

              {post.tags && (
                <View style={styles.tags}>
                  {post.tags.map((tag, index) => (
                    <Pressable
                      key={index}
                      style={styles.tag}
                      onPress={() => router.push(`/feed/tag/${encodeURIComponent(tag.replace('#', ''))}`)}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={styles.postActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/feed/likes')}>
                  <ThumbsUp size={20} color="#94a3b8" strokeWidth={1.8} />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/feed/comments')}>
                  <MessageCircle size={20} color="#94a3b8" strokeWidth={1.8} />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push('/feed/repost')}>
                  <Share2 size={20} color="#94a3b8" strokeWidth={1.8} />
                  <Text style={styles.actionText}>{post.shares}</Text>
                </Pressable>
              </View>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111b21',
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1a2329',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#25D366',
  },
  content: {
    flex: 1,
  },
  post: {
    backgroundColor: '#111b21',
    marginBottom: 2,
  },
  postImage: {
    width: '100%',
    height: 320,
  },
  postBody: {
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#1a2329',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: '#25D366',
    fontWeight: '500',
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
