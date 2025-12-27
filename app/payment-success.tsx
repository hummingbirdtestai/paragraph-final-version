//payment-success.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

type SubscriptionStatus = 'checking' | 'success' | 'processing' | 'failed';
type PaymentOrderStatus = 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'PENDING' | null;
type FailureReason = 'CANCELLED' | 'FAILED' | 'UNKNOWN';

const FAILURE_COPY: Record<FailureReason, { title: string; message: string }> = {
  CANCELLED: {
    title: 'Payment Cancelled',
    message:
      'You cancelled the payment process. No amount has been charged to your account.',
  },
  FAILED: {
    title: 'Payment Failed',
    message:
      'The payment could not be completed. If any amount was deducted, it will be refunded automatically by your bank.',
  },
  UNKNOWN: {
    title: 'Unable to Verify Payment',
    message:
      'We could not verify the payment status at this moment. Please try again later.',
  },
};

interface UserSubscription {
  is_active: boolean;
  is_paid: boolean;
  subscription_start_at: string | null;
  subscription_end_at: string | null;
  purchased_package: string | null;
  amount_paid: number | null;
  subscribed_at: string | null;
}

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const confettiRef = useRef<any>(null);

  const [status, setStatus] = useState<SubscriptionStatus>('checking');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<PaymentOrderStatus>(null);
  const [failureReason, setFailureReason] = useState<FailureReason | null>(null);

  const MAX_RETRIES = 2;
  const RETRY_DELAY = 2000;

const fetchUserSubscription = async (): Promise<UserSubscription | null> => {
  if (!user?.id) return null;

  const { data, error } = await supabase
    .from('users')
    .select(
      'is_active, is_paid, subscription_start_at, subscription_end_at, purchased_package, amount_paid, subscribed_at'
    )
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
};

const verifyOrderStatus = async () => {
  const orderId = params?.order_id as string;
  if (!orderId) return null;

  try {
    const res = await fetch(
      `https://paragraph-pg-production.up.railway.app/api/payments/status?order_id=${orderId}`
    );

    const data = await res.json();
    setOrderStatus(data.order_status);
    return data.order_status;
  } catch {
    return null;
  }
};
  
  const checkSubscription = async (isRetry = false) => {
    const paymentStatus = await verifyOrderStatus();

    if (paymentStatus === 'CANCELLED') {
      setFailureReason('CANCELLED');
      setStatus('failed');
      return;
    }

    if (paymentStatus === 'FAILED') {
      setFailureReason('FAILED');
      setStatus('failed');
      return;
    }

    if (paymentStatus === 'PENDING') {
      if (retryCount < MAX_RETRIES && !isRetry) {
        setStatus('processing');
        setRetryCount((prev) => prev + 1);
        setTimeout(() => checkSubscription(true), RETRY_DELAY);
        return;
      }

      setStatus('processing');
      return;
    }

    const data = await fetchUserSubscription();

    if (!data) {
      setFailureReason('UNKNOWN');
      setStatus('failed');
      return;
    }

    setSubscription(data);

    if (paymentStatus === 'SUCCESS' && data.is_paid && data.is_active) {
      setStatus('success');
      confettiRef.current?.start();
      return;
    }

    if (paymentStatus === 'SUCCESS' && (!data.is_paid || !data.is_active)) {
      if (retryCount < MAX_RETRIES && !isRetry) {
        setStatus('processing');
        setRetryCount((prev) => prev + 1);
        setTimeout(() => checkSubscription(true), RETRY_DELAY);
      } else {
        setStatus('processing');
      }
      return;
    }

    setStatus('processing');
  };

  useEffect(() => {
    if (!user) return; // ⛔ wait silently
    checkSubscription();
  }, [user]);

  const handleContinue = () => {
    router.replace('/');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
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

  if (status === 'checking') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#25D366" />
          <Text style={styles.loadingText}>Verifying your payment...</Text>
        </View>
      </View>
    );
  }

  if (status === 'processing') {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Loader2 size={48} color="#fbbf24" strokeWidth={2} />
          <Text style={styles.title}>Payment Verification In Progress</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              We are confirming the final payment status with the payment provider.
              This may take a few minutes.
            </Text>
            <Text style={[styles.infoText, { marginTop: 12 }]}>
              You do not need to retry the payment.
              If it completes successfully, your subscription will activate automatically.
            </Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (status === 'failed') {
    const copy = FAILURE_COPY[failureReason ?? 'UNKNOWN'];

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconContainer}>
            <AlertCircle size={80} color="#ef4444" strokeWidth={1.5} />
          </View>

          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.errorText}>{copy.message}</Text>

          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: width / 2, y: -10 }}
        autoStart={false}
        fadeOut
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#25D366" strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your subscription is now active</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailValue}>
              {getPlanDuration(subscription?.purchased_package)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid</Text>
            <Text style={styles.detailValue}>{formatAmount(subscription?.amount_paid)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(subscription?.subscription_start_at)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid Until</Text>
            <Text style={styles.detailValue}>
              {formatDate(subscription?.subscription_end_at)}
            </Text>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>You now have access to:</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Unlimited Concepts & Questions</Text>
            <Text style={styles.benefitItem}>• NEET-PG Full-Scale Mock Tests</Text>
            <Text style={styles.benefitItem}>• Video Lectures & Image-Based MCQs</Text>
            <Text style={styles.benefitItem}>• Battle Mode & Analytics</Text>
            <Text style={styles.benefitItem}>• AI-Powered Learning Insights</Text>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue to Dashboard</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Thank you for choosing Paragraph. Start your NEET-PG preparation now!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9A9A9A',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#E5E5E5',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E5E5',
    marginBottom: 20,
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
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  benefitsCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E5',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 14,
    color: '#9A9A9A',
    lineHeight: 20,
  },
  infoBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  infoText: {
    fontSize: 14,
    color: '#E5E5E5',
    lineHeight: 20,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#25D366',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0D0D',
  },
  footerText: {
    fontSize: 14,
    color: '#9A9A9A',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
