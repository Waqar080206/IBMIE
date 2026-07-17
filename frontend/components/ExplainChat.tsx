"use client";

import { useState } from "react";
import { MessageCircleHeart, Send, Sparkles } from "lucide-react";
import { T } from "@/lib/tokens";
import { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "What does this mean for me?",
  "Is this urgent?",
  "What should I ask my doctor?",
];

// Lightweight keyword-based demo responder. Wire this to your real
// /api/chat endpoint (backed by the LLM parser) for production use.
function demoReply(question: string, docTitle: string): string {
  const q = question.toLowerCase();
  if (q.includes("urgent") || q.includes("worried") || q.includes("serious")) {
    return "If any value on this report was flagged urgent, you'll see a red banner at the top with next steps. Otherwise, nothing here needs same-day attention — but it's still worth a regular follow-up with your doctor.";
  }
  if (q.includes("doctor") || q.includes("ask")) {
    return "Good questions to bring: what's likely causing the flagged values, whether a repeat test is needed, and whether any diet, activity, or medication changes make sense for you specifically.";
  }
  if (q.includes("mean") || q.includes("what") ) {
    return `In short, this ${docTitle.toLowerCase()} has a few values outside the typical range — see the "Plain-language explanation" tab above for a breakdown of each one. None of this is a diagnosis; think of it as a translation of the numbers.`;
  }
  return "That's a great question for your doctor, who has the full clinical picture. I can help translate the numbers on this report, but I can't interpret symptoms or make a diagnosis.";
}

export default function ExplainChat({ docTitle }: { docTitle: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m0", role: "assistant", text: `Ask me anything about this ${docTitle.toLowerCase()} — I'll explain it in plain language.` },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: demoReply(trimmed, docTitle) };
      setMessages((prev) => [...prev, reply]);
    }, 500);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ background: T.canvasAlt }}>
        <MessageCircleHeart size={16} color={T.coral} />
        <span className="text-[13.5px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Ask about this report</span>
      </div>

      <div className="p-5 flex flex-col gap-3 max-h-80 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed max-w-[85%]"
              style={{
                background: m.role === "user" ? T.primary : T.coralTint,
                color: m.role === "user" ? "#fff" : T.ink,
                fontFamily: "var(--font-body)",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-3 flex gap-2 flex-wrap">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-[11.5px] font-medium rounded-full px-3 py-1.5 flex items-center gap-1"
            style={{ background: T.canvasAlt, color: T.inkSoft, fontFamily: "var(--font-body)" }}
          >
            <Sparkles size={11} color={T.gold} /> {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 px-5 py-4"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question about this report…"
          className="flex-1 bg-transparent outline-none text-[13px]"
          style={{ color: T.ink, fontFamily: "var(--font-body)" }}
        />
        <button type="submit" className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: T.primary }}>
          <Send size={15} color="#fff" />
        </button>
      </form>
    </div>
  );
}
