import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TrendingUp, TrendingDown, Share2, X } from 'lucide-react-native';

interface PostPerformanceBannerProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  performanceType: 'good' | 'slow';
  likes: number;
  comments: number;
  shares: number;
}

export default function PostPerformanceBanner({
  visible,
  onClose,
  onShare,
  performanceType,
  likes,
  comments,
  shares,
}: PostPerformanceBannerProps) {
  if (!visible) return null;

  const isGoodPerformance = performanceType === 'good';
  const Icon = isGoodPerformance ? TrendingUp : TrendingDown;
  const iconColor = isGoodPerformance ? '#25D366' : '#f59e0b';
  const bgColor = isGoodPerformance ? '#1a3929' : '#3a2d18';
  const borderColor = isGoodPerformance ? '#25D366' : '#f59e0b';

  const getMessage = () => {
    if (isGoodPerformance) {
      return 'Your post is performing well!';
    } else {
      return 'Engagement has slowed. Try sharing it again!';
    }
  };

  const getSubMessage = () => {
    if (isGoodPerformance) {
      return `${likes} likes, ${comments} comments, ${shares} shares so far`;
    } else {
      return 'Add a comment and reshare to boost visibility';
    }
  };

  return (
    <View style={[styles.banner, { backgroundColor: bgColor, borderBottomColor: borderColor }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={iconColor} strokeWidth={2} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.message}>{getMessage()}</Text>
          <Text style={styles.subMessage}>{getSubMessage()}</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={20} color="#94a3b8" strokeWidth={2} />
        </Pressable>
      </View>
      {!isGoodPerformance && (
        <Pressable style={styles.shareButton} onPress={onShare}>
          <Share2 size={16} color="#0b141a" strokeWidth={2} />
          <Text style={styles.shareButtonText}>Reshare Now</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderBottomWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  subMessage: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0b141a',
  },
});
