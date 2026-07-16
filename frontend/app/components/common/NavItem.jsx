import React from "react";
import { FONTS } from "../../styles/theme";

/** Single clickable row inside the sidebar navigation. */
export default function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
      style={{
        background: active ? "#123D38" : "transparent",
        color: active ? "#F4F6F2" : "rgba(244,246,242,0.72)",
        fontFamily: FONTS.body,
        fontWeight: active ? 600 : 500,
      }}
    >
      <Icon size={17} strokeWidth={2} />
      {label}
    </button>
  );
}
