import React, { useState } from 'react';

import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Link, usePathname } from 'expo-router';
import {
  Home,
  BookOpen,
  CreditCard,
  FileText,
  Swords,
  BarChart3,
  Settings,
  X,
} from 'lucide-react-native';
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from './NotificationBell';



interface NavItem {
  label: string;
  href: string;
  icon: any;
}
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenAuth?: (mode: "login" | "signup") => void;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "practice", label: "Concepts", href: "/practice", icon: BookOpen },
  { id: "flash", label: "Flash Cards", href: "/flashcard-feed-demo", icon: CreditCard },
  { id: "mocktests", label: "NEET-PG Full-Scale Mock Tests", href: "/mocktests", icon: FileText },
  { id: "battle", label: "Battles", href: "/battle", icon: Swords },
  { id: "analytics", label: "Analytics", href: "/analyticspage", icon: BarChart3 },
];

export default function Sidebar({
  isOpen = true,
  onClose,
  onOpenAuth,   // ⭐ ADD THIS
}: SidebarProps) {

  const pathname = usePathname();
  // AUTH MODAL STATES
const [showLoginModal, setShowLoginModal] = useState(false);
const [showOTPModal, setShowOTPModal] = useState(false);
const [showRegistrationModal, setShowRegistrationModal] = useState(false);

const [phoneNumber, setPhoneNumber] = useState("");
  const { user, logout } = useAuth();
const isLoggedIn = !!user;
// Only block sidebar on DESKTOP when not logged in
if (!onClose && !isLoggedIn) {
  return null;
}


  const isMobile = !!onClose;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link key={item.href} href={item.href} asChild>
        <Pressable
          style={active ? styles.navItemActive : styles.navItem}
          onPress={isMobile ? onClose : undefined}
        >
          <View style={styles.navItemContent}>
            <View style={styles.iconWrapper}>
              <Icon
                size={20}
                color={active ? '#25D366' : '#9A9A9A'}
                strokeWidth={2}
              />
            </View>
            <Text style={active ? styles.navLabelActive : styles.navLabel}>
              {item.label}
            </Text>
          </View>
          {active && <View style={styles.activeIndicator} />}
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onClose ? (
          <Pressable onPress={onClose} style={styles.logoSection}>
            <Image
              source={{ uri: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/Paragraph%20Logo.webp' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>100% AI-Driven NEETPG Self Prep Platform</Text>
          </Pressable>
        ) : (
          <View style={styles.logoSection}>
            <Image
              source={{ uri: 'https://qyhbwuqnedkizvvsyfyx.supabase.co/storage/v1/object/public/medical-images/Paragraph%20Logo.webp' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>100% AI-Driven NEETPG Self Prep Platform</Text>
          </View>
        )}

        {/* NOTIFICATION BELL - Shows on desktop when logged in, hidden on mobile drawer */}
        {!onClose && isLoggedIn && (
          <View style={styles.notificationContainer}>
            <NotificationBell userId={user?.id} />
          </View>
        )}

        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#E5E5E5" />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.navContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navSection}>
          {navItems.map(renderNavItem)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Link href="/settings" asChild>
          <Pressable
            style={isActive('/settings') ? styles.navItemActive : styles.navItem}
            onPress={isMobile ? onClose : undefined}
          >
            <View style={styles.navItemContent}>
              <View style={styles.iconWrapper}>
                <Settings
                  size={20}
                  color={isActive('/settings') ? '#25D366' : '#9A9A9A'}
                  strokeWidth={2}
                />
              </View>
              <Text style={isActive('/settings') ? styles.navLabelActive : styles.navLabel}>
                Settings
              </Text>
            </View>
            {isActive('/settings') && <View style={styles.activeIndicator} />}
          </Pressable>
        </Link>

       <View style={styles.authButtons}>
  {!isLoggedIn && (
    <>
      <Pressable
        style={styles.loginButton}
        onPress={() => onOpenAuth?.("login")}
      >
        <Text style={styles.loginText}>Login</Text>
      </Pressable>

      <Pressable
        style={styles.signupButton}
        onPress={() => onOpenAuth?.("signup")}
      >
        <Text style={styles.signupText}>Sign Up</Text>
      </Pressable>
    </>
  )}
</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    borderRightWidth: 1,
    borderRightColor: '#1F1F1F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
    minHeight: 100,
  },
  logoSection: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  logoImage: {
    width: 180,
    height: 45,
  },
  tagline: {
    fontSize: 13.6,
    fontWeight: '500',
    color: '#FFFBED',
    letterSpacing: 0.2,
    lineHeight: 19.2,
  },
  notificationContainer: {
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  navContent: {
    paddingVertical: 16,
  },
  navSection: {
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
  },
  navItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
    backgroundColor: '#1A3A2E',
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 14,
    color: '#9A9A9A',
    fontWeight: '400',
    lineHeight: 20,
  },
  navLabelActive: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '600',
    lineHeight: 20,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#25D366',
    borderRadius: 2,
  },
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  loginButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  loginText: {
    fontSize: 14,
    color: '#E5E5E5',
    fontWeight: '600',
    lineHeight: 20,
  },
  signupButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#25D366',
    borderRadius: 6,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#0D0D0D',
    fontWeight: '600',
    lineHeight: 20,
  },
});
