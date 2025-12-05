import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark } from 'lucide-react-native';
import { UserAvatar } from '../UserAvatar';
import { PostEngagementBar } from '../PostEngagementBar';
import Markdown from 'react-native-markdown-display';

interface PostCardProps {
  post: {
    id: string;
    Keyword: string;
    post_content: string;
    image_description: string;
    image_url?: string;
    cached_user_name?: string;
    cached_user_avatar_url?: string;
    created_at?: string;
    likes_count?: number;
    comments_count?: number;
    shares_count?: number;
  };
  onLike?: (postId: string, isLiked: boolean) => Promise<boolean>;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [expanded, setExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const COLLAPSED_HEIGHT = 110;

  const handleLike = async () => {
    if (onLike) {
      const newLikedState = await onLike(post.id, isLiked);
      setIsLiked(newLikedState);
      setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));
    }
  };

  const handleUserPress = () => {
    if (post.cached_user_name) {
      router.push(`/feed/profile/${post.cached_user_name}`);
    }
  };

  const onContentLayout = (e: any) => {
    const height = e.nativeEvent.layout.height;
    if (contentHeight === 0 && height > COLLAPSED_HEIGHT) {
      setContentHeight(height);
      setShouldShowMore(true);
    }
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'web' && styles.containerWeb,
      ]}
    >
      <View style={styles.header}>
        <Pressable style={styles.userInfo} onPress={handleUserPress}>
          <UserAvatar uri={post.cached_user_avatar_url} size={44} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.cached_user_name}</Text>
            <Text style={styles.timestamp}>
              {post.created_at ? new Date(post.created_at).toLocaleString() : ''}
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.saveButton}>
          <Bookmark size={20} color="#94a3b8" strokeWidth={2} />
        </Pressable>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View style={{ position: 'relative' }}>
          <View
            style={expanded ? {} : { maxHeight: COLLAPSED_HEIGHT, overflow: "hidden" }}
            onLayout={onContentLayout}
          >
            <Markdown style={markdownStyles}>
              {post.post_content}
            </Markdown>
          </View>

          {shouldShowMore && !expanded && (
            <LinearGradient
              colors={['rgba(17, 27, 33, 0)', 'rgba(17, 27, 33, 0.8)', 'rgba(17, 27, 33, 1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fadeOverlay}
            >
              <Pressable onPress={() => setExpanded(true)} style={styles.moreButton}>
                <Text style={styles.moreButtonText}>...more</Text>
              </Pressable>
            </LinearGradient>
          )}
        </View>

        {shouldShowMore && expanded && (
          <Pressable onPress={() => setExpanded(false)} style={styles.lessButton}>
            <Text style={styles.lessButtonText}>Show less</Text>
          </Pressable>
        )}
      </View>

      {post.image_url && (
        <Pressable
          onPress={() =>
            router.push(`/feed/media-viewer?url=${encodeURIComponent(post.image_url!)}`)
          }
        >
          <Image
            source={{ uri: post.image_url }}
            style={[
              styles.image,
              Platform.OS === 'web' && styles.imageWeb,
            ]}
            resizeMode="cover"
          />
        </Pressable>
      )}

      {onLike && onComment && onShare && (
        <PostEngagementBar
          likesCount={likesCount}
          commentsCount={post.comments_count || 0}
          sharesCount={post.shares_count || 0}
          isLiked={isLiked}
          onLike={handleLike}
          onComment={() => onComment(post.id)}
          onShare={() => onShare(post.id)}
        />
      )}
    </View>
  );
}

const markdownStyles = {
  body: {
    color: '#e1e1e1',
    fontSize: 14,
    lineHeight: 20,
  },
  heading3: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  strong: {
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
  },
  bullet_list: {
    marginTop: 8,
    marginBottom: 8,
  },
  list_item: {
    marginBottom: 4,
  },
  code_inline: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#1a1f26',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  hr: {
    backgroundColor: '#374151',
    height: 1,
    marginVertical: 12,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111b21',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  containerWeb: {
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1f2a30',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  saveButton: {
    padding: 4,
    marginTop: -4,
  },
  contentWrapper: {
    overflow: 'hidden',
  },
  collapsedContent: {
    maxHeight: 100,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#25D366',
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionBox: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    marginBottom: 12,
  },
  sectionTitleContainer: {
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e1e1e1',
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  toggleText: {
    fontSize: 13,
    color: '#25D366',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  imageWeb: {
    borderRadius: 12,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingLeft: 50,
    paddingTop: 20,
    paddingBottom: 4,
    paddingRight: 4,
  },
  moreButton: {
    paddingHorizontal: 0,
  },
  moreButtonText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '600',
  },
  lessButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  lessButtonText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '600',
  },
});
