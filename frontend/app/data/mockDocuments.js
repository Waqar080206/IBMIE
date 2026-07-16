/**
 * Mock "Medical Knowledge Objects" — stand-ins for documents that would
 * normally arrive from the OCR + LLM extraction pipeline (see pipelineSteps.js).
 * Swap this module for a real API/data-fetching layer in production.
 */

export const CBC_DOC = {
  id: "doc_cbc_0142",
  type: "lab_report",
  title: "Complete Blood Count",
  category: "Hematology",
  date: "2026-07-12",
  status: "processed",
  confidence: 0.97,
  ocrUsed: false,
  patient: {
    name: "Patient Record #A-4471",
    age: 46,
    gender: "Male",
    patientId: "PT-4471",
    referringDoctor: "Dr. R. Kulkarni",
  },
  results: [
    { test_name: "Hemoglobin", category: "CBC", value: 8.2, unit: "g/dL", reference_range: { low: 13.5, high: 17.5 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "Below reference interval" },
    { test_name: "RBC Count", category: "CBC", value: 4.1, unit: "mill/uL", reference_range: { low: 4.5, high: 5.9 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "" },
    { test_name: "WBC Count", category: "CBC", value: 15200, unit: "/uL", reference_range: { low: 4000, high: 11000 }, status: "HIGH", flag: "abnormal", sample_type: "Whole Blood", remarks: "Suggestive of leukocytosis" },
    { test_name: "Platelet Count", category: "CBC", value: 262000, unit: "/uL", reference_range: { low: 150000, high: 450000 }, status: "NORMAL", flag: "normal", sample_type: "Whole Blood", remarks: "" },
    { test_name: "Hematocrit", category: "CBC", value: 38.1, unit: "%", reference_range: { low: 41, high: 53 }, status: "LOW", flag: "abnormal", sample_type: "Whole Blood", remarks: "" },
    { test_name: "MCV", category: "CBC", value: 88, unit: "fL", reference_range: { low: 80, high: 100 }, status: "NORMAL", flag: "normal", sample_type: "Whole Blood", remarks: "" },
  ],
};

export const LIPID_DOC = {
  id: "doc_lipid_0098",
  type: "lab_report",
  title: "Lipid Profile",
  category: "Biochemistry",
  date: "2026-07-12",
  status: "processed",
  confidence: 0.95,
  ocrUsed: true,
  patient: {
    name: "Patient Record #A-4471",
    age: 46,
    gender: "Male",
    patientId: "PT-4471",
    referringDoctor: "Dr. R. Kulkarni",
  },
  results: [
    { test_name: "Total Cholesterol", category: "Lipid Profile", value: 245, unit: "mg/dL", reference_range: { low: null, high: 200 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
    { test_name: "LDL Cholesterol", category: "Lipid Profile", value: 165, unit: "mg/dL", reference_range: { low: null, high: 100 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
    { test_name: "HDL Cholesterol", category: "Lipid Profile", value: 38, unit: "mg/dL", reference_range: { low: 40, high: null }, status: "LOW", flag: "abnormal", sample_type: "Serum", remarks: "" },
    { test_name: "Triglycerides", category: "Lipid Profile", value: 312, unit: "mg/dL", reference_range: { low: null, high: 150 }, status: "CRITICAL", flag: "critical", sample_type: "Serum", remarks: "Markedly elevated" },
    { test_name: "VLDL", category: "Lipid Profile", value: 62, unit: "mg/dL", reference_range: { low: 5, high: 40 }, status: "HIGH", flag: "abnormal", sample_type: "Serum", remarks: "" },
  ],
};

export const RX_DOC = {
  id: "doc_rx_0067",
  type: "prescription",
  title: "Outpatient Prescription",
  category: "Prescription",
  date: "2026-07-12",
  status: "processed",
  confidence: 0.93,
  ocrUsed: false,
  patient: {
    name: "Patient Record #A-4471",
    age: 46,
    gender: "Male",
    patientId: "PT-4471",
    referringDoctor: "Dr. R. Kulkarni",
  },
  medicines: [
    { medicine_name: "Metformin", strength: "500 mg", dose: "1 tablet", frequency: "Twice daily", duration: "30 days", route: "Oral", instructions: "After meals" },
    { medicine_name: "Atorvastatin", strength: "20 mg", dose: "1 tablet", frequency: "Once daily, night", duration: "30 days", route: "Oral", instructions: "Avoid grapefruit juice" },
    { medicine_name: "Aspirin", strength: "75 mg", dose: "1 tablet", frequency: "Once daily", duration: "30 days", route: "Oral", instructions: "After breakfast" },
  ],
};

export const DOCS = [CBC_DOC, LIPID_DOC, RX_DOC];
