import { GradientBackground } from "@/components/gradient-background";
import { Header } from "@/components/header";
import {
    CompatibilityStatus,
    Drug,
    drugList,
    mixingResults,
} from "@/data/drug-mixing-data";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

// ===================== Responsive Hook =====================
function useResponsive() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  return { width, isMobile, isTablet };
}

// ===================== FadeInView Component =====================
function FadeInView({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: any;
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
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

// ===================== Helper: group drugs by compatibility =====================
interface CompatibilityGroup {
  compatible: Drug[];
  caution: Drug[];
  limited_data: Drug[];
  incompatible: Drug[];
}

function getCompatibilityGroups(selectedDrugId: string): CompatibilityGroup {
  const groups: CompatibilityGroup = {
    compatible: [],
    caution: [],
    limited_data: [],
    incompatible: [],
  };

  const knownDrugIds = new Set<string>();

  for (const result of mixingResults) {
    let otherDrugId: string | null = null;

    if (result.drug1Id === selectedDrugId) {
      otherDrugId = result.drug2Id;
    } else if (result.drug2Id === selectedDrugId) {
      otherDrugId = result.drug1Id;
    }

    if (otherDrugId) {
      const otherDrug = drugList.find((d) => d.id === otherDrugId);
      if (otherDrug) {
        groups[result.status].push(otherDrug);
        knownDrugIds.add(otherDrugId);
      }
    }
  }

  for (const drug of drugList) {
    if (drug.id !== selectedDrugId && !knownDrugIds.has(drug.id)) {
      groups.limited_data.push(drug);
    }
  }

  groups.compatible.sort((a, b) => a.name.localeCompare(b.name));
  groups.caution.sort((a, b) => a.name.localeCompare(b.name));
  groups.limited_data.sort((a, b) => a.name.localeCompare(b.name));
  groups.incompatible.sort((a, b) => a.name.localeCompare(b.name));

  return groups;
}

// ===================== Status Config =====================
const statusConfig = {
  compatible: {
    label: "COMPATIBLE",
    labelThai: "ผสมได้",
    barBg: "#059669",
    color: "#059669",
    badgeBg: "#A7F3D0",
    icon: "checkmark-circle" as const,
    bg: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  caution: {
    label: "CAUTION",
    labelThai: "ควรระวัง",
    barBg: "#D97706",
    color: "#D97706",
    badgeBg: "#FED7AA",
    icon: "warning" as const,
    bg: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  limited_data: {
    label: "NO DATA",
    labelThai: "ข้อมูลจำกัด",
    barBg: "#6B7280",
    color: "#92400E",
    badgeBg: "#FDE68A",
    icon: "help-circle" as const,
    bg: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  incompatible: {
    label: "INCOMPATIBLE",
    labelThai: "ห้ามผสม",
    barBg: "#DC2626",
    color: "#DC2626",
    badgeBg: "#FCA5A5",
    icon: "close-circle" as const,
    bg: "#FEF2F2",
    borderColor: "#FECACA",
  },
};

// ===================== DrugBar Component =====================
function DrugBar({
  drug,
  status,
}: {
  drug: Drug;
  status: CompatibilityStatus;
}) {
  const c = statusConfig[status];
  return (
    <View style={[styles.drugBar, { backgroundColor: c.barBg }]}>
      <View>
        <Text style={styles.drugBarName}>{drug.name}</Text>
        <Text style={styles.drugBarThai}>{drug.thaiName}</Text>
      </View>
      <Ionicons name={c.icon} size={18} color="rgba(255,255,255,0.7)" />
    </View>
  );
}

// ===================== SummaryStats Component =====================
function SummaryStats({ groups }: { groups: CompatibilityGroup }) {
  const stats = [
    { key: "compatible" as const, count: groups.compatible.length },
    { key: "caution" as const, count: groups.caution.length },
    { key: "limited_data" as const, count: groups.limited_data.length },
    { key: "incompatible" as const, count: groups.incompatible.length },
  ];

  return (
    <View style={styles.summaryRow}>
      {stats.map((s) => {
        const c = statusConfig[s.key];
        return (
          <View
            key={s.key}
            style={[
              styles.summaryItem,
              { backgroundColor: c.bg, borderColor: c.borderColor },
            ]}
          >
            <Ionicons name={c.icon} size={16} color={c.color} />
            <Text style={[styles.summaryCount, { color: c.color }]}>
              {s.count}
            </Text>
            <Text style={styles.summaryLabel}>{c.labelThai}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ===================== StatusSection Component =====================
function StatusSection({
  status,
  drugs,
  delay = 0,
}: {
  status: CompatibilityStatus;
  drugs: Drug[];
  delay?: number;
}) {
  const c = statusConfig[status];

  return (
    <FadeInView delay={delay}>
      <View style={styles.statusSection}>
        {/* Section Header */}
        <View style={[styles.statusHeader, { borderLeftColor: c.color }]}>
          <View style={styles.statusHeaderLeft}>
            <Ionicons
              name={c.icon}
              size={20}
              color={c.color}
              style={{ marginRight: 8 }}
            />
            <View>
              <Text style={[styles.statusHeaderLabel, { color: c.color }]}>
                {c.label}
              </Text>
              <Text style={styles.statusHeaderThai}>{c.labelThai}</Text>
            </View>
          </View>
          <View style={[styles.countBadge, { backgroundColor: c.badgeBg }]}>
            <Text style={[styles.countBadgeText, { color: c.color }]}>
              {drugs.length}
            </Text>
          </View>
        </View>

        {/* Drug Bars */}
        {drugs.length > 0 ? (
          drugs.map((drug) => (
            <DrugBar key={drug.id} drug={drug} status={status} />
          ))
        ) : (
          <View style={styles.emptySection}>
            <Ionicons
              name="remove-circle-outline"
              size={16}
              color="#9CA3AF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.emptySectionText}>ไม่มียาในกลุ่มนี้</Text>
          </View>
        )}
      </View>
    </FadeInView>
  );
}

// ===================== Main Screen =====================
export default function DrugInfoScreen() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [searchText, setSearchText] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredDrugs = drugList.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchText.toLowerCase()) ||
      drug.thaiName.includes(searchText),
  );

  const compatibilityGroups = useMemo(() => {
    if (!selectedDrug) return null;
    return getCompatibilityGroups(selectedDrug.id);
  }, [selectedDrug]);

  const contentPadding = isMobile ? 12 : isTablet ? 24 : 120;

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
          {/* Page Title + Back Button */}
          <FadeInView delay={100}>
            <View style={styles.pageHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/")}
              >
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}
                >
                  เช็คข้อมูลชนิดยา
                </Text>
                <Text style={styles.pageSubtitle}>
                  ดูความเข้ากันได้ของยาแต่ละชนิดกับยาอื่น ๆ ในฐานข้อมูล
                </Text>
              </View>
            </View>
          </FadeInView>

          <View
            style={[
              styles.mainContainer,
              isMobile && styles.mainContainerMobile,
            ]}
          >
            {/* Search Section */}
            {(!isMobile || !showDetails) && (
              <FadeInView
                delay={250}
                style={isMobile ? undefined : { flexShrink: 0 }}
              >
                <View
                  style={[
                    styles.searchSection,
                    isMobile && styles.searchSectionMobile,
                    isTablet && styles.searchSectionTablet,
                  ]}
                >
                  {/* Search Header */}
                  <View style={styles.searchHeader}>
                    <Ionicons
                      name="list"
                      size={20}
                      color="#0D4C73"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>รายการยา</Text>
                    <View style={styles.drugCountChip}>
                      <Text style={styles.drugCountText}>
                        {filteredDrugs.length}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={18} color="#0D9488" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="พิมพ์ชื่อยาเพื่อค้นหา..."
                      placeholderTextColor="#9CA3AF"
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchText("")}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Drug List */}
                  <ScrollView
                    style={[
                      styles.drugListScroll,
                      isMobile && styles.drugListScrollMobile,
                    ]}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                  >
                    {filteredDrugs.length === 0 ? (
                      <View style={styles.noResultBox}>
                        <Ionicons
                          name="search-outline"
                          size={32}
                          color="#D1D5DB"
                        />
                        <Text style={styles.noResultText}>ไม่พบยาที่ค้นหา</Text>
                        <Text style={styles.noResultHint}>
                          ลองพิมพ์ชื่อภาษาอังกฤษหรือไทย
                        </Text>
                      </View>
                    ) : (
                      filteredDrugs.map((drug) => {
                        const isActive = selectedDrug?.id === drug.id;
                        return (
                          <TouchableOpacity
                            key={drug.id}
                            style={[
                              styles.drugItem,
                              isActive && styles.drugItemActive,
                            ]}
                            onPress={() => handleSelectDrug(drug)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.drugItemDot,
                                isActive && styles.drugItemDotActive,
                              ]}
                            />
                            <View style={styles.drugItemContent}>
                              <Text
                                style={[
                                  styles.drugItemName,
                                  isActive && styles.drugItemNameActive,
                                ]}
                              >
                                {drug.name}
                              </Text>
                              <Text style={styles.drugItemThai}>
                                {drug.thaiName}
                              </Text>
                            </View>
                            <Ionicons
                              name="chevron-forward"
                              size={18}
                              color={isActive ? "#0D9488" : "#D1D5DB"}
                            />
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </ScrollView>
                </View>
              </FadeInView>
            )}

            {/* Compatibility Details */}
            {(!isMobile || showDetails) && (
              <FadeInView delay={400} style={{ flex: 1, minWidth: 0 }}>
                <View
                  style={[
                    styles.detailsSection,
                    isMobile && styles.detailsSectionMobile,
                  ]}
                >
                  {selectedDrug && compatibilityGroups ? (
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                    >
                      {/* Mobile Back Button */}
                      {isMobile && (
                        <TouchableOpacity
                          style={styles.mobileBackButton}
                          onPress={handleBackToList}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="arrow-back"
                            size={18}
                            color="#0D9488"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.mobileBackButtonText}>
                            กลับไปเลือกยา
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* Selected Drug Chip */}
                      <FadeInView delay={100}>
                        <View style={styles.selectedDrugChipRow}>
                          <View
                            style={[
                              styles.selectedDrugChip,
                              isMobile && styles.selectedDrugChipMobile,
                            ]}
                          >
                            <View style={styles.drugChipIcon}>
                              <Ionicons
                                name="medkit"
                                size={20}
                                color="#FFFFFF"
                              />
                            </View>
                            <View style={{ marginLeft: 12 }}>
                              <Text style={styles.selectedDrugChipLabel}>
                                กำลังดูข้อมูลยา
                              </Text>
                              <Text
                                style={[
                                  styles.selectedDrugChipText,
                                  isMobile && styles.selectedDrugChipTextMobile,
                                ]}
                              >
                                {selectedDrug.name}
                              </Text>
                              <Text style={styles.selectedDrugChipThai}>
                                {selectedDrug.thaiName}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </FadeInView>

                      {/* Summary Stats */}
                      <FadeInView delay={200}>
                        <SummaryStats groups={compatibilityGroups} />
                      </FadeInView>

                      {/* Compatibility Sections */}
                      <StatusSection
                        status="compatible"
                        drugs={compatibilityGroups.compatible}
                        delay={300}
                      />
                      <StatusSection
                        status="caution"
                        drugs={compatibilityGroups.caution}
                        delay={400}
                      />
                      <StatusSection
                        status="limited_data"
                        drugs={compatibilityGroups.limited_data}
                        delay={500}
                      />
                      <StatusSection
                        status="incompatible"
                        drugs={compatibilityGroups.incompatible}
                        delay={600}
                      />

                      {/* Disclaimer */}
                      <FadeInView delay={700}>
                        <View style={styles.disclaimerBox}>
                          <Ionicons
                            name="information-circle"
                            size={16}
                            color="#9CA3AF"
                            style={{ marginRight: 6, marginTop: 1 }}
                          />
                          <Text style={styles.disclaimerText}>
                            ข้อมูลนี้ใช้เพื่อการศึกษาเท่านั้น
                            ควรปรึกษาเภสัชกรก่อนใช้ยาจริง
                          </Text>
                        </View>
                      </FadeInView>
                    </ScrollView>
                  ) : (
                    <View style={styles.emptyState}>
                      <View style={styles.emptyIconCircle}>
                        <Ionicons
                          name="search"
                          size={isMobile ? 36 : 44}
                          color="#0D9488"
                        />
                      </View>
                      <Text style={styles.emptyTitle}>
                        เลือกยาเพื่อดูข้อมูล
                      </Text>
                      <Text style={styles.emptySubtext}>
                        กรุณาเลือกยาจากรายการ
                        {isMobile ? "ด้านบน" : "ด้านซ้าย"}
                        {"\n"}
                        เพื่อดูความเข้ากันได้กับยาอื่น
                      </Text>
                      <View style={styles.emptyHintRow}>
                        <View style={styles.emptyHintDot} />
                        <Text style={styles.emptyHintText}>
                          มียาในฐานข้อมูลทั้งหมด {drugList.length} รายการ
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </FadeInView>
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
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },

  // Page Header
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pageTitle: {
    fontSize: 28,
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

  // Main Layout
  mainContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
  },
  mainContainerMobile: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  // Search Section (Left Panel)
  searchSection: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    maxHeight: 700,
    marginRight: 14,
  },
  searchSectionMobile: {
    width: "100%",
    maxHeight: 480,
    padding: 14,
    borderRadius: 14,
    marginRight: 0,
    marginBottom: 14,
  },
  searchSectionTablet: {
    width: 260,
    padding: 16,
    marginRight: 12,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D4C73",
    flex: 1,
  },
  drugCountChip: {
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  drugCountText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0284C7",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1F2937",
    outlineStyle: "none",
  } as any,
  drugListScroll: {
    flex: 1,
  },
  drugListScrollMobile: {
    maxHeight: 320,
  },
  noResultBox: {
    alignItems: "center",
    paddingVertical: 30,
  },
  noResultText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 10,
  },
  noResultHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  drugItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 6,
  },
  drugItemActive: {
    backgroundColor: "#F0FDFA",
    borderColor: "#0D9488",
  },
  drugItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginRight: 12,
  },
  drugItemDotActive: {
    backgroundColor: "#0D9488",
  },
  drugItemContent: {
    flex: 1,
  },
  drugItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  drugItemNameActive: {
    color: "#0D9488",
  },
  drugItemThai: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },

  // Details Section (Right Panel)
  detailsSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    minHeight: 400,
  },
  detailsSectionMobile: {
    padding: 14,
    borderRadius: 14,
    minHeight: 300,
  },

  // Mobile Back Button
  mobileBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mobileBackButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
  },

  // Selected Drug Chip
  selectedDrugChipRow: {
    marginBottom: 16,
  },
  selectedDrugChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#99F6E4",
  },
  selectedDrugChipMobile: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  drugChipIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDrugChipLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  selectedDrugChipText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D4C73",
    marginTop: 2,
  },
  selectedDrugChipTextMobile: {
    fontSize: 17,
  },
  selectedDrugChipThai: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 1,
  },

  // Summary Stats
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    marginHorizontal: -4,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    width: "46%",
    flexGrow: 1,
  },
  summaryCount: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
    marginRight: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Status Section
  statusSection: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 6,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
  },
  statusHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusHeaderLabel: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  statusHeaderThai: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  countBadge: {
    borderRadius: 10,
    minWidth: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginRight: 8,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: "bold",
  },

  // Drug Bar
  drugBar: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drugBarName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  drugBarThai: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },

  // Empty
  emptySection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptySectionText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#99F6E4",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyHintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F0FDFA",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyHintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0D9488",
    marginRight: 8,
  },
  emptyHintText: {
    fontSize: 13,
    color: "#0D9488",
    fontWeight: "500",
  },

  // Disclaimer
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 18,
  },
});
