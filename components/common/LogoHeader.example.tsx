/**
 * ✅ LOGO HEADER - USAGE EXAMPLES
 *
 * The logo file is now: assets/images/paragraph_logo.png
 * (lowercase, no spaces, works on both Mobile and Web)
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import LogoHeader from './LogoHeader';

// ========================================
// EXAMPLE 1: Basic Screen (Most Common)
// ========================================

export function Example1_BasicScreen() {
  return (
    <View style={styles.container}>
      <LogoHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.text}>Your content flows naturally below the logo.</Text>
      </ScrollView>
    </View>
  );
}

// ========================================
// EXAMPLE 2: With SafeAreaView
// ========================================

export function Example2_WithSafeArea() {
  return (
    <SafeAreaView style={styles.container}>
      <LogoHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Safe Area Screen</Text>
        <Text style={styles.text}>Logo respects safe areas on notched devices.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#b0b0b0',
    lineHeight: 24,
  },
});

export default Example1_BasicScreen;
