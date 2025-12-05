import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Mail, MessageCircle, Book, Video } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>help & support</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Help & Support</Text>

        <Text style={styles.subtitle}>
          We're here to help! Choose the option that works best for you.
        </Text>

        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <Mail size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Email Support</Text>
            <Text style={styles.supportDescription}>
              Get help via email. We typically respond within 24 hours.
            </Text>
            <Text style={styles.contactInfo}>support@hummingbirdmentor.com</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <MessageCircle size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Live Chat</Text>
            <Text style={styles.supportDescription}>
              Chat with our support team in real-time during business hours.
            </Text>
            <Text style={styles.contactInfo}>Available Mon-Fri, 9 AM - 6 PM EST</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <Book size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Documentation</Text>
            <Text style={styles.supportDescription}>
              Browse our comprehensive guides and FAQs for quick answers.
            </Text>
            <Text style={styles.contactInfo}>docs.hummingbirdmentor.com</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <Video size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Video Tutorials</Text>
            <Text style={styles.supportDescription}>
              Watch step-by-step video guides to make the most of the platform.
            </Text>
            <Text style={styles.contactInfo}>tutorials.hummingbirdmentor.com</Text>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.heading}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I reset my password?</Text>
            <Text style={styles.answer}>
              Go to Settings → Change Password, or use the "Forgot Password" link on the login screen.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I cancel my subscription?</Text>
            <Text style={styles.answer}>
              Navigate to Settings → Manage Subscription and follow the cancellation process.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>Is my data secure?</Text>
            <Text style={styles.answer}>
              Yes, we use industry-standard encryption and security practices to protect your data.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>Can I use the app offline?</Text>
            <Text style={styles.answer}>
              Currently, an internet connection is required to access learning content and track progress.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    marginBottom: theme.spacing.xl,
  },
  supportCard: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  supportDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
    marginBottom: theme.spacing.xs,
  },
  contactInfo: {
    color: theme.colors.accent,
    fontSize: theme.typography.bodySmall.fontSize,
  },
  faqSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  heading: {
    color: theme.colors.accent,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  faqItem: {
    marginBottom: theme.spacing.lg,
  },
  question: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  answer: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
});
