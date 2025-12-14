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
import { X, Check, Zap, BookOpen, Brain, Image as ImageIcon, Video, FileText, MessageSquare, Tag } from 'lucide-react-native';

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

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const calculatePrice = (basePrice: number): { original: number; final: number; discount: number } => {
    if (!appliedPromo) return { original: basePrice, final: basePrice, discount: 0 };

    const promo = PROMO_CODES[appliedPromo];
    let discount = 0;

    if (promo.discount < 1) {
      discount = basePrice * promo.discount;
    } else {
      discount = promo.discount;
    }

    return {
      original: basePrice,
      final: Math.max(0, basePrice - discount),
      discount: discount,
    };
  };

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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headline}>Unlock Your Rank.{'\n'}Not Just Content.</Text>
            <Text style={styles.subHeadline}>
              Paragraph Pro is not a course.{'\n'}
              It's a 12-month NEET-PG winning system designed for daily progress, not binge watching.
            </Text>
            <Text style={styles.tagline}>
              Everything you need to crack NEET-PG — structured, adaptive, and distraction-free.
            </Text>
          </View>

          <View style={styles.promoSectionTop}>
            <View style={styles.promoCard}>
              <View style={styles.promoHeader}>
                <Tag size={20} color="#10b981" />
                <Text style={styles.promoTitle}>Have a Promo Code?</Text>
              </View>
              <Text style={styles.promoSubtitle}>Apply your discount code before selecting a plan</Text>

              <View style={styles.promoInputContainer}>
                <View style={styles.promoInputWrapper}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter promo code"
                    placeholderTextColor="#6b7280"
                    value={promoCode}
                    onChangeText={(text) => {
                      setPromoCode(text);
                      setPromoError('');
                    }}
                    autoCapitalize="characters"
                  />
                </View>
                {!appliedPromo ? (
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={applyPromoCode}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={removePromo}
                    activeOpacity={0.8}
                  >
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>

              {promoError ? (
                <View style={styles.promoMessage}>
                  <Text style={styles.promoError}>{promoError}</Text>
                </View>
              ) : null}

              {appliedPromo ? (
                <View style={styles.promoSuccess}>
                  <Check size={16} color="#10b981" />
                  <Text style={styles.promoSuccessText}>
                    {PROMO_CODES[appliedPromo].label} applied successfully!
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>What You Get</Text>

            <FeatureBlock
              icon={<FileText size={24} color="#10b981" />}
              title="10,000 NEET-PG PYQs"
              time="150 hours of focused revision"
              description="Every PYQ mapped to concepts, mistakes, and exam patterns."
            />

            <FeatureBlock
              icon={<Brain size={24} color="#10b981" />}
              title="10,000 High-Yield Concepts"
              time="300 hours of structured learning"
              description="Concepts that matter — no fluff, no duplication."
            />

            <FeatureBlock
              icon={<BookOpen size={24} color="#10b981" />}
              title="45,000 Flash Cards"
              time="200 hours of rapid recall"
              description="Designed for last-minute revision and long-term memory."
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
            />

            <FeatureBlock
              icon={<MessageSquare size={24} color="#10b981" />}
              title="24×7 AI Chat"
              description="Clear doubts instantly. No waiting. No teachers' availability issues."
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Subscription Plans</Text>

            <PlanCard
              duration="3 Months"
              basePrice={12000}
              pricing={calculatePrice(12000)}
              color="#10b981"
              features={[
                'Ideal for focused revision phase',
                'PYQs + Concepts + Flashcards',
                'Videos, Images & AI Chat',
                'Mock tests included',
              ]}
              onSubscribe={() => {
                const pricing = calculatePrice(12000);
                onSubscribe('3', pricing.final, appliedPromo || undefined);
              }}
            />

            <PlanCard
              duration="6 Months"
              basePrice={20000}
              pricing={calculatePrice(20000)}
              color="#3b82f6"
              features={[
                'Strong foundation + revision',
                'Full adaptive learning',
                'All mock tests during period',
                'Best value for serious aspirants',
              ]}
              onSubscribe={() => {
                const pricing = calculatePrice(20000);
                onSubscribe('6', pricing.final, appliedPromo || undefined);
              }}
            />

            <PlanCard
              duration="12 Months"
              basePrice={36000}
              pricing={calculatePrice(36000)}
              color="#8b5cf6"
              recommended
              features={[
                'Complete NEET-PG preparation cycle',
                '100 Grand Tests included',
                'Daily videos, images & revisions',
                'Maximum rank optimisation',
              ]}
              onSubscribe={() => {
                const pricing = calculatePrice(36000);
                onSubscribe('12', pricing.final, appliedPromo || undefined);
              }}
            />
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
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  time?: string;
  bullets?: string[];
  description?: string;
}) {
  return (
    <View style={styles.featureBlock}>
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
  pricing,
  color,
  recommended,
  features,
  onSubscribe,
}: {
  duration: string;
  basePrice: number;
  pricing: { original: number; final: number; discount: number };
  color: string;
  recommended?: boolean;
  features: string[];
  onSubscribe: () => void;
}) {
  const hasDiscount = pricing.discount > 0;

  return (
    <View style={[styles.planCard, recommended && styles.planCardRecommended]}>
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
        onPress={onSubscribe}
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
  promoSectionTop: {
    marginVertical: 24,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
    padding: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 18,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoInputWrapper: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
  },
  promoInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  removeButton: {
    backgroundColor: '#2a1a1a',
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  promoMessage: {
    marginTop: 12,
  },
  promoError: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  promoSuccess: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a2f1f',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  promoSuccessText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
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
});
