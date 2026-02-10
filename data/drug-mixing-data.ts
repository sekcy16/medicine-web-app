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
  { id: "1", name: "Amikacin", thaiName: "อะมิคาซิน" },
  { id: "2", name: "Amoxicillin", thaiName: "อะม็อกซีซิลลิน" },
  { id: "3", name: "Ampicillin", thaiName: "แอมพิซิลลิน" },
  { id: "4", name: "Aspirin", thaiName: "แอสไพริน" },
  { id: "5", name: "Atorvastatin", thaiName: "อะทอร์วาสแตติน" },
  { id: "6", name: "Ceftriaxone", thaiName: "เซฟไตรอะโซน" },
  { id: "7", name: "Ciprofloxacin", thaiName: "ซิโปรฟลอกซาซิน" },
  { id: "8", name: "Dexamethasone", thaiName: "เดกซาเมทาโซน" },
  { id: "9", name: "Diazepam", thaiName: "ไดอะซีแพม" },
  { id: "10", name: "Diclofenac", thaiName: "ไดโคลฟีแนค" },
  { id: "11", name: "Dopamine", thaiName: "โดพามีน" },
  { id: "12", name: "Furosemide", thaiName: "ฟูโรซีไมด์" },
  { id: "13", name: "Gentamicin", thaiName: "เจนตามัยซิน" },
  { id: "14", name: "Heparin", thaiName: "เฮปาริน" },
  { id: "15", name: "Ibuprofen", thaiName: "ไอบูโพรเฟน" },
  { id: "16", name: "Insulin (Regular)", thaiName: "อินซูลิน (เรกูลาร์)" },
  { id: "17", name: "Ketorolac", thaiName: "คีโตโรแลค" },
  { id: "18", name: "Metoclopramide", thaiName: "เมโทโคลพราไมด์" },
  { id: "19", name: "Morphine", thaiName: "มอร์ฟีน" },
  { id: "20", name: "Omeprazole", thaiName: "โอเมพราโซล" },
  { id: "21", name: "Ondansetron", thaiName: "ออนแดนซีตรอน" },
  { id: "22", name: "Paracetamol", thaiName: "พาราเซตามอล" },
  { id: "23", name: "Potassium Chloride", thaiName: "โพแทสเซียมคลอไรด์" },
  { id: "24", name: "Ranitidine", thaiName: "รานิทิดีน" },
  { id: "25", name: "Vancomycin", thaiName: "แวนโคมัยซิน" },
].sort((a, b) => a.name.localeCompare(b.name));

// Mock ผลการผสมยา
export const mixingResults: MixingResult[] = [
  // Compatible
  {
    drug1Id: "22",
    drug2Id: "21",
    status: "compatible",
    precautions:
      "สามารถให้ร่วมกันได้อย่างปลอดภัย ไม่พบปฏิกิริยาระหว่างยาที่มีนัยสำคัญ",
    nursingCare:
      "ติดตามอาการทั่วไปของผู้ป่วย สังเกตอาการแพ้ยาตามปกติ บันทึกเวลาการให้ยาทั้งสองชนิด",
  },
  {
    drug1Id: "11",
    drug2Id: "12",
    status: "compatible",
    precautions:
      "ใช้ร่วมกันได้ แต่ควรระวังภาวะความดันโลหิตต่ำ เนื่องจาก Furosemide อาจลดปริมาณน้ำในร่างกาย",
    nursingCare:
      "วัดความดันโลหิตทุก 15 นาทีในช่วงแรก ติดตาม urine output ตรวจสอบสมดุลอิเล็กโทรไลต์",
  },
  {
    drug1Id: "6",
    drug2Id: "18",
    status: "compatible",
    precautions: "ผสมในสารละลาย NSS ได้ ไม่พบการเปลี่ยนแปลงทางเคมีหรือฟิสิกส์",
    nursingCare:
      "สังเกตสารละลายว่าใสไม่มีตะกอน ให้ยาภายใน 24 ชั่วโมงหลังผสม เก็บในอุณหภูมิห้อง",
  },
  // Limited Data / Caution
  {
    drug1Id: "19",
    drug2Id: "9",
    status: "limited_data",
    precautions:
      "ข้อมูลจำกัด: การใช้ร่วมกันอาจเสริมฤทธิ์กดระบบประสาทส่วนกลาง ทำให้ง่วงซึมมากขึ้น อาจกดการหายใจ",
    nursingCare:
      "ติดตามระดับความรู้สึกตัว (Consciousness level) วัด O2 Saturation อย่างต่อเนื่อง ติดตามอัตราการหายใจทุก 15 นาที เตรียม Naloxone และ Flumazenil ไว้ใกล้มือ",
  },
  {
    drug1Id: "14",
    drug2Id: "4",
    status: "limited_data",
    precautions:
      "ข้อมูลจำกัด: การใช้ร่วมกันเพิ่มความเสี่ยงต่อภาวะเลือดออก (Bleeding) อย่างมาก",
    nursingCare:
      "ติดตามค่า INR/PT อย่างใกล้ชิด สังเกตอาการเลือดออก เช่น จ้ำเลือด เลือดออกตามไรฟัน ปัสสาวะเป็นเลือด ห้ามฉีดยาเข้ากล้ามเนื้อ",
  },
  {
    drug1Id: "16",
    drug2Id: "8",
    status: "limited_data",
    precautions:
      "ข้อมูลจำกัด: Dexamethasone อาจทำให้ระดับน้ำตาลในเลือดสูงขึ้น ต้านฤทธิ์ Insulin",
    nursingCare:
      "ตรวจระดับน้ำตาลในเลือดทุก 4-6 ชั่วโมง อาจต้องปรับขนาด Insulin เพิ่มขึ้น สังเกตอาการน้ำตาลในเลือดสูงและต่ำ",
  },
  // Incompatible
  {
    drug1Id: "6",
    drug2Id: "23",
    status: "incompatible",
    precautions:
      "ห้ามผสมร่วมกัน! Ceftriaxone + Calcium (ใน Potassium Chloride บางสูตร) ทำให้เกิดตะกอน Ceftriaxone-Calcium ซึ่งอาจอันตรายถึงชีวิต",
    nursingCare:
      "ห้ามให้ทาง IV line เดียวกัน ต้อง flush line ด้วย NSS ก่อนเปลี่ยนยา ควรเว้นระยะห่างอย่างน้อย 48 ชั่วโมงในทารกแรกเกิด หากจำเป็นต้องให้พร้อมกัน ให้ผ่านคนละ line",
  },
  {
    drug1Id: "12",
    drug2Id: "13",
    status: "incompatible",
    precautions:
      "ห้ามผสมใน syringe หรือ IV bag เดียวกัน! Furosemide มีค่า pH สูง (ด่าง) ทำให้ Gentamicin ตกตะกอนและสูญเสียฤทธิ์ยา",
    nursingCare:
      "ให้ยาแยก line หรือ flush line ด้วย NSS อย่างน้อย 20 mL ระหว่างยาทั้งสอง ห้ามผสมในขวดเดียวกันเด็ดขาด สังเกตสารละลายว่ามีตะกอนหรือขุ่นหรือไม่",
  },
  {
    drug1Id: "20",
    drug2Id: "7",
    status: "incompatible",
    precautions:
      "ห้ามผสมร่วมกัน! pH ไม่เข้ากัน ทำให้ตกตะกอนทันที Omeprazole เป็นด่าง ขณะที่ Ciprofloxacin เป็นกรด",
    nursingCare:
      "ให้ยาคนละเวลา เว้นระยะห่างอย่างน้อย 2 ชั่วโมง หากให้ทาง IV ต้องใช้คนละ line หรือ flush ด้วย NSS ให้หมดก่อนเปลี่ยนยา",
  },
  {
    drug1Id: "25",
    drug2Id: "14",
    status: "incompatible",
    precautions:
      "ห้ามผสมร่วมกัน! Vancomycin ตกตะกอนเมื่อผสมกับ Heparin ทำให้ยาทั้งสองสูญเสียฤทธิ์",
    nursingCare:
      "ห้ามให้ผ่าน IV line เดียวกัน ต้อง flush line ด้วย NSS อย่างน้อย 20 mL ก่อนและหลังให้ยาแต่ละตัว ให้ยาคนละเวลาหรือคนละ line",
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
