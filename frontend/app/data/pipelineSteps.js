import { FileText, ScanLine, Brain, ShieldCheck, Database } from "lucide-react";

/**
 * Steps shown in the Upload view's simulated extraction pipeline.
 */
export const PIPELINE_STEPS = [
  { key: "detect", label: "Detect document type", icon: FileText, desc: "Digital text layer vs. scanned image" },
  { key: "ocr", label: "OCR extraction", icon: ScanLine, desc: "Docling primary, PaddleOCR fallback" },
  { key: "llm", label: "LLM medical parsing", icon: Brain, desc: "Llama 3.3 70B via Ollama, structured output" },
  { key: "validate", label: "Validate & normalize", icon: ShieldCheck, desc: "Pydantic schema, range parsing, flags" },
  { key: "embed", label: "Embed & store", icon: Database, desc: "SentenceTransformers → pgvector" },
];
