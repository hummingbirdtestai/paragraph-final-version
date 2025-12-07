import { usePathname } from "expo-router";

export default function MainLayout({ children }) {
  const { loginWithOTP, verifyOTP, registerUser, user } = useAuth();
  const isLoggedIn = !!user;

  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/index";

  const shouldShowMenu = !(isHome && !isLoggedIn); 
  // hide menu only on home for NOT logged in users

  ...
  
  return (
    <View style={styles.container}>
      {isMobile ? (
        <>
          <AppHeader 
            onMenuPress={openDrawer} 
            showMenu={shouldShowMenu} 
          />

          <View style={styles.mobileContent}>{injectedChild}</View>

          <MobileDrawer
            visible={drawerVisible}
            onClose={closeDrawer}
            onOpenAuth={() => {
              closeDrawer();
              setShowLoginModal(true);
            }}
          />
        </>
      ) : (
        <View style={styles.desktopLayout}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onOpenAuth={() => setShowLoginModal(true)}
            />
          </View>

          <View style={styles.desktopContent}>{injectedChild}</View>
        </View>
      )}
