import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { Menu } from 'lucide-react-native';

interface AppHeaderProps {
  onMenuPress?: () => void;
  showMenu?: boolean;
}

export default function AppHeader({ onMenuPress, showMenu = false }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showMenu ? (
          <>
            <Pressable onPress={onMenuPress} style={styles.menuButton}>
              <Menu size={24} color="#E5E5E5" strokeWidth={2} />
            </Pressable>
            <Link href="/" asChild>
  <Pressable style={styles.logoSection}>
    <Image
      source={{ uri: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/Paragraph%20Logo.webp' }}
      style={styles.logo}
      resizeMode="contain"
    />
    <Text style={styles.tagline} numberOfLines={1}>
      100% AI-Driven NEETPG Self Prep Platform
    </Text>
  </Pressable>
</Link>

          </>
        ) : (
          <>
            <View style={styles.spacer} />
            <View style={styles.authButtons}>
              <Link href="/login" asChild>
                <Pressable style={styles.loginButton}>
                  <Text style={styles.loginText}>Login</Text>
                </Pressable>
              </Link>
              <Link href="/signup" asChild>
                <Pressable style={styles.signupButton}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </Pressable>
              </Link>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    maxWidth: 1400,
    marginHorizontal: 'auto',
    width: '100%',
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  logoSection: {
    flex: 1,
    flexDirection: 'column',
  },
  logo: {
    width: 150,
    height: 45,
  },
  tagline: {
    fontSize: 13.6,
    fontWeight: '500',
    color: '#FFFBED',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  spacer: {
    flex: 1,
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  loginText: {
    fontSize: 14,
    color: '#E5E5E5',
    fontWeight: '500',
    lineHeight: 20,
  },
  signupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#25D366',
    borderRadius: 6,
  },
  signupText: {
    fontSize: 14,
    color: '#0D0D0D',
    fontWeight: '600',
    lineHeight: 20,
  },
});
