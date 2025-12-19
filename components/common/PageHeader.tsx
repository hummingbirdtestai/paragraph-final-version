import React from 'react';
import { View, Image, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  showLogo?: boolean;   // ✅ ADD THIS
}


export default function PageHeader({
  title,
  subtitle,
  children,
  showLogo = true,      // ✅ DEFAULT TRUE
}: PageHeaderProps) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;

  const logoWidth = isDesktop ? 120 : isTablet ? 100 : 80;
  const logoHeight = logoWidth * 0.4;

  return (
    <View style={styles.headerContainer}>

{/* LEFT: Logo */}
<View style={styles.leftContent}>
  {showLogo && (
    <Image
      source={require('../../assets/images/paragraph_logo.png')}
      style={{ width: logoWidth, height: logoHeight }}
      resizeMode="contain"
    />
  )}
</View>


      {/* CENTERED TITLE */}
      <View style={styles.centerWrapper}>
        {!!title && !!subtitle ? (
          <Text style={[styles.titleSingleLine, isMobile && styles.titleSingleLineMobile]}>
            {title} {subtitle}
          </Text>
        ) : (
          <>
            {!!title && (
              <Text style={[styles.title, isMobile && styles.titleMobile]}>
                {title}
              </Text>
            )}
            {!!subtitle && (
              <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
                {subtitle}
              </Text>
            )}
          </>
        )}
      </View>

      {/* RIGHT: Children such as progress */}
      <View style={styles.rightContent}>
        {children}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',   // ✅ KEY FIX
    backgroundColor: '#0B0B0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    minHeight: 60,
  },

  leftContent: {
    width: 120,                          // ✅ RESERVE SPACE FOR LOGO
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  centerWrapper: {
    flex: 1,                              // ✅ CENTER THESE EXACTLY
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',                // 🔥 prevents rightContent from shifting center
  },

  rightContent: {
    width: 120,                            // ✅ MATCH LEFT WIDTH → PERFECT CENTER
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },

  titleMobile: { fontSize: 18 },

  titleSingleLine: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },

  titleSingleLineMobile: { fontSize: 14 },

  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
  },

  subtitleMobile: { fontSize: 12 },
});
