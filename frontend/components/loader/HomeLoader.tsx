"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Initializing secure workspace...",
  "Encrypting health records...",
  "Analyzing medical documents...",
  "Building your health timeline...",
  "Preparing dashboard...",
];

export default function HomeLoader() {
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [expandReveal, setExpandReveal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const TOTAL_DURATION = 10000;
    const MIN_DELAY = 10000;
    const HARD_TIMEOUT = 11000;

    const fontsReady =
      document.fonts?.ready ?? Promise.resolve();

    const windowReady =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), {
              once: true,
            });
          });

    document.body.style.overflow = "hidden";

    let value = 0;

    const progressInterval = window.setInterval(() => {
      value += 0.5;

      const eased =
        100 * (1 - Math.pow(1 - value / 100, 2.2));

      const p = Math.min(Math.floor(eased), 99);

      setProgress(p);

      setMessageIndex(
        Math.min(
          Math.floor((p / 100) * LOADING_MESSAGES.length),
          LOADING_MESSAGES.length - 1
        )
      );
    }, TOTAL_DURATION / 200);

    Promise.all([
      fontsReady,
      windowReady,
      new Promise((r) => setTimeout(r, MIN_DELAY)),
    ]).then(() => {
      if (cancelled) return;

      clearInterval(progressInterval);

      setProgress(100);

      setTimeout(() => {
        if (!cancelled) setShowLogo(true);
      }, 350);

      setTimeout(() => {
        if (!cancelled) setExpandReveal(true);
      }, 1200);

      setTimeout(() => {
        if (!cancelled) setMounted(false);
      }, 2300);
    });

    const hardTimeout = window.setTimeout(() => {
      if (cancelled) return;

      clearInterval(progressInterval);

      setProgress(100);

      setShowLogo(true);

      setTimeout(() => setExpandReveal(true), 900);
      setTimeout(() => setMounted(false), 2000);
    }, HARD_TIMEOUT);

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
      clearTimeout(hardTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at center,#10342B 0%,#081A17 45%,#050808 100%)",
      }}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[140px]" />

        <div className="absolute left-20 top-20 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl animate-pulse" />

        <div
          className="absolute bottom-16 right-24 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      {/* Expanding Reveal */}
      <div
        className={`absolute left-1/2 top-1/2 rounded-full transition-all duration-[1800ms] ease-out
        ${
          expandReveal
            ? "w-[260vmax] h-[260vmax]"
            : "w-0 h-0"
        }`}
        style={{
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle,  #065F46,#059669)",
          filter: "blur(18px)",
        }}
      />

 
      {/* Main */}
      <div
        className={`relative z-20 flex flex-col items-center transition-all duration-700 ${
          expandReveal
            ? "opacity-0 scale-110"
            : "opacity-100 scale-100"
        }`}
      >
        {/* Logo */}
        <img
          src="/brand/logo.png"
          alt="Vitalis"
          draggable={false}
          className="h-14 w-auto mb-10 select-none"
        />

        {/* Ring */}
        <div className="relative h-40 w-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/10" />

          {!showLogo && (
            <>
              <svg
                className="absolute inset-0 animate-spin"
                viewBox="0 0 100 100"
                style={{
                  animationDuration: "2.4s",
                }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#00935d"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray="175 120"
                />
              </svg>

            </>
          )}

          {/* Center */}
          <div className="relative z-20 flex flex-col items-center">
            {!showLogo ? (
              <>
                <span className="text-4xl font-bold text-white tabular-nums">
                  {progress}
                </span>

                <span className="text-sm text-emerald-300 font-medium">
                  %
                </span>
              </>
            ) : (
              <img
                src="/brand/logoc.png"
                alt="Vitalis"
                className="h-16 w-16 animate-[logoReveal_700ms_ease-out_forwards]"
              />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {!showLogo && (
          <div className="mt-10 w-72">
            <div className="h-[4px] rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient( 90deg,  #064E3B 0%,  #0F766E 45%,  #059669 100%)",
                }}
              />
            </div>
          </div>
        )}

        {/* Status */}
        {!showLogo && (
          <>
            <p className="mt-8 text-white text-lg font-medium">
              {LOADING_MESSAGES[messageIndex]}
            </p>

            <p className="mt-2 text-sm tracking-[0.35em] uppercase text-white/35">
              Vitalis
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-7 right-8 flex items-center gap-4 text-white/60">
        <div className="h-px w-10 bg-white/20" />

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">
            Crafted by
          </p>

          <p className="text-sm font-semibold text-white/80">
            Team Intelligent Engineers
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes logoReveal {
          from {
            opacity: 0;
            transform: scale(0.4) rotate(-90deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}