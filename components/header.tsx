import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={isMobile ? styles.headerMobile : styles.header}>
      {/* Logo และชื่อแอป */}
      <View style={styles.logoSection}>
        <View
          style={isMobile ? styles.logoContainerMobile : styles.logoContainer}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/SUT_Logo.svg/3840px-SUT_Logo.svg.png",
            }}
            style={isMobile ? styles.logoImageMobile : styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={isMobile ? styles.appTitleMobile : styles.appTitle}>
          MediMix
        </Text>
      </View>

      {/* Desktop Navigation */}
      {!isMobile && (
        <View style={styles.navMenu}>
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/" && pathname === "/(tabs)");

            return (
              <Link key={index} href={item.href as any} asChild>
                <TouchableOpacity
                  style={isActive ? styles.navItemActive : styles.navItem}
                  activeOpacity={0.7}
                >
                  <Text
                    style={isActive ? styles.navTextActive : styles.navText}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Link>
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
            size={22}
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
              <Link key={index} href={item.href as any} asChild>
                <TouchableOpacity
                  style={
                    isActive
                      ? styles.mobileMenuItemActive
                      : styles.mobileMenuItem
                  }
                  onPress={() => setMenuOpen(false)}
                  activeOpacity={0.7}
                >
                  {isActive && <View style={styles.activeBar} />}
                  <Text
                    style={
                      isActive
                        ? styles.mobileMenuTextActive
                        : styles.mobileMenuText
                    }
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Link>
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
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 20,
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
  },

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoContainerMobile: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoImage: {
    width: 67,
    height: 67,
  },
  logoImageMobile: {
    width: 50,
    height: 50,
  },

  appTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
    paddingLeft: 10,
  },
  appTitleMobile: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  navMenu: {
    flexDirection: "row",
  },

  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginLeft: 10,
  },
  navItemActive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    marginLeft: 10,
  },

  navText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  navTextActive: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
  },

  // Hamburger Button
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Mobile Dropdown Menu
  mobileMenu: {
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 14,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  mobileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  mobileMenuItemActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 2,
    backgroundColor: "#F0FDFA",
  },
  mobileMenuText: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  mobileMenuTextActive: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
  activeBar: {
    width: 4,
    height: 25,
    borderRadius: 2,
    backgroundColor: "#0D9488",
    marginRight: 12,
  },
});

export default Header;
