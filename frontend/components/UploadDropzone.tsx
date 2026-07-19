"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { T } from "@/lib/tokens";
import { PIPELINE_STEPS } from "@/lib/mock-data";
import { DocumentKind, uploadMedicalDocument } from "@/lib/api";

type Stage = "idle" | "queued" | "processing" | "done";

export default function UploadDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [resultDocId, setResultDocId] = useState<string | null>(null);
  const [documentKind, setDocumentKind] = useState<DocumentKind>("lab_report");
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;

    const accepted = Array.from(incoming).filter(
      (file) =>
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    );

    if (accepted.length) {
      setFiles((prev) => [...prev, ...accepted]);
      setStage("queued");
      setError(null);
      setResultDocId(null);
    }
  }, []);

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const runPipeline = async () => {
    if (!files.length) return;

    setStage("processing");
    setActiveStep(0);
    setError(null);

    try {
      for (let i = 1; i < Math.min(3, PIPELINE_STEPS.length); i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        setActiveStep(i);
      }

      const uploads = [];
      for (const file of files) {
        setActiveStep(3);
        uploads.push(await uploadMedicalDocument(file, documentKind));
      }

      setActiveStep(PIPELINE_STEPS.length);
      setResultDocId(uploads[uploads.length - 1]?.id || null);
      setStage("done");
    } catch (err) {
      setStage("queued");
      setActiveStep(-1);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
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
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: T.primaryTint }}
        >
          <UploadCloud size={24} color={T.primary} />
        </div>
        <div
          className="text-[15px] font-semibold"
          style={{ color: T.ink, fontFamily: "var(--font-display)" }}
        >
          Drop a lab report or prescription here
        </div>
        <p
          className="text-[12.5px] mt-1.5 max-w-sm"
          style={{ color: T.muted, fontFamily: "var(--font-body)" }}
        >
          PDF documents are sent to the backend parsing pipeline.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="mt-5 rounded-lg px-5 py-2.5 text-[13px] font-semibold"
          style={{ background: T.primary, color: "#fff", fontFamily: "var(--font-body)" }}
        >
          Browse files
        </button>
      </div>

      {files.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="text-[12px] font-semibold mb-3" style={{ color: T.muted }}>
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </div>
          <div className="flex flex-col gap-2">
            {files.map((file, idx) => (
              <div
                key={file.name + idx}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{ background: T.canvasAlt }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={16} color={T.primary} className="shrink-0" />
                  <div className="min-w-0">
                    <div
                      className="text-[13px] font-medium truncate"
                      style={{ color: T.ink, fontFamily: "var(--font-body)" }}
                    >
                      {file.name}
                    </div>
                    <div className="text-[11px]" style={{ color: T.muted }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
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

          <div className="mt-4 flex items-center gap-2 rounded-lg p-1 w-fit" style={{ background: T.canvasAlt }}>
            {[
              { key: "lab_report", label: "Lab report" },
              { key: "prescription", label: "Prescription" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setDocumentKind(option.key as DocumentKind)}
                className="rounded-md px-3.5 py-2 text-[12.5px] font-semibold"
                style={{
                  background: documentKind === option.key ? T.card : "transparent",
                  color: documentKind === option.key ? T.primary : T.muted,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="mt-4 rounded-lg p-3 text-[12.5px]"
              style={{ background: T.criticalTint, color: T.critical }}
            >
              {error}
            </div>
          )}

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
        <div
          className="rounded-xl p-6"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex flex-col">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = idx < activeStep || stage === "done";
              const isActive = idx === activeStep && stage === "processing";
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isDone
                          ? T.primary
                          : isActive
                            ? T.primaryTint
                            : T.canvasAlt,
                        border: isActive ? `2px solid ${T.primary}` : "none",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} color="#fff" />
                      ) : isActive ? (
                        <Loader2 size={15} color={T.primary} className="animate-spin" />
                      ) : null}
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{
                          background: isDone ? T.primary : T.border,
                          minHeight: 24,
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-5">
                    <div
                      className="text-[13.5px] font-medium"
                      style={{
                        color: isDone || isActive ? T.ink : T.muted,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {stage === "done" && resultDocId && (
            <div
              className="rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap"
              style={{ background: T.primaryTint }}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} color={T.primary} />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: T.primaryDeep, fontFamily: "var(--font-body)" }}
                >
                  Done - structured, explained, and checked for urgent values.
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
    </div>
  );
}
