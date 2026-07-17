"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, X, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { T } from "@/lib/tokens";
import { PIPELINE_STEPS, DOCS } from "@/lib/mock-data";

type Stage = "idle" | "queued" | "processing" | "done";

export default function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [resultDocId, setResultDocId] = useState<string | null>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const accepted = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || f.type.startsWith("image/")
    );
    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
      setStage("queued");
    }
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const runPipeline = () => {
    setStage("processing");
    setActiveStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      if (i >= PIPELINE_STEPS.length) {
        clearInterval(iv);
        setStage("done");
        setActiveStep(PIPELINE_STEPS.length);
        // In a real integration this id would come back from the API response.
        // Here we route to a representative parsed example.
        const looksLikePrescription = files.some((f) => /rx|prescription/i.test(f.name));
        setResultDocId(looksLikePrescription ? "rx-0067" : "lipid-0098");
      } else {
        setActiveStep(i);
      }
    }, 700);
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
        style={{
          background: T.card,
          border: `1.5px dashed ${dragOver ? T.primary : T.borderStrong}`,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="h-14 w-14 rounded-full flex items-center justify-center mb-4" style={{ background: T.primaryTint }}>
          <UploadCloud size={24} color={T.primary} />
        </div>
        <div className="text-[15px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>
          Drop a lab report or prescription here
        </div>
        <p className="text-[12.5px] mt-1.5 max-w-sm" style={{ color: T.muted, fontFamily: "var(--font-body)" }}>
          PDF or photo. Digital and scanned documents are both supported.
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="mt-5 rounded-lg px-5 py-2.5 text-[13px] font-semibold"
          style={{ background: T.primary, color: "#fff", fontFamily: "var(--font-body)" }}
        >
          Browse files
        </button>
      </div>

      {files.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <div className="text-[12px] font-semibold mb-3" style={{ color: T.muted }}>
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-col gap-2">
            {files.map((f, idx) => (
              <div key={f.name + idx} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: T.canvasAlt }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={16} color={T.primary} className="shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{f.name}</div>
                    <div className="text-[11px]" style={{ color: T.muted }}>{(f.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
                {stage !== "processing" && stage !== "done" && (
                  <button onClick={() => removeFile(idx)} className="p-1">
                    <X size={15} color={T.muted} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {stage === "queued" && (
            <button
              onClick={runPipeline}
              className="mt-4 w-full rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: T.primary, color: "#fff", fontFamily: "var(--font-body)" }}
            >
              Analyze {files.length > 1 ? "documents" : "document"}
            </button>
          )}
        </div>
      )}

      {(stage === "processing" || stage === "done") && (
        <div className="rounded-xl p-6" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <div className="flex flex-col">
            {PIPELINE_STEPS.map((s, idx) => {
              const isDone = idx < activeStep || stage === "done";
              const isActive = idx === activeStep && stage === "processing";
              return (
                <div key={s.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: isDone ? T.primary : isActive ? T.primaryTint : T.canvasAlt, border: isActive ? `2px solid ${T.primary}` : "none" }}
                    >
                      {isDone ? <CheckCircle2 size={15} color="#fff" /> : isActive ? <Loader2 size={15} color={T.primary} className="animate-spin" /> : null}
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ background: isDone ? T.primary : T.border, minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className="text-[13.5px] font-medium" style={{ color: isDone || isActive ? T.ink : T.muted, fontFamily: "var(--font-body)" }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {stage === "done" && resultDocId && (
            <div className="rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap" style={{ background: T.primaryTint }}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} color={T.primary} />
                <span className="text-[13px] font-medium" style={{ color: T.primaryDeep, fontFamily: "var(--font-body)" }}>
                  Done — structured, explained, and checked for urgent values.
                </span>
              </div>
              <button
                onClick={() => router.push(`/reports/${resultDocId}`)}
                className="text-[12.5px] font-semibold rounded-lg px-3.5 py-2 flex items-center gap-1.5"
                style={{ background: T.primary, color: "#fff" }}
              >
                View report <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Fallback quick-demo path for reviewers without a sample PDF on hand */}
      {files.length === 0 && (
        <button
          onClick={() => {
            setFiles([new File([""], "lipid_profile_scan.pdf", { type: "application/pdf" })]);
            setStage("queued");
          }}
          className="self-start text-[12.5px] font-medium"
          style={{ color: T.muted }}
        >
          No file handy? Load a sample report instead →
        </button>
      )}
    </div>
  );
}
