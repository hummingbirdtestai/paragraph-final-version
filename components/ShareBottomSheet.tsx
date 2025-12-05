import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Link2, MessageCircle, Repeat2, Share2, X } from 'lucide-react-native';

interface ShareBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
}

export default function ShareBottomSheet({ visible, onClose, postId }: ShareBottomSheetProps) {
  const handleCopyLink = () => {
    console.log('Copy link for post:', postId);
    onClose();
  };

  const handleShareToChat = () => {
    console.log('Share to chat for post:', postId);
    onClose();
  };

  const handleRepost = () => {
    console.log('Repost:', postId);
    onClose();
  };

  const handleShareToSocial = () => {
    console.log('Share to social media:', postId);
    onClose();
  };

  const handleSendAsDM = () => {
    console.log('Send as DM:', postId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Share Post</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <View style={styles.options}>
            <Pressable style={styles.option} onPress={handleCopyLink}>
              <View style={styles.iconContainer}>
                <Link2 size={22} color="#e5e7eb" strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Copy Link</Text>
                <Text style={styles.optionDescription}>Copy post link to clipboard</Text>
              </View>
            </Pressable>

            <Pressable style={styles.option} onPress={handleShareToChat}>
              <View style={styles.iconContainer}>
                <MessageCircle size={22} color="#e5e7eb" strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Share to Chat</Text>
                <Text style={styles.optionDescription}>Share in a group or conversation</Text>
              </View>
            </Pressable>

            <Pressable style={styles.option} onPress={handleRepost}>
              <View style={styles.iconContainer}>
                <Repeat2 size={22} color="#e5e7eb" strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Repost</Text>
                <Text style={styles.optionDescription}>Share to your feed</Text>
              </View>
            </Pressable>

            <Pressable style={styles.option} onPress={handleShareToSocial}>
              <View style={styles.iconContainer}>
                <Share2 size={22} color="#e5e7eb" strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Share to Social Media</Text>
                <Text style={styles.optionDescription}>Share on other platforms</Text>
              </View>
            </Pressable>

            <Pressable style={styles.option} onPress={handleSendAsDM}>
              <View style={styles.iconContainer}>
                <MessageCircle size={22} color="#e5e7eb" strokeWidth={2} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Send as DM</Text>
                <Text style={styles.optionDescription}>Send directly to someone</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#111b21',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#64748b',
  },
});
