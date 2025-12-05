import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Edit3, Trash2, AlertCircle, Pin, VolumeX, Bookmark, EyeOff, X } from 'lucide-react-native';

interface PostOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  onPin?: () => void;
  onMute?: () => void;
  onSave?: () => void;
  onHide?: () => void;
  isOwnPost?: boolean;
}

export default function PostOptionsBottomSheet({
  visible,
  onClose,
  postId,
  onEdit,
  onDelete,
  onReport,
  onPin,
  onMute,
  onSave,
  onHide,
  isOwnPost = false,
}: PostOptionsBottomSheetProps) {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleReport = () => {
    onReport();
    onClose();
  };

  const handlePin = () => {
    if (onPin) onPin();
    onClose();
  };

  const handleMute = () => {
    if (onMute) onMute();
    onClose();
  };

  const handleSave = () => {
    if (onSave) onSave();
    onClose();
  };

  const handleHide = () => {
    if (onHide) onHide();
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
            <Text style={styles.title}>Post Options</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <View style={styles.options}>
            {isOwnPost && (
              <>
                <Pressable style={styles.option} onPress={handleEdit}>
                  <View style={styles.iconContainer}>
                    <Edit3 size={20} color="#e5e7eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>Edit</Text>
                </Pressable>

                <Pressable style={styles.option} onPress={handlePin}>
                  <View style={styles.iconContainer}>
                    <Pin size={20} color="#e5e7eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>Pin</Text>
                </Pressable>

                <Pressable style={[styles.option, styles.dangerOption]} onPress={handleDelete}>
                  <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                    <Trash2 size={20} color="#ef4444" strokeWidth={2} />
                  </View>
                  <Text style={[styles.optionTitle, styles.dangerText]}>Delete</Text>
                </Pressable>
              </>
            )}

            {!isOwnPost && (
              <>
                <Pressable style={styles.option} onPress={handleSave}>
                  <View style={styles.iconContainer}>
                    <Bookmark size={20} color="#e5e7eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>Save Post</Text>
                </Pressable>

                <Pressable style={styles.option} onPress={handleMute}>
                  <View style={styles.iconContainer}>
                    <VolumeX size={20} color="#e5e7eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>Mute User</Text>
                </Pressable>

                <Pressable style={styles.option} onPress={handleHide}>
                  <View style={styles.iconContainer}>
                    <EyeOff size={20} color="#e5e7eb" strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>Hide Post</Text>
                </Pressable>

                <Pressable style={[styles.option, styles.dangerOption]} onPress={handleReport}>
                  <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                    <AlertCircle size={20} color="#ef4444" strokeWidth={2} />
                  </View>
                  <Text style={[styles.optionTitle, styles.dangerText]}>Report</Text>
                </Pressable>
              </>
            )}
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
  dangerOption: {
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
    marginTop: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconContainer: {
    backgroundColor: '#2a1818',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
  },
  dangerText: {
    color: '#ef4444',
  },
});
