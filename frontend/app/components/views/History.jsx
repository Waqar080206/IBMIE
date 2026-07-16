import React from "react";
import { Pill, FlaskConical } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import { DOCS } from "../../data/mockDocuments";
import TopBar from "../layout/TopBar";

/** Tabular list of every parsed document, with type, confidence, and status. */
export default function History({ setView }) {
  return (
    <div>
      <TopBar title="Document history" subtitle="Every extraction, with type, confidence, and status" />
      <div className="rounded-xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: T.canvasAlt }}>
              {["Document", "Category", "Date", "Method", "Confidence", ""].map((h) => (
                <th key={h} className="text-[11px] font-semibold tracking-wide px-5 py-3" style={{ color: T.muted, fontFamily: FONTS.body }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCS.map((d) => (
              <tr key={d.id} className="border-t" style={{ borderColor: T.border }}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    {d.type === "prescription" ? <Pill size={15} color={T.primary} /> : <FlaskConical size={15} color={T.primary} />}
                    <span className="text-[13px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>{d.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[12.5px]" style={{ color: T.inkSoft }}>{d.category}</td>
                <td className="px-5 py-3.5 text-[12.5px]" style={{ color: T.inkSoft, fontFamily: FONTS.mono }}>{d.date}</td>
                <td className="px-5 py-3.5 text-[12.5px]" style={{ color: T.inkSoft }}>{d.ocrUsed ? "OCR" : "Digital text"}</td>
                <td className="px-5 py-3.5 text-[12.5px]" style={{ color: T.inkSoft, fontFamily: FONTS.mono }}>{Math.round(d.confidence * 100)}%</td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setView(d.id)} className="text-[12.5px] font-semibold" style={{ color: T.primary }}>
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
