import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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

// ===================== DrugDropdown Component =====================
function DrugDropdown({
  label,
  selectedDrug,
  onSelect,
  excludeDrugId,
}: {
  label: string;
  selectedDrug: Drug | null;
  onSelect: (drug: Drug) => void;
  excludeDrugId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    setSearch("");
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        {selectedDrug ? (
          <View style={styles.selectedDrugDisplay}>
            <Ionicons
              name="medkit"
              size={18}
              color="#0D9488"
              style={styles.drugIcon}
            />
            <View>
              <Text style={styles.selectedDrugName}>{selectedDrug.name}</Text>
              <Text style={styles.selectedDrugThai}>
                {selectedDrug.thaiName}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.dropdownPlaceholder}>เลือกยา...</Text>
        )}
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownMenu}>
          <View style={styles.dropdownSearchBox}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              style={styles.dropdownSearchInput}
              placeholder="พิมพ์ค้นหายา..."
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
          >
            {filtered.length === 0 ? (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>ไม่พบยาที่ค้นหา</Text>
              </View>
            ) : (
              filtered.map((drug) => (
                <TouchableOpacity
                  key={drug.id}
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(drug)}
                >
                  <Text style={styles.dropdownItemName}>{drug.name}</Text>
                  <Text style={styles.dropdownItemThai}>{drug.thaiName}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ===================== StatusBadge Component =====================
function StatusBadge({ status }: { status: MixingResult["status"] }) {
  const config = {
    compatible: {
      label: "Compatible",
      labelThai: "ผสมได้",
      icon: "checkmark-circle" as const,
      bg: "#ECFDF5",
      color: "#059669",
      border: "#A7F3D0",
    },
    limited_data: {
      label: "Limited Data / Caution",
      labelThai: "ข้อมูลจำกัด / ควรระวัง",
      icon: "alert-circle" as const,
      bg: "#FFFBEB",
      color: "#D97706",
      border: "#FDE68A",
    },
    incompatible: {
      label: "Incompatible",
      labelThai: "ห้ามผสม",
      icon: "close-circle" as const,
      bg: "#FEF2F2",
      color: "#DC2626",
      border: "#FECACA",
    },
  };

  const c = config[status];

  return (
    <View
      style={{
        ...styles.statusBadge,
        backgroundColor: c.bg,
        borderColor: c.border,
      }}
    >
      <Ionicons name={c.icon} size={32} color={c.color} />
      <View style={styles.statusTextContainer}>
        <Text style={{ ...styles.statusLabel, color: c.color }}>{c.label}</Text>
        <Text style={{ ...styles.statusLabelThai, color: c.color }}>
          {c.labelThai}
        </Text>
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
      <Animated.View
        style={{
          ...styles.loadingCircleOuter,
          transform: [{ rotate: spinInterpolate }],
        }}
      >
        <View style={styles.loadingCircleInner} />
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Ionicons name="flask" size={40} color="#0D9488" />
      </Animated.View>
      <Text style={styles.loadingText}>กำลังประมวลผลการผสมยา...</Text>
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

  return <Animated.View style={{ ...styles.dot, opacity }} />;
}

// ===================== ResultView Component =====================
function ResultView({
  drug1,
  drug2,
  result,
  onReset,
  onGoHome,
}: {
  drug1: Drug;
  drug2: Drug;
  result: MixingResult;
  onReset: () => void;
  onGoHome: () => void;
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
      {/* Drug Pair Header */}
      <View style={styles.resultDrugPair}>
        <View style={styles.resultDrugChip}>
          <Ionicons name="medkit" size={16} color="#0D9488" />
          <Text style={styles.resultDrugChipText}>{drug1.name}</Text>
        </View>
        <Ionicons name="add" size={20} color="#6B7280" />
        <View style={styles.resultDrugChip}>
          <Ionicons name="medkit" size={16} color="#3B82F6" />
          <Text style={styles.resultDrugChipText}>{drug2.name}</Text>
        </View>
      </View>

      {/* Status */}
      <StatusBadge status={result.status} />

      {/* Precautions */}
      <View style={styles.resultSection}>
        <View style={styles.resultSectionHeader}>
          <Ionicons name="warning" size={20} color="#D97706" />
          <Text style={styles.resultSectionTitle}>ข้อควรระวัง</Text>
        </View>
        <Text style={styles.resultSectionContent}>{result.precautions}</Text>
      </View>

      {/* Nursing Care */}
      <View style={styles.resultSection}>
        <View style={styles.resultSectionHeader}>
          <Ionicons name="heart" size={20} color="#EC4899" />
          <Text style={styles.resultSectionTitle}>การพยาบาล</Text>
        </View>
        <Text style={styles.resultSectionContent}>{result.nursingCare}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Ionicons name="refresh" size={18} color="#0D9488" />
          <Text style={styles.resetButtonText}>ทดลองผสมยาใหม่</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
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
  const [drug1, setDrug1] = useState<Drug | null>(null);
  const [drug2, setDrug2] = useState<Drug | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MixingResult | null>(null);

  const canProcess = drug1 !== null && drug2 !== null && !isProcessing;

  const handleProcess = () => {
    if (!drug1 || !drug2) return;

    setIsProcessing(true);
    setResult(null);

    // จำลอง delay เหมือนเรียก API
    setTimeout(() => {
      const mixResult = findMixingResult(drug1.id, drug2.id);
      setIsProcessing(false);
      setResult(mixResult);
    }, 2000);
  };

  const handleReset = () => {
    setDrug1(null);
    setDrug2(null);
    setResult(null);
    setIsProcessing(false);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={styles.content}>
          {/* Page Title + Back Button */}
          <View style={styles.pageHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>ทดลองการผสมยา</Text>
          </View>

          {/* Main Card */}
          <View style={styles.mainCard}>
            {!result && !isProcessing && (
              <>
                {/* Drug Selection */}
                <View style={styles.drugSelectionRow}>
                  <View style={styles.drugSelectionCol}>
                    <DrugDropdown
                      label="ยา 1"
                      selectedDrug={drug1}
                      onSelect={setDrug1}
                      excludeDrugId={drug2?.id}
                    />
                  </View>
                  <View style={styles.drugSelectionCol}>
                    <DrugDropdown
                      label="ยา 2"
                      selectedDrug={drug2}
                      onSelect={setDrug2}
                      excludeDrugId={drug1?.id}
                    />
                  </View>
                </View>

                {/* Process Button */}
                <TouchableOpacity
                  style={
                    canProcess
                      ? styles.processButton
                      : styles.processButtonDisabled
                  }
                  onPress={handleProcess}
                  disabled={!canProcess}
                >
                  <Ionicons name="flask" size={20} color="#FFFFFF" />
                  <Text style={styles.processButtonText}>ประมวลผล</Text>
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
              />
            )}
          </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },

  // Page Header
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Main Card
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    minHeight: 400,
  },

  // Drug Selection
  drugSelectionRow: {
    flexDirection: "row",
    marginBottom: 25,
    zIndex: 20,
    position: "relative",
  },
  drugSelectionCol: {
    flex: 1,
    marginRight: 15,
    zIndex: 20,
  },

  // Dropdown
  dropdownContainer: {
    position: "relative",
    zIndex: 30,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D4C73",
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 15,
    paddingVertical: 14,
    minHeight: 56,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  selectedDrugDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  drugIcon: {
    marginRight: 10,
  },
  selectedDrugName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectedDrugThai: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: 82,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 999,
    maxHeight: 280,
    overflow: "hidden",
  },
  dropdownSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dropdownSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1F2937",
  },
  dropdownList: {
    maxHeight: 220,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  dropdownItemThai: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  noResult: {
    padding: 20,
    alignItems: "center",
  },
  noResultText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Process Button
  processButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    zIndex: 1,
    position: "relative",
  },
  processButtonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    zIndex: 1,
    position: "relative",
  },
  processButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 10,
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#0D9488",
    borderRightColor: "#0D9488",
    position: "absolute",
    top: 40,
  },
  loadingCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 30,
    fontWeight: "500",
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0D9488",
    marginHorizontal: 5,
  },

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 25,
  },
  statusTextContainer: {
    marginLeft: 12,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusLabelThai: {
    fontSize: 14,
    marginTop: 2,
  },

  // Result
  resultDrugPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  resultDrugChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  resultDrugChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D4C73",
    marginLeft: 8,
  },

  resultSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  resultSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  resultSectionContent: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },

  // Action Buttons
  resultActions: {
    flexDirection: "row",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D9488",
    marginLeft: 8,
  },
  homeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D4C73",
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 10,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});
