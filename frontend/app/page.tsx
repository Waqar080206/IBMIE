"use client";
import React, { useMemo, useState } from "react";
import { T, FONT_IMPORT } from "./styles/theme";
import { DOCS } from "./data/mockDocuments";

import Sidebar from "./components/layout/Sidebar";
import Home from "./components/views/Home";
import Upload from "./components/views/Upload";
import History from "./components/views/History";
import LabReport from "./components/views/LabReport";
import Prescription from "./components/views/Prescription";

/**
 * App shell: owns the current "view" (home / upload / history / a document id)
 * and renders the matching screen. All presentation lives in ./components,
 * all mock data lives in ./data.
 */
export default function App() {
  const [view, setView] = useState("home");
  const docsById = useMemo(() => Object.fromEntries(DOCS.map((d) => [d.id, d])), []);

  let content;
  if (view === "home") content = <Home setView={setView} />;
  else if (view === "upload") content = <Upload setView={setView} />;
  else if (view === "history") content = <History setView={setView} />;
  else if (docsById[view]) {
    const doc = docsById[view];
    content = doc.type === "prescription" ? <Prescription doc={doc} setView={setView} /> : <LabReport doc={doc} setView={setView} />;
  } else content = <Home setView={setView} />;

  return (
    <div className="w-full min-h-screen flex" style={{ background: T.canvas }}>
      <style>{FONT_IMPORT}</style>
      <Sidebar view={view} setView={setView} />
      <main className="flex-1 p-6 md:p-9 max-w-6xl mx-auto w-full">{content}</main>
    </div>
  );
}
