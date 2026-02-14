// export interface Drug และ CompatibilityStatus
export interface Drug {
  id: string;
  name: string;
  thaiName: string;
}

export type CompatibilityStatus =
  | "compatible"
  | "limited_data"
  | "incompatible"
  | "caution";

// เพิ่ม reference สำหรับเก็บแหล่งอ้างอิง
export interface MixingResult {
  drug1Id: string;
  drug2Id: string;
  status: CompatibilityStatus;
  precautions: string;
  nursingCare: string;
  reference: string;
}

// รายการยาอ้างอิงจากไฟล์ CSV จัดเรียง A-Z
export const drugList: Drug[] = [
  { id: "1", name: "Adrenaline", thaiName: "อะดรีนาลีน" },
  { id: "2", name: "Azithromycin", thaiName: "อะซิโธรมัยซิน" },
  { id: "3", name: "Ceftazidime", thaiName: "เซฟตาซิดีม" },
  { id: "4", name: "Ceftriaxone", thaiName: "เซฟไตรอะโซน" },
  { id: "5", name: "Dobutamine", thaiName: "โดบูทามีน" },
  { id: "6", name: "Dopamine", thaiName: "โดพามีน" },
  { id: "7", name: "Dormicum", thaiName: "ดอร์มิคุม" },
  { id: "8", name: "Fentanyl", thaiName: "เฟนทานิล" },
  { id: "9", name: "Hydrocortisone", thaiName: "ไฮโดรคอร์ติโซน" },
  { id: "10", name: "Meropenem", thaiName: "เมโรพีเนม" },
  { id: "11", name: "Methylene blue", thaiName: "เมทิลีนบลู" },
  { id: "12", name: "Nimbex", thaiName: "นิมเบกซ์" },
  { id: "13", name: "Norepinephrine", thaiName: "นอร์เอพิเนฟรีน" },
  { id: "14", name: "Propofol", thaiName: "โปรโพฟอล" },
  { id: "15", name: "Tazocin", thaiName: "ทาโซซิน" },
  { id: "16", name: "Terlipressin", thaiName: "เทอร์ลิเพรสซิน" },
].sort((a, b) => a.name.localeCompare(b.name));

// ข้อมูลผลการผสมยาพร้อมอ้างอิง
export const mixingResults: MixingResult[] = [
  // --- Azithromycin (2) ---
  {
    drug1Id: "2",
    drug2Id: "1",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ควรเฝ้าระวังเรื่องการเต้นของหัวใจ เนื่องจากอาจทำให้เกิด Ventricular arrhythmia",
    reference: "(งานเภสัชกรรมคลินิก โรงพยาบาลรามาธิบดี, 2559)",
  },
  {
    drug1Id: "2",
    drug2Id: "4",
    status: "caution",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Azithromycin 2 mg/ml + Ceftriaxone 20 mg/ml in D5W = Compatible\nAzithromycin 2 mg/ml in NSS 0.9% + Ceftriaxone 66.7 mg/ml in NSS 0.45% = Incompatible",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "3",
    status: "caution",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Azithromycin 2 mg/ml + Ceftazidime 40 mg/ml in D5W = Compatible\nAzithromycin 2 mg/ml in NSS 0.9% + Ceftazidime 80 mg/ml in NSS 0.45% = Incompatible",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "5",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Monitor EKG ทุกครั้งที่ให้ร่วมกัน เนื่องจากอาจทำให้เกิด Arrhythmia ได้",
    reference:
      "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561), (คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "2",
    drug2Id: "6",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Monitor EKG ทุกครั้งที่ให้ร่วมกัน เนื่องจากอาจทำให้เกิด Arrhythmia ได้",
    reference:
      "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561), (คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "2",
    drug2Id: "7",
    status: "incompatible",
    nursingCare: "-",
    precautions:
      "ยา Azithromycin เป็นยาในกลุ่ม macrolide ซึ่งจะเสริมให้ระดับยา Dormicum (Midazolam) สูงขึ้นและออกฤทธิ์นานขึ้น",
    reference:
      "คณะกรรมการเภสัชกรรมและการบำบัด. (2564). คู่มือการใช้ยาที่มีความเสี่ยงสูง (พิมพ์ครั้งที่ 5). ฝ่ายเภสัชกรรม โรงพยาบาลศิริราช",
  },
  {
    drug1Id: "2",
    drug2Id: "8",
    status: "caution",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Azithromycin 2 mg/ml in D5W + Fentanyl 0.05 mg/ml (50 mcg/ml) in Undiluted = Compatible\nAzithromycin 2 mg/ml in NSS 0.9% + Fentanyl 0.05 mg/ml (50 mcg/ml) in Undiluted = Incompatible",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Monitor EKG เพราะ Azithromycin สามารถทำให้เกิด QT prolong ได้ และ Hydrocortisone อาจทำให้เกิดการอักเสบบริเวณที่ให้ยาได้",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "10",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Monitor EKG เพราะ Azithromycin สามารถทำให้เกิด QT prolong ได้ และ Meropenem อาจทำให้เกิดอาการท้องเดินและมีการอักเสบบริเวณที่ให้ยา",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "15",
    status: "caution",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Azithromycin 2 mg/mL + Piperacillin/Tazobactam 40 and 5 mg/mL in D5W = Compatible\nAzithromycin 2 mg/mL in NSS 0.9% + Piperacillin/Tazobactam 100 and 12.5 mg/mL in NSS 0.45% = Incompatible",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "2",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "Monitor EKG เพราะ Azithromycin สามารถทำให้เกิด QT prolong ได้ และเฝ้าระวังการกดการหายใจของ Nimbex",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Adrenaline (1) ---
  {
    drug1Id: "1",
    drug2Id: "4",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ห้ามใช้ยา Adrenaline ที่ไม่ได้เจือจางฉีด IV, flush สายก่อนและหลังให้ยา, ระวัง Extravasation",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "3",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ห้ามใช้ยา Adrenaline ที่ไม่ได้เจือจางฉีด IV, flush สายก่อนและหลังให้ยา, ระวัง Extravasation, ติดตามสัญญาณชีพอย่างใกล้ชิด",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "5",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "เข้าทางหลอดเลือดดำได้ทางเดียวเท่านั้น และควรให้ทาง Central line, ห้ามฉีด IV ที่ไม่ได้เจือจาง, ระวัง Extravasation",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "6",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "เข้าทางหลอดเลือดดำได้ทางเดียวเท่านั้น และควรให้ทาง Central line, ต้องใช้ infusion Pump, ระวัง Extravasation",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "7",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ยา Domicum ควร Slow IV หรือให้ทาง infusion pump, ติดตามสัญญาณชีพอย่างใกล้ชิด",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ยา Fentanyl ให้เร็วไปอาจทำให้กดการหายใจ, ยา Adrenaline ควรให้ทาง infusion pump",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: NSS",
    precautions:
      "ควรเฝ้าระวัง Severe hypertension, Cardiac arrhythmia, Hyperglycemia",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ควรเฝ้าระวัง Severe hypertension, Cardiac arrhythmia",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "ควรเฝ้าระวัง Hemodynamic instability, Cardiac arrhythmia และ Extravasation",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },
  {
    drug1Id: "1",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ควรเฝ้าระวัง Severe hypertension, Hemodynamic instability",
    reference: "(คณะอนุกรรมการระบบยา โรงพยาบาลประจวบคีรีขันธ์, 2566)",
  },

  // --- Ceftriaxone (4) ---
  {
    drug1Id: "4",
    drug2Id: "3",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• เพิ่มความเสี่ยงในการแพ้ยา\n• เสี่ยงท้องเสียรุนแรง\n• อาจทำให้เม็ดเลือดต่ำ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "5",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "6",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• Dopamine อาจทำให้หัวใจเต้นเร็ว\n• เสี่ยงเนื้อเยื่อเสียหายหากยารั่ว",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "7",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Dormicum อาจทำให้ง่วงมาก กดการหายใจ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Fentanyl อาจทำให้กดการหายใจ ง่วงมาก",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• Hydrocortisone อาจทำให้น้ำตาลสูง\n• เสี่ยงติดเชื้อได้ง่ายขึ้น",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "• Propofol อาจทำให้ความดันต่ำ กดการหายใจ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "4",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Nimbex ทำให้กล้ามเนื้ออ่อนแรง ต้องใส่เครื่องช่วยหายใจ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Ceftazidime (3) ---
  {
    drug1Id: "3",
    drug2Id: "5",
    status: "caution",
    nursingCare: "-",
    precautions:
      "Ceftazidime 120 mg/ml in SWFI + Dobutamine 1 mg/ml = Compatible\nCeftazidime 400 mg/ml + Dobutamine 6.25 mg/ml in NSS, D5W = Incompatible",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "6",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Dopamine อาจทำให้หัวใจเต้นเร็ว ความดันไม่คงที่",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "7",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Fentanyl อาจทำให้กดการหายใจ ง่วงมาก",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Hydrocortisone อาจทำให้น้ำตาลสูง",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "3",
    drug2Id: "12",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Dobutamine (5) ---
  {
    drug1Id: "5",
    drug2Id: "6",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "หากให้ยาพร้อมกันควรเฝ้าระวัง Cardiac arrhythmia, Myocardial ischemia, Hypertension",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "7",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "หากใช้ยาพร้อมกันควรเฝ้าระวัง Hemodynamic instability, เฝ้าระวัง RR และ O₂ saturation",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "หากใช้ยาพร้อมกันควรเฝ้าระวัง Hypotension, เฝ้าระวัง RR และ O₂ saturation",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "9",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions:
      "หากใช้ยาพร้อมกันควรเฝ้าระวัง Hypotension, เฝ้าระวัง RR และ O₂ saturation",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "15",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "5",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "หากใช้ยาพร้อมกันควรเฝ้าระวังภาวะกดการหายใจ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Dopamine (6) ---
  {
    drug1Id: "6",
    drug2Id: "7",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• Dopamine เพิ่มความดัน/หัวใจเต้นเร็ว\n• Dormicum อาจกดการหายใจ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• Fentanyl อาจกดการหายใจ\n• Dopamine ทำให้หัวใจเต้นเร็ว ความดันไม่คงที่",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions:
      "• Dopamine อาจทำให้หัวใจเต้นเร็ว\n• Hydrocortisone อาจทำให้น้ำตาลสูง",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions:
      "• Propofol อาจทำให้ความดันต่ำ กดการหายใจ\n• Dopamine เพิ่มความดัน/หัวใจเต้นเร็ว",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "• Dopamine อาจทำให้หัวใจเต้นเร็ว\n• Tazocin เสี่ยงแพ้ยา",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "6",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "Dopamine อาจทำให้หัวใจเต้นเร็ว ความดันไม่คงที่",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Dormicum (7) ---
  {
    drug1Id: "7",
    drug2Id: "8",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ความดันต่ำ กดการหายใจ กล้ามเนื้อสั่น คลื่นไส้อาเจียน",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "7",
    drug2Id: "9",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "7",
    drug2Id: "10",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "7",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "7",
    drug2Id: "15",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "7",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ความดันต่ำ กดการหายใจ กล้ามเนื้อสั่น คลื่นไส้อาเจียน",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Fentanyl (8) ---
  {
    drug1Id: "8",
    drug2Id: "9",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ถ้ามีอาการปวด บวม แดง บริเวณที่ให้ยา ให้แจ้งพยาบาลทันที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "8",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions:
      "ถ้ามีอาการปวด บวม แดง บริเวณที่ให้ยา ให้แจ้งพยาบาลทันที และตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "8",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ถ้ามีอาการปวด บวม แดง บริเวณที่ให้ยา ให้แจ้งพยาบาลทันที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "8",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ถ้ามีอาการปวด บวม แดง บริเวณที่ให้ยา ให้แจ้งพยาบาลทันที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "8",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ถ้ามีอาการปวด บวม แดง บริเวณที่ให้ยา ให้แจ้งพยาบาลทันที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Hydrocortisone (9) ---
  {
    drug1Id: "9",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions:
      "อาจทำให้ผิวบาง บวมน้ำ หรือน้ำตาลในเลือดสูงได้ ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "9",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "อาจทำให้ผิวบาง บวมน้ำ ความดันสูง หรือน้ำตาลในเลือดสูงได้",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "9",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "อาจทำให้ผิวบาง บวมน้ำ ความดันสูง หรือน้ำตาลในเลือดสูงได้",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "9",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "อาจทำให้ผิวบาง บวมน้ำ ความดันสูง หรือน้ำตาลในเลือดสูงได้",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Meropenem (10) ---
  {
    drug1Id: "10",
    drug2Id: "13",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions:
      "ตรวจวัด vital sign ทุก 30-60 นาที ให้ระดับความดันโลหิตอยู่ในระดับที่ต้องการ",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "10",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ห้ามใช้ในผู้ป่วยที่มีอาการแพ้ยาในกลุ่มคาร์บาเพเนม",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "10",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W, NSS",
    precautions: "ห้ามใช้ในผู้ป่วยที่มีอาการแพ้ยาในกลุ่มคาร์บาเพเนม",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Norepinephrine (13) ---
  {
    drug1Id: "13",
    drug2Id: "14",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "13",
    drug2Id: "15",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },
  {
    drug1Id: "13",
    drug2Id: "12",
    status: "compatible",
    nursingCare: "สารน้ำที่ใช้ได้: D5W",
    precautions: "ตรวจวัด vital sign ทุก 30-60 นาที",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Propofol (14) ---
  {
    drug1Id: "14",
    drug2Id: "12",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ, 2561)",
  },

  // --- Tazocin (15) ---
  {
    drug1Id: "15",
    drug2Id: "12",
    status: "incompatible",
    nursingCare: "-",
    precautions: "-",
    reference: "(กลุ่มงานเภสัชกรรมโรงพยาบาลนพรัตนราชธานี, 2562)",
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

  return {
    drug1Id,
    drug2Id,
    status: "limited_data",
    precautions: "", //"ยังไม่มีข้อมูลเพียงพอเกี่ยวกับการผสมยาคู่นี้ กรุณาปรึกษาเภสัชกรก่อนใช้ร่วมกัน",
    nursingCare: "", //""สังเกตอาการผิดปกติหลังให้ยา ตรวจสอบสารละลายว่ามีการเปลี่ยนแปลงสี ความขุ่น หรือตะกอนหรือไม่ บันทึกและรายงานอาการผิดปกติทุกชนิด",
    reference: "-", // กรณี Default ที่ไม่มีในตารางจะส่งกลับเป็น "-"
  };
}
