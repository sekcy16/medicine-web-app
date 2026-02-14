import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { GradientBackground } from "@/components/gradient-background";
import { Header } from "@/components/header";
import {
  Drug,
  drugList,
  findMixingResult,
  MixingResult,
} from "@/data/drug-mixing-data";
import { useRouter } from "expo-router";

// ===================== Responsive Hook =====================
function useResponsive() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  return { width, isMobile, isTablet };
}

// ===================== StepIndicator Component =====================
function StepIndicator({
  step,
  currentStep,
  label,
  isMobile,
}: {
  step: number;
  currentStep: number;
  label: string;
  isMobile: boolean;
}) {
  const isActive = currentStep >= step;
  const isCurrent = currentStep === step;

  return (
    <View style={stepStyles.stepItem}>
      <View
        style={[
          stepStyles.stepCircle,
          isActive && stepStyles.stepCircleActive,
          isCurrent && stepStyles.stepCircleCurrent,
        ]}
      >
        {isActive && currentStep > step ? (
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        ) : (
          <Text
            style={[
              stepStyles.stepNumber,
              isActive && stepStyles.stepNumberActive,
            ]}
          >
            {step}
          </Text>
        )}
      </View>
      {!isMobile && (
        <Text
          style={[stepStyles.stepLabel, isActive && stepStyles.stepLabelActive]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  stepItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: "#0D9488",
  },
  stepCircleCurrent: {
    backgroundColor: "#0D9488",
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#0D9488",
    fontWeight: "600",
  },
});

// ===================== DrugDropdown Component =====================
function DrugDropdown({
  label,
  stepNumber,
  selectedDrug,
  onSelect,
  onClear,
  excludeDrugId,
  isMobile,
  isOpen,
  onToggle,
}: {
  label: string;
  stepNumber: number;
  selectedDrug: Drug | null;
  onSelect: (drug: Drug) => void;
  onClear: () => void;
  excludeDrugId?: string;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = drugList
    .filter((d) => d.id !== excludeDrugId)
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.thaiName.includes(search),
    );

  const handleSelect = (drug: Drug) => {
    onSelect(drug);
    setSearch("");
    onToggle(); // ปิด dropdown หลังเลือก
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.dropdownLabelRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{stepNumber}</Text>
        </View>
        <Text style={styles.dropdownLabel}>{label}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.dropdownButton,
          selectedDrug && styles.dropdownButtonSelected,
          isOpen && styles.dropdownButtonOpen,
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {selectedDrug ? (
          <View style={styles.selectedDrugDisplay}>
            <View style={styles.drugIconCircle}>
              <Ionicons name="medkit" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedDrugName}>{selectedDrug.name}</Text>
              <Text style={styles.selectedDrugThai}>
                {selectedDrug.thaiName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onClear();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderRow}>
            <Ionicons
              name="search"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dropdownPlaceholder}>กดเพื่อเลือกยา...</Text>
          </View>
        )}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[styles.dropdownMenu, isMobile && styles.dropdownMenuMobile]}
        >
          <View style={styles.dropdownSearchBox}>
            <Ionicons name="search" size={16} color="#0D9488" />
            <TextInput
              style={styles.dropdownSearchInput}
              placeholder="พิมพ์ชื่อยาเพื่อค้นหา..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {filtered.length === 0 ? (
              <View style={styles.noResult}>
                <Ionicons
                  name="search-outline"
                  size={28}
                  color="#D1D5DB"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.noResultText}>ไม่พบยาที่ค้นหา</Text>
                <Text style={styles.noResultHint}>
                  ลองพิมพ์ชื่อยาภาษาอังกฤษหรือไทย
                </Text>
              </View>
            ) : (
              filtered.map((drug) => (
                <Pressable
                  key={drug.id}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.dropdownItemPressed,
                  ]}
                  onPress={() => handleSelect(drug)}
                >
                  <View style={styles.dropdownItemIcon}>
                    <Ionicons name="medical" size={14} color="#0D9488" />
                  </View>
                  <View>
                    <Text style={styles.dropdownItemName}>{drug.name}</Text>
                    <Text style={styles.dropdownItemThai}>{drug.thaiName}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
          <View style={styles.dropdownFooter}>
            <Text style={styles.dropdownFooterText}>
              {filtered.length} รายการ
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ===================== StatusBadge Component =====================
function StatusBadge({
  status,
  isMobile,
}: {
  status: MixingResult["status"];
  isMobile: boolean;
}) {
  const config = {
    compatible: {
      label: "Compatible",
      labelThai: "ผสมได้",
      description: "ยาทั้งสองชนิดสามารถใช้ร่วมกันได้อย่างปลอดภัย",
      icon: "checkmark-circle" as const,
      bg: "#ECFDF5",
      color: "#059669",
      border: "#A7F3D0",
      iconBg: "#D1FAE5",
    },
    limited_data: {
      label: "NO DATA",
      labelThai: "ข้อมูลจำกัด",
      description: "ควรระมัดระวังเป็นพิเศษ อาจมีปฏิกิริยาระหว่างยา",
      icon: "alert-circle" as const,
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
      iconBg: "#FEF3C7",
    },
    incompatible: {
      label: "Incompatible",
      labelThai: "ห้ามผสม",
      description: "ยาทั้งสองชนิดไม่สามารถใช้ร่วมกันได้",
      icon: "close-circle" as const,
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
      iconBg: "#FEE2E2",
    },
    caution: {
      label: "Caution",
      labelThai: "ควรระวัง",
      description: "",//"ผสมได้ในบางความเข้มข้น ควรตรวจสอบขนาดยาก่อนใช้ร่วมกัน",
      icon: "warning" as const,
      bg: "#FFF7ED",
      color: "#EA580C",
      border: "#FED7AA",
      iconBg: "#FFEDD5",
    },
  };

  const c = config[status];

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: c.bg, borderColor: c.border },
      ]}
    >
      <View style={[styles.statusIconCircle, { backgroundColor: c.iconBg }]}>
        <Ionicons name={c.icon} size={28} color={c.color} />
      </View>
      <View style={styles.statusTextContainer}>
        <Text style={[styles.statusLabel, { color: c.color }]}>{c.label}</Text>
        <Text style={[styles.statusLabelThai, { color: c.color }]}>
          {c.labelThai}
        </Text>
        <Text style={styles.statusDescription}>{c.description}</Text>
      </View>
    </View>
  );
}

// ===================== LoadingAnimation Component =====================
function LoadingAnimation() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    spin.start();
    pulse.start();

    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [spinAnim, pulseAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingIconWrapper}>
        <Animated.View
          style={[
            styles.loadingCircleOuter,
            { transform: [{ rotate: spinInterpolate }] },
          ]}
        />
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name="flask" size={36} color="#0D9488" />
        </Animated.View>
      </View>
      <Text style={styles.loadingTitle}>กำลังประมวลผล</Text>
      <Text style={styles.loadingText}>ตรวจสอบความเข้ากันได้ของยา...</Text>
      <View style={styles.loadingDots}>
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity, delay]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

// ===================== ResultView Component =====================
function ResultView({
  drug1,
  drug2,
  result,
  onReset,
  onGoHome,
  isMobile,
}: {
  drug1: Drug;
  drug2: Drug;
  result: MixingResult;
  onReset: () => void;
  onGoHome: () => void;
  isMobile: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Result Title */}
      <View style={styles.resultTitleRow}>
        <Ionicons name="document-text" size={20} color="#0D4C73" />
        <Text style={styles.resultTitle}>ผลการตรวจสอบ</Text>
      </View>

      {/* Drug Pair Header */}
      <View
        style={[styles.resultDrugPair, isMobile && styles.resultDrugPairMobile]}
      >
        <View style={styles.resultDrugChip}>
          <View style={[styles.resultDrugIcon, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="medkit" size={14} color="#0D9488" />
          </View>
          <View>
            <Text style={styles.resultDrugChipText}>{drug1.name}</Text>
            <Text style={styles.resultDrugChipThai}>{drug1.thaiName}</Text>
          </View>
        </View>
        <View style={styles.mixIconCircle}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
        </View>
        <View style={styles.resultDrugChip}>
          <View style={[styles.resultDrugIcon, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="medkit" size={14} color="#3B82F6" />
          </View>
          <View>
            <Text style={styles.resultDrugChipText}>{drug2.name}</Text>
            <Text style={styles.resultDrugChipThai}>{drug2.thaiName}</Text>
          </View>
        </View>
      </View>

      {/* Status */}
      <StatusBadge status={result.status} isMobile={isMobile} />

      {/* Nursing Care */}
      <View style={styles.resultSection}>
        <View style={styles.resultSectionHeader}>
          <View
            style={[styles.sectionIconCircle, { backgroundColor: "#FCE7F3" }]}
          >
            <Ionicons name="heart" size={18} color="#EC4899" />
          </View>
          <Text style={styles.resultSectionTitle}>สารน้ำที่ใช้ได้</Text>
        </View>
        <Text style={styles.resultSectionContent}>{result.nursingCare}</Text>
      </View>

      {/* Precautions */}
      <View style={styles.resultSection}>
        <View style={styles.resultSectionHeader}>
          <View
            style={[styles.sectionIconCircle, { backgroundColor: "#FEF3C7" }]}
          >
            <Ionicons name="warning" size={18} color="#D97706" />
          </View>
          <Text style={styles.resultSectionTitle}>ข้อควรระวัง</Text>
        </View>
        <Text style={styles.resultSectionContent}>{result.precautions}</Text>
      </View>
      {/* Action Buttons */}
      <View
        style={[styles.resultActions, isMobile && styles.resultActionsMobile]}
      >
        <TouchableOpacity
          style={[
            styles.resetButton,
            isMobile && { marginRight: 0, marginBottom: 10 },
          ]}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#0D9488" />
          <Text style={styles.resetButtonText}>ทดลองผสมยาใหม่</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.homeButton, isMobile && { marginLeft: 0 }]}
          onPress={onGoHome}
          activeOpacity={0.7}
        >
          <Ionicons name="home" size={18} color="#FFFFFF" />
          <Text style={styles.homeButtonText}>กลับหน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ===================== Main Screen =====================
export default function DrugMixingScreen() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [drug1, setDrug1] = useState<Drug | null>(null);
  const [drug2, setDrug2] = useState<Drug | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MixingResult | null>(null);
  const [openDropdown, setOpenDropdown] = useState<"none" | "drug1" | "drug2">(
    "none",
  );

  const canProcess = drug1 !== null && drug2 !== null && !isProcessing;

  // Determine current step for the indicator
  const currentStep = drug1 === null ? 1 : drug2 === null ? 2 : 3;

  const handleProcess = () => {
    if (!drug1 || !drug2) return;

    setOpenDropdown("none");
    setIsProcessing(true);
    setResult(null);

    // จำลอง delay เหมือนเรียก API
    setTimeout(() => {
      const mixResult = findMixingResult(drug1.id, drug2.id);
      setIsProcessing(false);
      setResult(mixResult);
    }, 2000);
  };

  const handleSwapDrugs = () => {
    const temp = drug1;
    setDrug1(drug2);
    setDrug2(temp);
  };

  const handleReset = () => {
    setDrug1(null);
    setDrug2(null);
    setResult(null);
    setIsProcessing(false);
    setOpenDropdown("none");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const contentPadding = isMobile ? 16 : isTablet ? 40 : 120;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header />

        <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
          {/* Page Title + Back Button */}
          <View style={styles.pageHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text
                style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}
              >
                ทดลองการผสมยา
              </Text>
              <Text style={styles.pageSubtitle}>
                ตรวจสอบความเข้ากันได้ของยา 2 ชนิด
              </Text>
            </View>
          </View>

          {/* Main Card */}
          <View style={[styles.mainCard, isMobile && styles.mainCardMobile]}>
            {!result && !isProcessing && (
              <>
                {/* Step Indicator */}
                <View style={styles.stepIndicatorRow}>
                  <StepIndicator
                    step={1}
                    currentStep={currentStep}
                    label="เลือกยา 1"
                    isMobile={isMobile}
                  />
                  <View style={styles.stepLine} />
                  <StepIndicator
                    step={2}
                    currentStep={currentStep}
                    label="เลือกยา 2"
                    isMobile={isMobile}
                  />
                  <View style={styles.stepLine} />
                  <StepIndicator
                    step={3}
                    currentStep={currentStep}
                    label="ประมวลผล"
                    isMobile={isMobile}
                  />
                </View>

                {/* Drug Selection */}
                <View
                  style={[
                    styles.drugSelectionRow,
                    isMobile && styles.drugSelectionRowMobile,
                  ]}
                >
                  <View
                    style={[
                      styles.drugSelectionCol,
                      isMobile && styles.drugSelectionColMobile,
                      { zIndex: openDropdown === "drug1" ? 100 : 20 },
                    ]}
                  >
                    <DrugDropdown
                      label="เลือกยาตัวที่ 1"
                      stepNumber={1}
                      selectedDrug={drug1}
                      onSelect={setDrug1}
                      onClear={() => setDrug1(null)}
                      excludeDrugId={drug2?.id}
                      isMobile={isMobile}
                      isOpen={openDropdown === "drug1"}
                      onToggle={() =>
                        setOpenDropdown(
                          openDropdown === "drug1" ? "none" : "drug1",
                        )
                      }
                    />
                  </View>

                  {/* Swap Button */}
                  {drug1 && drug2 && (
                    <TouchableOpacity
                      style={[
                        styles.swapButton,
                        isMobile && styles.swapButtonMobile,
                      ]}
                      onPress={handleSwapDrugs}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isMobile ? "swap-vertical" : "swap-horizontal"}
                        size={20}
                        color="#0D9488"
                      />
                    </TouchableOpacity>
                  )}

                  <View
                    style={[
                      styles.drugSelectionCol,
                      isMobile && styles.drugSelectionColMobile,
                      { zIndex: openDropdown === "drug2" ? 100 : 10 },
                    ]}
                  >
                    <DrugDropdown
                      label="เลือกยาตัวที่ 2"
                      stepNumber={2}
                      selectedDrug={drug2}
                      onSelect={setDrug2}
                      onClear={() => setDrug2(null)}
                      excludeDrugId={drug1?.id}
                      isMobile={isMobile}
                      isOpen={openDropdown === "drug2"}
                      onToggle={() =>
                        setOpenDropdown(
                          openDropdown === "drug2" ? "none" : "drug2",
                        )
                      }
                    />
                  </View>
                </View>

                {/* Process Button */}
                <TouchableOpacity
                  style={[
                    styles.processButton,
                    !canProcess && styles.processButtonDisabled,
                  ]}
                  onPress={handleProcess}
                  disabled={!canProcess}
                  activeOpacity={0.8}
                >
                  <View style={styles.processButtonInner}>
                    <Ionicons name="flask" size={20} color="#FFFFFF" />
                    <Text style={styles.processButtonText}>
                      ตรวจสอบความเข้ากันได้
                    </Text>
                  </View>
                  {!canProcess && (
                    <Text style={styles.processButtonHint}>
                      กรุณาเลือกยาทั้ง 2 ชนิดก่อน
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Loading Animation */}
            {isProcessing && <LoadingAnimation />}

            {/* Result */}
            {result && drug1 && drug2 && (
              <ResultView
                drug1={drug1}
                drug2={drug2}
                result={result}
                onReset={handleReset}
                onGoHome={handleGoHome}
                isMobile={isMobile}
              />
            )}
          </View>

          {/* Footer note */}
          {!result && !isProcessing && (
            <View style={styles.footerNote}>
              <Ionicons
                name="information-circle"
                size={16}
                color="rgba(255,255,255,0.6)"
              />
              <Text style={styles.footerNoteText}>
                ข้อมูลนี้ใช้เพื่อการศึกษาเท่านั้น ควรปรึกษาเภสัชกรก่อนใช้ยาจริง
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

// ===================== Styles =====================
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },

  // Page Header
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  pageTitleMobile: {
    fontSize: 20,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  // Step Indicator
  stepIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
    maxWidth: 60,
  },

  // Main Card
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    minHeight: 350,
  },
  mainCardMobile: {
    padding: 18,
    borderRadius: 16,
  },

  // Drug Selection
  drugSelectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    zIndex: 20,
    position: "relative",
    gap: 15,
  },
  drugSelectionRowMobile: {
    flexDirection: "column",
    gap: 12,
  },
  drugSelectionCol: {
    flex: 1,
    zIndex: 20,
  },
  drugSelectionColMobile: {
    flex: undefined,
    width: "100%",
  },

  // Swap Button
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDFA",
    borderWidth: 1.5,
    borderColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  swapButtonMobile: {
    marginTop: 0,
    alignSelf: "center",
  },

  // Dropdown
  dropdownContainer: {
    position: "relative",
    zIndex: 30,
  },
  dropdownLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
  },
  dropdownButtonSelected: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
  },
  dropdownButtonOpen: {
    borderColor: "#0D9488",
  },
  placeholderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  selectedDrugDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  drugIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDrugName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectedDrugThai: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: 88,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 999,
    maxHeight: 320,
    overflow: "hidden",
  },
  dropdownMenuMobile: {
    maxHeight: 260,
  },
  dropdownSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    padding: 0,
    outlineStyle: "none",
  } as any,
  dropdownList: {
    maxHeight: 240,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  dropdownItemPressed: {
    backgroundColor: "#F0FDFA",
  },
  dropdownItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  dropdownItemThai: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  dropdownFooter: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dropdownFooterText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
  },
  noResult: {
    padding: 24,
    alignItems: "center",
  },
  noResultText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  noResultHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  // Process Button
  processButton: {
    backgroundColor: "#0D9488",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    zIndex: 1,
    position: "relative",
    alignItems: "center",
  },
  processButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  processButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  processButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  processButtonHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  loadingIconWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  loadingCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "#0D9488",
    borderRightColor: "#0D9488",
    position: "absolute",
  },
  loadingTitle: {
    fontSize: 18,
    color: "#1F2937",
    fontWeight: "700",
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0D9488",
  },

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 14,
  },
  statusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  statusLabelThai: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  statusDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    lineHeight: 18,
  },

  // Result
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D4C73",
  },
  resultDrugPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  resultDrugPairMobile: {
    flexDirection: "column",
    gap: 8,
  },
  resultDrugChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    flex: 1,
    maxWidth: 250,
  },
  resultDrugIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  resultDrugChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D4C73",
  },
  resultDrugChipThai: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  mixIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
  },

  resultSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  resultSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  resultSectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
  },
  resultSectionContent: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    paddingLeft: 44,
  },

  // Action Buttons
  resultActions: {
    flexDirection: "row",
    marginTop: 24,
    gap: 10,
  },
  resultActionsMobile: {
    flexDirection: "column",
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDFA",
    borderWidth: 1.5,
    borderColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D9488",
  },
  homeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D4C73",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Footer Note
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
    paddingHorizontal: 10,
  },
  footerNoteText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
});
