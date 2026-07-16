import React from "react";
import { ArrowLeft, ShieldCheck, User, CalendarDays, Stethoscope, Clock } from "lucide-react";
import { T, FONTS } from "../../styles/theme";

/** Shared header (back link, title, confidence badge, patient facts) for document detail views. */
export default function DocHeader({ doc, setView }) {
  return (
    <div>
      <button onClick={() => setView("home")} className="flex items-center gap-1.5 text-[12.5px] font-medium mb-4" style={{ color: T.muted }}>
        <ArrowLeft size={14} /> Back to overview
      </button>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[22px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>{doc.title}</h1>
            {doc.status === "processed" && (
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: T.primaryTint, color: T.primary }}>
                PARSED
              </span>
            )}
          </div>
          <p className="text-[13px]" style={{ color: T.muted, fontFamily: FONTS.body }}>
            {doc.category} · captured {doc.date} · {doc.ocrUsed ? "OCR pipeline" : "digital text layer"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3.5 py-2" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <ShieldCheck size={15} color={T.primary} />
          <span className="text-[12.5px] font-medium" style={{ color: T.inkSoft, fontFamily: FONTS.body }}>
            {Math.round(doc.confidence * 100)}% extraction confidence
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { icon: User, label: "Patient", value: doc.patient.patientId },
          { icon: CalendarDays, label: "Age / Gender", value: `${doc.patient.age} · ${doc.patient.gender}` },
          { icon: Stethoscope, label: "Referring physician", value: doc.patient.referringDoctor },
          { icon: Clock, label: "Report date", value: doc.date },
        ].map((f) => (
          <div key={f.label} className="rounded-xl p-3.5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1.5" style={{ color: T.muted }}>
              <f.icon size={12.5} /> {f.label.toUpperCase()}
            </div>
            <div className="text-[13.5px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
