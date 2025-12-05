/**
 * TEST SCREEN: LogoHeader Component
 *
 * This file demonstrates correct usage of the LogoHeader component.
 * Use this as a reference for integrating LogoHeader into your screens.
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import LogoHeader from './LogoHeader';

export default function LogoHeaderTestScreen() {
  return (
    <View style={styles.container}>
      {/* Logo Header - Always place at the top */}
      <LogoHeader />

      {/* Main Content - Flows naturally below the header */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Logo Header Test Screen</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✅ LogoHeader is working!</Text>
          <Text style={styles.infoText}>
            If you see the Paragraph logo at the top of this screen,
            the component is rendering correctly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works:</Text>
          <Text style={styles.sectionText}>
            1. LogoHeader uses relative positioning{'\n'}
            2. Content flows naturally below it{'\n'}
            3. Logo size is responsive (Desktop: 160px, Tablet: 130px, Mobile: 100px){'\n'}
            4. Dark background (#0B0B0B) with subtle shadow
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check console logs:</Text>
          <Text style={styles.sectionText}>
            Open the console to see diagnostic messages:{'\n'}
            • LogoHeader mounted with screen width{'\n'}
            • Logo width and height calculations{'\n'}
            • Breakpoint detection (desktop/tablet/mobile){'\n'}
            • Image load success/failure
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integration steps:</Text>
          <Text style={styles.sectionText}>
            1. Import: import LogoHeader from '@/components/common/LogoHeader';{'\n'}
            2. Add at top of your screen component{'\n'}
            3. Wrap remaining content in ScrollView{'\n'}
            4. No manual spacing needed - it flows naturally!
          </Text>
        </View>

        <View style={styles.debugBox}>
          <Text style={styles.debugTitle}>🔍 Debugging Info</Text>
          <Text style={styles.debugText}>
            Logo file: assets/images/paragraph_logo.png{'\n'}
            Image size: 869×276 pixels{'\n'}
            Aspect ratio: ~3.15:1{'\n'}
            Display ratio: 2.5:1 (width × 0.4 = height)
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00ff88',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#b0b0b0',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#b0b0b0',
    lineHeight: 24,
  },
  debugBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  spacer: {
    height: 40,
  },
});
