import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>privacy policy</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.updateDate}>Last updated: October 15, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, including your name, email address,
            and learning preferences. We also collect usage data to improve your learning experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            Your information is used to personalize your learning journey, track your progress,
            and provide relevant educational content. We never sell your personal data to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your data. All sensitive
            information is encrypted both in transit and at rest.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to access, modify, or delete your personal information at any time.
            Contact our support team for assistance with data-related requests.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this privacy policy, please contact us at
            privacy@hummingbirdmentor.com
          </Text>
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
  updateDate: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  heading: {
    color: theme.colors.accent,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  paragraph: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
});
