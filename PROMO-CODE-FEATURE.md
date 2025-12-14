# Promo Code Feature Implementation

## Overview

The subscription modal has been enhanced with a dynamic promo code system that changes pricing in real-time, similar to airline and hotel booking platforms.

## Changes Made

### 1. Headline Color Update
- Changed headline color from white (#fff) to beige/cream (#F5E6D3)
- Matches the premium aesthetic shown in the design reference
- Location: `SubscribeModal.tsx` - styles.headline

### 2. Trust Badges Update
- Removed "Cancel anytime" badge from trust section
- Remaining badges:
  - No ads
  - No distractions
  - Secure payments
  - Instant access after payment

### 3. Promo Code System

#### Features
- Real-time price calculation
- Strikethrough original price when discount applied
- Success/error feedback
- Visual savings badge
- Remove promo code option

#### Promo Codes Available
```typescript
const PROMO_CODES = {
  'NEET25': { discount: 0.25, label: '25% off' },
  'SAVE500': { discount: 500, label: '₹500 off' },
  'FIRST50': { discount: 0.50, label: '50% off first month' },
  'STUDENT20': { discount: 0.20, label: '20% off' },
};
```

#### How It Works
1. User enters promo code in input field
2. Clicks "Apply" button
3. System validates code
4. If valid:
   - Shows success message with discount label
   - Updates all plan prices
   - Shows original price (strikethrough)
   - Shows discounted price (highlighted)
   - Shows savings badge
5. If invalid:
   - Shows error message "Invalid promo code"
6. User can remove promo code by clicking X button

#### Discount Types
The system supports two discount types:
- **Percentage Discount**: Values < 1 (e.g., 0.25 = 25% off)
- **Fixed Amount Discount**: Values ≥ 1 (e.g., 500 = ₹500 off)

#### Price Display
When promo code applied:
```
Original: ₹36,000 (strikethrough, gray)
Final: ₹27,000 (colored, prominent)
Badge: "Save ₹9,000" (green badge)
```

## UI Components

### Promo Code Section
- Tag icon for visual clarity
- Text input with dark theme styling
- Apply/Remove button
- Success/error messages
- Green success badge with checkmark

### Plan Cards Enhancement
- Dynamic pricing calculation
- Conditional rendering for discounts
- Savings badge display
- Color-coded final price

## Integration

### SubscribeModal Component
```typescript
interface SubscribeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (plan: '3' | '6' | '12', finalPrice: number, promoCode?: string) => void;
}
```

### Sidebar Integration
```typescript
const handleSubscribe = (plan: '3' | '6' | '12', finalPrice: number, promoCode?: string) => {
  console.log(`User selected ${plan} month plan`);
  console.log(`Final price: ₹${finalPrice}`);
  if (promoCode) {
    console.log(`Applied promo code: ${promoCode}`);
  }
  setShowSubscribeModal(false);
};
```

## Adding New Promo Codes

To add new promo codes, update the `PROMO_CODES` object in `SubscribeModal.tsx`:

```typescript
const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'NEWCODE': { discount: 0.30, label: '30% off' },  // Percentage
  'FLAT1000': { discount: 1000, label: '₹1000 off' },  // Fixed amount
};
```

## Database Integration (Future)

To track promo code usage in Supabase:

```sql
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL,  -- 'percentage' or 'fixed'
  discount_value numeric NOT NULL,
  label text NOT NULL,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_code_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid REFERENCES promo_codes(id),
  user_id uuid REFERENCES auth.users(id),
  subscription_id uuid REFERENCES subscriptions(id),
  discount_applied numeric NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

-- Users can view active promo codes
CREATE POLICY "Users can view active promo codes"
  ON promo_codes FOR SELECT
  TO authenticated
  USING (active = true AND (valid_until IS NULL OR valid_until > now()));

-- Users can view their own usage
CREATE POLICY "Users can view own promo usage"
  ON promo_code_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## Testing

### Test Cases
1. Enter valid promo code → Price updates correctly
2. Enter invalid promo code → Error message displays
3. Apply promo, then remove → Price resets to original
4. Apply different promo codes → Last one takes effect
5. Select plan with promo → Final price and code logged correctly

### Test Codes
```
Valid: NEET25, SAVE500, FIRST50, STUDENT20
Invalid: TEST, INVALID, EXPIRED
```

## Styling

All promo code styles follow the dark theme:
- Input: Dark gray background (#1f2937)
- Success: Green theme (#10b981)
- Error: Red theme (#ef4444)
- Borders: Subtle gray (#374151)

## User Experience

### Flow
1. User reviews plans
2. Scrolls up to see "Have a Promo Code?" section
3. Enters code
4. Sees immediate price updates on all plans
5. Reviews new prices with savings badges
6. Selects plan
7. Payment processed with discounted price

### Visual Feedback
- Input border highlights on focus
- Success message with checkmark icon
- Error message in red
- Original price strikethrough
- Prominent discounted price
- Green savings badge

## Future Enhancements

1. **Backend Validation**: Move promo codes to Supabase
2. **Usage Limits**: Track and enforce one-time use codes
3. **Expiry Dates**: Add time-limited promotions
4. **User-Specific Codes**: Generate unique codes per user
5. **Analytics**: Track conversion rates with promo codes
6. **Email Integration**: Send codes via email campaigns
7. **Referral Codes**: Auto-generate codes for referrals
8. **Admin Dashboard**: Manage codes without code changes
