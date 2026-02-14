import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface NavItem {
  title: string;
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { title: "หน้าหลัก", href: "/", icon: "home" },
  { title: "ทดลองการผสมยา", href: "/drug-mixing", icon: "flask" },
  { title: "เช็คข้อมูลชนิดยา", href: "/drug-info", icon: "document-text" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={isMobile ? styles.headerMobile : styles.header}>
      {/* Logo และชื่อแอป */}
      <TouchableOpacity
        style={styles.logoSection}
        activeOpacity={0.8}
        onPress={() => router.push("/")}
      >
        {/* <View
          style={isMobile ? styles.logoContainerMobile : styles.logoContainer}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/SUT_Logo.svg/3840px-SUT_Logo.svg.png",
            }}
            style={isMobile ? styles.logoImageMobile : styles.logoImage}
            resizeMode="contain"
          />
        </View> */}
        <Text style={isMobile ? styles.appTitleMobile : styles.appTitle}>
          MediMix
        </Text>
      </TouchableOpacity>

      {/* Desktop Navigation */}
      {!isMobile && (
        <View style={styles.navMenu}>
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/(tabs)");

            return (
              <TouchableOpacity
                key={index}
                style={[styles.navItem, isActive && styles.navItemActive]}
                activeOpacity={0.7}
                onPress={() => router.push(item.href as any)}
              >
                <Text
                  style={[styles.navText, isActive && styles.navTextActive]}
                >
                  {item.title}
                </Text>
                {isActive && <View style={styles.navActiveIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Hamburger Button (Mobile) */}
      {isMobile && (
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setMenuOpen(!menuOpen)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={menuOpen ? "close" : "menu"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}

      {/* Mobile Dropdown Menu */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/(tabs)");

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.mobileMenuItem,
                  isActive && styles.mobileMenuItemActive,
                ]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.href as any);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={isActive ? "#0D9488" : "#6B7280"}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={[
                    styles.mobileMenuText,
                    isActive && styles.mobileMenuTextActive,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  headerMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoContainerMobile: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  logoImageMobile: {
    width: 42,
    height: 42,
  },

  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  appTitleMobile: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  navMenu: {
    flexDirection: "row",
    alignItems: "center",
  },

  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 4,
  },
  navItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },

  navText: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 15,
    fontWeight: "500",
  },
  navTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  navActiveIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    marginTop: 4,
  },

  // Hamburger Button
  hamburgerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  // Mobile Dropdown Menu
  mobileMenu: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mobileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 2,
  },
  mobileMenuItemActive: {
    backgroundColor: "#F0FDFA",
  },
  mobileMenuText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  mobileMenuTextActive: {
    color: "#0D9488",
    fontWeight: "700",
  },
});

export default Header;
