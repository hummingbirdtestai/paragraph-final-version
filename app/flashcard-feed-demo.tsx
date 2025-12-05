import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import FlashcardFeed from '@/components/FlashcardFeedDemo';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function FlashcardFeedDemoScreen() {
  return (
    <View style={styles.container}>
      <FlashcardFeed />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
});
