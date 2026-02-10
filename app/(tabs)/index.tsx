import { FunctionCard } from "@/components/function-card";
import { GradientBackground } from "@/components/gradient-background";
import { Header } from "@/components/header";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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
        {/* Header */}
        <Header />

        {/* Main Content */}
        <View style={isMobile ? styles.mainContentMobile : styles.mainContent}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text
              style={isMobile ? styles.welcomeTitleMobile : styles.welcomeTitle}
            >
              ยินดีต้อนรับ
            </Text>
            <Text
              style={
                isMobile ? styles.welcomeSubtitleMobile : styles.welcomeSubtitle
              }
            >
              ระบบตรวจสอบและทดลองการผสมยาอัจฉริยะ
            </Text>
          </View>

          {/* Function Cards */}
          <View
            style={
              isMobile ? styles.cardsContainerMobile : styles.cardsContainer
            }
          >
            <FunctionCard
              title="ทดลองการผสมยา"
              description="ทดลองผสมยาหลายชนิดเข้าด้วยกัน เพื่อตรวจสอบปฏิกิริยาระหว่างยา และความปลอดภัยในการใช้ยาร่วมกัน"
              iconName="flask"
              buttonText="เข้าสู่การทดลอง"
              href="/drug-mixing"
              iconColor="#0D9488"
            />

            <FunctionCard
              title="เช็คข้อมูลชนิดยา"
              description="ค้นหาและตรวจสอบข้อมูลยาแต่ละชนิด รวมถึงสรรพคุณ ข้อควรระวัง และวิธีการใช้ยาอย่างถูกต้อง"
              iconName="document-text"
              buttonText="ค้นหาข้อมูลยา"
              href="/drug-info"
              iconColor="#3B82F6"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 MediMix - ระบบตรวจสอบการผสมยา
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

  welcomeSection: {
    alignItems: "center",
    marginBottom: 50,
  },

  welcomeTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  welcomeTitleMobile: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  welcomeSubtitleMobile: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    paddingHorizontal: 10,
  },

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

  footer: {
    paddingVertical: 25,
    alignItems: "center",
    marginTop: "auto",
  },

  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
});
