import React from "react";
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Pill, FlaskConical, ChevronRight, UploadCloud } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import { DOCS, CBC_DOC, LIPID_DOC, RX_DOC } from "../../data/mockDocuments";
import TopBar from "../layout/TopBar";

/** Dashboard overview: summary stats, recent documents, status distribution. */
export default function Home({ setView }) {
  const allResults = [...CBC_DOC.results, ...LIPID_DOC.results];
  const counts = allResults.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});
  const stats = [
    { label: "Documents parsed", value: DOCS.length, icon: FileText },
    { label: "Values extracted", value: allResults.length + RX_DOC.medicines.length, icon: Sparkles },
    { label: "Flagged abnormal", value: (counts.HIGH || 0) + (counts.LOW || 0) + (counts.CRITICAL || 0), icon: AlertTriangle },
    { label: "Avg. confidence", value: "95.2%", icon: ShieldCheck },
  ];

  return (
    <div>
      <TopBar title="Overview" subtitle="Structured extraction status across recent uploads" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: T.primaryTint }}>
                <s.icon size={16} color={T.primary} />
              </div>
            </div>
            <div className="text-[22px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>{s.value}</div>
            <div className="text-[12px] mt-0.5" style={{ color: T.muted, fontFamily: FONTS.body }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>Recent documents</h3>
            <button onClick={() => setView("history")} className="text-[12px] font-medium flex items-center gap-1" style={{ color: T.primary }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: T.border }}>
            {DOCS.map((d) => (
              <button
                key={d.id}
                onClick={() => setView(d.id)}
                className="flex items-center justify-between py-3.5 text-left first:pt-0 last:pb-0"
                style={{ borderColor: T.border }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: T.canvasAlt }}>
                    {d.type === "prescription" ? <Pill size={16} color={T.primary} /> : <FlaskConical size={16} color={T.primary} />}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>{d.title}</div>
                    <div className="text-[11.5px]" style={{ color: T.muted }}>{d.category} · {d.date}</div>
                  </div>
                </div>
                <ChevronRight size={16} color={T.muted} />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: T.card, border: `1px solid ${T.border}` }}>
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: T.ink, fontFamily: FONTS.display }}>Status distribution</h3>
          <div className="flex flex-col gap-3">
            {["NORMAL", "LOW", "HIGH", "CRITICAL"].map((k) => {
              const total = allResults.length;
              const n = counts[k] || 0;
              const pct = total ? Math.round((n / total) * 100) : 0;
              const color = { NORMAL: T.primary, LOW: T.low, HIGH: T.high, CRITICAL: T.critical }[k];
              return (
                <div key={k}>
                  <div className="flex justify-between text-[12px] mb-1" style={{ color: T.inkSoft, fontFamily: FONTS.body }}>
                    <span>{k.charAt(0) + k.slice(1).toLowerCase()}</span>
                    <span style={{ fontFamily: FONTS.mono }}>{n}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.canvasAlt }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setView("upload")}
            className="mt-5 w-full rounded-lg py-2.5 text-[13px] font-semibold flex items-center justify-center gap-2"
            style={{ background: T.primary, color: "#fff", fontFamily: FONTS.body }}
          >
            <UploadCloud size={15} /> Upload a document
          </button>
        </div>
      </div>
    </div>
  );
}
