"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import {
  CircleUserRound,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      title: "Features",
      href: "#features",
    },
    {
      title: "How It Works",
      href: "#how",
    },
    {
      title: "Privacy",
      href: "#privacy",
    },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-[Inter]">

      {/* ========================= */}
      {/* Background Video */}
      {/* ========================= */}

    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-0">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="
      h-[100vh]
      w-auto
      object-contain
    "
  >
    <source src="/videos/anatomy1.mp4" type="video/mp4" />
  </video>
</div>
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/60" />

      {/* Emerald Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f766e33,transparent_60%)]" />

      {/* ========================= */}
      {/* Navigation */}
      {/* ========================= */}

      <nav
        className="
        relative
        z-20
        flex
        items-center
        justify-between

        px-5
        pt-6

        sm:px-8
        sm:pt-8

        md:px-16

        lg:px-20
      "
      >
        {/* Logo */}

       <div className="flex items-center gap-3">
  <Image
    src="/brand/logoc.png"
    alt="Vitalis Logo"
    width={36}
    height={36}
    className="shrink-0"
    priority
  />

  <span className="text-xl font-semibold tracking-tight text-white">
    Vitalis
  </span>
</div>
        {/* Desktop Nav */}

        <div
          className="
            liquid-glass
            hidden
            rounded-full
            px-8
            py-3

            md:flex
            md:items-center
            md:gap-10
          "
        >
          {navItems.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              className={`text-sm transition-opacity duration-300 ${
                i === 0
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Desktop Avatar */}

        <button
          className="
            liquid-glass
            hidden

            h-10
            w-10
            items-center
            justify-center
            rounded-full

            md:flex
          "
        >
          <CircleUserRound
            className="h-5 w-5 text-white/80"
            strokeWidth={1.5}
          />
        </button>

        {/* Mobile */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            liquid-glass

            relative
            flex

            h-10
            w-10

            items-center
            justify-center

            rounded-full

            md:hidden
          "
        >
          <Menu
            className={`
              absolute
              h-5
              w-5
              text-white
              transition-all
              duration-300

              ${
                menuOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }
            `}
          />

          <X
            className={`
              absolute
              h-5
              w-5
              text-white
              transition-all
              duration-300

              ${
                menuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }
            `}
          />
        </button>
      </nav>

      {/* ==================================================== */}
      {/* Remaining Sections */}
      {/* ==================================================== */}

      <main
        className={`
          relative
          z-10
          flex
          h-[calc(100vh-84px)]
          flex-col
          justify-between
          transition-all
          duration-500

          ${
            menuOpen
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
        `}
      >
        {/* Hero content comes in Part 2 */}
        <div
  className="
    flex
    flex-1
    items-center

    px-5

    sm:px-8

    md:px-16

    lg:px-20
  "
>
  <div
    className="
      max-w-3xl

      mt-14

      sm:mt-20

      md:mt-28
    "
  >
    {/* ================================= */}
    {/* Badge */}
    {/* ================================= */}

    <div
      className="
        liquid-glass

        inline-flex
        items-center
        gap-3

        rounded-full

        px-3
        py-1.5

        sm:px-4
        sm:py-2

        mb-6
      "
    >
      <div className="flex -space-x-2">

        <img
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
          className="h-6 w-6 rounded-full border-2 border-white/20 object-cover"
          alt=""
        />

        <img
          src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
          className="h-6 w-6 rounded-full border-2 border-white/20 object-cover"
          alt=""
        />

        <img
          src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
          className="h-6 w-6 rounded-full border-2 border-white/20 object-cover"
          alt=""
        />

        <img
          src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100"
          className="h-6 w-6 rounded-full border-2 border-white/20 object-cover"
          alt=""
        />

      </div>

      <span
        className="
          text-xs

          sm:text-sm

          font-light

          text-white/80
        "
      >
        Trusted by students, families & healthcare professionals
      </span>
    </div>

    {/* ================================= */}
    {/* Heading */}
    {/* ================================= */}

    <h1
      className="
        text-5xl

        sm:text-6xl

        md:text-7xl

        lg:text-8xl

        leading-[0.95]

        font-semibold

        tracking-[-0.05em]

        text-white
      "
    >
      Your Health.
      <br />
      Finally Organized.
    </h1>

    {/* ================================= */}
    {/* Subtitle */}
    {/* ================================= */}

    <p
      className="
        mt-6

        max-w-2xl

        text-base

        sm:text-lg

        md:text-xl

        leading-relaxed

        text-white/70
      "
    >
      Upload prescriptions, lab reports and medical
      documents.

      <br />

      Vitalis transforms scattered PDFs into a searchable,
      AI-powered health workspace built for lifelong care.
    </p>

    {/* ================================= */}
    {/* Buttons */}
    {/* ================================= */}

        <div
  className="
    mt-10
    flex
    flex-wrap
    items-center
    gap-4
  "
>
  <Link href="/auth">
    <button
      className="
        liquid-glass
        group
        flex
        items-center
        gap-2

        rounded-full

        px-7
        py-3.5

        text-sm
        font-medium
        text-white

        transition-all
        duration-300

        hover:scale-[1.03]
        hover:bg-white/10
      "
    >
      <span>Sign In / Up</span>

      <ArrowUpRight
        className="
          h-4
          w-4
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
        strokeWidth={2}
      />
    </button>
  </Link>
</div>

    </div>

   
  </div>

      </main>

      {/* Mobile Menu comes in Part 3 */}
        {/* ========================================= */}
{/* Mobile Menu Overlay */}
{/* ========================================= */}

<div
  className={`
    fixed
    inset-0
    z-10
    flex
    items-center
    justify-center
    bg-black/80
    backdrop-blur-xl
    transition-all
    duration-500
    ease-out
    md:hidden

    ${
      menuOpen
        ? "pointer-events-auto opacity-100"
        : "pointer-events-none opacity-0"
    }
  `}
>
  <div
    className={`
      flex
      flex-col
      items-center
      gap-8
      transition-all
      duration-500

      ${
        menuOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-8 opacity-0"
      }
    `}
  >
    {/* Navigation Links */}

    {navItems.map((item) => (
      <a
        key={item.title}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        className="
          text-2xl
          font-medium
          tracking-tight
          text-white
          transition-all
          duration-300
          hover:opacity-70
        "
      >
        {item.title}
      </a>
    ))}

    {/* Divider */}

    <div className="h-px w-24 bg-white/10" />

    {/* Account */}

    <button
      className="
        liquid-glass
        flex
        flex-col
        items-center
        gap-4
        rounded-3xl
        px-8
        py-6
      "
    >
      <div
        className="
          liquid-glass
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
        "
      >
        <CircleUserRound
          className="h-8 w-8 text-white/80"
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-white">
          Account
        </p>

        <p className="mt-1 text-sm font-light text-white/60">
          Sign in to access your health workspace
        </p>
      </div>
    </button>

    {/* CTA */}

    <button
      className="
        liquid-glass
        mt-2
        rounded-full
        px-8
        py-3
        text-sm
        font-medium
        text-white
        transition-all
        duration-300
        hover:bg-white/10
      "
    >
      Get Started
    </button>
  </div>
</div>
    </section>
  );
}