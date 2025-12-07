import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import AppHeader from './AppHeader';

interface MainLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

export default function MainLayout({ children }: MainLayoutProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <View style={styles.container}>
      {isMobile ? (
        <>
          <AppHeader onMenuPress={openDrawer} showMenu />
          <View style={styles.mobileContent}>{children}</View>
          <MobileDrawer visible={drawerVisible} onClose={closeDrawer} />
        </>
      ) : (
        <View style={styles.desktopLayout}>
          <View style={styles.sidebarContainer}>
            <Sidebar />
          </View>
          <View style={styles.desktopContent}>
            {children}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: SIDEBAR_WIDTH,
    height: '100%',
  },
  desktopContent: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
  },
});
