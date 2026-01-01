import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ProfileCardProps {
  name: string;
  contact: string;
  subscriptionStatus: 'active' | 'inactive';
  avatarUrl?: string;
}

export function ProfileCard({ name, contact, subscriptionStatus }: ProfileCardProps) {
  const getSubscriptionColor = () => {
    switch (subscriptionStatus) {
      case 'active':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getSubscriptionText = () => {
    switch (subscriptionStatus) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Inactive';
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(name)}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.contact}>{contact}</Text>

        <View style={styles.subscriptionContainer}>
          <Text style={styles.subscriptionLabel}>Subscription: </Text>
          <View style={[styles.subscriptionBadge, { backgroundColor: getSubscriptionColor() + '20' }]}>
            <Text style={[styles.subscriptionText, { color: getSubscriptionColor() }]}>
              {getSubscriptionText()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: theme.spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.background,
    fontSize: 24,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    marginBottom: theme.spacing.xs,
  },
  contact: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    marginBottom: theme.spacing.md,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
  },
  subscriptionBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  subscriptionText: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
