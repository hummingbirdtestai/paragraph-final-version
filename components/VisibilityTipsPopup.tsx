import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { TrendingUp, Hash, Clock, Users, X } from 'lucide-react-native';

interface VisibilityTipsPopupProps {
  visible: boolean;
  onClose: () => void;
  postContent: string;
}

export default function VisibilityTipsPopup({
  visible,
  onClose,
  postContent,
}: VisibilityTipsPopupProps) {
  const suggestedHashtags = extractSuggestedHashtags(postContent);
  const bestTimeToPost = getBestPostingTime();
  const engagementTips = getEngagementTips();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TrendingUp size={22} color="#25D366" strokeWidth={2} />
              <Text style={styles.title}>Visibility Tips</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            <Text style={styles.subtitle}>
              Optimize your post for better reach and engagement
            </Text>

            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Clock size={20} color="#25D366" strokeWidth={2} />
                <Text style={styles.tipTitle}>Best Time to Post</Text>
              </View>
              <Text style={styles.tipContent}>{bestTimeToPost}</Text>
              <Text style={styles.tipReason}>
                Based on when your audience is most active
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Hash size={20} color="#25D366" strokeWidth={2} />
                <Text style={styles.tipTitle}>Suggested Hashtags</Text>
              </View>
              <View style={styles.hashtags}>
                {suggestedHashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtag}>
                    <Text style={styles.hashtagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.tipReason}>
                Add these to increase discoverability
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Users size={20} color="#25D366" strokeWidth={2} />
                <Text style={styles.tipTitle}>Engagement Boosters</Text>
              </View>
              {engagementTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet} />
                  <Text style={styles.tipItemText}>{tip}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.gotItButton} onPress={onClose}>
              <Text style={styles.gotItButtonText}>Got It, Thanks!</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function extractSuggestedHashtags(content: string): string[] {
  const keywords = content.toLowerCase();
  const suggestions: string[] = [];

  const topicMap: Record<string, string[]> = {
    cardiology: ['#cardiology', '#heartdisease', '#ecg'],
    anatomy: ['#anatomy', '#medschool', '#medicalstudent'],
    pharmacology: ['#pharmacology', '#drugs', '#medstudent'],
    surgery: ['#surgery', '#surgeon', '#medicalstudent'],
    study: ['#studytips', '#medschool', '#medstudent'],
    exam: ['#examprep', '#medicalexam', '#usmle'],
  };

  Object.entries(topicMap).forEach(([keyword, tags]) => {
    if (keywords.includes(keyword)) {
      suggestions.push(...tags.slice(0, 2));
    }
  });

  if (suggestions.length === 0) {
    return ['#medicalstudent', '#medschool', '#medicine'];
  }

  return [...new Set(suggestions)].slice(0, 4);
}

function getBestPostingTime(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 6 && currentHour < 9) {
    return 'Morning (6-9 AM) - Great time! Students check their feeds before class.';
  } else if (currentHour >= 12 && currentHour < 14) {
    return 'Lunch Time (12-2 PM) - Good timing! Peak activity during breaks.';
  } else if (currentHour >= 18 && currentHour < 21) {
    return 'Evening (6-9 PM) - Excellent! Highest engagement after study sessions.';
  } else if (currentHour >= 21 || currentHour < 1) {
    return 'Late Evening (9 PM-1 AM) - Active time for night owls studying late.';
  } else {
    return 'Consider posting during peak hours: 6-9 AM, 12-2 PM, or 6-9 PM for maximum reach.';
  }
}

function getEngagementTips(): string[] {
  return [
    'Ask a question to encourage comments',
    'Share personal experiences or insights',
    'Use clear, concise language',
    'Include relevant study resources or tips',
    'Respond to comments within the first hour',
  ];
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
    maxHeight: '80%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  body: {
    maxHeight: 500,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#1a2329',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#25D366',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  tipContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e5e7eb',
    marginBottom: 8,
  },
  tipReason: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  hashtag: {
    backgroundColor: '#1a3929',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  hashtagText: {
    fontSize: 13,
    color: '#25D366',
    fontWeight: '500',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#25D366',
    marginTop: 7,
  },
  tipItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#94a3b8',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  gotItButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
    alignItems: 'center',
  },
  gotItButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
});
