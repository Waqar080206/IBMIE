import { MedicalDocument, Reminder, WeeklySummary } from "./types";

const patient = {
  name: "Patient Record #A-4471",
  age: 46,
  gender: "Male",
  patientId: "PT-4471",
  referringDoctor: "Dr. R. Kulkarni",
};

export const DOCS: MedicalDocument[] = [
  {
    id: "cbc-0142",
    type: "lab_report",
    title: "Complete Blood Count",
    category: "Hematology",
    date: "2026-07-12",
    confidence: 0.97,
    ocrUsed: false,
    patient,
    results: [
      { test_name: "Hemoglobin", category: "CBC", value: 8.2, unit: "g/dL", reference_range: { low: 13.5, high: 17.5 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "Below reference interval" },
      { test_name: "RBC Count", category: "CBC", value: 4.1, unit: "mill/uL", reference_range: { low: 4.5, high: 5.9 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "" },
      { test_name: "WBC Count", category: "CBC", value: 15200, unit: "/uL", reference_range: { low: 4000, high: 11000 }, status: "HIGH", flag: "abnormal", sample_type: "Whole Blood", remarks: "Suggestive of leukocytosis" },
      { test_name: "Platelet Count", category: "CBC", value: 262000, unit: "/uL", reference_range: { low: 150000, high: 450000 }, status: "NORMAL", flag: "normal", sample_type: "Whole Blood", remarks: "" },
      { test_name: "Hematocrit", category: "CBC", value: 38.1, unit: "%", reference_range: { low: 41, high: 53 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "" },
    ],
    explanations: [
      { test_name: "Hemoglobin", severity: "LOW", simple_summary: "Hemoglobin carries oxygen in your blood. Yours is lower than the typical range, which is often described as anemia. Common causes include low iron, blood loss, or diet — your doctor can confirm which applies to you." },
      { test_name: "WBC Count", severity: "HIGH", simple_summary: "White blood cells help fight infection. Yours are higher than usual, which can happen with an infection, inflammation, or stress on the body. Worth mentioning to your doctor, especially if you've felt unwell." },
      { test_name: "Hematocrit", severity: "LOW", simple_summary: "This measures the portion of your blood made up of red blood cells. It's a bit low, which lines up with the low hemoglobin reading above." },
    ],
    overallSummary: "This report shows signs of anemia (low hemoglobin, RBC and hematocrit) along with an elevated white cell count. Neither is an emergency on its own, but both are worth discussing with your doctor soon.",
    urgent: null,
  },
  {
    id: "lipid-0098",
    type: "lab_report",
    title: "Lipid Profile",
    category: "Biochemistry",
    date: "2026-07-12",
    confidence: 0.95,
    ocrUsed: true,
    patient,
    results: [
      { test_name: "Total Cholesterol", category: "Lipid Profile", value: 245, unit: "mg/dL", reference_range: { low: null, high: 200 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
      { test_name: "LDL Cholesterol", category: "Lipid Profile", value: 165, unit: "mg/dL", reference_range: { low: null, high: 100 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
      { test_name: "HDL Cholesterol", category: "Lipid Profile", value: 38, unit: "mg/dL", reference_range: { low: 40, high: null }, status: "LOW", flag: "abnormal", sample_type: "Serum", remarks: "" },
      { test_name: "Triglycerides", category: "Lipid Profile", value: 312, unit: "mg/dL", reference_range: { low: null, high: 150 }, status: "CRITICAL", flag: "critical", sample_type: "Serum", remarks: "Markedly elevated" },
      { test_name: "VLDL", category: "Lipid Profile", value: 62, unit: "mg/dL", reference_range: { low: 5, high: 40 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
    ],
    explanations: [
      { test_name: "Total Cholesterol", severity: "HIGH", simple_summary: "Your overall cholesterol is above the typical range. This is usually managed through diet, activity, and sometimes medication." },
      { test_name: "LDL Cholesterol", severity: "HIGH", simple_summary: "Often called 'bad' cholesterol — it's elevated here, which over time can affect heart health if left unaddressed." },
      { test_name: "HDL Cholesterol", severity: "LOW", simple_summary: "This is the 'good' cholesterol that helps clear LDL from your blood. Yours is a little low, which is worth improving alongside the other values." },
      { test_name: "Triglycerides", severity: "CRITICAL", simple_summary: "This is markedly above the typical range. Very high triglycerides can, in rare cases, lead to serious complications, so this is flagged as something to act on soon rather than later." },
    ],
    overallSummary: "This lipid panel shows a pattern often described as an unfavorable cholesterol profile, with triglycerides high enough to flag for prompt attention.",
    urgent: { message: "Triglycerides are markedly elevated at 312 mg/dL. Please contact your doctor promptly rather than waiting for a routine follow-up.", test_name: "Triglycerides" },
  },
  {
    id: "rx-0067",
    type: "prescription",
    title: "Outpatient Prescription",
    category: "Prescription",
    date: "2026-07-12",
    confidence: 0.93,
    ocrUsed: false,
    patient,
    medicines: [
      { medicine_name: "Metformin", strength: "500 mg", dose: "1 tablet", frequency: "Twice daily", duration: "30 days", route: "Oral", instructions: "After meals" },
      { medicine_name: "Atorvastatin", strength: "20 mg", dose: "1 tablet", frequency: "Once daily, night", duration: "30 days", route: "Oral", instructions: "Avoid grapefruit juice" },
      { medicine_name: "Aspirin", strength: "75 mg", dose: "1 tablet", frequency: "Once daily", duration: "30 days", route: "Oral", instructions: "After breakfast" },
    ],
    overallSummary: "Three regular prescriptions, all taken orally with meals or at a fixed time of day. Reminders have been suggested based on the frequencies listed.",
    urgent: null,
  },
];

export const REMINDERS: Reminder[] = [
  { id: "r1", medicine_name: "Metformin 500mg", dose: "1 tablet", time: "08:30 AM", frequency: "Twice daily", active: true, nextDose: "Today, 08:30 PM" },
  { id: "r2", medicine_name: "Atorvastatin 20mg", dose: "1 tablet", time: "09:30 PM", frequency: "Once daily", active: true, nextDose: "Today, 09:30 PM" },
  { id: "r3", medicine_name: "Aspirin 75mg", dose: "1 tablet", time: "08:00 AM", frequency: "Once daily", active: true, nextDose: "Tomorrow, 08:00 AM" },
  { id: "r4", medicine_name: "Vitamin D3", dose: "1 sachet", time: "Sunday", frequency: "Weekly", active: false, nextDose: "Paused" },
];

export const WEEKLY_SUMMARY: WeeklySummary = {
  weekRange: "Jul 7 – Jul 13, 2026",
  headline: "Two lab reports and one prescription processed this week, with one value flagged for prompt follow-up.",
  highlights: [
    "Triglycerides came back critically high — flagged for prompt attention.",
    "Hemoglobin and hematocrit are both below range, consistent with mild anemia.",
    "All three prescribed medicines have reminders active for the full 30-day course.",
    "Cholesterol trend has moved up compared to your last recorded panel.",
  ],
  trend: [
    { label: "Hemoglobin", unit: "g/dL", points: [9.4, 9.0, 8.7, 8.2] },
    { label: "Total Cholesterol", unit: "mg/dL", points: [198, 212, 228, 245] },
  ],
  lifestyleTips: [
    "Add iron-rich foods like leafy greens, legumes, and lean meat to help support hemoglobin levels.",
    "Consider swapping fried snacks for nuts or fruit — small changes add up for cholesterol and triglycerides.",
    "Aim for a brisk 20–30 minute walk most days; this is broadly associated with improved lipid profiles.",
    "Keep up with the reminder schedule — consistent medicine timing matters as much as the dose.",
  ],
};

export const PIPELINE_STEPS = [
  { key: "upload", label: "Receiving document" },
  { key: "detect", label: "Detecting document type" },
  { key: "ocr", label: "Running OCR (scanned pages)" },
  { key: "parse", label: "AI structuring the data" },
  { key: "explain", label: "Writing a plain-language explanation" },
  { key: "check", label: "Checking for abnormal or urgent values" },
];
