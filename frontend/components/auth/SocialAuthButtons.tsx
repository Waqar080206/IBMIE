"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


import { signInWithGoogle } from "@/lib/auth";

export default function SocialAuthButtons() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    try {
      setLoading(true);
      setError("");

      await signInWithGoogle();

      router.replace("/onboarding");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="
          liquid-glass
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          text-white
          transition-all
          duration-300
          hover:bg-white/10
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Image
          src="/brand/google.svg"
          alt="Google"
          width={20}
          height={20}
        />

        {loading
          ? "Signing in..."
          : "Continue with Google"}
      </button>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

    </div>
  );
}
