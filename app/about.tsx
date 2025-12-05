import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Target, Users, Zap, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>about hummingbird</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>About Hummingbird Mentor</Text>

        <View style={styles.introSection}>
          <Text style={styles.paragraph}>
            Hummingbird Mentor is an AI-powered learning platform designed to make education
            accessible, personalized, and engaging for everyone.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Target size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Our Mission</Text>
            <Text style={styles.featureDescription}>
              To democratize quality education through intelligent, adaptive learning experiences
              that meet each student where they are.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Zap size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Our Approach</Text>
            <Text style={styles.featureDescription}>
              We combine conversational AI with proven pedagogical methods to create an
              interactive learning journey tailored to your pace and style.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Users size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Our Community</Text>
            <Text style={styles.featureDescription}>
              Join thousands of learners worldwide who are achieving their educational goals
              with Hummingbird Mentor.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconContainer}>
            <Heart size={24} color={theme.colors.accent} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Our Values</Text>
            <Text style={styles.featureDescription}>
              We believe in accessible education, continuous improvement, and empowering learners
              to reach their full potential.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.paragraph}>
            Email: hello@hummingbirdmentor.com{'\n'}
            Website: www.hummingbirdmentor.com{'\n'}
            Support: support@hummingbirdmentor.com
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
    marginBottom: theme.spacing.xl,
  },
  introSection: {
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
  featureCard: {
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
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: theme.typography.bodySmall.lineHeight,
  },
});
