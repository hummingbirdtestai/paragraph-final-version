import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>terms & conditions</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <Text style={styles.updateDate}>Last updated: October 15, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using the Hummingbird Mentor app, you accept and agree to be bound
            by the terms and provisions of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily access the materials on Hummingbird Mentor for
            personal, non-commercial educational use only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. User Account</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account and password.
            You agree to accept responsibility for all activities under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Subscription Terms</Text>
          <Text style={styles.paragraph}>
            Subscriptions are billed on a recurring basis. You may cancel your subscription at any
            time, and cancellation will take effect at the end of your current billing period.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Prohibited Activities</Text>
          <Text style={styles.paragraph}>
            You may not use the service to engage in any unlawful activities, share inappropriate
            content, or attempt to access unauthorized areas of the platform.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Hummingbird Mentor shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>7. Contact Information</Text>
          <Text style={styles.paragraph}>
            For questions about these terms, please contact us at legal@hummingbirdmentor.com
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
