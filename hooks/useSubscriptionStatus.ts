//useSubscriptionStatus.ts
import { useMemo } from 'react';

export type SubscriptionStatus =
  | 'PRO_ACTIVE'
  | 'PRO_EXPIRING'
  | 'SUBSCRIPTION_EXPIRED'
  | 'TRIAL_ACTIVE'
  | 'TRIAL_EXPIRED'
  | 'FREE';

export interface SubscriptionState {
  status: SubscriptionStatus;
  daysLeft: number | null;
  expiryDate: Date | null;
  showUpgradeCTA: boolean;
  statusText: string;
  subText: string | null;
  color: string;
}

interface UserData {
  is_active?: boolean;
  is_paid?: boolean;
  trial_started_at?: string | null;
  trial_expires_at?: string | null;
  subscription_start_at?: string | null;
  subscription_end_at?: string | null;
  paid_activated_at?: string | null;
  purchased_package?: string | null;
}

const calculateDaysLeft = (endDate: Date): number => {
  return Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

const formatExpiryText = (daysLeft: number, type: 'trial' | 'subscription'): string => {
  if (daysLeft <= 0) return 'Expired';
  if (daysLeft === 1) return type === 'trial' ? 'Trial ends tomorrow' : 'Expires tomorrow';
  return type === 'trial' ? `Trial ends in ${daysLeft} days` : `Expires in ${daysLeft} days`;
};

export function useSubscriptionStatus(user: UserData | null | undefined): SubscriptionState {
  return useMemo(() => {
    if (!user) {
      return {
        status: 'FREE',
        daysLeft: null,
        expiryDate: null,
        showUpgradeCTA: true,
        statusText: 'Upgrade to Pro',
        subText: null,
        color: '#fbbf24',
      };
    }

    const now = new Date();
    const isPaid = user.is_paid === true;
    const isActive = user.is_active === true;

    const subscriptionEndAt = user.subscription_end_at ? new Date(user.subscription_end_at) : null;
    const trialExpiresAt = user.trial_expires_at ? new Date(user.trial_expires_at) : null;

    if (isPaid && subscriptionEndAt) {
      const daysLeft = calculateDaysLeft(subscriptionEndAt);

      if (now >= subscriptionEndAt) {
        return {
          status: 'SUBSCRIPTION_EXPIRED',
          daysLeft: 0,
          expiryDate: subscriptionEndAt,
          showUpgradeCTA: true,
          statusText: 'Subscription Expired',
          subText: 'Renew to continue',
          color: '#ef4444',
        };
      }

      if (isActive && daysLeft <= 7) {
        return {
          status: 'PRO_EXPIRING',
          daysLeft,
          expiryDate: subscriptionEndAt,
          showUpgradeCTA: false,
          statusText: `Pro · ${formatExpiryText(daysLeft, 'subscription')}`,
          subText: null,
          color: '#fbbf24',
        };
      }

      if (isActive) {
        return {
          status: 'PRO_ACTIVE',
          daysLeft,
          expiryDate: subscriptionEndAt,
          showUpgradeCTA: false,
          statusText: 'Pro User',
          subText: formatExpiryText(daysLeft, 'subscription'),
          color: '#25D366',
        };
      }
    }

    if (!isPaid && trialExpiresAt) {
      const daysLeft = calculateDaysLeft(trialExpiresAt);

      if (now >= trialExpiresAt) {
        return {
          status: 'TRIAL_EXPIRED',
          daysLeft: 0,
          expiryDate: trialExpiresAt,
          showUpgradeCTA: true,
          statusText: 'Upgrade to Pro',
          subText: null,
          color: '#fbbf24',
        };
      }

      return {
        status: 'TRIAL_ACTIVE',
        daysLeft,
        expiryDate: trialExpiresAt,
        showUpgradeCTA: true,
        statusText: `Trial · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`,
        subText: null,
        color: '#a855f7',
      };
    }

    return {
      status: 'FREE',
      daysLeft: null,
      expiryDate: null,
      showUpgradeCTA: true,
      statusText: 'Upgrade to Pro',
      subText: null,
      color: '#fbbf24',
    };
  }, [user]);
}
