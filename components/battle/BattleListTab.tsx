import React from 'react';
import { View, StyleSheet } from 'react-native';
import BattleListScreen from './BattleListScreen';

export default function BattleListTab({ onJoinBattle }) {
  return (
    <View style={styles.container}>
      {/* ✅ Pass down the prop */}
      <BattleListScreen onJoinBattle={onJoinBattle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
});
