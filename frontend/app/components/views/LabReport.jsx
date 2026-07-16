import React, { useMemo } from "react";
import { FlaskConical } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import DocHeader from "./DocHeader";
import StatusPill from "../common/StatusPill";
import MeridianLine from "../common/MeridianLine";

/** Detail view for a lab-report Medical Knowledge Object, grouped by test category. */
export default function LabReport({ doc, setView }) {
  const grouped = useMemo(() => {
    const g = {};
    doc.results.forEach((r) => {
      g[r.category] = g[r.category] || [];
      g[r.category].push(r);
    });
    return g;
  }, [doc]);

  return (
    <div>
      <DocHeader doc={doc} setView={setView} />

      <div className="flex flex-col gap-5">
        {Object.entries(grouped).map(([category, tests]) => (
          <div key={category} className="rounded-xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ background: T.canvasAlt }}>
              <div className="flex items-center gap-2">
                <FlaskConical size={15} color={T.primary} />
                <span className="text-[13.5px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>{category}</span>
              </div>
              <span className="text-[11.5px]" style={{ color: T.muted }}>{tests.length} parameters</span>
            </div>

            <div className="divide-y" style={{ borderColor: T.border }}>
              {tests.map((r) => (
                <div key={r.test_name} className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr_1.4fr] gap-4 md:gap-6 px-5 py-4 items-center">
                  <div>
                    <div className="text-[13.5px] font-medium" style={{ color: T.ink, fontFamily: FONTS.body }}>{r.test_name}</div>
                    <div className="text-[11.5px]" style={{ color: T.muted }}>{r.sample_type}{r.remarks ? ` · ${r.remarks}` : ""}</div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-[16px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.mono }}>
                      {r.value}
                    </span>
                    <span className="text-[12px]" style={{ color: T.muted, fontFamily: FONTS.mono }}>{r.unit}</span>
                    <StatusPill status={r.status} />
                  </div>

                  <MeridianLine value={r.value} low={r.reference_range.low} high={r.reference_range.high} status={r.status} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
