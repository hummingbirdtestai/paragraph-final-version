import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FileText, X } from 'lucide-react-native';

interface DraftRecoveryBannerProps {
  visible: boolean;
  onResume: () => void;
  onDiscard: () => void;
}

export default function DraftRecoveryBanner({
  visible,
  onResume,
  onDiscard,
}: DraftRecoveryBannerProps) {
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <View style={styles.iconContainer}>
          <FileText size={20} color="#25D366" strokeWidth={2} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.title}>Unsaved Draft Found</Text>
          <Text style={styles.subtitle}>Do you want to resume your draft?</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.discardButton} onPress={onDiscard}>
          <Text style={styles.discardButtonText}>Start New</Text>
        </Pressable>
        <Pressable style={styles.resumeButton} onPress={onResume}>
          <Text style={styles.resumeButtonText}>Resume Draft</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#1a2329',
    borderBottomWidth: 1,
    borderBottomColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a3929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  discardButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#111b21',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a3942',
  },
  discardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  resumeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#25D366',
    alignItems: 'center',
  },
  resumeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0b141a',
  },
});
