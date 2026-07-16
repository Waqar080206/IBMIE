import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import { PIPELINE_STEPS } from "../../data/pipelineSteps";
import { LIPID_DOC } from "../../data/mockDocuments";
import TopBar from "../layout/TopBar";

/** Upload view: idle drop-zone, then a simulated step-by-step extraction pipeline. */
export default function Upload({ setView }) {
  const [stage, setStage] = useState("idle"); // idle | running | done
  const [activeStep, setActiveStep] = useState(-1);

  const startDemo = () => {
    setStage("running");
    setActiveStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      if (i >= PIPELINE_STEPS.length) {
        clearInterval(iv);
        setStage("done");
        setActiveStep(PIPELINE_STEPS.length);
      } else {
        setActiveStep(i);
      }
    }, 750);
  };

  return (
    <div>
      <TopBar title="Upload document" subtitle="A lab report or prescription PDF, routed through the parsing pipeline" />

      {stage === "idle" && (
        <div className="rounded-xl p-12 flex flex-col items-center justify-center text-center" style={{ background: T.card, border: `1.5px dashed ${T.borderStrong}` }}>
          <div className="h-14 w-14 rounded-full flex items-center justify-center mb-4" style={{ background: T.primaryTint }}>
            <UploadCloud size={24} color={T.primary} />
          </div>
          <div className="text-[15px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>
            Drop a PDF here, or browse
          </div>
          <p className="text-[12.5px] mt-1.5 max-w-sm" style={{ color: T.muted, fontFamily: FONTS.body }}>
            Supports digital and scanned laboratory reports, and printed or typed prescriptions.
          </p>
          <button
            onClick={startDemo}
            className="mt-6 rounded-lg px-5 py-2.5 text-[13px] font-semibold"
            style={{ background: T.primary, color: "#fff", fontFamily: FONTS.body }}
          >
            Simulate: lipid_profile_scan.pdf
          </button>
        </div>
      )}

      {stage !== "idle" && (
        <div className="rounded-xl p-6" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: T.canvasAlt }}>
              <FileText size={18} color={T.primary} />
            </div>
            <div>
              <div className="text-[13.5px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>lipid_profile_scan.pdf</div>
              <div className="text-[11.5px]" style={{ color: T.muted }}>2.1 MB · scanned document detected</div>
            </div>
          </div>

          <div className="flex flex-col">
            {PIPELINE_STEPS.map((s, idx) => {
              const isDone = idx < activeStep || stage === "done";
              const isActive = idx === activeStep && stage === "running";
              return (
                <div key={s.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isDone ? T.primary : isActive ? T.primaryTint : T.canvasAlt,
                        border: isActive ? `2px solid ${T.primary}` : "none",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} color="#fff" />
                      ) : isActive ? (
                        <Loader2 size={15} color={T.primary} className="animate-spin" />
                      ) : (
                        <s.icon size={14} color={T.muted} />
                      )}
                    </div>
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div className="w-px flex-1 my-1" style={{ background: isDone ? T.primary : T.border, minHeight: 28 }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="text-[13.5px] font-medium" style={{ color: isDone || isActive ? T.ink : T.muted, fontFamily: FONTS.body }}>
                      {s.label}
                    </div>
                    <div className="text-[12px]" style={{ color: T.muted }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {stage === "done" && (
            <div className="rounded-lg p-4 flex items-center justify-between mt-1" style={{ background: T.primaryTint }}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={17} color={T.primary} />
                <span className="text-[13px] font-medium" style={{ color: T.primaryDeep, fontFamily: FONTS.body }}>
                  Medical Knowledge Object generated · 95% confidence
                </span>
              </div>
              <button
                onClick={() => setView(LIPID_DOC.id)}
                className="text-[12.5px] font-semibold rounded-lg px-3.5 py-2"
                style={{ background: T.primary, color: "#fff" }}
              >
                View extracted data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
