import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Filter, X, Check } from 'lucide-react-native';
import { useState } from 'react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    college: string;
    year: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const subjectPosts: Record<string, Post[]> = {
  anatomy: [
    {
      id: '1',
      author: {
        name: 'Sneha Reddy',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        college: 'JIPMER',
        year: '2nd Year',
      },
      timestamp: '2h ago',
      content: 'Complete guide to brachial plexus injuries. Made a flowchart that helped me remember all the nerves!',
      image: 'https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 156,
      comments: 34,
      shares: 21,
    },
    {
      id: '2',
      author: {
        name: 'Rohit Kumar',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        college: 'AIIMS Delhi',
        year: '1st Year',
      },
      timestamp: '5h ago',
      content: 'Dissection lab tips for first-timers. These really helped me get through my first cadaver session.',
      likes: 89,
      comments: 22,
      shares: 12,
    },
  ],
  pharmacology: [
    {
      id: '1',
      author: {
        name: 'Arjun Patel',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        college: 'AIIMS Delhi',
        year: '3rd Year',
      },
      timestamp: '1h ago',
      content: 'Drug mnemonics for autonomic nervous system. These saved me in my exam!',
      image: 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      likes: 234,
      comments: 67,
      shares: 43,
    },
  ],
};

export default function SubjectFeedScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams<{ subject: string }>();
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];
  const colleges = ['AIIMS Delhi', 'CMC Vellore', 'JIPMER', 'AFMC Pune'];

  const toggleYear = (year: string) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleCollege = (college: string) => {
    setSelectedColleges(prev =>
      prev.includes(college) ? prev.filter(c => c !== college) : [...prev, college]
    );
  };

  const clearFilters = () => {
    setSelectedYears([]);
    setSelectedColleges([]);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const posts = subjectPosts[subject?.toLowerCase() || 'anatomy'] || [];
  const subjectName = subject?.charAt(0).toUpperCase() + subject?.slice(1) || 'Subject';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>{subjectName}</Text>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}>
          <Filter size={20} color="#e5e7eb" />
        </Pressable>
      </View>

      <View style={styles.sortBar}>
        <Pressable
          style={[styles.sortButton, sortBy === 'recent' && styles.sortButtonActive]}
          onPress={() => setSortBy('recent')}>
          <Text style={[styles.sortText, sortBy === 'recent' && styles.sortTextActive]}>
            Recent
          </Text>
        </Pressable>
        <Pressable
          style={[styles.sortButton, sortBy === 'popular' && styles.sortButtonActive]}
          onPress={() => setSortBy('popular')}>
          <Text style={[styles.sortText, sortBy === 'popular' && styles.sortTextActive]}>
            Most Engaged
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.post}
            onPress={() => router.push(`/feed/post/${post.id}`)}>
            <View style={styles.postHeader}>
              <Pressable onPress={() => router.push(`/feed/profile/${post.author.name}`)}>
                <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
              </Pressable>
              <View style={styles.postAuthorInfo}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <Text style={styles.authorMeta}>
                  {post.author.college} • {post.author.year}
                </Text>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.image && (
              <Pressable onPress={() => post.image && router.push(`/feed/media?url=${encodeURIComponent(post.image)}`)}>
                {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
              </Pressable>
            )}

            <View style={styles.postActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/feed/likes')}>
                <ThumbsUp size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/feed/comments')}>
                <MessageCircle size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/feed/repost')}>
                <Share2 size={20} color="#94a3b8" strokeWidth={1.8} />
                <Text style={styles.actionText}>{post.shares}</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Posts</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#94a3b8" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Year</Text>
              <View style={styles.filterOptions}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    style={[
                      styles.filterOption,
                      selectedYears.includes(year) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleYear(year)}>
                    {selectedYears.includes(year) && (
                      <Check size={16} color="#25D366" strokeWidth={2.5} />
                    )}
                    <Text style={[
                      styles.filterOptionText,
                      selectedYears.includes(year) && styles.filterOptionTextActive
                    ]}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterSectionTitle}>College</Text>
              <View style={styles.filterOptions}>
                {colleges.map((college) => (
                  <Pressable
                    key={college}
                    style={[
                      styles.filterOption,
                      selectedColleges.includes(college) && styles.filterOptionActive
                    ]}
                    onPress={() => toggleCollege(college)}>
                    {selectedColleges.includes(college) && (
                      <Check size={16} color="#25D366" strokeWidth={2.5} />
                    )}
                    <Text style={[
                      styles.filterOptionText,
                      selectedColleges.includes(college) && styles.filterOptionTextActive
                    ]}>
                      {college}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    justifyContent: 'space-between',
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
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBar: {
    flexDirection: 'row',
    backgroundColor: '#111b21',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonActive: {
    backgroundColor: '#1a2329',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  sortTextActive: {
    color: '#25D366',
  },
  content: {
    flex: 1,
  },
  post: {
    backgroundColor: '#111b21',
    marginBottom: 2,
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  authorMeta: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e5e7eb',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 240,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111b21',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  modalTitle: {
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
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
    marginTop: 8,
  },
  filterOptions: {
    gap: 8,
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1a2329',
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterOptionActive: {
    borderColor: '#25D366',
    backgroundColor: '#1a2f29',
  },
  filterOptionText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#e5e7eb',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1a2329',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
});
