import { FunctionCard } from "@/components/function-card";
import { GradientBackground } from "@/components/gradient-background";
import { Header } from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

function FadeInView({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

function PulseIcon() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [scale]);

  return (
    <Animated.View style={[styles.heroIconWrapper, { transform: [{ scale }] }]}>
      <Ionicons name="medkit" size={48} color="#FFFFFF" />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={isMobile ? styles.mainContentMobile : styles.mainContent}>
          {/* Hero Section */}
          <FadeInView delay={100}>
            <View style={styles.heroSection}>
              <PulseIcon />
              <Text
                style={
                  isMobile ? styles.welcomeTitleMobile : styles.welcomeTitle
                }
              >
                MediMix
              </Text>
              <Text
                style={
                  isMobile
                    ? styles.welcomeSubtitleMobile
                    : styles.welcomeSubtitle
                }
              >
                ระบบตรวจสอบและทดลองการผสมยาอัจฉริยะ
              </Text>
              <View style={styles.divider} />
            </View>
          </FadeInView>

          {/* Stats Row */}
          <FadeInView delay={300}>
            <View style={isMobile ? styles.statsRowMobile : styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>16</Text>
                <Text style={styles.statLabel}>รายการยา</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>80+</Text>
                <Text style={styles.statLabel}>คู่ยาที่ตรวจสอบได้</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4</Text>
                <Text style={styles.statLabel}>ระดับความเข้ากันได้</Text>
              </View>
            </View>
          </FadeInView>

          {/* Function Cards */}
          <View
            style={
              isMobile ? styles.cardsContainerMobile : styles.cardsContainer
            }
          >
            <FadeInView delay={500}>
              <FunctionCard
                title="ทดลองการผสมยา"
                description="ทดลองผสมยาหลายชนิดเข้าด้วยกัน เพื่อตรวจสอบปฏิกิริยาระหว่างยา และความปลอดภัยในการใช้ยาร่วมกัน"
                iconName="flask"
                buttonText="เข้าสู่การทดลอง"
                href="/drug-mixing"
                iconColor="#0D9488"
              />
            </FadeInView>

            <FadeInView delay={650}>
              <FunctionCard
                title="เช็คข้อมูลชนิดยา"
                description="ค้นหาและตรวจสอบข้อมูลยาแต่ละชนิด รวมถึงสรรพคุณ ข้อควรระวัง และวิธีการใช้ยาอย่างถูกต้อง"
                iconName="document-text"
                buttonText="ค้นหาข้อมูลยา"
                href="/drug-info"
                iconColor="#3B82F6"
              />
            </FadeInView>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 MediMix - ระบบตรวจสอบการผสมยา
          </Text>
          <Text style={styles.footerSubText}>
            ข้อมูลนี้ใช้เพื่อการศึกษาเท่านั้น ควรปรึกษาเภสัชกรก่อนใช้ยาจริง
          </Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: "100%",
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: 120,
    paddingTop: 40,
  },
  mainContentMobile: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 1,
  },
  welcomeTitleMobile: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
  },
  welcomeSubtitleMobile: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  divider: {
    width: 50,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginTop: 20,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  statsRowMobile: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  // Cards
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    paddingBottom: 40,
  },
  cardsContainerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingBottom: 30,
  },

  // Footer
  footer: {
    paddingVertical: 25,
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
  footerSubText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 11,
    marginTop: 4,
  },
});
