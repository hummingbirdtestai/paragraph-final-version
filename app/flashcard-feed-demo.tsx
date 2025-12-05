import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlashcardFeed from '@/components/FlashcardFeedDemo';

export default function FlashcardFeedDemoScreen() {
  return (
    <View style={styles.container}>
      <FlashcardFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
});
