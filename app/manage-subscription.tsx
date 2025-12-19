import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, CheckCircle, Mail, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface UserSubscription {
  phone: string;
  is_active: boolean;
  is_paid: boolean;
  subscription_start_at: string | null;
  subscription_end_at: string | null;
  purchased_package: string | null;
  amount_paid: number | null;
  subscribed_at: string | null;
}

export default function ManageSubscriptionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, [user?.id]);

  const fetchSubscription = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select(
          'phone, is_active, is_paid, subscription_start_at, subscription_end_at, purchased_package, amount_paid, subscribed_at'
        )
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getPlanDuration = (packageName: string | null) => {
    if (!packageName) return 'N/A';
    if (packageName.includes('3')) return '3 Months';
    if (packageName.includes('6')) return '6 Months';
    if (packageName.includes('12')) return '12 Months';
    return packageName;
  };

  const getDaysRemaining = () => {
    if (!subscription?.subscription_end_at) return null;
    const endDate = new Date(subscription.subscription_end_at);
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Loading subscription details...</Text>
        </View>
      </View>
    );
  }

  if (!subscription || !subscription.is_active || !subscription.is_paid) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#E5E5E5" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.title}>Manage Subscription</Text>
          <View style={styles.noSubscriptionCard}>
            <Text style={styles.noSubscriptionText}>
              You don't have an active subscription.
            </Text>
            <Pressable
              style={styles.upgradeButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.upgradeButtonText}>Go to Home</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#E5E5E5" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Manage Subscription</Text>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Crown size={32} color="#25D366" strokeWidth={2} />
            <View style={styles.statusHeaderText}>
              <Text style={styles.planName}>Pro Plan</Text>
              <View style={styles.activeStatusBadge}>
                <CheckCircle size={14} color="#25D366" strokeWidth={2} />
                <Text style={styles.activeStatusText}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.validitySection}>
            <Text style={styles.validityLabel}>Valid till</Text>
            <Text style={styles.validityDate}>{formatDate(subscription.subscription_end_at)}</Text>
            {daysRemaining !== null && daysRemaining > 0 && (
              <Text style={styles.daysRemaining}>{daysRemaining} days remaining</Text>
            )}
          </View>

          <View style={styles.accessMessage}>
            <Text style={styles.accessText}>
              You have full access to all premium features.
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Plan Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>{subscription.phone || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan Duration</Text>
            <Text style={styles.detailValue}>{getPlanDuration(subscription.purchased_package)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subscription Started</Text>
            <Text style={styles.detailValue}>{formatDate(subscription.subscription_start_at)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subscription Expiry</Text>
            <Text style={styles.detailValue}>{formatDate(subscription.subscription_end_at)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid</Text>
            <Text style={styles.detailValue}>{formatAmount(subscription.amount_paid)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text style={[styles.detailValue, styles.successText]}>Successful</Text>
          </View>
        </View>

        <View style={styles.policyCard}>
          <Text style={styles.policyTitle}>Subscription Policy</Text>
          <Text style={styles.policyText}>
            You can maintain only one active subscription at a time. Renewals will be available once
            your current subscription expires.
          </Text>
        </View>

        <View style={styles.supportCard}>
          <Mail size={20} color="#9A9A9A" strokeWidth={2} />
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>Need help with your subscription?</Text>
            <Text style={styles.supportEmail}>Contact us at support@neetpg.app</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#9A9A9A',
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#E5E5E5',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  statusHeaderText: {
    flex: 1,
    gap: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  activeStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#25D366',
  },
  validitySection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    marginBottom: 16,
  },
  validityLabel: {
    fontSize: 12,
    color: '#9A9A9A',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  validityDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  daysRemaining: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  accessMessage: {
    backgroundColor: '#1A3A2E',
    padding: 12,
    borderRadius: 8,
  },
  accessText: {
    fontSize: 14,
    color: '#25D366',
    fontWeight: '500',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E5',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  detailLabel: {
    fontSize: 14,
    color: '#9A9A9A',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  successText: {
    color: '#25D366',
  },
  policyCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#E5E5E5',
    lineHeight: 20,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 14,
    color: '#E5E5E5',
    fontWeight: '500',
    marginBottom: 4,
  },
  supportEmail: {
    fontSize: 14,
    color: '#9A9A9A',
  },
  noSubscriptionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  noSubscriptionText: {
    fontSize: 16,
    color: '#E5E5E5',
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0D0D',
  },
});
