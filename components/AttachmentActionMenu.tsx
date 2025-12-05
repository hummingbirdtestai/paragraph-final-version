import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Forward, Reply, Share2, Download, Trash2, Info, Highlighter, Smile } from 'lucide-react-native';

interface AttachmentActionMenuProps {
  visible: boolean;
  position?: { x: number; y: number };
  onClose: () => void;
  onForward: () => void;
  onReply: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onInfo: () => void;
  onHighlight?: () => void;
  onAddSticker?: () => void;
}

export default function AttachmentActionMenu({
  visible,
  position = { x: 0, y: 0 },
  onClose,
  onForward,
  onReply,
  onShare,
  onDownload,
  onDelete,
  onInfo,
  onHighlight,
  onAddSticker,
}: AttachmentActionMenuProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAction = (action: () => void) => {
    onClose();
    setTimeout(() => action(), 100);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.menu,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Pressable style={styles.menuItem} onPress={() => handleAction(onForward)}>
            <Forward size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.menuItemText}>Forward</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={() => handleAction(onReply)}>
            <Reply size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.menuItemText}>Reply</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={() => handleAction(onShare)}>
            <Share2 size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.menuItemText}>Share</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={() => handleAction(onDownload)}>
            <Download size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.menuItemText}>Download</Text>
          </Pressable>

          {onHighlight && (
            <>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={() => handleAction(onHighlight)}>
                <Highlighter size={20} color="#e5e7eb" strokeWidth={2} />
                <Text style={styles.menuItemText}>Highlight</Text>
              </Pressable>
            </>
          )}

          {onAddSticker && (
            <>
              <View style={styles.menuDivider} />
              <Pressable style={styles.menuItem} onPress={() => handleAction(onAddSticker)}>
                <Smile size={20} color="#e5e7eb" strokeWidth={2} />
                <Text style={styles.menuItemText}>Add Sticker</Text>
              </Pressable>
            </>
          )}

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={() => handleAction(onInfo)}>
            <Info size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.menuItemText}>Info</Text>
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={[styles.menuItem, styles.menuItemDanger]} onPress={() => handleAction(onDelete)}>
            <Trash2 size={20} color="#ef4444" strokeWidth={2} />
            <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    minWidth: 200,
    backgroundColor: '#1f2c34',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e5e7eb',
  },
  menuItemDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuItemTextDanger: {
    color: '#ef4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
