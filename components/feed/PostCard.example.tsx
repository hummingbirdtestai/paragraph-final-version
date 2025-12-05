import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PostCard } from './PostCard';

const examplePost = {
  id: '1',
  Keyword: '_P/O ratio_ — ATP per NADH',
  post_content:
    '****_P/O ratio_** — ATP yield per **_NADH_** in the mitochondrial electron transport chain — High-Yield Image Anatomy for NEET-PG**\n\nThe image summarises electron flow from **_NADH_** through Complexes I→III→IV with quantified proton translocation and ATP synthase stoichiometry. It is frequently tested because P/O ratios link biochemical stoichiometry to exam-style calculations on ATP yield and oxidative phosphorylation defects.\n\n### Key Identifiers\n- Inner mitochondrial membrane diagram showing Complex I, III, IV and ATP synthase with directional electron arrows to O₂ (O₂).\n- Proton counts labelled at each complex adding to ≈10 H⁺ per **_NADH_** (I≈4, III≈4, IV≈2) and ATP synthase showing ≈3 H⁺/ATP + ≈1 H⁺ for transporter.\n- Dual annotation: classical convention **3 ATP**/NADH and modern physiological value **≈2.5 ATP**/NADH.\n\n### Must-Know Exam Points\n- Classical textbook convention: **3 ATP** per mitochondrial **_NADH_** (historical exam keys).\n- Modern bioenergetics: **≈2.5 ATP** per mitochondrial **_NADH_** derived from 10 H⁺/ (≈4 H⁺/ATP) = 2.5.\n- Calculate from proton numbers: total H⁺ pumped per **_NADH_** ≈10 → ATP = 10 ÷ 4 ≈ 2.5 (account for proton leak/transport).\n\n---\n\n### 📌 NEET-PG PYQ (Image-Based)\n**Q.** In the provided mitochondrial inner membrane diagram electrons from **_NADH_** pass through Complexes I→III→IV and pump a total of 10 H⁺ into the intermembrane space; using ATP synthase stoichiometry of ≈3 H⁺/ATP plus ≈1 H⁺ for phosphate/ADP translocation, what is the ATP yield per **_NADH_** shown in the image?\n\n**A.** ≈2.5 ATP per **_NADH_** (modern physiological value; classical convention often cited as 3 ATP).\n\n**Concept Tested:** Calculation of P/O ratio from proton translocation and ATP synthase H⁺/ATP stoichiometry.\n\n---\n\n### Exam Tip\nRemember: total ≈10 H⁺ per **_NADH_** ÷ ≈4 H⁺/ATP → ≈2.5 ATP (classical = 3 ATP).',
  image_description:
    'Cross-sectional schematic of a mitochondrion: inner membrane with Complex I, III, IV and ATP synthase (Complex V). Arrows show electron flow from **_NADH_** → Complex I → III → IV → O₂ (O₂ reduced to H₂O). Proton pumps indicated with numbers: Complex I (≈4 H⁺), Complex III (≈4 H⁺), Complex IV (≈2 H⁺) — total ≈10 H⁺ translocated to the intermembrane space per **_NADH_**. ATP synthase annotated with rotation stoichiometry: ≈3 H⁺/ATP + ≈1 H⁺ for ADP/PO₄³⁻ translocation (≈4 H⁺/ATP). Side notes: classical label "3 ATP per **_NADH_**" and modern physiological value "≈2.5 ATP per **_NADH_**". Clear labels for ADP + Pi → ATP, proton gradient (Δp), and O₂ as terminal electron acceptor.',
  image_url: 'https://example.com/mitochondria-po-ratio.png',
  cached_user_name: 'Dr. Sharma',
  cached_user_avatar_url: 'https://i.pravatar.cc/150?img=15',
  created_at: new Date().toISOString(),
  likes_count: 42,
  comments_count: 8,
  shares_count: 3,
};

export default function PostCardExample() {
  const handleLike = async (postId: string, isLiked: boolean) => {
    console.log('Like toggled:', postId, isLiked);
    return !isLiked;
  };

  const handleComment = (postId: string) => {
    console.log('Comment clicked:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share clicked:', postId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <PostCard
          post={examplePost}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
