import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useEffect } from 'react';

export default function LogoHeader() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const logoWidth = isDesktop ? 160 : isTablet ? 130 : 100;
  const logoHeight = logoWidth * 0.4;

  useEffect(() => {
    console.log('LogoHeader mounted, screenWidth=', width);
    console.log('LogoHeader sizes - logoWidth=', logoWidth, 'logoHeight=', logoHeight);
    console.log('LogoHeader breakpoint - isDesktop=', isDesktop, 'isTablet=', isTablet);
  }, [width, logoWidth, logoHeight, isDesktop, isTablet]);

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../assets/images/paragraph_logo.png')}
        style={[
          styles.logo,
          {
            width: logoWidth,
            height: logoHeight,
          },
        ]}
        resizeMode="contain"
        onLoad={() => console.log('✅ Logo image loaded successfully')}
        onError={(error) => console.error('❌ Logo image failed to load:', error.nativeEvent.error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    backgroundColor: '#0B0B0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  logo: {
    alignSelf: 'flex-start',
  },
});
