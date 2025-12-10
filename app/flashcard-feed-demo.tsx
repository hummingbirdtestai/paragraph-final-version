import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import FlashcardFeed from '@/components/FlashcardFeedDemo';
import MainLayout from "@/components/MainLayout";


export default function FlashcardFeedDemoScreen() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  return (
    <MainLayout isHeaderHidden={isHeaderHidden}>
    <View style={styles.container}>
      <FlashcardFeed onScrollDirectionChange={setIsHeaderHidden} />
    </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
});
