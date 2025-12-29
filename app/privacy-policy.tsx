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

<View style={styles.section}>
  <Text style={styles.heading}>1. 📜 Introduction & Scope</Text>
  <Text style={styles.paragraph}>
    This Privacy Policy governs the collection, use, processing, storage, disclosure,
    and protection of information by <Text style={styles.bold}>Paragraph</Text> through
    the platform <Text style={styles.bold}>neetpg.app</Text>, including its mobile
    applications, websites, dashboards, APIs, and related services
    (collectively, the <Text style={styles.boldItalic}>Platform</Text>).
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>2. 👤 Applicability</Text>
  <Text style={styles.paragraph}>
    This Policy applies to all Users, including visitors, registered users,
    trial users, and paid subscribers, across web and mobile platforms.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>3. 🏢 Data Controller</Text>
  <Text style={styles.paragraph}>
    The Platform is owned and operated by <Text style={styles.bold}>Paragraph</Text>,
    a <Text style={styles.bold}>Sole Proprietorship</Text> entity based in India.
    Paragraph acts as the <Text style={styles.bold}>Data Controller</Text> under
    applicable data protection laws.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>4. 📘 Definitions</Text>
  <Text style={styles.paragraph}>
    • <Text style={styles.boldItalic}>User</Text> means any individual accessing the Platform{"\n"}
    • <Text style={styles.boldItalic}>Personal Information</Text> means any information
      identifying a User{"\n"}
    • <Text style={styles.boldItalic}>Sensitive Personal Data</Text> includes identifiers,
      government IDs, biometrics, health data{"\n"}
    • <Text style={styles.boldItalic}>Services</Text> includes videos, AI mentor, tests,
      analytics, images, and content{"\n"}
    • <Text style={styles.boldItalic}>Third-Party Providers</Text> includes payment gateways,
      analytics, hosting, CDN providers
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>5. 👶 Children & Minors</Text>
  <Text style={styles.paragraph}>
    Users must be at least <Text style={styles.bold}>18 years of age</Text>.
    Minors may access the Platform only with verified parental or legal guardian consent.
  </Text>
</View>


<View style={styles.section}>
  <Text style={styles.heading}>6. 📥 Information You Provide</Text>
  <Text style={styles.paragraph}>
    We may collect name, email, mobile number, educational details, profile images,
    uploaded documents, preferences, and communications.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>7. 🧾 Identity Verification (KYC)</Text>
  <Text style={styles.paragraph}>
    Certain subscriptions may require government-issued identity verification.
    Such data is encrypted, used solely for verification, and stored securely.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>8. ⚙️ Automatically Collected Information</Text>
  <Text style={styles.paragraph}>
    Device type, IP address, browser, OS, timestamps, usage behavior,
    crash logs, and diagnostic data may be collected automatically.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>9. 📍 Location Information</Text>
  <Text style={styles.paragraph}>
    Approximate location may be inferred via IP address for security,
    analytics, and compliance purposes.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>10. 🍪 Cookies & Tracking Technologies</Text>
  <Text style={styles.paragraph}>
    Cookies and similar technologies are used for authentication,
    analytics, fraud prevention, and personalization.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>11. 🔐 Sensitive Personal Data</Text>
  <Text style={styles.paragraph}>
    Sensitive data is collected only when legally required and processed
    in compliance with Indian SPDI Rules and DPDP Act.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>12. 🎯 Purpose of Data Use</Text>
  <Text style={styles.paragraph}>
    Personal Information is used strictly for:
    {"\n"}• Account creation and authentication
    {"\n"}• Delivering educational services and content
    {"\n"}• AI mentor personalization and analytics
    {"\n"}• Subscription management and payments
    {"\n"}• Customer support and grievance handling
    {"\n"}• Legal, regulatory, and security compliance
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>13. 🤖 AI Processing & Profiling</Text>
  <Text style={styles.paragraph}>
    Certain data may be processed using <Text style={styles.bold}>AI-driven systems</Text> for
    learning personalization, recommendations, analytics, and performance insights.
  </Text>
  <Text style={styles.paragraph}>
    AI outputs are <Text style={styles.bold}>algorithmic, probabilistic (μ, σ², ∑)</Text> and may
    not always be accurate. Users retain full responsibility for interpretation.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>14. 🤝 Data Sharing & Disclosure</Text>
  <Text style={styles.paragraph}>
    We do <Text style={styles.bold}>NOT sell</Text> personal data. Information may be shared only with:
    {"\n"}• Payment gateways (e.g., Cashfree)
    {"\n"}• Cloud infrastructure & CDN providers
    {"\n"}• Analytics and monitoring services
    {"\n"}• Legal or regulatory authorities when required by law
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>15. 💳 Payment Information</Text>
  <Text style={styles.paragraph}>
    Paragraph does <Text style={styles.bold}>not store</Text> card, UPI, or banking details.
    All payment data is handled directly by authorised gateways in compliance with PCI-DSS.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>16. 🌍 Cross-Border Data Transfers</Text>
  <Text style={styles.paragraph}>
    Data may be processed or stored outside India on secure servers.
    Appropriate safeguards are implemented in accordance with
    <Text style={styles.bold}> GDPR, DPDP Act (India), and contractual clauses</Text>.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>17. 🗄️ Data Retention</Text>
  <Text style={styles.paragraph}>
    Data is retained only as long as necessary for service delivery,
    legal compliance, dispute resolution, and enforcement.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>18. 🧑‍⚖️ User Rights (India – DPDP Act)</Text>
  <Text style={styles.paragraph}>
    Indian users have the right to:
    {"\n"}• Access personal data
    {"\n"}• Request correction or erasure
    {"\n"}• Withdraw consent
    {"\n"}• Nominate a representative
    {"\n"}• Lodge grievances
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>19. 🇪🇺 User Rights (GDPR – EU)</Text>
  <Text style={styles.paragraph}>
    EU users may exercise rights including:
    {"\n"}• Right of access
    {"\n"}• Right to rectification
    {"\n"}• Right to erasure (Right to be Forgotten)
    {"\n"}• Right to restrict or object to processing
    {"\n"}• Data portability
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>20. 🇺🇸 User Rights (CCPA – California)</Text>
  <Text style={styles.paragraph}>
    California residents may request disclosure, deletion, or opt-out
    of personal data processing. We do not sell personal data.
  </Text>
</View>


<View style={styles.section}>
  <Text style={styles.heading}>21. 🔐 Data Security Measures</Text>
  <Text style={styles.paragraph}>
    We employ <Text style={styles.bold}>industry-standard security practices</Text> including
    encryption at rest and transit, access controls, monitoring, and periodic audits.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>22. ⚠️ Data Breach Response</Text>
  <Text style={styles.paragraph}>
    In the event of a data breach, affected users will be notified as
    required under applicable law.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>23. 🧠 Educational & AI Disclaimer</Text>
  <Text style={styles.paragraph}>
    AI-generated outputs are <Text style={styles.bold}>not medical advice</Text>, not guaranteed,
    and must not replace professional judgment.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>24. 🏛️ NEET-PG Disclaimer</Text>
  <Text style={styles.paragraph}>
    <Text style={styles.bold}>neetpg.app is NOT affiliated</Text> with the Government of India,
    NMC, NBEMS, or NBE. NEET-PG is a national examination conducted by authorities.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>25. 📱 Device, IP & Abuse Monitoring</Text>
  <Text style={styles.paragraph}>
    We may restrict access based on IP address, device fingerprinting,
    abnormal behavior, or security risk indicators.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>26. 🧾 Log Files & Monitoring</Text>
  <Text style={styles.paragraph}>
    Server logs, audit trails, and system logs may be maintained for
    fraud prevention, debugging, and legal compliance.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>27. 🧹 Account Deletion</Text>
  <Text style={styles.paragraph}>
    Users may request account deletion. Certain data may be retained
    where required by law or legitimate interest.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>28. 🔄 Policy Updates</Text>
  <Text style={styles.paragraph}>
    This Privacy Policy may be updated periodically. Continued use
    constitutes acceptance of the revised policy.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>29. ⚖️ Governing Law</Text>
  <Text style={styles.paragraph}>
    This Policy shall be governed by the <Text style={styles.bold}>laws of India</Text>.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>30. 🧑‍⚖️ Jurisdiction</Text>
  <Text style={styles.paragraph}>
    Exclusive jurisdiction lies with courts at
    <Text style={styles.bold}> Hyderabad, Telangana, India</Text>.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>31. 🏢 Ownership Declaration</Text>
  <Text style={styles.paragraph}>
    The Platform is owned by <Text style={styles.bold}>Paragraph</Text>,
    a <Text style={styles.bold}>Sole Proprietorship</Text>.
    {"\n"}Owner: <Text style={styles.bold}>Manu Bharadwaj Yadavalli</Text>
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>32. 📮 Grievance Redressal Officer</Text>
  <Text style={styles.paragraph}>
    <Text style={styles.bold}>Grievance Officer:</Text> Manu Bharadwaj Yadavalli
    {"\n"}<Text style={styles.bold}>Email:</Text> support@neetpg.app
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>33. ⏱️ Grievance Resolution Timeline</Text>
  <Text style={styles.paragraph}>
    We aim to resolve grievances within <Text style={styles.bold}>7 working days</Text>.
  </Text>
</View>

<View style={styles.section}>
  <Text style={styles.heading}>34. ✅ Consent & Final Acceptance</Text>
  <Text style={styles.paragraph}>
    By using the Platform, you provide <Text style={styles.bold}>free, informed, specific,
    unconditional, and unambiguous consent</Text> to this Privacy Policy.
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
