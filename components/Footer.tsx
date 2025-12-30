import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

const Footer = memo(() => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb || width < 768;

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <Text style={styles.brandText}>Paragraph</Text>
        <View style={styles.mobileLinks}>
          <Link href="/terms" style={styles.link}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
          </Link>
          <Text style={styles.separator}>•</Text>
         <Link href="/privacy-policy" style={styles.link}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/refund-policy" style={styles.link}>
            <Text style={styles.linkText}>Refund Policy</Text>
          </Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/contact-us" style={styles.link}>
            <Text style={styles.linkText}>Contact Us</Text>
          </Link>
        </View>
        <Text style={styles.copyrightText}>© 2025 Paragraph. All rights reserved.</Text>
      </View>
    );
  }

  return (
    <View style={styles.webContainer}>
      <Text style={styles.brandText}>Paragraph</Text>
      <View style={styles.webLinks}>
        <Link href="/terms" style={styles.link}>
          <Text style={styles.linkText}>Terms & Conditions</Text>
        </Link>
        <Text style={styles.separator}>•</Text>
        <Link href="/privacy" style={styles.link}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Link>
        <Text style={styles.separator}>•</Text>
        <Link href="/refund-policy" style={styles.link}>
          <Text style={styles.linkText}>Refund Policy</Text>
        </Link>
        <Text style={styles.separator}>•</Text>
        <Link href="/contact-us" style={styles.link}>
          <Text style={styles.linkText}>Contact Us</Text>
        </Link>
      </View>
      <Text style={styles.copyrightText}>© 2025 Paragraph. All rights reserved.</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  mobileContainer: {
    backgroundColor: '#0d1117',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#21262d',
  },
  webContainer: {
    backgroundColor: '#0d1117',
    paddingVertical: 32,
    paddingHorizontal: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#21262d',
  },
  brandText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f0f6fc',
    letterSpacing: 0.5,
  },
  mobileLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  webLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    textDecorationLine: 'none',
    marginHorizontal: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#8b949e',
    fontWeight: '400',
  },
  separator: {
    fontSize: 13,
    color: '#8b949e',
    marginHorizontal: 4,
  },
  copyrightText: {
    fontSize: 13,
    color: '#8b949e',
    fontWeight: '400',
  },
});

export default Footer;
