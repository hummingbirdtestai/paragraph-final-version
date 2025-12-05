import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, MessageCircle, UserPlus } from 'lucide-react-native';

interface Profile {
  name: string;
  avatar: string;
  college: string;
  year: string;
  bio: string;
  followers: number;
  following: number;
}

const profiles: Record<string, Profile> = {
  'Priya Sharma': {
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'AIIMS Delhi',
    year: 'Final Year',
    bio: 'Aspiring cardiologist | NEET PG prep | Sharing study resources',
    followers: 1234,
    following: 567,
  },
  'Dr. Meera Singh': {
    name: 'Dr. Meera Singh',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'CMC Vellore',
    year: 'Final Year',
    bio: 'Medical student | Cardiology enthusiast | Sharing clinical insights',
    followers: 2456,
    following: 890,
  },
  'Rahul Verma': {
    name: 'Rahul Verma',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'JIPMER Puducherry',
    year: '3rd Year',
    bio: 'Pharmacology enthusiast | Looking for study partners',
    followers: 567,
    following: 234,
  },
  'Ananya Iyer': {
    name: 'Ananya Iyer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'CMC Vellore',
    year: '2nd Year',
    bio: 'Anatomy notes curator | Sharing resources with fellow medicos',
    followers: 890,
    following: 456,
  },
  'Arjun Patel': {
    name: 'Arjun Patel',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'AIIMS Delhi',
    year: '3rd Year',
    bio: 'Future neurologist | Creating helpful mnemonics',
    followers: 1567,
    following: 678,
  },
  'Sneha Reddy': {
    name: 'Sneha Reddy',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'JIPMER',
    year: '2nd Year',
    bio: 'Anatomy enthusiast | Helping peers with dissection tips',
    followers: 734,
    following: 412,
  },
  'Rohit Kumar': {
    name: 'Rohit Kumar',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'AIIMS Delhi',
    year: '1st Year',
    bio: 'First year med student | Learning and growing',
    followers: 345,
    following: 189,
  },
  'Meera Singh': {
    name: 'Meera Singh',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'CMC Vellore',
    year: 'Final Year',
    bio: 'Medical student | Cardiology enthusiast | Sharing clinical insights',
    followers: 2456,
    following: 890,
  },
  'Vikram Reddy': {
    name: 'Vikram Reddy',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'JIPMER',
    year: '2nd Year',
    bio: 'Passionate about clinical medicine',
    followers: 678,
    following: 345,
  },
};

export default function ProfilePreviewScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const decodedName = name ? decodeURIComponent(name as string) : 'Priya Sharma';
  const profile = profiles[decodedName] || {
    name: decodedName,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    college: 'Medical College',
    year: 'Student',
    bio: 'Medical student',
    followers: 100,
    following: 50,
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={() => router.back()} />
      <View style={styles.card}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#94a3b8" />
        </Pressable>

        <View style={styles.profileHeader}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.college}>{profile.college}</Text>
          <Text style={styles.year}>{profile.year}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton}>
            <UserPlus size={20} color="#0b141a" strokeWidth={2} />
            <Text style={styles.primaryButtonText}>Follow</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <MessageCircle size={20} color="#e5e7eb" strokeWidth={2} />
            <Text style={styles.secondaryButtonText}>Message</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#111b21',
    borderRadius: 16,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  college: {
    fontSize: 15,
    color: '#94a3b8',
    marginBottom: 2,
  },
  year: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1a2329',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2329',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
  },
});
