import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>privacy policy</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.updateDate}>Last updated: October 15, 2025</Text>

        {/* PART 1 — FOUNDATION & APPLICABILITY */}

        <View style={styles.section}>
          <Text style={styles.heading}>1. 📜 Introduction & Acceptance</Text>
          <Text style={styles.paragraph}>
            This Privacy Policy governs the collection, use, processing, storage, and disclosure
            of information by <Text style={styles.bold}>Paragraph</Text> through the platform
            <Text style={styles.bold}> neetpg.app</Text> (the <Text style={styles.boldItalic}>Platform</Text>).
          </Text>

          <Text style={styles.paragraph}>
            By accessing or using the Platform, you expressly consent to the practices described
            in this Privacy Policy and agree to be legally bound by it.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. 🏢 Platform Owner & Controller</Text>
          <Text style={styles.paragraph}>
            The Platform is owned and operated by <Text style={styles.bold}>Paragraph</Text>,
            a <Text style={styles.bold}>Sole Proprietorship</Text> entity based in India.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph is the <Text style={styles.bold}>Data Controller</Text> for the purposes
            of applicable data protection laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. 👤 Applicability</Text>
          <Text style={styles.paragraph}>
            This Privacy Policy applies to all users of the Platform, including registered users,
            subscribers, trial users, and visitors.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. 👶 Children & Minors</Text>
          <Text style={styles.paragraph}>
            Users must be <Text style={styles.bold}>18 years or older</Text>. Minors may access
            the Platform only under parental or legal guardian consent.
          </Text>
        </View>

        {/* PART 2 — INFORMATION COLLECTION */}

        <View style={styles.section}>
          <Text style={styles.heading}>5. 📥 Information We Collect</Text>
          <Text style={styles.paragraph}>
            We may collect:
            {"\n"}• Name, email, mobile number
            {"\n"}• Educational details (college, year, exam)
            {"\n"}• Device, IP address, browser, OS
            {"\n"}• Usage patterns and analytics
            {"\n"}• Uploaded images or verification documents (if required)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. 🔐 Sensitive Personal Data</Text>
          <Text style={styles.paragraph}>
            We do not intentionally collect Sensitive Personal Data except where legally required
            for verification, security, or fraud prevention.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>7. 🍪 Cookies & Tracking</Text>
          <Text style={styles.paragraph}>
            Cookies and similar technologies are used to improve performance, analytics, and
            security. You may disable cookies, but some features may not function.
          </Text>
        </View>

        {/* PART 3 — USAGE, SHARING & RIGHTS */}

        <View style={styles.section}>
          <Text style={styles.heading}>8. ⚙️ How We Use Information</Text>
          <Text style={styles.paragraph}>
            Your data is used to:
            {"\n"}• Deliver educational services
            {"\n"}• Personalize learning experience
            {"\n"}• Provide analytics and insights
            {"\n"}• Prevent fraud and misuse
            {"\n"}• Comply with legal obligations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>9. 🤝 Information Sharing</Text>
          <Text style={styles.paragraph}>
            Data may be shared with:
            {"\n"}• Payment gateways (e.g. Cashfree)
            {"\n"}• Cloud & analytics providers
            {"\n"}• Law enforcement when required by law
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>10. 🌍 Cross-Border Transfers</Text>
          <Text style={styles.paragraph}>
            Data may be processed in India, Singapore, USA, or other jurisdictions with adequate
            safeguards as required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>11. 🧑‍⚖️ User Rights</Text>
          <Text style={styles.paragraph}>
            You have rights to:
            {"\n"}• Access
            {"\n"}• Correction
            {"\n"}• Erasure
            {"\n"}• Withdrawal of consent
            {"\n"}• Nomination (as per DPDP Act)
          </Text>
        </View>

        {/* PART 4 — SECURITY, DISCLAIMERS & FINALITY */}

        <View style={styles.section}>
          <Text style={styles.heading}>12. 🔒 Data Security</Text>
          <Text style={styles.paragraph}>
            We implement technical and organizational safeguards including encryption,
            access controls, and secure storage.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>13. 🤖 AI & Automated Processing</Text>
          <Text style={styles.paragraph}>
            AI systems may process anonymized or pseudonymized data using probabilistic models
            (μ, σ², ∑). Outputs are informational only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>14. ⏳ Data Retention</Text>
          <Text style={styles.paragraph}>
            Data is retained only as long as necessary for legal, operational, or educational
            purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>15. 🏢 Entity Declaration</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Paragraph</Text>{"\n"}
            Sole Proprietorship{"\n"}
            Owner: <Text style={styles.bold}>Manu Bharadwaj Yadavalli</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>16. 📮 Grievance Redressal</Text>
          <Text style={styles.paragraph}>
            Email: <Text style={styles.bold}>support@neetpg.app</Text>{"\n"}
            Response time: 7 working days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>17. 📜 Final Consent</Text>
          <Text style={styles.paragraph}>
            Continued use of the Platform constitutes explicit, informed, and unconditional
            consent to this Privacy Policy.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: { marginRight: theme.spacing.md },
  headerText: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: theme.colors.text },
  updateDate: { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl },
  section: { marginBottom: theme.spacing.xl },
  heading: { color: theme.colors.accent, fontSize: 18, fontWeight: '600' },
  paragraph: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  bold: { fontWeight: '700' },
  boldItalic: { fontWeight: '700', fontStyle: 'italic' },
});
