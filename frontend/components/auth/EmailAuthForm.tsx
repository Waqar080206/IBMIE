
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

import {
  signUpWithEmail,
  loginWithEmail,
} from "@/lib/auth";

export default function EmailAuthForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">(
    "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim();

      if (mode === "signup") {
        await signUpWithEmail(cleanEmail, password);

        router.push("/onboarding");
      } else {
        await loginWithEmail(cleanEmail, password);

        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      {/* Mode Switch */}

      <div className="mb-6 flex rounded-2xl border border-white/10 bg-white/5 p-1">

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setMode("login");
            setError("");
          }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            mode === "login"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setMode("signup");
            setError("");
          }}
          className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
            mode === "signup"
              ? "bg-white text-black"
              : "text-white/60 hover:text-white"
          }`}
        >
          Sign Up
        </button>

      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Email
          </label>

          <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">

            <Mail
              className="text-white/40"
              size={18}
            />

            <input
              type="email"
              required
              disabled={loading}
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              className="
                h-14
                w-full
                bg-transparent
                px-3
                text-white
                placeholder:text-white/30
                outline-none
                disabled:opacity-50
              "
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm text-white/70">
            Password
          </label>

          <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4">

            <Lock
              className="text-white/40"
              size={18}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              minLength={6}
              disabled={loading}
              autoComplete={
                mode === "signup"
                  ? "new-password"
                  : "current-password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              className="
                h-14
                w-full
                bg-transparent
                px-3
                text-white
                placeholder:text-white/30
                outline-none
                disabled:opacity-50
              "
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="text-white/40 transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="
            liquid-glass
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            text-sm
            font-medium
            text-white
            transition-all
            duration-300
            hover:bg-white/10
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
            ? "Create Account"
            : "Sign In"}

          {!loading && (
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>

      </form>
    </div>
  );
}
