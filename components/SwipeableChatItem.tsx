import { View, Text, StyleSheet, Pressable, Image, Animated, Modal } from 'react-native';
import { useRef, useState } from 'react';
import { Pin, Volume2, VolumeX, Check, CheckCheck, Archive, Trash2, Users } from 'lucide-react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface Chat {
  id: string;
  type: 'dm' | 'group';
  otherUser?: {
    id: string;
    name: string;
    avatar_url: string | null;
    college: string;
    online_status: boolean;
  };
  groupInfo?: {
    name: string;
    description: string;
    avatar_url: string | null;
    memberCount: number;
    onlineCount: number;
  };
  lastMessage: string;
  lastMessageSender?: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isRead: boolean;
}

interface SwipeableChatItemProps {
  chat: Chat;
  onPress: () => void;
  onPin: () => void;
  onMarkRead: () => void;
  onMute: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function SwipeableChatItem({
  chat,
  onPress,
  onPin,
  onMarkRead,
  onMute,
  onArchive,
  onDelete,
}: SwipeableChatItemProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const isGroup = chat.type === 'group';
  const avatar = isGroup ? chat.groupInfo?.avatar_url : chat.otherUser?.avatar_url;
  const name = isGroup ? chat.groupInfo?.name : chat.otherUser?.name;
  const subtitle = isGroup
    ? `${chat.groupInfo?.memberCount} members`
    : chat.otherUser?.college;

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      const newTranslateX = event.translationX;

      if (newTranslateX > 0 && newTranslateX <= 80) {
        translateX.setValue(newTranslateX);
        setSwipeDirection('right');
      } else if (newTranslateX < 0 && newTranslateX >= -160) {
        translateX.setValue(newTranslateX);
        setSwipeDirection('left');
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const translation = event.translationX;

      if (translation > 40) {
        Animated.spring(translateX, {
          toValue: 80,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      } else if (translation < -80) {
        Animated.spring(translateX, {
          toValue: -160,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }).start();
        setSwipeDirection(null);
      }
    });

  const handleLongPress = () => {
    setShowLongPressMenu(true);
  };

  const closeMenu = () => {
    setShowLongPressMenu(false);
  };

  const handleActionAndClose = (action: () => void) => {
    action();
    closeMenu();
    resetSwipe();
  };

  const resetSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
    setSwipeDirection(null);
  };

  const handlePin = () => {
    onPin();
    resetSwipe();
  };

  const handleMarkRead = () => {
    onMarkRead();
    resetSwipe();
  };

  const handleMute = () => {
    onMute();
    resetSwipe();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <Pressable
            style={[styles.rightAction, chat.isPinned ? styles.unpinAction : styles.pinAction]}
            onPress={handlePin}>
            <Pin size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.actionText}>{chat.isPinned ? 'Unpin' : 'Pin'}</Text>
          </Pressable>
        </View>

        <View style={styles.leftActionsContainer}>
          <Pressable
            style={[styles.leftAction, styles.readAction]}
            onPress={handleMarkRead}>
            {chat.isRead ? (
              <Check size={20} color="#fff" strokeWidth={2} />
            ) : (
              <CheckCheck size={20} color="#fff" strokeWidth={2} />
            )}
            <Text style={styles.actionText}>
              {chat.isRead ? 'Unread' : 'Read'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.leftAction, styles.muteAction]}
            onPress={handleMute}>
            {chat.isMuted ? (
              <Volume2 size={20} color="#fff" strokeWidth={2} />
            ) : (
              <VolumeX size={20} color="#fff" strokeWidth={2} />
            )}
            <Text style={styles.actionText}>
              {chat.isMuted ? 'Unmute' : 'Mute'}
            </Text>
          </Pressable>
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.chatItemWrapper,
              { transform: [{ translateX }] }
            ]}>
            <Pressable
              style={styles.chatItem}
              onPress={onPress}
              onLongPress={handleLongPress}
              delayLongPress={500}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: avatar || 'https://via.placeholder.com/100' }}
                  style={[
                    styles.avatar,
                    !chat.isRead && !isGroup && styles.avatarUnread,
                  ]}
                />
                {!isGroup && chat.otherUser?.online_status && (
                  <View style={styles.onlineIndicator} />
                )}
              </View>

              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <View style={styles.nameContainer}>
                    {chat.isPinned && (
                      <Text style={styles.pinnedIcon}>📌</Text>
                    )}
                    {!chat.isRead && <View style={styles.unreadDot} />}
                    <Text style={[styles.contactName, !chat.isRead && styles.unreadText]}>
                      {name}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>{chat.lastMessageTime}</Text>
                </View>

                <View style={styles.messagePreviewContainer}>
                  <Text
                    style={[styles.messagePreview, !chat.isRead && styles.unreadText]}
                    numberOfLines={1}>
                    {isGroup && chat.lastMessageSender && `${chat.lastMessageSender}: `}
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                    </View>
                  )}
                  {chat.isMuted && (
                    <Text style={styles.mutedIcon}>🔇</Text>
                  )}
                </View>

                {isGroup && (
                  <View style={styles.groupFooter}>
                    <Users size={12} color="#94a3b8" strokeWidth={2} />
                    <Text style={styles.memberCount}>{chat.groupInfo?.memberCount}</Text>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineCount}>{chat.groupInfo?.onlineCount} online</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>

      <Modal
        visible={showLongPressMenu}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}>
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View style={styles.longPressMenu}>
            <Text style={styles.menuTitle}>{name}</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleActionAndClose(onPin)}>
              <Pin size={20} color="#e5e7eb" strokeWidth={2} />
              <Text style={styles.menuItemText}>
                {chat.isPinned ? 'Unpin Chat' : 'Pin Chat'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleActionAndClose(onMarkRead)}>
              {chat.isRead ? (
                <Check size={20} color="#e5e7eb" strokeWidth={2} />
              ) : (
                <CheckCheck size={20} color="#e5e7eb" strokeWidth={2} />
              )}
              <Text style={styles.menuItemText}>
                {chat.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleActionAndClose(onMute)}>
              {chat.isMuted ? (
                <Volume2 size={20} color="#e5e7eb" strokeWidth={2} />
              ) : (
                <VolumeX size={20} color="#e5e7eb" strokeWidth={2} />
              )}
              <Text style={styles.menuItemText}>
                {chat.isMuted ? 'Unmute Chat' : 'Mute Chat'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleActionAndClose(onArchive)}>
              <Archive size={20} color="#e5e7eb" strokeWidth={2} />
              <Text style={styles.menuItemText}>Archive Chat</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => handleActionAndClose(onDelete)}>
              <Trash2 size={20} color="#ef4444" strokeWidth={2} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Delete Chat
              </Text>
            </Pressable>

            <Pressable style={styles.menuItemCancel} onPress={closeMenu}>
              <Text style={styles.menuItemCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  actionsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
  },
  leftActionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightAction: {
    width: 70,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  leftAction: {
    width: 80,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pinAction: {
    backgroundColor: '#25D366',
  },
  unpinAction: {
    backgroundColor: '#64748b',
  },
  readAction: {
    backgroundColor: '#3b82f6',
  },
  muteAction: {
    backgroundColor: '#94a3b8',
  },
  actionText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  chatItemWrapper: {
    backgroundColor: '#0b141a',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#0b141a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarUnread: {
    opacity: 1,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: '#0b141a',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  pinnedIcon: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#25D366',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    flex: 1,
  },
  unreadText: {
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messagePreview: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0b141a',
  },
  mutedIcon: {
    fontSize: 14,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  memberCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#25D366',
    marginLeft: 4,
  },
  onlineCount: {
    fontSize: 12,
    color: '#25D366',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  longPressMenu: {
    backgroundColor: '#1a2329',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    padding: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2a3942',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3942',
  },
  menuItemText: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '500',
  },
  menuItemDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuItemTextDanger: {
    color: '#ef4444',
  },
  menuItemCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#111b21',
  },
  menuItemCancelText: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '600',
  },
});
