import { View, Text, StyleSheet, Modal, TextInput, ScrollView, Pressable, Image, Animated } from 'react-native';
import { ArrowLeft, Search, MessageCircle, Users, User, Image as ImageIcon, FileText, Link as LinkIcon, X } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

interface SearchResult {
  id: string;
  type: 'chat' | 'message' | 'contact' | 'group' | 'media' | 'document' | 'link';
  title: string;
  subtitle?: string;
  snippet?: string;
  avatar?: string;
  timestamp?: string;
  chatId?: string;
  messageId?: string;
  highlight?: string;
  mediaUrl?: string;
  memberCount?: number;
  onlineCount?: number;
}

interface GlobalSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'messages' | 'media' | 'links' | 'docs';

export default function GlobalSearchModal({ visible, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setSearchQuery('');
      setActiveTab('all');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        performSearch(searchQuery);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, activeTab]);

  const performSearch = async (query: string) => {
    setIsSearching(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults: SearchResult[] = [
      {
        id: 'chat-1',
        type: 'chat',
        title: 'Priya Sharma',
        subtitle: 'AIIMS Delhi',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        timestamp: '2m ago',
        chatId: 'dm-1',
      },
      {
        id: 'group-1',
        type: 'group',
        title: 'Anatomy Study Group',
        subtitle: '45 members',
        avatar: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        timestamp: '5m ago',
        chatId: 'group-1',
        memberCount: 45,
        onlineCount: 18,
      },
      {
        id: 'message-1',
        type: 'message',
        title: 'Priya Sharma',
        subtitle: 'Anatomy Study Group',
        snippet: 'Does anyone have notes on the cardiac cycle? I need them for tomorrow.',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        timestamp: 'Today, 10:30 AM',
        chatId: 'group-1',
        messageId: 'msg-1',
        highlight: 'cardiac cycle',
      },
      {
        id: 'message-2',
        type: 'message',
        title: 'You',
        subtitle: 'Priya Sharma',
        snippet: 'I have the notes on cardiac anatomy. Let me share them with you.',
        timestamp: 'Yesterday, 3:45 PM',
        chatId: 'dm-1',
        messageId: 'msg-2',
        highlight: 'cardiac',
      },
      {
        id: 'media-1',
        type: 'media',
        title: 'Cardiac_Cycle_Diagram.jpg',
        subtitle: 'Anatomy Study Group',
        mediaUrl: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        timestamp: 'Nov 12, 2024',
        chatId: 'group-1',
        messageId: 'msg-3',
      },
      {
        id: 'doc-1',
        type: 'document',
        title: 'Cardiology_Notes.pdf',
        subtitle: 'Rahul Verma',
        timestamp: 'Nov 10, 2024',
        chatId: 'dm-2',
        messageId: 'msg-4',
      },
      {
        id: 'link-1',
        type: 'link',
        title: 'www.ncbi.nlm.nih.gov/cardiac-physiology',
        subtitle: 'AIIMS Delhi 2024',
        timestamp: 'Nov 8, 2024',
        chatId: 'group-2',
        messageId: 'msg-5',
      },
      {
        id: 'contact-1',
        type: 'contact',
        title: 'Dr. Ananya Iyer',
        subtitle: 'CMC Vellore • Cardiology Dept',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      },
    ];

    const filtered = mockResults.filter(result => {
      const matchesQuery =
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
        result.snippet?.toLowerCase().includes(query.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'messages' && result.type === 'message') ||
        (activeTab === 'media' && result.type === 'media') ||
        (activeTab === 'links' && result.type === 'link') ||
        (activeTab === 'docs' && result.type === 'document');

      return matchesQuery && matchesTab;
    });

    setResults(filtered);
    setIsSearching(false);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.chatId) {
      onClose();
      setTimeout(() => {
        if (result.type === 'group') {
          router.push(`/chat/group/${result.chatId}`);
        } else {
          router.push(`/chat/${result.chatId}`);
        }
      }, 300);
    }
  };

  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Text key={index} style={styles.highlightedText}>{part}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  const renderChatItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <Image
        source={{ uri: result.avatar || 'https://via.placeholder.com/100' }}
        style={styles.resultAvatar}
      />
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
        </View>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
      </View>
    </Pressable>
  );

  const renderGroupItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <Image
        source={{ uri: result.avatar || 'https://via.placeholder.com/100' }}
        style={styles.resultAvatar}
      />
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
        </View>
        <View style={styles.groupInfo}>
          <Users size={12} color="#94a3b8" strokeWidth={2} />
          <Text style={styles.resultSubtitle}>
            {result.memberCount} members, {result.onlineCount} online
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderMessageItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <Image
        source={{ uri: result.avatar || 'https://via.placeholder.com/100' }}
        style={styles.resultAvatar}
      />
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{result.title}</Text>
          <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
        </View>
        <Text style={styles.resultSubtitle} numberOfLines={1}>
          {result.subtitle}
        </Text>
        {result.snippet && (
          <Text style={styles.messageSnippet} numberOfLines={2}>
            {highlightText(result.snippet, result.highlight)}
          </Text>
        )}
      </View>
    </Pressable>
  );

  const renderMediaItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <View style={styles.mediaThumbnail}>
        <Image
          source={{ uri: result.mediaUrl || 'https://via.placeholder.com/100' }}
          style={styles.mediaImage}
        />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
        <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
      </View>
    </Pressable>
  );

  const renderDocumentItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <View style={styles.documentIcon}>
        <FileText size={24} color="#25D366" strokeWidth={2} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
        <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
      </View>
    </Pressable>
  );

  const renderLinkItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <View style={styles.linkIcon}>
        <LinkIcon size={24} color="#25D366" strokeWidth={2} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
        <Text style={styles.resultTimestamp}>{result.timestamp}</Text>
      </View>
    </Pressable>
  );

  const renderContactItem = (result: SearchResult) => (
    <Pressable
      key={result.id}
      style={styles.resultItem}
      onPress={() => handleResultPress(result)}>
      <Image
        source={{ uri: result.avatar || 'https://via.placeholder.com/100' }}
        style={styles.resultAvatar}
      />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
      </View>
    </Pressable>
  );

  const renderResult = (result: SearchResult) => {
    switch (result.type) {
      case 'chat':
        return renderChatItem(result);
      case 'group':
        return renderGroupItem(result);
      case 'message':
        return renderMessageItem(result);
      case 'media':
        return renderMediaItem(result);
      case 'document':
        return renderDocumentItem(result);
      case 'link':
        return renderLinkItem(result);
      case 'contact':
        return renderContactItem(result);
      default:
        return null;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const category = result.type === 'chat' || result.type === 'group' ? 'Chats & Groups' :
                     result.type === 'message' ? 'Messages' :
                     result.type === 'contact' ? 'Contacts' :
                     result.type === 'media' ? 'Media' :
                     result.type === 'document' ? 'Documents' : 'Links';

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1000, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY }] }
        ]}>
        <View style={styles.searchHeader}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <ArrowLeft size={24} color="#e5e7eb" strokeWidth={2} />
          </Pressable>

          <View style={styles.searchInputContainer}>
            <Search size={20} color="#94a3b8" strokeWidth={2} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search messages, chats, contacts..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={20} color="#94a3b8" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {[
              { key: 'all', label: 'All', icon: Search },
              { key: 'messages', label: 'Messages', icon: MessageCircle },
              { key: 'media', label: 'Media', icon: ImageIcon },
              { key: 'links', label: 'Links', icon: LinkIcon },
              { key: 'docs', label: 'Docs', icon: FileText },
            ].map(({ key, label, icon: Icon }) => (
              <Pressable
                key={key}
                style={[styles.searchTab, activeTab === key && styles.activeSearchTab]}
                onPress={() => setActiveTab(key as TabType)}>
                <Icon size={16} color={activeTab === key ? '#25D366' : '#94a3b8'} strokeWidth={2} />
                <Text style={[styles.searchTabText, activeTab === key && styles.activeSearchTabText]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {!searchQuery.trim() && (
            <View style={styles.emptyState}>
              <Search size={48} color="#2a3942" strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>Search for messages, chats, and more</Text>
              <Text style={styles.emptyStateSubtext}>
                Type to search across all your conversations
              </Text>
            </View>
          )}

          {searchQuery.trim() && isSearching && (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {searchQuery.trim() && !isSearching && results.length === 0 && (
            <View style={styles.emptyState}>
              <Search size={48} color="#2a3942" strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No results found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          )}

          {searchQuery.trim() && !isSearching && results.length > 0 && (
            <>
              {Object.entries(groupedResults).map(([category, categoryResults]) => (
                <View key={category}>
                  <Text style={styles.categoryHeader}>{category}</Text>
                  {categoryResults.map(result => renderResult(result))}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2329',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#e5e7eb',
  },
  tabsContainer: {
    backgroundColor: '#0b141a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#1a2329',
    gap: 6,
  },
  activeSearchTab: {
    backgroundColor: '#1a3929',
  },
  searchTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  activeSearchTabText: {
    color: '#25D366',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    fontSize: 15,
    color: '#94a3b8',
  },
  categoryHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#25D366',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
    alignItems: 'center',
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e5e7eb',
    flex: 1,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  messageSnippet: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 18,
  },
  highlightedText: {
    color: '#25D366',
    fontWeight: '600',
  },
  mediaThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
