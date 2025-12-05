import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, ThumbsUp } from 'lucide-react-native';
import { useState } from 'react';

type Tab = 'posts' | 'comments' | 'likes' | 'saved' | 'drafts';

interface Activity {
  id: string;
  type: 'post' | 'comment' | 'like';
  content: string;
  timestamp: string;
  likes?: number;
  comments?: number;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'post',
    content: 'Just finished my cardiology rotation. The experience was incredible and I learned so much about patient care.',
    timestamp: '2d ago',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    type: 'post',
    content: 'Looking for study partners for the upcoming anatomy exam. Anyone interested?',
    timestamp: '5d ago',
    likes: 15,
    comments: 12,
  },
  {
    id: '3',
    type: 'post',
    content: 'Sharing my pharmacology notes for everyone preparing for finals.',
    timestamp: '1w ago',
    likes: 42,
    comments: 18,
  },
];

export default function ActivityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>My Activity</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}>
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}>
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
            Comments
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}>
          <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
            Likes
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => router.push('/feed/saved')}>
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Saved
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'drafts' && styles.activeTab]}
          onPress={() => setActiveTab('drafts')}>
          <Text style={[styles.tabText, activeTab === 'drafts' && styles.activeTabText]}>
            Drafts
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activities.map((activity) => (
          <Pressable key={activity.id} style={styles.activityItem}>
            <Text style={styles.activityContent}>{activity.content}</Text>
            <View style={styles.activityMeta}>
              <Text style={styles.timestamp}>{activity.timestamp}</Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <ThumbsUp size={14} color="#64748b" strokeWidth={1.8} />
                  <Text style={styles.statText}>{activity.likes}</Text>
                </View>
                <View style={styles.stat}>
                  <MessageCircle size={14} color="#64748b" strokeWidth={1.8} />
                  <Text style={styles.statText}>{activity.comments}</Text>
                </View>
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
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1a2329',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  activeTabText: {
    color: '#25D366',
  },
  content: {
    flex: 1,
  },
  activityItem: {
    backgroundColor: '#111b21',
    padding: 16,
    marginBottom: 2,
  },
  activityContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e5e7eb',
    marginBottom: 12,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
