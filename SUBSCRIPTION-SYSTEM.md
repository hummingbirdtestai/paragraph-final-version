# Subscription System Implementation

## Overview

A premium, conversion-focused subscription paywall has been implemented for your NEET-PG learning app. The system follows the architectural pattern where the Sidebar acts as the entitlement gatekeeper.

## Components Created

### 1. `SubscribeModal.tsx`
Located in: `/components/SubscribeModal.tsx`

A full-screen modal that displays:
- Premium headline and value proposition
- Detailed feature breakdown with time estimates
- Three subscription plans (3, 6, and 12 months)
- Trust badges and security assurances
- Clear CTAs for conversion

**Features:**
- Dark mode design
- Mobile-first, thumb-friendly layout
- 12-month plan highlighted as recommended
- Professional medical exam tone
- Clean typography with high contrast

### 2. Sidebar Integration
Updated: `/components/Sidebar.tsx`

The Sidebar now includes:
- "Upgrade to Pro" button (visible when logged in)
- Subscription modal state management
- Access checking placeholder (ready for Supabase integration)
- Premium crown icon for visual hierarchy

## How It Works

### Current Flow
1. User logs in
2. Sidebar shows "Upgrade to Pro" button with crown icon
3. User clicks button → Subscription modal opens
4. User selects plan → `handleSubscribe` called with plan duration
5. Modal closes (payment integration pending)

### Architecture Pattern

```
User Interaction
    ↓
Sidebar (Entitlement Gatekeeper)
    ↓
Check Access: resolve_user_access()
    ↓
If no access → Show SubscribeModal
If has access → Allow navigation
```

## Integration Steps

### Step 1: Add Subscription Table to Supabase

Create a migration to track user subscriptions:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_duration integer NOT NULL, -- 3, 6, or 12 months
  start_date timestamptz DEFAULT now(),
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active', -- active, expired, cancelled
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Step 2: Implement Access Checking

Update the `checkUserAccess` function in `Sidebar.tsx`:

```typescript
useEffect(() => {
  const checkUserAccess = async () => {
    if (!user?.id) {
      setHasAccess(false);
      return;
    }

    // Query Supabase for active subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error('Error checking subscription:', error);
      setHasAccess(false);
      return;
    }

    setHasAccess(!!data);
  };

  checkUserAccess();
}, [user?.id]);
```

### Step 3: Handle Subscription Purchase

Update the `handleSubscribe` function to process payments:

```typescript
const handleSubscribe = async (plan: '3' | '6' | '12') => {
  // Calculate end date based on plan
  const months = parseInt(plan);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);

  // Insert subscription record
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      plan_duration: months,
      end_date: endDate.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating subscription:', error);
    return;
  }

  // Update access state
  setHasAccess(true);
  setShowSubscribeModal(false);

  // Show success message
  alert('Subscription activated successfully!');
};
```

### Step 4: Protect Routes

Add access checks to protected screens:

```typescript
// In any protected screen (e.g., practice.tsx, flashcards.tsx)
useEffect(() => {
  const checkAccess = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .maybeSingle();

    if (!data) {
      // Show paywall or redirect
      router.push('/');
    }
  };

  checkAccess();
}, [userId]);
```

## Payment Integration

For actual payment processing, integrate with a payment provider. Since this is a mobile app with in-app subscriptions:

### Option 1: RevenueCat (Recommended for Mobile)
- Handles App Store and Google Play subscriptions
- Manages receipt validation
- Provides cross-platform support
- See: https://www.revenuecat.com/docs/getting-started/installation/expo

### Option 2: Web Payments (For Web Platform)
For web-only payments, you can integrate:
- Razorpay (for India)
- Stripe (international)
- PhonePe/Paytm (India-specific)

**Note:** The current implementation is payment-agnostic and ready for any provider.

## Customization

### Pricing
Update prices in `SubscribeModal.tsx`:

```typescript
<PlanCard
  duration="3 Months"
  price="₹12,000"  // Change this
  ...
/>
```

### Features
Modify feature blocks in the same file:

```typescript
<FeatureBlock
  icon={<Brain size={24} color="#10b981" />}
  title="Your Feature"
  time="100 hours"
  description="Your description"
/>
```

### Access Logic
Customize what "access" means for your app:
- Trial period
- Feature-based access
- Time-based access
- Content limits

## Testing

1. Log in as a user
2. Click "Upgrade to Pro" in the sidebar
3. Select a plan
4. Verify console logs the selected plan
5. Modal should close after selection

## Next Steps

1. Create Supabase migration for subscriptions table
2. Implement payment provider integration
3. Add subscription status to user profile
4. Create admin dashboard to manage subscriptions
5. Add email notifications for subscription events
6. Implement subscription renewal reminders
7. Add analytics tracking for conversion rates

## Security Considerations

- NEVER expose payment credentials in client code
- Always validate subscription status server-side
- Use Row Level Security (RLS) for subscription data
- Implement rate limiting on subscription endpoints
- Log all subscription events for audit trail
