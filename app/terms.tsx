import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerText}>terms & conditions</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <Text style={styles.updateDate}>Last updated: October 15, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>
            1. 📜 Acceptance of Terms
          </Text>
          <Text style={styles.paragraph}>
            By accessing, browsing, registering on, or otherwise using the <Text style={styles.bold}>Paragraph</Text> mobile application,
            website, platform, services, content, features, tools, or any associated offerings
            (collectively, the <Text style={styles.boldItalic}>Platform</Text>), you expressly acknowledge that you have read,
            understood, and agreed to be legally bound by these <Text style={styles.boldItalic}>Terms and Conditions</Text>
            (<Text style={styles.boldItalic}>Terms</Text>), together with our <Text style={styles.bold}>Privacy Policy</Text>, <Text style={styles.bold}>Refund Policy</Text>, and any
            other policies, notices, or guidelines published or referenced on the Platform
            (collectively, the <Text style={styles.boldItalic}>Platform Terms</Text>).
          </Text>

          <Text style={styles.paragraph}>
            If you do <Text style={styles.bold}>not</Text> agree to any part of these Terms, you must <Text style={styles.bold}>immediately discontinue</Text>{" "}
            access to and use of the Platform.
          </Text>

          <Text style={styles.paragraph}>
            These Terms constitute a <Text style={styles.bold}>legally binding electronic contract</Text> under the
            Information Technology Act, 2000 (India), and do not require any physical or digital
            signature.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            2. 🏢 About Paragraph (Platform Owner)
          </Text>
          <Text style={styles.paragraph}>
            The Platform is owned and operated by <Text style={styles.bold}>Paragraph</Text> (hereinafter referred to as
            <Text style={styles.boldItalic}>Paragraph</Text>, <Text style={styles.boldItalic}>we</Text>, <Text style={styles.boldItalic}>us</Text>, or <Text style={styles.boldItalic}>our</Text>), an India-based educational
            technology initiative providing <Text style={styles.bold}>digital learning, AI-assisted mentorship,
            mock tests, analytics, videos, and exam-preparation services</Text>, primarily for
            medical entrance examinations including but not limited to <Text style={styles.bold}>NEET-PG</Text>, <Text style={styles.bold}>INI-CET</Text>,
            <Text style={styles.bold}>FMGE</Text>, and related competitive exams.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph is a <Text style={styles.bold}>private educational platform</Text> and is <Text style={styles.bold}>not affiliated with,
            endorsed by, or recognised by</Text> the National Medical Commission (NMC), any university,
            examining authority, government body, or regulatory authority.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            3. 📘 Definitions & Interpretation
          </Text>
          <Text style={styles.paragraph}>
            For the purposes of these Terms, unless the context otherwise requires:
          </Text>

          <Text style={styles.paragraph}>
            • <Text style={styles.boldItalic}>User</Text> means any individual who accesses or uses the Platform, whether registered or not.{"\n"}
            • <Text style={styles.boldItalic}>Learner</Text> means a User accessing educational content for learning purposes.{"\n"}
            • <Text style={styles.boldItalic}>Services</Text> means all digital offerings including videos, AI mentor interactions,
              mock tests, analytics, flashcards, images, question banks, and related features.{"\n"}
            • <Text style={styles.boldItalic}>Subscription</Text> means a paid plan granting time-bound or feature-bound access
              to specific Services.{"\n"}
            • <Text style={styles.boldItalic}>Content</Text> includes text, images, videos, audio, graphics, data, software,
              AI-generated outputs, and study material made available on the Platform.{"\n"}
            • <Text style={styles.boldItalic}>User-Generated Content</Text> means any content submitted, uploaded, posted, or
              transmitted by Users.{"\n"}
            • <Text style={styles.boldItalic}>Third-Party Service Providers</Text> include payment gateways, analytics providers,
              cloud storage/CDN providers, and similar vendors.
          </Text>

          <Text style={styles.paragraph}>
            Headings are for convenience only and shall not affect interpretation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            4. 👤 Eligibility & Age Requirements
          </Text>
          <Text style={styles.paragraph}>
            To access or use the Platform, you must be <Text style={styles.bold}>at least 18 (eighteen) years of age</Text>.
          </Text>

          <Text style={styles.paragraph}>
            If you are <Text style={styles.bold}>below 18 years</Text>, you may use the Platform <Text style={styles.bold}>only with the verifiable
            consent and supervision of a parent or legal guardian</Text>, who agrees to be bound by
            these Terms on your behalf and assumes full responsibility for your actions.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph reserves the right to <Text style={styles.bold}>suspend or terminate accounts</Text> where age eligibility
            or guardian consent is misrepresented.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            5. 🔐 Account Registration & Security
          </Text>
          <Text style={styles.paragraph}>
            To access certain Services, you may be required to create an account using a verified
            mobile number, email address, OTP, or other authentication mechanisms.
          </Text>

          <Text style={styles.paragraph}>
            You are solely responsible for:
            {"\n"}• Maintaining the confidentiality of your credentials
            {"\n"}• All activities occurring under your account
            {"\n"}• Preventing unauthorised access or misuse
          </Text>

          <Text style={styles.paragraph}>
            Paragraph shall <Text style={styles.bold}>not be liable</Text> for any loss, damage, or unauthorised activity
            arising from your failure to secure your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            6. 🛡️ Intermediary Status & Safe Harbour
          </Text>
          <Text style={styles.paragraph}>
            Paragraph acts as an <Text style={styles.bold}>intermediary</Text> under Section 79 of the Information Technology
            Act, 2000. We do not initiate, modify, or select User-Generated Content and shall not
            be liable for such content to the extent permitted by law.
          </Text>

          <Text style={styles.paragraph}>
            We reserve the right to remove, restrict, or disable access to any content that
            violates applicable laws or these Terms, <Text style={styles.bold}>without prior notice</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            7. 🔁 Modification of Terms
          </Text>
          <Text style={styles.paragraph}>
            Paragraph may modify these Terms at any time. Updated versions will be posted on the
            Platform with a revised "Last Updated" date.
          </Text>

          <Text style={styles.paragraph}>
            Continued use of the Platform after such updates constitutes <Text style={styles.bold}>deemed acceptance</Text>{" "}
            of the revised Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            8. 🎓 Platform Services
          </Text>
          <Text style={styles.paragraph}>
            Paragraph provides a <Text style={styles.bold}>technology-enabled educational Platform</Text> offering digital
            learning tools including but not limited to:
            {"\n"}• Concept explanations and notes
            {"\n"}• AI-assisted mentor interactions
            {"\n"}• Mock tests, MCQs, and assessments
            {"\n"}• Performance analytics and dashboards
            {"\n"}• Images, diagrams, videos, and flashcards
            {"\n"}• Exam-oriented revision and practice modules
          </Text>

          <Text style={styles.paragraph}>
            The Platform is intended <Text style={styles.bold}>solely for educational and informational purposes</Text> and
            does not replace formal teaching, classroom instruction, or institutional coaching.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph reserves the right to <Text style={styles.bold}>add, modify, suspend, or discontinue</Text> any feature,
            Service, or part of the Platform at its sole discretion, with or without prior notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            9. 🤖 AI Mentor, Automation & Generated Content
          </Text>
          <Text style={styles.paragraph}>
            Certain features of the Platform utilise <Text style={styles.bold}>artificial intelligence (AI)</Text>,
            algorithmic systems, or automated processes (collectively, <Text style={styles.boldItalic}>AI Systems</Text>),
            including mentor-style explanations, suggestions, analytics, summaries, and
            recommendations.
          </Text>

          <Text style={styles.paragraph}>
            You expressly acknowledge and agree that:
            {"\n"}• AI responses may be <Text style={styles.bold}>probabilistic</Text>, <Text style={styles.bold}>approximate</Text>, or <Text style={styles.bold}>context-limited</Text>
            {"\n"}• AI outputs may contain <Text style={styles.bold}>errors, omissions, or outdated information</Text>
            {"\n"}• AI content is <Text style={styles.bold}>not a substitute</Text> for professional academic, medical,
            or legal advice
          </Text>

          <Text style={styles.paragraph}>
            Paragraph makes <Text style={styles.bold}>no representations or warranties</Text> regarding the accuracy,
            completeness, reliability, or exam-outcome relevance of AI-generated content.
          </Text>

          <Text style={styles.paragraph}>
            Use of AI Systems is entirely <Text style={styles.bold}>at your own discretion and risk</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            10. 💳 Subscriptions, Plans & Access
          </Text>
          <Text style={styles.paragraph}>
            Certain Services are offered under <Text style={styles.bold}>paid subscription plans</Text> (<Text style={styles.boldItalic}>Subscriptions</Text>),
            the details of which (pricing, duration, scope, features) are displayed on the Platform
            at the time of purchase.
          </Text>

          <Text style={styles.paragraph}>
            Subscriptions are:
            {"\n"}• <Text style={styles.bold}>Personal and non-transferable</Text>
            {"\n"}• Valid only for the registered User
            {"\n"}• Limited to the duration and scope purchased
          </Text>

          <Text style={styles.paragraph}>
            Sharing accounts, reselling access, or simultaneous use beyond permitted device limits
            may result in <Text style={styles.bold}>immediate suspension or termination without refund</Text>.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph reserves the right to <Text style={styles.bold}>revise pricing, plans, or features</Text> at any time.
            Changes shall not affect already-purchased Subscriptions unless required by law.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            11. 🚫 No Guarantee of Results
          </Text>
          <Text style={styles.paragraph}>
            Paragraph does <Text style={styles.bold}>not guarantee</Text>:
            {"\n"}• Any rank, score, percentile, or exam result
            {"\n"}• Selection, qualification, or admission
            {"\n"}• Accuracy of predictions or analytics
          </Text>

          <Text style={styles.paragraph}>
            Academic outcomes depend on multiple factors beyond the Platform's control,
            including individual effort, preparation strategy, exam difficulty, and external
            conditions.
          </Text>

          <Text style={styles.paragraph}>
            Any testimonials, success stories, or examples shown are <Text style={styles.bold}>illustrative only</Text> and
            do not represent typical outcomes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            12. 📚 Intellectual Property Rights
          </Text>
          <Text style={styles.paragraph}>
            All Platform content, software, designs, layouts, logos, trademarks, text, graphics,
            videos, audio, data, AI models, workflows, and materials (excluding User-Generated
            Content) are the <Text style={styles.bold}>exclusive intellectual property of Paragraph</Text> or its licensors.
          </Text>

          <Text style={styles.paragraph}>
            You are granted a <Text style={styles.bold}>limited, non-exclusive, non-transferable, revocable license</Text>{" "}
            to access the Platform <Text style={styles.bold}>solely for personal, non-commercial educational use</Text>.
          </Text>

          <Text style={styles.paragraph}>
            You shall <Text style={styles.bold}>not</Text>:
            {"\n"}• Copy, reproduce, distribute, or sell Platform content
            {"\n"}• Record, scrape, mirror, or archive videos or tests
            {"\n"}• Reverse-engineer or exploit any system or algorithm
            {"\n"}• Use content for coaching, resale, or competing platforms
          </Text>

          <Text style={styles.paragraph}>
            Any unauthorised use may result in <Text style={styles.bold}>civil and criminal liability</Text> under applicable
            intellectual property laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            13. ✍️ User-Generated Content (UGC)
          </Text>
          <Text style={styles.paragraph}>
            You retain ownership of content you submit, post, or upload to the Platform
            (<Text style={styles.boldItalic}>User-Generated Content</Text>).
          </Text>

          <Text style={styles.paragraph}>
            By submitting UGC, you grant Paragraph a <Text style={styles.bold}>worldwide, royalty-free, perpetual,
            irrevocable, sublicensable license</Text> to use, display, reproduce, modify, distribute,
            and store such content for Platform operations, improvement, moderation, analytics,
            and legal compliance.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph assumes <Text style={styles.bold}>no responsibility</Text> for User-Generated Content and does not
            endorse opinions expressed by Users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            14. ⚕️ Medical & Educational Disclaimer
          </Text>
          <Text style={styles.paragraph}>
            The Platform content is <Text style={styles.bold}>not medical advice</Text> and must not be used for diagnosis,
            treatment, or patient care decisions.
          </Text>

          <Text style={styles.paragraph}>
            Users must rely on <Text style={styles.bold}>standard textbooks, official guidelines, institutional teaching,
            and licensed professionals</Text> for clinical or academic decisions.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph expressly disclaims all liability for actions taken based on Platform content.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            15. 💰 Pricing, Payments & Taxes
          </Text>
          <Text style={styles.paragraph}>
            All prices for Subscriptions and Services are displayed on the Platform in Indian
            Rupees (₹) unless otherwise stated and are <Text style={styles.bold}>exclusive of applicable taxes</Text>, including
            but not limited to <Text style={styles.bold}>GST</Text>, which shall be charged as per prevailing law.
          </Text>

          <Text style={styles.paragraph}>
            Payments are processed through authorised third-party payment gateways, including
            <Text style={styles.bold}>Cashfree Payments India Pvt. Ltd.</Text> (<Text style={styles.boldItalic}>Cashfree</Text>).
          </Text>

          <Text style={styles.paragraph}>
            Paragraph does <Text style={styles.bold}>not store</Text> your card, UPI, or banking credentials. Payment data is
            handled entirely by the payment gateway in accordance with their respective policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            16. 🧾 Payment Gateway Disclaimer (Cashfree)
          </Text>
          <Text style={styles.paragraph}>
            By making a payment, you agree to be bound by <Text style={styles.bold}>Cashfree's terms, policies, and risk
            controls</Text>, in addition to these Terms.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph shall <Text style={styles.bold}>not be liable</Text> for:
            {"\n"}• Payment failures or delays
            {"\n"}• Duplicate debits or bank errors
            {"\n"}• UPI, card, or net-banking issues
            {"\n"}• Gateway downtime or reconciliation delays
          </Text>

          <Text style={styles.paragraph}>
            Any payment disputes must first be raised with Cashfree or your issuing bank.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            17. 🔁 Refund & Cancellation Policy (NO REFUNDS)
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.</Text>
          </Text>

          <Text style={styles.paragraph}>
            Once a Subscription is activated, <Text style={styles.bold}>no refunds</Text>, partial or full, shall be issued
            under any circumstances, including but not limited to:
            {"\n"}• Change of mind
            {"\n"}• Incorrect purchase
            {"\n"}• Dissatisfaction with content
            {"\n"}• Technical issues
            {"\n"}• Exam postponement or cancellation
          </Text>

          <Text style={styles.paragraph}>
            Cancellation of a Subscription only prevents future renewals and <Text style={styles.bold}>does not entitle</Text>{" "}
            you to any refund.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            18. 🎟️ Coupons, Discounts & Promotional Offers
          </Text>
          <Text style={styles.paragraph}>
            Coupons, discounts, referral benefits, or promotional pricing are:
            {"\n"}• <Text style={styles.bold}>Time-bound</Text>
            {"\n"}• <Text style={styles.bold}>Non-transferable</Text>
            {"\n"}• Subject to withdrawal without notice
          </Text>

          <Text style={styles.paragraph}>
            Paragraph reserves the right to <Text style={styles.bold}>invalidate or revoke</Text> any coupon or offer if misuse,
            fraud, or policy violation is detected.
          </Text>

          <Text style={styles.paragraph}>
            No refunds or price adjustments shall be made if a discount was missed or expired.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            19. 📱 Device, IP & Access Restrictions
          </Text>
          <Text style={styles.paragraph}>
            Access to the Platform may be <Text style={styles.bold}>restricted by device, IP address, session, or account</Text>{" "}
            to prevent abuse.
          </Text>

          <Text style={styles.paragraph}>
            Users may access the Platform only on a <Text style={styles.bold}>limited number of devices</Text>, as determined
            by Paragraph. Excessive logins, device switching, or abnormal activity may result in
            account suspension.
          </Text>

          <Text style={styles.paragraph}>
            Access from VPNs, emulators, rooted/jailbroken devices, or suspicious IP addresses may
            be blocked without notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            20. 🚫 Prohibited Activities
          </Text>
          <Text style={styles.paragraph}>
            You shall <Text style={styles.bold}>NOT</Text>, directly or indirectly:
            {"\n"}• Share or resell your account
            {"\n"}• Record or screen-capture content
            {"\n"}• Scrape, download, or archive data
            {"\n"}• Circumvent access controls
            {"\n"}• Use bots, scripts, or automation
            {"\n"}• Reverse engineer platform logic
            {"\n"}• Impersonate another user
            {"\n"}• Use content for coaching or resale
          </Text>

          <Text style={styles.paragraph}>
            Any such activity constitutes a <Text style={styles.bold}>material breach</Text> of these Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            21. ⚠️ Enforcement, Suspension & Termination
          </Text>
          <Text style={styles.paragraph}>
            Paragraph reserves the right to <Text style={styles.bold}>suspend, restrict, or permanently terminate</Text>{" "}
            your account without notice if:
            {"\n"}• These Terms are violated
            {"\n"}• Fraud or abuse is suspected
            {"\n"}• Legal or regulatory obligations require action
          </Text>

          <Text style={styles.paragraph}>
            Termination does <Text style={styles.bold}>not</Text> entitle the User to any refund or compensation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            22. 📍 IP-Based Access & Geographic Controls
          </Text>
          <Text style={styles.paragraph}>
            The Platform may restrict or condition access based on <Text style={styles.bold}>geographic location, IP
            address, or jurisdiction</Text>.
          </Text>

          <Text style={styles.paragraph}>
            Users are responsible for ensuring compliance with local laws when accessing the
            Platform outside India.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            23. 🤖 AI Mentor & Automated Content Disclaimer
          </Text>
          <Text style={styles.paragraph}>
            The Platform may provide responses, explanations, suggestions, or guidance through
            <Text style={styles.bold}>AI-powered mentors, assistants, or automated systems</Text> (<Text style={styles.boldItalic}>AI Mentor</Text>).
          </Text>

          <Text style={styles.paragraph}>
            AI Mentor outputs are generated algorithmically using probabilistic models (∑, μ, σ²)
            and <Text style={styles.bold}>may be inaccurate, incomplete, outdated, or incorrect</Text>.
          </Text>

          <Text style={styles.paragraph}>
            AI Mentor responses:
            {"\n"}• Do <Text style={styles.bold}>NOT</Text> constitute medical advice
            {"\n"}• Do <Text style={styles.bold}>NOT</Text> guarantee exam accuracy
            {"\n"}• Do <Text style={styles.bold}>NOT</Text> replace faculty judgment
            {"\n"}• Are for <Text style={styles.bold}>educational support only</Text>
          </Text>

          <Text style={styles.paragraph}>
            Users must independently verify all information. Paragraph bears <Text style={styles.bold}>no liability</Text>{" "}
            for reliance placed on AI Mentor outputs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            24. 🩺 Medical & Educational Disclaimer
          </Text>
          <Text style={styles.paragraph}>
            All content on the Platform — including videos, MCQs, flashcards, notes, explanations,
            and AI outputs — is provided <Text style={styles.bold}>solely for educational purposes</Text>.
          </Text>

          <Text style={styles.paragraph}>
            The Platform does <Text style={styles.bold}>NOT</Text> provide medical diagnosis, treatment, or clinical advice.
            Users must consult qualified medical professionals for real-world decisions.
          </Text>

          <Text style={styles.paragraph}>
            Paragraph does <Text style={styles.bold}>NOT</Text> guarantee any rank, score, percentile, admission, or exam success.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            25. 🏛️ NEET-PG Examination Disclaimer
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>NEET-PG is a national examination conducted by the Government of India / designated
            authorities.</Text>
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>neetpg.app is NOT affiliated with, endorsed by, sponsored by, or connected to</Text>{" "}
            the National Medical Commission (NMC), NBEMS, NBE, or any Government body.
          </Text>

          <Text style={styles.paragraph}>
            All trademarks, exam names, and references belong to their respective owners.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            26. ⚖️ Limitation of Liability
          </Text>
          <Text style={styles.paragraph}>
            To the <Text style={styles.bold}>maximum extent permitted by law</Text>, Paragraph shall <Text style={styles.bold}>NOT</Text> be liable for any:
            {"\n"}• Indirect or consequential losses
            {"\n"}• Loss of marks, rank, or opportunity
            {"\n"}• Data loss or service interruption
            {"\n"}• AI or content inaccuracies
            {"\n"}• Payment gateway failures
          </Text>

          <Text style={styles.paragraph}>
            Total liability, if any, shall be limited to the <Text style={styles.bold}>amount actually paid</Text> by the User
            for the relevant Subscription.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            27. 🛡️ Indemnity
          </Text>
          <Text style={styles.paragraph}>
            You agree to <Text style={styles.bold}>indemnify, defend, and hold harmless</Text> Paragraph, its owner, contractors,
            and affiliates from any claims, damages, losses, or expenses arising from:
            {"\n"}• Violation of these Terms
            {"\n"}• Misuse of the Platform
            {"\n"}• Infringement of third-party rights
            {"\n"}• Unauthorized sharing or abuse
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            28. 🌪️ Force Majeure
          </Text>
          <Text style={styles.paragraph}>
            Paragraph shall not be liable for failure or delay in performance due to events beyond
            reasonable control, including but not limited to <Text style={styles.bold}>natural disasters, pandemics,
            network failures, governmental actions, or power outages</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            29. 🧑‍⚖️ Governing Law & Jurisdiction
          </Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the <Text style={styles.bold}>laws of India</Text>.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Exclusive jurisdiction</Text> shall lie with the competent courts of
            <Text style={styles.bold}>Hyderabad, Telangana, India</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            30. 🏢 Ownership & Entity Declaration
          </Text>
          <Text style={styles.paragraph}>
            The Platform <Text style={styles.bold}>neetpg.app</Text> is owned and operated by:
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Paragraph</Text> — a <Text style={styles.bold}>Sole Proprietorship</Text> entity
            {"\n"}Owner: <Text style={styles.bold}>Manu Bharadwaj Yadavalli</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            31. 📮 Grievance Redressal & Contact
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Grievance Officer:</Text> Manu Bharadwaj Yadavalli
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Email:</Text> support@neetpg.app
          </Text>

          <Text style={styles.paragraph}>
            We aim to respond to grievances within <Text style={styles.bold}>7 working days</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>
            32. 📜 Final & Binding Provisions
          </Text>
          <Text style={styles.paragraph}>
            These Terms constitute the <Text style={styles.bold}>entire agreement</Text> between you and Paragraph.
          </Text>

          <Text style={styles.paragraph}>
            If any clause is held unenforceable, the remaining provisions shall remain valid.
          </Text>

          <Text style={styles.paragraph}>
            Continued use of the Platform constitutes <Text style={styles.bold}>explicit acceptance</Text> of these Terms.
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
  italic: {
    fontStyle: 'italic',
  },
  boldItalic: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
