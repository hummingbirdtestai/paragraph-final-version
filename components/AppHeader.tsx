import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { useAuth } from "@/contexts/AuthContext";

interface AppHeaderProps {
  onMenuPress?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  isDesktop?: boolean;
}

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

export default function AppHeader({ onMenuPress, onOpenAuth, isDesktop }: AppHeaderProps) {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  return (
    <View style={styles.container}>
      <View style={[
        styles.content,
        isDesktop && !isLoggedIn && styles.contentDesktop
      ]}>

        {isLoggedIn ? (
          // ⭐ AFTER LOGIN — SHOW MENU + LOGO
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
                <Text style={styles.tagline}>100% AI-Driven NEETPG Self Prep Platform</Text>
              </Pressable>
            </Link>
          </>
        ) : (
          // ⭐ BEFORE LOGIN — SHOW LOGO + AUTH BUTTONS
          <>
            <Link href="/" asChild>
              <Pressable style={[
                styles.logoSection,
                isDesktop && styles.logoSectionDesktop
              ]}>
                <Image
                  source={{ uri: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/Paragraph%20Logo.webp' }}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.tagline}>100% AI-Driven NEETPG Self Prep Platform</Text>
              </Pressable>
            </Link>

            <View style={styles.authButtons}>
              <Pressable
                style={styles.loginButton}
                onPress={() => onOpenAuth?.('login')}
              >
                <Text style={styles.loginText}>Login</Text>
              </Pressable>

              <Pressable
                style={styles.signupButton}
                onPress={() => onOpenAuth?.('signup')}
              >
                <Text style={styles.signupText}>Sign Up</Text>
              </Pressable>
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
    alignSelf: 'center',
    width: '100%',
  },
  contentDesktop: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxWidth: '100%',
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  logoSection: {
    flex: 1,
    flexDirection: 'column',
  },
  logoSectionDesktop: {
    flex: 0,
    width: SIDEBAR_WIDTH - 40,
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
  },
});
