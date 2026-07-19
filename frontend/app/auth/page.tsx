import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AuthHero from "@/components/auth/AuthHero";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import EmailAuthForm from "@/components/auth/EmailAuthForm";

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050808] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,.25),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(5,150,105,.15),transparent_40%)]" />

      {/* Top Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:bg-white/10"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <h1 className="text-xl font-semibold tracking-tight">
          Vitalis
        </h1>
      </header>

      {/* Main Content */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-6 md:px-12">

        {/* Left Hero */}
        <AuthHero />

        {/* Right Authentication Card */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="liquid-glass w-full max-w-md rounded-[32px] p-8">

            <div className="mb-8">
              <h2 className="text-3xl font-semibold">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-white/60">
                Sign in to continue to your secure health workspace.
              </p>
            </div>

            <SocialAuthButtons />

            <div className="relative my-8">
              <div className="h-px bg-white/10" />

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050808] px-3 text-xs tracking-wider text-white/40">
                OR
              </span>
            </div>

            <EmailAuthForm />
          </div>
        </div>

      </section>
    </main>
  );
}