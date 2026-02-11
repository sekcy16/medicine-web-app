// ข้อมูล Mock-up สำหรับยาและผลการผสมยา
// ในอนาคตจะเปลี่ยนเป็นข้อมูลจาก API

export interface Drug {
  id: string;
  name: string;
  thaiName: string;
}

export type CompatibilityStatus =
  | "compatible"
  | "limited_data"
  | "incompatible";

export interface MixingResult {
  drug1Id: string;
  drug2Id: string;
  status: CompatibilityStatus;
  precautions: string;
  nursingCare: string;
}

// รายการยาเรียงตาม A-Z
export const drugList: Drug[] = [
  { id: "1", name: "Cefazolin", thaiName: "เซฟาโซลิน" },
  { id: "2", name: "Ceftazidime", thaiName: "เซฟตาซิดีม" },
  { id: "3", name: "Meropenem", thaiName: "เมโรพีเนม" },
  { id: "4", name: "Norepinephrine", thaiName: "นอร์เอพิเนฟรีน" },
  { id: "5", name: "Ceftriaxone", thaiName: "เซฟไตรอะโซน" },
  { id: "6", name: "Dobutamine", thaiName: "โดบูทามีน" },
  { id: "7", name: "Hydrocortisone", thaiName: "ไฮโดรคอร์ติโซน " },
  { id: "8", name: "Amiodarone", thaiName: "อะมิโอดาโรน" },
  // { id: "9", name: "Diazepam", thaiName: "ไดอะซีแพม" },
  // { id: "10", name: "Diclofenac", thaiName: "ไดโคลฟีแนค" },
  // { id: "11", name: "Dopamine", thaiName: "โดพามีน" },
  // { id: "12", name: "Furosemide", thaiName: "ฟูโรซีไมด์" },
  // { id: "13", name: "Gentamicin", thaiName: "เจนตามัยซิน" },
  // { id: "14", name: "Heparin", thaiName: "เฮปาริน" },
  // { id: "15", name: "Ibuprofen", thaiName: "ไอบูโพรเฟน" },
  // { id: "16", name: "Insulin (Regular)", thaiName: "อินซูลิน (เรกูลาร์)" },
  // { id: "17", name: "Ketorolac", thaiName: "คีโตโรแลค" },
  // { id: "18", name: "Metoclopramide", thaiName: "เมโทโคลพราไมด์" },
  // { id: "19", name: "Morphine", thaiName: "มอร์ฟีน" },
  // { id: "20", name: "Omeprazole", thaiName: "โอเมพราโซล" },
  // { id: "21", name: "Ondansetron", thaiName: "ออนแดนซีตรอน" },
  // { id: "22", name: "Paracetamol", thaiName: "พาราเซตามอล" },
  // { id: "23", name: "Potassium Chloride", thaiName: "โพแทสเซียมคลอไรด์" },
  // { id: "24", name: "Ranitidine", thaiName: "รานิทิดีน" },
  // { id: "25", name: "Vancomycin", thaiName: "แวนโคมัยซิน" },
].sort((a, b) => a.name.localeCompare(b.name));

// Mock ผลการผสมยา
export const mixingResults: MixingResult[] = [
  // Compatible
  {
    drug1Id: "1",
    drug2Id: "2",
    status: "compatible",
    precautions:
      "Cef-dime สามารถผสมใน NSS 5-120 mg/ml สามารถผสมใน D5W 1-40 mg/ml",
    nursingCare: "สารน้ำที่ใช้ได้: NSS, D5W ",
  },
  {
    drug1Id: "3",
    drug2Id: "4",
    status: "compatible",
    precautions: "บริหารแยกเส้น IV กันเพื่อป้องกันการตกตะกอน",
    nursingCare: "สารน้ำที่ใช้ได้: NSS ",
  },
  // Incompatible
  {
    drug1Id: "5",
    drug2Id: "6",
    status: "incompatible",
    precautions: "ไม่สามารถใช้ร่วมกันได้ เนื่องจากจะทำให้เกิดการตกตะกอน",
    nursingCare: "-",
  },
  {
    drug1Id: "7",
    drug2Id: "8",
    status: "incompatible",
    precautions:
      "ไม่สามารถใช้ร่วมกันได้ เนื่องจากอาจทำให้หัวใจเต้นผิดจังหวะได้",
    nursingCare: "-",
  },
];

// ฟังก์ชันค้นหาผลการผสมยา
export function findMixingResult(
  drug1Id: string,
  drug2Id: string,
): MixingResult | null {
  const result = mixingResults.find(
    (r) =>
      (r.drug1Id === drug1Id && r.drug2Id === drug2Id) ||
      (r.drug1Id === drug2Id && r.drug2Id === drug1Id),
  );

  if (result) return result;

  // Default: ถ้าไม่มีข้อมูล ให้คืน limited_data
  return {
    drug1Id,
    drug2Id,
    status: "limited_data",
    precautions:
      "ยังไม่มีข้อมูลเพียงพอเกี่ยวกับการผสมยาคู่นี้ กรุณาปรึกษาเภสัชกรก่อนใช้ร่วมกัน",
    nursingCare:
      "สังเกตอาการผิดปกติหลังให้ยา ตรวจสอบสารละลายว่ามีการเปลี่ยนแปลงสี ความขุ่น หรือตะกอนหรือไม่ บันทึกและรายงานอาการผิดปกติทุกชนิด",
  };
}
