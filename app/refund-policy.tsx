import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function RefundPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>refund & subscription policy</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          Refund, Cancellation, Renewal & Upgrade Policy
        </Text>
        <Text style={styles.updateDate}>Last updated: October 15, 2025</Text>

        {/* 1 */}
        <View style={styles.section}>
          <Text style={styles.heading}>1. 🎓 Free Access & Informed Decision</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Paragraph</Text> provides substantial portions of its learning
            content free of charge, including selected concepts, MCQs, videos, tests, and platform
            features.
          </Text>
          <Text style={styles.paragraph}>
            Users are encouraged to <Text style={styles.bold}>evaluate the free content thoroughly</Text>{" "}
            before purchasing any paid subscription.
          </Text>
        </View>

        {/* 2 */}
        <View style={styles.section}>
          <Text style={styles.heading}>2. ❌ No Cancellation & No Refund Policy</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>
              ALL SUBSCRIPTION PAYMENTS MADE ON neetpg.app ARE FINAL AND NON-REFUNDABLE.
            </Text>
          </Text>
          <Text style={styles.paragraph}>
            Once a paid subscription is purchased and access is activated, it{" "}
            <Text style={styles.bold}>
              cannot be cancelled, refunded, transferred, paused, exchanged, or reversed
            </Text>{" "}
            under any circumstances, except where a refund is expressly required by applicable law.
          </Text>
        </View>

        {/* 3 */}
        <View style={styles.section}>
          <Text style={styles.heading}>3. 🚫 Non-Refundable Items</Text>
          <Text style={styles.paragraph}>
            The following are strictly <Text style={styles.bold}>non-refundable</Text>:
            {"\n"}• Subscription fees (all plans and durations)
            {"\n"}• Notes, QBank, MCQs, mock tests, analytics, AI features
            {"\n"}• Videos, images, flashcards, and study materials
            {"\n"}• Renewals, upgrades, add-ons, and extensions
            {"\n"}• Discounted, promotional, coupon-based, or referral purchases
          </Text>
        </View>

        {/* 4 */}
        <View style={styles.section}>
          <Text style={styles.heading}>4. ⚠️ Clarifications (No Exceptions)</Text>
          <Text style={styles.paragraph}>
            Refunds shall <Text style={styles.bold}>NOT</Text> be issued for:
            {"\n"}• Change of mind or incorrect purchase
            {"\n"}• Partial usage or non-usage of the subscription
            {"\n"}• Dissatisfaction with content, teaching style, or difficulty level
            {"\n"}• Technical issues related to device, browser, OS, or internet connectivity
            {"\n"}• Exam postponement, cancellation, syllabus change, or pattern change
            {"\n"}• Personal, academic, professional, or medical reasons
          </Text>
        </View>

        {/* 5 */}
        <View style={styles.section}>
          <Text style={styles.heading}>5. 🔁 Renewal Policy</Text>
          <Text style={styles.paragraph}>
            Paragraph may offer renewal benefits to existing subscribers during specific time
            windows, as displayed on the Pro Plans page.
          </Text>
          <Text style={styles.paragraph}>
            Renewal benefits:
            {"\n"}• Are time-bound and discretionary
            {"\n"}• May change or be withdrawn without prior notice
            {"\n"}• Do <Text style={styles.bold}>NOT</Text> reset QBank, tests, analytics, bookmarks, or learning history
          </Text>
        </View>

        {/* 6 */}
        <View style={styles.section}>
          <Text style={styles.heading}>6. ⬆️ Upgrade Policy</Text>
          <Text style={styles.paragraph}>
            Only selected users may be eligible for subscription upgrades, based on internal
            criteria such as remaining validity and usage patterns.
          </Text>
          <Text style={styles.paragraph}>
            Once an upgrade is completed:
            {"\n"}• Downgrades are <Text style={styles.bold}>not permitted</Text>
            {"\n"}• The upgraded plan becomes final
            {"\n"}• No partial refunds, credits, or reversals apply
          </Text>
        </View>

        {/* 7 */}
        <View style={styles.section}>
          <Text style={styles.heading}>7. 💳 Failed Transaction Policy</Text>
          <Text style={styles.paragraph}>
            This section applies only where a payment amount is debited from the User’s account,
            but the subscription is not activated.
          </Text>
        </View>

        {/* 8 */}
        <View style={styles.section}>
          <Text style={styles.heading}>8. 🏦 User Responsibility (Failed Payments)</Text>
          <Text style={styles.paragraph}>
            Users must first raise a dispute through:
            {"\n"}• The respective UPI application (for UPI transactions), or
            {"\n"}• Their issuing bank’s dispute or chargeback department
          </Text>
          <Text style={styles.paragraph}>
            Banks typically resolve such disputes within{" "}
            <Text style={styles.bold}>5 to 19 working days</Text>.
          </Text>
        </View>

        {/* 9 */}
        <View style={styles.section}>
          <Text style={styles.heading}>9. 🧾 Paragraph’s Role</Text>
          <Text style={styles.paragraph}>
            If Paragraph has <Text style={styles.bold}>not received the payment</Text>, we are unable
            to initiate a refund from our side.
          </Text>
          <Text style={styles.paragraph}>
            If the amount is not reversed after 19 days, Users may contact{" "}
            <Text style={styles.bold}>support@neetpg.app</Text> with valid transaction proof for
            assistance.
          </Text>
        </View>

        {/* 10 */}
        <View style={styles.section}>
          <Text style={styles.heading}>10. ⏳ Time Limits</Text>
          <Text style={styles.paragraph}>
            All failed-transaction concerns must be initiated within{" "}
            <Text style={styles.bold}>40 days</Text> of the transaction date. Requests raised beyond
            this period shall be considered <Text style={styles.bold}>null and void</Text>.
          </Text>
        </View>

        {/* 11 */}
        <View style={styles.section}>
          <Text style={styles.heading}>11. 🛑 Abuse & Misuse</Text>
          <Text style={styles.paragraph}>
            Paragraph reserves the right to deny assistance or restrict accounts in cases involving:
            {"\n"}• Account sharing or credential misuse
            {"\n"}• Suspicious activity or abuse
            {"\n"}• Repeated disputes or chargebacks
            {"\n"}• Violation of Terms & Conditions
          </Text>
        </View>

        {/* 12 */}
        <View style={styles.section}>
          <Text style={styles.heading}>12. 📮 Refund-Related Communication</Text>
          <Text style={styles.paragraph}>
            For clarity, traceability, and compliance, all refund, cancellation, renewal, and
            failed-transaction requests must be <Text style={styles.bold}>initiated via email</Text>.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Email:</Text> support@neetpg.app
          </Text>
          <Text style={styles.paragraph}>
            Other support channels, if available, may not be able to assist with refund-related
            requests.
          </Text>
        </View>

        {/* 13 */}
        <View style={styles.section}>
          <Text style={styles.heading}>13. ⚖️ Governing Law & Jurisdiction</Text>
          <Text style={styles.paragraph}>
            This Policy shall be governed by the <Text style={styles.bold}>laws of India</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Exclusive jurisdiction shall lie with the competent courts of{" "}
            <Text style={styles.bold}>Hyderabad, Telangana, India</Text>.
          </Text>
        </View>

        {/* 14 */}
        <View style={styles.section}>
          <Text style={styles.heading}>14. 📜 Final Provisions</Text>
          <Text style={styles.paragraph}>
            By purchasing a subscription on neetpg.app, you acknowledge that you have read,
            understood, and agreed to this Policy in full.
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
    marginBottom: theme.spacing.md,
  },
  bold: {
    fontWeight: '700',
  },
});
