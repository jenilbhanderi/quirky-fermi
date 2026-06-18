"use client";

/*
  ═══════════════════════════════════════════════════════════════
  NAVBAR COMPONENT

  "use client" directive:
  Next.js has two types of components:
  - Server Components (default): Rendered on the server, sent as HTML.
    Good for static content. Can't use useState, onClick, etc.
  - Client Components ("use client"): Rendered in the browser.
    Required when you need interactivity (click handlers, state).

  We need "use client" here because:
  1. useState for mobile menu open/close
  2. usePathname to highlight the current page link
  3. onClick handlers for the hamburger menu
  ═══════════════════════════════════════════════════════════════
*/

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  NAV LINKS ARRAY
  Each object = one link in the navigation.
  We define them as data so we can loop over them (DRY principle).
*/
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/technology", label: "Technology" },
  { href: "/research", label: "Research" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // Returns current URL path, e.g. "/about"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ─── Logo (Wordmark) ─── */}
        <Link href="/" className="group flex items-center">
          <span className="font-display text-xl font-bold tracking-tight gradient-text">
            Hylunian.
          </span>
        </Link>

        {/* ─── Desktop Navigation ─── */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            /*
              Check if this link is the current page.
              Special case for "/" — only match exactly (not "/about", "/technology").
            */
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ─── Status Badge (Desktop) ─── */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded border border-border bg-surface-elevated">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary font-semibold">
            R&D Status: Phase 1
          </span>
        </div>

        {/* ─── Mobile Hamburger Button ─── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {/*
            Hamburger → X animation using CSS transforms.
            Three lines that morph into an X when mobileOpen is true.
          */}
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span
              className={`block h-0.5 w-5 bg-text-primary rounded-full transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-primary rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text-primary rounded-full transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* ─── Mobile Menu (slides down) ─── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 pt-2 border-t border-border-light space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
