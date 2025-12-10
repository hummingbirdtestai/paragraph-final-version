import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificationExample() {
  const { user } = useAuth();

  const createSampleNotification = async (message, gifUrl = null) => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    const { error } = await supabase
      .from('student_notifications')
      .insert({
        student_id: user.id,
        message: message,
        gif_url: gifUrl,
        is_read: false,
      });

    if (error) {
      alert('Error creating notification');
    } else {
      alert('Notification created!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Notifications</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => createSampleNotification('🔥 Amazing! You hit a 5 day streak!')}
      >
        <Text style={styles.buttonText}>Create Streak Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => createSampleNotification('⭐ Concept Mastered! Keep going!')}
      >
        <Text style={styles.buttonText}>Create Mastery Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          createSampleNotification(
            '🏆 Victory! You won the battle!',
            'https://example.com/celebration.gif'
          )
        }
      >
        <Text style={styles.buttonText}>Create Battle Win (with GIF)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => createSampleNotification('✅ Mock test completed! Check your results.')}
      >
        <Text style={styles.buttonText}>Create Test Complete Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#0B141A',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
