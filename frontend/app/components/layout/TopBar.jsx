import React from "react";
import { Search } from "lucide-react";
import { T, FONTS } from "../../styles/theme";

/** Page heading + search bar shown at the top of every main view. */
export default function TopBar({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
      <div>
        <h1 className="text-[22px] font-semibold" style={{ color: T.ink, fontFamily: FONTS.display }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] mt-0.5" style={{ color: T.muted, fontFamily: FONTS.body }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 w-full max-w-xs" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <Search size={15} color={T.muted} />
        <input
          placeholder="Search patients, tests, medicines…"
          className="bg-transparent outline-none text-[13px] w-full"
          style={{ color: T.ink, fontFamily: FONTS.body }}
        />
      </div>
    </div>
  );
}
