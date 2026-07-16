import React from "react";
import { LayoutDashboard, UploadCloud, FolderClock, Fingerprint, Pill, FlaskConical, ShieldCheck } from "lucide-react";
import { T, FONTS } from "../../styles/theme";
import { DOCS } from "../../data/mockDocuments";
import NavItem from "../common/NavItem";

/** Left navigation rail: primary views + recent extractions + trust footer note. */
export default function Sidebar({ view, setView }) {
  return (
    <aside
      className="hidden md:flex flex-col justify-between w-64 shrink-0 p-5"
      style={{ background: T.primary, backgroundImage: `linear-gradient(180deg, ${T.primary}, ${T.primaryDeep})` }}
    >
      <div>
        <div className="flex items-center gap-2.5 px-1 mb-8">
          <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: "rgba(244,246,242,0.14)" }}>
            <Fingerprint size={18} color="#F4F6F2" strokeWidth={2.2} />
          </div>
          <div style={{ fontFamily: FONTS.display }}>
            <div className="text-[15px] font-semibold" style={{ color: "#F4F6F2" }}>Meridian</div>
            <div className="text-[10.5px] tracking-wide" style={{ color: "rgba(244,246,242,0.55)" }}>DOCUMENT INTELLIGENCE</div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <NavItem icon={LayoutDashboard} label="Overview" active={view === "home"} onClick={() => setView("home")} />
          <NavItem icon={UploadCloud} label="Upload document" active={view === "upload"} onClick={() => setView("upload")} />
          <NavItem icon={FolderClock} label="Document history" active={view === "history"} onClick={() => setView("history")} />
        </div>

        <div className="mt-8 px-1 text-[10.5px] font-semibold tracking-wider" style={{ color: "rgba(244,246,242,0.4)" }}>
          RECENT EXTRACTIONS
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {DOCS.map((d) => (
            <button
              key={d.id}
              onClick={() => setView(d.id)}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left"
              style={{ background: view === d.id ? "rgba(244,246,242,0.12)" : "transparent" }}
            >
              {d.type === "prescription" ? (
                <Pill size={14} color="rgba(244,246,242,0.75)" />
              ) : (
                <FlaskConical size={14} color="rgba(244,246,242,0.75)" />
              )}
              <span className="text-[12.5px] truncate" style={{ color: "rgba(244,246,242,0.85)", fontFamily: FONTS.body }}>
                {d.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-3.5" style={{ background: "rgba(244,246,242,0.08)", border: "1px solid rgba(244,246,242,0.14)" }}>
        <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: "#F4F6F2", fontFamily: FONTS.body }}>
          <ShieldCheck size={14} />
          Extraction only
        </div>
        <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "rgba(244,246,242,0.6)" }}>
          This engine structures documents. It does not interpret, diagnose, or recommend treatment.
        </p>
      </div>
    </aside>
  );
}
