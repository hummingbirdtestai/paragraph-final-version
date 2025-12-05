import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ThumbsUp } from 'lucide-react-native';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    college: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const comments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Arjun Patel',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'AIIMS Delhi',
    },
    content: 'Congratulations! Cardiology is such an interesting field.',
    timestamp: '1h ago',
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Priya Sharma',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          college: 'AIIMS Delhi',
        },
        content: 'Thank you! It really was amazing.',
        timestamp: '45m ago',
        likes: 3,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Meera Singh',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'CMC Vellore',
    },
    content: 'Would love to hear more about your experience!',
    timestamp: '45m ago',
    likes: 8,
  },
  {
    id: '3',
    author: {
      name: 'Vikram Reddy',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      college: 'JIPMER',
    },
    content: 'Dr. Mehta is amazing! You were lucky to learn from him.',
    timestamp: '30m ago',
    likes: 5,
  },
];

const post = {
  author: {
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'AIIMS Delhi',
  },
  timestamp: '2h ago',
  content: 'Just finished my cardiology rotation. The experience was incredible...',
};

export default function CommentsScreen() {
  const router = useRouter();

  const renderComment = (comment: Comment, isReply = false) => (
    <View key={comment.id} style={[styles.comment, isReply && styles.reply]}>
      <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.author.name}</Text>
          <Text style={styles.commentMeta}>{comment.author.college}</Text>
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
          <Pressable style={styles.commentLike}>
            <ThumbsUp size={14} color="#64748b" strokeWidth={1.8} />
            <Text style={styles.commentLikeText}>{comment.likes}</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.replyButton}>Reply</Text>
          </Pressable>
        </View>
        {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>

      <View style={styles.postSnippet}>
        <Image source={{ uri: post.author.avatar }} style={styles.snippetAvatar} />
        <View style={styles.snippetContent}>
          <Text style={styles.snippetAuthor}>{post.author.name}</Text>
          <Text style={styles.snippetText} numberOfLines={2}>{post.content}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {comments.map((comment) => renderComment(comment))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
          style={styles.inputAvatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#64748b"
        />
      </View>
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
  postSnippet: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  snippetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  snippetContent: {
    flex: 1,
  },
  snippetAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  snippetText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  content: {
    flex: 1,
  },
  comment: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#0b141a',
  },
  reply: {
    marginLeft: 48,
    paddingTop: 12,
    paddingBottom: 12,
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
  commentHeader: {
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  commentMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e5e7eb',
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  replyButton: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111b21',
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#e5e7eb',
    paddingVertical: 8,
  },
});
