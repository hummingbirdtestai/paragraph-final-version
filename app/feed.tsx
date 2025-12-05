//feed.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedData } from '@/hooks/useFeedData';
import { usePostActions } from '@/hooks/usePostActions';
import { PostCard } from '@/components/PostCard';
import { SubjectFilterBubble } from '@/components/SubjectFilterBubble';
import PostPerformanceBanner from '@/components/PostPerformanceBanner';
import FeedSkeletonLoader from '@/components/FeedSkeletonLoader';
import { UserAvatar } from '@/components/UserAvatar';

const subjects = [
  'General Medicine',
  'Anatomy',
  'Anesthesia',
  'Biochemistry',
  'Community Medicine',
  'Dermatology',
  'ENT',
  'Forensic Medicine',
  'General Surgery',
  'Microbiology',
  'OBG',
  'Obstetrics and Gynaecology',
  'Ophthalmology',
  'Orthopedics',
  'Pathology',
  'Pediatrics',
  'Pharmacology',
  'Physiology',
  'Psychiatry',
  'Radiology',
];

export default function FeedScreen() {
  const router = useRouter();

  // ✅ define the state FIRST
  const [selectedSubject, setSelectedSubject] = useState<string>('General Medicine');

  // ✅ now you can safely pass it into the hook
  const { posts, loading, refreshing, refresh, loadMore, isLoadingMore } =
  useFeedData(selectedSubject);

  console.log("🟣 FeedScreen — posts received:", posts);

  const { handleLike, handleComment, handleShare } = usePostActions();


 
  const currentUserAvatar = 'https://i.pravatar.cc/150?img=33';

  const handleSubjectPress = (subject: string) => {
  if (selectedSubject === subject) {
    setSelectedSubject(null);
  } else {
    setSelectedSubject(subject);
  }
};


  const handleCreatePost = () => {
    router.push('/feed/create');
  };

  const handleActivityPress = () => {
    router.push('/feed/activity');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
        </View>
        <FeedSkeletonLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
      </View>

<ScrollView
  style={styles.scrollView}
  contentContainerStyle={styles.scrollContent}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refresh}
      tintColor="#25D366"
      colors={["#25D366"]}
    />
  }
  onScroll={({ nativeEvent }) => {
    const paddingToBottom = 200;

    const isBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom;

    if (isBottom) {
      loadMore(); // 🔥 auto-load next 20 posts
    }
  }}
  scrollEventThrottle={16}
>



        <View style={styles.subjectsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsContainer}
            style={styles.subjectsScroll}>
            {subjects.map((subject) => (
              <SubjectFilterBubble
                key={subject}
                subject={subject}
                selected={selectedSubject === subject}
                onPress={() => handleSubjectPress(subject)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.postsContainer}>
          {posts.map((post) => (
<PostCard
  key={post.id}
  post={{
    id: post.id,

    keyword: post.v6?.Keyword ?? "",
    post_content: post.v6?.post_content ?? "",
    image_description: post.v6?.image_description ?? post.image_description ?? "",
    image_url: post.image_url ?? null,

    cached_user_name: post.cached_user_name,
    cached_user_avatar_url: post.cached_user_avatar_url,
    created_at: post.created_at,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    shares_count: post.shares_count,
  }}
  onLike={handleLike}
  onComment={handleComment}
  onShare={handleShare}
/>



          ))}
        </View>
        {posts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to share your thoughts
            </Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#25D366',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    ...(Platform.OS === 'web' && {
      maxWidth: 760,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    }),
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111b21',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 12,
  },
  createInputContainer: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    backgroundColor: '#1a2329',
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  createPlaceholder: {
    fontSize: 15,
    color: '#64748b',
  },
  subjectsWrapper: {
    ...(Platform.OS === 'web' && {
      maxWidth: 760,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%',
    }),
  },
  subjectsScroll: {
    marginBottom: 16,
    ...(Platform.OS === 'web' && {
      flexWrap: 'wrap',
    }),
  },
  subjectsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    ...(Platform.OS === 'web' && {
      flexWrap: 'wrap',
    }),
  },
  postsContainer: {
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' && {
      paddingHorizontal: 0,
    }),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
