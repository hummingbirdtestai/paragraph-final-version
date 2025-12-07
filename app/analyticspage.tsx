import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainLayout from '@/components/MainLayout';

export default function AnalyticsScreen() {
  return (
    <MainLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.description}>
          Track your progress, identify weak areas, and optimize your study strategy.
        </Text>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E5E5E5',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#9A9A9A',
    lineHeight: 24,
  },
});
