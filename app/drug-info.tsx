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
import React, { useMemo, useState } from "react";
import {
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

// ===================== Helper: group drugs by compatibility =====================
interface CompatibilityGroup {
  compatible: Drug[];
  limited_data: Drug[];
  incompatible: Drug[];
}

function getCompatibilityGroups(selectedDrugId: string): CompatibilityGroup {
  const groups: CompatibilityGroup = {
    compatible: [],
    limited_data: [],
    incompatible: [],
  };

  // หายาอื่นทั้งหมดที่มีข้อมูลการผสมกับยานี้
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

  // ยาที่ไม่มีข้อมูล → limited_data
  for (const drug of drugList) {
    if (drug.id !== selectedDrugId && !knownDrugIds.has(drug.id)) {
      groups.limited_data.push(drug);
    }
  }

  // Sort ทุกกลุ่ม A-Z
  groups.compatible.sort((a, b) => a.name.localeCompare(b.name));
  groups.limited_data.sort((a, b) => a.name.localeCompare(b.name));
  groups.incompatible.sort((a, b) => a.name.localeCompare(b.name));

  return groups;
}

// ===================== DrugBar Component =====================
function DrugBar({ drug }: { drug: Drug }) {
  return (
    <View style={styles.drugBar}>
      <Text style={styles.drugBarName}>{drug.name}</Text>
      <Text style={styles.drugBarThai}>{drug.thaiName}</Text>
    </View>
  );
}

// ===================== StatusSection Component =====================
function StatusSection({
  status,
  drugs,
  isMobile,
}: {
  status: CompatibilityStatus;
  drugs: Drug[];
  isMobile?: boolean;
}) {
  const config = {
    compatible: {
      label: "COMPATIBLE",
      labelThai: "ผสมได้",
      bg: "#A7F3D0",
      color: "#065F46",
      icon: "checkmark-circle" as const,
    },
    limited_data: {
      label: "LIMITED DATA / CAUTION",
      labelThai: "ข้อมูลจำกัด / ควรระวัง",
      bg: "#FDE68A",
      color: "#92400E",
      icon: "alert-circle" as const,
    },
    incompatible: {
      label: "INCOMPATIBLE",
      labelThai: "ห้ามผสม",
      bg: "#FCA5A5",
      color: "#991B1B",
      icon: "close-circle" as const,
    },
  };

  const c = config[status];

  return (
    <View style={styles.statusSection}>
      {/* Status Badge */}
      <View style={{ ...styles.statusBadge, backgroundColor: c.bg }}>
        <Ionicons name={c.icon} size={18} color={c.color} />
        <Text style={{ ...styles.statusBadgeText, color: c.color }}>
          {c.label}
        </Text>
      </View>

      {/* Drug Bars */}
      {drugs.length > 0 ? (
        drugs.map((drug) => <DrugBar key={drug.id} drug={drug} />)
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>ไม่มียาในกลุ่มนี้</Text>
        </View>
      )}
    </View>
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

  const contentPadding = isMobile ? 16 : isTablet ? 40 : 30;

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
          <View style={styles.pageHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/")}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text
                style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}
              >
                เช็คข้อมูลชนิดยา
              </Text>
              <Text style={styles.pageSubtitle}>
                ดูความเข้ากันได้ของยาแต่ละชนิด
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.mainContainer,
              isMobile && styles.mainContainerMobile,
            ]}
          >
            {/* Search Section — hide on mobile when showing details */}
            {(!isMobile || !showDetails) && (
              <View
                style={[
                  styles.searchSection,
                  isMobile && styles.searchSectionMobile,
                  isTablet && styles.searchSectionTablet,
                ]}
              >
                <Text style={styles.sectionTitle}>ค้นหายา</Text>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="พิมพ์ชื่อยา..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={setSearchText}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText("")}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
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
                  {filteredDrugs.map((drug) => (
                    <TouchableOpacity
                      key={drug.id}
                      style={
                        selectedDrug?.id === drug.id
                          ? { ...styles.drugItem, ...styles.drugItemActive }
                          : styles.drugItem
                      }
                      onPress={() => handleSelectDrug(drug)}
                    >
                      <View style={styles.drugItemContent}>
                        <Text
                          style={
                            selectedDrug?.id === drug.id
                              ? {
                                  ...styles.drugItemName,
                                  ...styles.drugItemNameActive,
                                }
                              : styles.drugItemName
                          }
                        >
                          {drug.name}
                        </Text>
                        <Text style={styles.drugItemThai}>{drug.thaiName}</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={
                          selectedDrug?.id === drug.id ? "#3B82F6" : "#9CA3AF"
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Compatibility Details */}
            {(!isMobile || showDetails) && (
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
                      >
                        <Ionicons name="arrow-back" size={18} color="#0D9488" />
                        <Text style={styles.mobileBackButtonText}>
                          กลับไปเลือกยา
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Selected Drug Name Chip */}
                    <View style={styles.selectedDrugChipRow}>
                      <View
                        style={[
                          styles.selectedDrugChip,
                          isMobile && styles.selectedDrugChipMobile,
                        ]}
                      >
                        <Ionicons name="medkit" size={18} color="#0D9488" />
                        <Text
                          style={[
                            styles.selectedDrugChipText,
                            isMobile && styles.selectedDrugChipTextMobile,
                          ]}
                        >
                          {selectedDrug.name.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* Compatible Section */}
                    <StatusSection
                      status="compatible"
                      drugs={compatibilityGroups.compatible}
                      isMobile={isMobile}
                    />

                    {/* Limited Data Section */}
                    <StatusSection
                      status="limited_data"
                      drugs={compatibilityGroups.limited_data}
                      isMobile={isMobile}
                    />

                    {/* Incompatible Section */}
                    <StatusSection
                      status="incompatible"
                      drugs={compatibilityGroups.incompatible}
                      isMobile={isMobile}
                    />
                  </ScrollView>
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="document-text-outline"
                      size={isMobile ? 48 : 60}
                      color="#9CA3AF"
                    />
                    <Text style={styles.emptyTitle}>เลือกยาเพื่อดูข้อมูล</Text>
                    <Text style={styles.emptySubtext}>
                      กรุณาเลือกยาจากรายการ
                      {isMobile ? "ด้านบน" : "ด้านซ้าย"}
                      เพื่อดูความเข้ากันได้กับยาอื่น
                    </Text>
                  </View>
                )}
              </View>
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
    paddingBottom: 40,
  },
  content: {
    flex: 1,
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
    gap: 25,
  },
  mainContainerMobile: {
    flexDirection: "column",
    gap: 16,
  },

  // Search Section (Left Panel)
  searchSection: {
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    maxHeight: 700,
  },
  searchSectionMobile: {
    width: "100%",
    maxHeight: 500,
    padding: 18,
    borderRadius: 14,
  },
  searchSectionTablet: {
    width: 280,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D4C73",
    marginBottom: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  drugListScroll: {
    flex: 1,
  },
  drugListScrollMobile: {
    maxHeight: 320,
  },
  drugItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  drugItemActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
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
    color: "#3B82F6",
  },
  drugItemThai: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Details Section (Right Panel)
  detailsSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
  },
  detailsSectionMobile: {
    padding: 18,
    borderRadius: 14,
  },

  // Mobile Back Button
  mobileBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  mobileBackButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
  },

  // Selected Drug Chip
  selectedDrugChipRow: {
    alignItems: "center",
    marginBottom: 25,
  },
  selectedDrugChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#7DD3FC",
  },
  selectedDrugChipMobile: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  selectedDrugChipText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C4A6E",
    marginLeft: 10,
    letterSpacing: 1,
  },
  selectedDrugChipTextMobile: {
    fontSize: 15,
  },

  // Status Section
  statusSection: {
    marginBottom: 25,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  // Drug Bar
  drugBar: {
    backgroundColor: "#1A6B7A",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drugBarName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  drugBarThai: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },

  // Empty
  emptySection: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  emptySectionText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});
