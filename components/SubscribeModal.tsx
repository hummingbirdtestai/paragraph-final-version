//SubscribeModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import { X, Check, Zap, BookOpen, Brain, Image as ImageIcon, Video, FileText, MessageSquare } from 'lucide-react-native';

interface SubscribeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: (plan: '3' | '6' | '12', finalPrice: number, promoCode?: string) => void;
}

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'NEET25': { discount: 0.25, label: '25% off' },
  'SAVE500': { discount: 500, label: '₹500 off' },
  'FIRST50': { discount: 0.50, label: '50% off first month' },
  'STUDENT20': { discount: 0.20, label: '20% off' },
};

export default function SubscribeModal({ visible, onClose, onSubscribe }: SubscribeModalProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#9ca3af" />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollContentDesktop,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, isDesktop && styles.headerDesktop]}>
            <Text style={[styles.headline, isDesktop && styles.headlineDesktop]}>Unlock Your Rank.{'\n'}Not Just Content.</Text>
            <Text style={[styles.subHeadline, isDesktop && styles.subHeadlineDesktop]}>
              Paragraph Pro is not a course.{'\n'}
              It's a 12-month NEET-PG winning system designed for daily progress, not binge watching.
            </Text>
            <Text style={[styles.tagline, isDesktop && styles.taglineDesktop]}>
              Everything you need to crack NEET-PG — structured, adaptive, and distraction-free.
            </Text>
          </View>


          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>What You Get</Text>

            <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
              <FeatureBlock
                icon={<FileText size={24} color="#10b981" />}
                title="10,000 NEET-PG PYQs"
                time="150 hours of focused revision"
                description="Every PYQ mapped to concepts, mistakes, and exam patterns."
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<Brain size={24} color="#10b981" />}
                title="10,000 High-Yield Concepts"
                time="300 hours of structured learning"
                description="Concepts that matter — no fluff, no duplication."
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<BookOpen size={24} color="#10b981" />}
                title="45,000 Flash Cards"
                time="200 hours of rapid recall"
                description="Designed for last-minute revision and long-term memory."
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<Video size={24} color="#10b981" />}
                title="Daily Short Videos"
                subtitle="3-Minute Reels"
                time="100 hours of visual revision"
                bullets={[
                  '20 videos every day',
                  '6,000 reels total',
                  '60,000 high-yield facts',
                  '6,000 MCQs for instant testing',
                ]}
                description="Learn anywhere. Revise anytime. Zero burnout."
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<ImageIcon size={24} color="#10b981" />}
                title="Daily Image-Based Learning"
                time="100 hours of image-based mastery"
                bullets={[
                  '4,500 clinical images',
                  '4,500 case-based vignettes',
                  '50 images daily',
                ]}
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<FileText size={24} color="#10b981" />}
                title="Full-Scale NEET-PG Mock Tests"
                bullets={[
                  'Bi-weekly (Thursday & Sunday)',
                  '100 Grand Tests in 12 months',
                  'Exam-level difficulty',
                  'Rank prediction & analysis',
                ]}
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<Zap size={24} color="#10b981" />}
                title="Hyper-Personalised Adaptive Learning"
                bullets={[
                  'AI adjusts content based on:',
                  '• Your mistakes',
                  '• Your speed',
                  '• Your weak subjects',
                ]}
                isDesktop={isDesktop}
              />

              <FeatureBlock
                icon={<MessageSquare size={24} color="#10b981" />}
                title="24×7 AI Chat"
                description="Clear doubts instantly. No waiting. No teachers' availability issues."
                isDesktop={isDesktop}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Subscription Plans</Text>

            <View style={[styles.plansGrid, isDesktop && styles.plansGridDesktop]}>
              <PlanCard
                duration="3 Months"
                basePrice={12000}
                color="#10b981"
                features={[
                  'Ideal for focused revision phase',
                  'PYQs + Concepts + Flashcards',
                  'Videos, Images & AI Chat',
                  'Mock tests included',
                ]}
                onSubscribe={(finalPrice, promoCode) => {
                  onSubscribe('3', finalPrice, promoCode);
                }}
                isDesktop={isDesktop}
              />

              <PlanCard
                duration="6 Months"
                basePrice={20000}
                color="#3b82f6"
                features={[
                  'Strong foundation + revision',
                  'Full adaptive learning',
                  'All mock tests during period',
                  'Best value for serious aspirants',
                ]}
                onSubscribe={(finalPrice, promoCode) => {
                  onSubscribe('6', finalPrice, promoCode);
                }}
                isDesktop={isDesktop}
              />

              <PlanCard
                duration="12 Months"
                basePrice={36000}
                color="#8b5cf6"
                recommended
                features={[
                  'Complete NEET-PG preparation cycle',
                  '100 Grand Tests included',
                  'Daily videos, images & revisions',
                  'Maximum rank optimisation',
                ]}
                onSubscribe={(finalPrice, promoCode) => {
                  onSubscribe('12', finalPrice, promoCode);
                }}
                isDesktop={isDesktop}
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.trustSection}>
            <TrustBadge text="No ads" />
            <TrustBadge text="No distractions" />
            <TrustBadge text="Secure payments" />
            <TrustBadge text="Instant access after payment" />
          </View>

          <View style={styles.finalCta}>
            <Text style={styles.ctaTitle}>Start Your NEET-PG Winning Journey Now</Text>
            <Text style={styles.ctaSubtitle}>
              Your rank will not improve by scrolling.{'\n'}
              It improves by structured daily learning.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function FeatureBlock({
  icon,
  title,
  subtitle,
  time,
  bullets,
  description,
  isDesktop,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  time?: string;
  bullets?: string[];
  description?: string;
  isDesktop?: boolean;
}) {
  return (
    <View style={[styles.featureBlock, isDesktop && styles.featureBlockDesktop]}>
      <View style={styles.featureHeader}>
        <View style={styles.featureIcon}>{icon}</View>
        <View style={styles.featureTitleContainer}>
          <Text style={styles.featureTitle}>{title}</Text>
          {subtitle && <Text style={styles.featureSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {time && (
        <View style={styles.featureTime}>
          <Text style={styles.featureTimeText}>{time}</Text>
        </View>
      )}
      {bullets && (
        <View style={styles.featureBullets}>
          {bullets.map((bullet, index) => (
            <Text key={index} style={styles.bulletText}>
              {bullet}
            </Text>
          ))}
        </View>
      )}
      {description && <Text style={styles.featureDescription}>{description}</Text>}
    </View>
  );
}

function PlanCard({
  duration,
  basePrice,
  color,
  recommended,
  features,
  onSubscribe,
  isDesktop,
}: {
  duration: string;
  basePrice: number;
  color: string;
  recommended?: boolean;
  features: string[];
  onSubscribe: (finalPrice: number, promoCode?: string) => void;
  isDesktop?: boolean;
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const calculatePricing = () => {
    const original = basePrice;
    let discount = 0;

    if (appliedPromo && PROMO_CODES[appliedPromo]) {
      discount = Math.round(original * PROMO_CODES[appliedPromo].discount);
    }

    const final = original - discount;
    return { original, final, discount };
  };

  const pricing = calculatePricing();
  const hasDiscount = pricing.discount > 0;

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <View style={[styles.planCard, recommended && styles.planCardRecommended, isDesktop && styles.planCardDesktop]}>
      {recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Most students choose this</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <Text style={styles.planDuration}>{duration}</Text>
        {hasDiscount ? (
          <View style={styles.pricingContainer}>
            <Text style={styles.planPriceOriginal}>₹{pricing.original.toLocaleString('en-IN')}</Text>
            <Text style={[styles.planPrice, { color }]}>₹{pricing.final.toLocaleString('en-IN')}</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Save ₹{pricing.discount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.planPrice}>₹{pricing.final.toLocaleString('en-IN')}</Text>
        )}
      </View>

      <View style={styles.planPromoSection}>
        <View style={styles.planPromoInputContainer}>
          <TextInput
            style={styles.planPromoInput}
            placeholder="Promo code"
            placeholderTextColor="#6b7280"
            value={promoCode}
            onChangeText={(text) => {
              setPromoCode(text);
              setPromoError('');
            }}
            autoCapitalize="characters"
          />
          {!appliedPromo ? (
            <TouchableOpacity
              style={styles.planPromoApplyButton}
              onPress={applyPromoCode}
              activeOpacity={0.8}
            >
              <Text style={styles.planPromoApplyText}>Apply</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.planPromoRemoveButton}
              onPress={removePromo}
              activeOpacity={0.8}
            >
              <X size={14} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        {promoError ? (
          <Text style={styles.planPromoError}>{promoError}</Text>
        ) : null}

        {appliedPromo ? (
          <View style={styles.planPromoSuccess}>
            <Check size={14} color="#10b981" />
            <Text style={styles.planPromoSuccessText}>
              {PROMO_CODES[appliedPromo].label} applied!
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.planFeatures}>
        {features.map((feature, index) => (
          <View key={index} style={styles.planFeature}>
            <Check size={16} color={color} />
            <Text style={styles.planFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.planButton, { backgroundColor: color }]}
        onPress={() => onSubscribe(pricing.final, appliedPromo || undefined)}
        activeOpacity={0.8}
      >
        <Text style={styles.planButtonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <View style={styles.trustBadge}>
      <Check size={16} color="#10b981" />
      <Text style={styles.trustBadgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F5E6D3',
    marginBottom: 16,
    lineHeight: 38,
  },
  subHeadline: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 24,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 32,
  },
  featuresSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  featureBlock: {
    marginBottom: 28,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureTitleContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  featureTime: {
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featureTimeText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '500',
  },
  featureBullets: {
    marginLeft: 36,
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 4,
    lineHeight: 20,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 36,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  plansSection: {
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  planCardRecommended: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1a1332',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#8b5cf6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  planHeader: {
    marginBottom: 16,
  },
  planDuration: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#d1d5db',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  trustSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  trustBadgeText: {
    fontSize: 13,
    color: '#d1d5db',
    marginLeft: 6,
  },
  finalCta: {
    alignItems: 'center',
    marginTop: 16,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
  pricingContainer: {
    alignItems: 'flex-start',
  },
  planPriceOriginal: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  savingsBadge: {
    backgroundColor: '#10b981',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContentDesktop: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 60,
  },
  featuresGrid: {
    width: '100%',
  },
  featuresGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12,
  },
  featureBlockDesktop: {
    width: '50%',
    paddingHorizontal: 12,
  },
  plansGrid: {
    width: '100%',
  },
  plansGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    alignItems: 'stretch',
  },
  planCardDesktop: {
    flexBasis: '32%',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  headerDesktop: {
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  headlineDesktop: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
  },
  subHeadlineDesktop: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 800,
  },
  taglineDesktop: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    maxWidth: 900,
  },
  planPromoSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  planPromoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planPromoInput: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  planPromoApplyButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  planPromoApplyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  planPromoRemoveButton: {
    backgroundColor: '#1f2937',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  planPromoError: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
  },
  planPromoSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#064e3b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  planPromoSuccessText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '500',
  },
});
