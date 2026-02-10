import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NavItem {
  title: string;
  href: string;
}

const navItems: NavItem[] = [
  { title: "หน้าหลัก", href: "/" },
  { title: "ทดลองการผสมยา", href: "/drug-mixing" },
  { title: "เช็คข้อมูลชนิดยา", href: "/drug-info" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      {/* Logo และชื่อแอป */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={28} color="#FFFFFF" />
        </View>
        <Text style={styles.appTitle}>MediMix</Text>
      </View>

      {/* Navigation Menu */}
      <View style={styles.navMenu}>
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/" && pathname === "/(tabs)");

          return (
            <Link key={index} href={item.href as any} asChild>
              <TouchableOpacity
                style={
                  isActive
                    ? { ...styles.navItem, ...styles.navItemActive }
                    : styles.navItem
                }
              >
                <Text
                  style={
                    isActive
                      ? { ...styles.navText, ...styles.navTextActive }
                      : styles.navText
                  }
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
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

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  appTitle: {
    fontSize: 24,
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
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },

  navText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },

  navTextActive: {
    fontWeight: "bold",
  },
});

export default Header;
