import { View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import LogoHeader from './LogoHeader';

interface ScreenWithLogoProps {
  children: ReactNode;
}

export default function ScreenWithLogo({ children }: ScreenWithLogoProps) {
  return (
    <View style={styles.wrapper}>
      <LogoHeader />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
