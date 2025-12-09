import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CelebrationPopup from './CelebrationPopup';

export default function CelebrationPopupExample() {
  const [showStreak, setShowStreak] = useState(false);
  const [showMastery, setShowMastery] = useState(false);
  const [showBattle, setShowBattle] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Celebration Popup Examples</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowStreak(true)}
      >
        <Text style={styles.buttonText}>Show Streak Celebration</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowMastery(true)}
      >
        <Text style={styles.buttonText}>Show Mastery Celebration</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowBattle(true)}
      >
        <Text style={styles.buttonText}>Show Battle Win Celebration</Text>
      </TouchableOpacity>

      <CelebrationPopup
        visible={showStreak}
        onClose={() => setShowStreak(false)}
        message="🔥 Amazing! 5 day streak!"
        autoDismissDelay={2500}
      />

      <CelebrationPopup
        visible={showMastery}
        onClose={() => setShowMastery(false)}
        message="⭐ Concept Mastered! Keep going!"
        autoDismissDelay={2500}
      />

      <CelebrationPopup
        visible={showBattle}
        onClose={() => setShowBattle(false)}
        message="🏆 Victory! You won the battle!"
        autoDismissDelay={2500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    width: 280,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B141A',
    fontSize: 16,
    fontWeight: '600',
  },
});
