import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Bookmark } from "lucide-react-native";
import { UserAvatar } from "./UserAvatar";
import { PostHashtags } from "./PostHashtags";
import { PostEngagementBar } from "./PostEngagementBar";
import PostOptionsBottomSheet from "./PostOptionsBottomSheet";
import Markdown from "react-native-markdown-display";

interface PostCardProps {
  post: any;
  onLike: (postId: string, isLiked: boolean) => Promise<boolean>;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  showPerformance?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH - 32;

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  showPerformance = false,
}: PostCardProps) {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const handleLike = async () => {
    const newLiked = await onLike(post.id, isLiked);
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
  };

  const handleUserPress = () => {
    router.push(`/feed/profile/${post.cached_user_name}`);
  };

  const handlePostPress = () => {
    router.push(`/feed/post/${post.id}`);
  };

  const handleCommentPress = () => {
    onComment(post.id);
    router.push(`/feed/comments?postId=${post.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.userInfo} onPress={handleUserPress}>
          <UserAvatar uri={post.cached_user_avatar_url} size={44} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{post.cached_user_name}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.created_at).toLocaleString()}
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={() => setOptionsVisible(true)}>
          <Bookmark size={20} color="#94a3b8" strokeWidth={2} />
        </Pressable>
      </View>

      <Pressable onPress={handlePostPress}>
        {post.keyword ? (
          <Text style={styles.keyword}>{post.keyword}</Text>
        ) : null}

        {!expanded ? (
          <View style={{ maxHeight: 120, overflow: "hidden", position: "relative", marginBottom: 12 }}>
            <Markdown style={markdownStyles}>{post.post_content}</Markdown>

            <LinearGradient
              colors={["rgba(17,27,33,0)", "rgba(17,27,33,1)"]}
              style={styles.fadeOverlay}
            >
              <Pressable onPress={() => setExpanded(true)}>
                <Text style={styles.moreButtonText}>...more</Text>
              </Pressable>
            </LinearGradient>
          </View>
        ) : (
          <View style={{ marginBottom: 12 }}>
            <Markdown style={markdownStyles}>{post.post_content}</Markdown>

            <Pressable onPress={() => setExpanded(false)} style={styles.lessButton}>
              <Text style={styles.lessButtonText}>Show less</Text>
            </Pressable>
          </View>
        )}


        {post.media_url && post.media_url.length > 0 && (
          <View style={styles.imagesContainer}>
            {Platform.OS === "web" ? (
              <View style={styles.webImagesGrid}>
                {post.media_url.map((img: string, index: number) => (
                  <Pressable
                    key={index}
                    onPress={() =>
                      router.push(
                        `/feed/media-viewer?url=${encodeURIComponent(img)}`
                      )
                    }
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.webImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const offsetX = event.nativeEvent.contentOffset.x;
                    const index = Math.round(offsetX / IMAGE_WIDTH);
                    setCurrentImageIndex(index);
                  }}
                >
                  {post.media_url.map((img: string, index: number) => (
                    <Pressable
                      key={index}
                      onPress={() =>
                        router.push(
                          `/feed/media-viewer?url=${encodeURIComponent(img)}`
                        )
                      }
                    >
                      <Image
                        source={{ uri: img }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </ScrollView>

                {post.media_url.length > 1 && (
                  <View style={styles.pagination}>
                    {post.media_url.map((_: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          index === currentImageIndex &&
                            styles.paginationDotActive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        <PostHashtags hashtags={[]} />
      </Pressable>

      <PostEngagementBar
        likesCount={likesCount}
        commentsCount={post.comments_count || 0}
        sharesCount={post.shares_count || 0}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={handleCommentPress}
        onShare={() => onShare(post.id)}
      />

      <PostOptionsBottomSheet
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        postId={post.id}
        onEdit={() => console.log("Edit post:", post.id)}
        onDelete={() => console.log("Delete post:", post.id)}
        onReport={() => console.log("Report post:", post.id)}
        isOwnPost={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111b21",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === "web" && {
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: "#1f2a30",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  keyword: {
    fontSize: 16,
    fontWeight: "700",
    color: "#25D366",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#64748b",
  },
  saveButton: {
    padding: 4,
    marginTop: -4,
  },
  imagesContainer: {
    marginTop: 8,
    marginBottom: 8,
    position: "relative",
  },
  image: {
    width: IMAGE_WIDTH,
    aspectRatio: 1,
    borderRadius: 8,
  },
  webImagesGrid: {
    width: "100%",
    gap: 8,
  },
  webImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    objectFit: "cover",
  },
  pagination: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  paginationDotActive: {
    backgroundColor: "#25D366",
    width: 20,
  },
  fadeOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "flex-end",
    paddingBottom: 6,
  },
  moreButtonText: {
    color: "#25D366",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 4,
  },
  lessButton: {
    marginTop: 8,
  },
  lessButtonText: {
    color: "#25D366",
    fontSize: 14,
    fontWeight: "600",
  },
});

const markdownStyles = {
  body: {
    color: "#e5e7eb",
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: { color: "#25D366", fontSize: 22, fontWeight: "700" },
  heading2: { color: "#25D366", fontSize: 20, fontWeight: "700" },
  heading3: { color: "#25D366", fontSize: 18, fontWeight: "700" },
  strong: { fontWeight: "700", color: "#ffffff" },
  em: { fontStyle: "italic", color: "#cbd5e1" },
  code_inline: {
    backgroundColor: "#1f2a30",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#e2e8f0",
  },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { flexDirection: "row" },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "#25D366",
    paddingLeft: 12,
    marginVertical: 8,
    color: "#94a3b8",
  },
};
