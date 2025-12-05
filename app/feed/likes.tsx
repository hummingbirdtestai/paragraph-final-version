import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  avatar: string;
  college: string;
  year: string;
}

const users: User[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'AIIMS Delhi',
    year: 'Final Year',
  },
  {
    id: '2',
    name: 'Meera Singh',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'CMC Vellore',
    year: '3rd Year',
  },
  {
    id: '3',
    name: 'Vikram Reddy',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'JIPMER',
    year: '2nd Year',
  },
  {
    id: '4',
    name: 'Ananya Iyer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'CMC Vellore',
    year: 'Final Year',
  },
  {
    id: '5',
    name: 'Rohit Kumar',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'AIIMS Delhi',
    year: '3rd Year',
  },
  {
    id: '6',
    name: 'Sneha Kapoor',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    college: 'MAMC Delhi',
    year: '2nd Year',
  },
];

export default function LikesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#e5e7eb" />
        </Pressable>
        <Text style={styles.headerTitle}>Reactions</Text>
        <Text style={styles.count}>{users.length}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {users.map((user) => (
          <Pressable key={user.id} style={styles.userItem}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userMeta}>
                {user.college} • {user.year}
              </Text>
            </View>
            <View style={styles.reaction}>
              <Heart size={18} color="#ff4444" strokeWidth={2} fill="#ff4444" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111b21',
    borderBottomWidth: 1,
    borderBottomColor: '#0b141a',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  userMeta: {
    fontSize: 13,
    color: '#94a3b8',
  },
  reaction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
