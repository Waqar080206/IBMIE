import React from "react";
import { Pill, Sparkles } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import DocHeader from "./DocHeader";

/** Detail view for a prescription Medical Knowledge Object, one card per medicine. */
export default function Prescription({ doc, setView }) {
  return (
    <div>
      <DocHeader doc={doc} setView={setView} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doc.medicines.map((m) => (
          <div key={m.medicine_name} className="rounded-xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: T.primaryTint }}>
                  <Pill size={17} color={T.primary} />
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>{m.medicine_name}</div>
                  <div className="text-[12px]" style={{ color: T.muted, fontFamily: FONTS.mono }}>{m.strength}</div>
                </div>
              </div>
              <span
                className="text-[10.5px] font-semibold px-2 py-1 rounded-full"
                style={{ background: T.canvasAlt, color: T.inkSoft, fontFamily: FONTS.body }}
              >
                {m.route}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Dose", value: m.dose },
                { label: "Frequency", value: m.frequency },
                { label: "Duration", value: m.duration },
              ].map((f) => (
                <div key={f.label} className="rounded-lg p-2.5" style={{ background: T.canvasAlt }}>
                  <div className="text-[10px] font-medium mb-0.5" style={{ color: T.muted }}>{f.label.toUpperCase()}</div>
                  <div className="text-[12.5px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>{f.value}</div>
                </div>
              ))}
            </div>

            {m.instructions && (
              <div className="flex items-start gap-1.5 text-[12px]" style={{ color: T.inkSoft }}>
                <Sparkles size={13} className="mt-0.5 shrink-0" color={T.gold} />
                {m.instructions}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
