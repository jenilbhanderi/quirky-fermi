"use client";

import { useState, useEffect } from "react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("your@email.com|");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Smooth terminal-like cursor blinking effect inside the email field
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => 
        prev.endsWith("|") ? "your@email.com " : "your@email.com|"
      );
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join the waitlist.");
      }

      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-text-primary overflow-hidden flex flex-col justify-between select-none">
      {/* ─── HEADER (0.2 s fade delay) ─── */}
      <header 
        className="relative z-30 w-full flex items-center justify-between px-8 md:px-12 py-6 animate-fade-slow"
        style={{ animationDelay: "0.2s" }}
      >
        <span className="font-display text-lg font-bold tracking-tight text-text-primary">
          Hylunian.
        </span>
      </header>

      {/* ─── DESKTOP ELEMENTS ─── */}
      
      {/* Title (0.5 s fade delay - Moved 60px higher to top-[27%]) */}
      <div 
        className="hidden md:block absolute top-[27%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 w-full text-center px-6 animate-fade-slow"
        style={{ animationDelay: "0.5s" }}
      >
        <h1 
          className="font-display text-[9vw] font-black leading-none text-text-primary tracking-tighter uppercase select-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          Coming Soon
        </h1>
      </div>

      {/* Subtitle (0.7 s fade delay - Explains what's coming soon, letter spacing reduced by ~5% to tracking-[0.09em] for tight layout) */}
      <div 
        className="hidden md:block absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full text-center px-6 animate-fade-slow"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="font-display text-xs md:text-sm font-bold tracking-[0.09em] text-text-primary/70 uppercase">
          Native intelligence for enterprises.
        </p>
      </div>

      {/* ─── BACKGROUND LAYER: ORANGE CORE (1.0 s fade delay) ─── */}
      <div className="absolute bottom-[calc(0vh-55vw)] md:bottom-[calc(11vh-60vw)] left-1/2 -translate-x-1/2 w-[110vw] md:w-[120vw] h-[110vw] md:h-[120vw] pointer-events-none z-0 aspect-square">
        {/* Soft entry fade */}
        <div className="w-full h-full animate-fade-slow" style={{ animationDelay: "1.0s" }}>
          {/* Looping ambient slow sunrise core breathing animation (scale 1.0 to 1.015 over 18s) */}
          <div 
            className="w-full h-full rounded-full animate-glow-breath" 
            style={{ 
              filter: "blur(35px)", 
              opacity: 0.90,
              background: "radial-gradient(circle, #FF6F28 0%, #FFA24A 30%, #FFE2B7 60%, rgba(229, 233, 248, 0) 80%)"
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ─── FOREGROUND OVERLAY: GLASS DISTORTION SPHERE (1.0 s fade delay) ─── */}
      <div className="absolute bottom-[calc(48vh-200vw)] md:bottom-[calc(60vh-220vw)] left-1/2 -translate-x-1/2 w-[200vw] md:w-[220vw] h-[200vw] md:h-[220vw] pointer-events-none z-10 aspect-square">
        {/* Soft entry fade */}
        <div className="w-full h-full animate-fade-slow" style={{ animationDelay: "1.0s" }}>
          {/* Static high-fidelity glass dome element */}
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              backgroundImage: "radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(125, 146, 255, 0.03) 75%, rgba(45, 4, 27, 0.04) 100%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E\")",
              backgroundSize: "cover, 120px 120px",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              boxShadow: `
                inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
                inset 0 25px 40px rgba(255, 255, 255, 0.65), 
                inset -20px -20px 50px rgba(125, 146, 255, 0.12), 
                inset 20px 20px 50px rgba(255, 111, 40, 0.10), 
                inset 0 0 40px rgba(255, 255, 255, 0.2),
                0 0 40px rgba(255, 255, 255, 0.25), 
                0 0 100px rgba(255, 111, 40, 0.22), 
                0 35px 70px rgba(45, 4, 27, 0.03)
              `,
              backdropFilter: "blur(32px) saturate(1.8) contrast(1.1)",
              WebkitBackdropFilter: "blur(32px) saturate(1.8) contrast(1.1)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Bottom Left: Email subscribe input bar (1.2 s fade delay) */}
      <div 
        className="hidden md:block absolute left-[8%] bottom-[8%] z-20 text-left w-full max-w-[280px] pointer-events-auto animate-fade-slow"
        style={{ animationDelay: "1.2s" }}
      >
        {submitted ? (
          <div className="py-1 animate-fade-in">
            <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider block">
              ✓ CONNECTION ESTABLISHED
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col w-full">
            <span className="text-[11px] font-bold text-text-primary/80 font-mono uppercase tracking-[0.12em] mb-2 block">
              Join the waitlist
            </span>
            <div className="flex items-center gap-2 border-b border-text-primary/35 focus-within:border-text-primary/70 transition-colors py-1">
              <input 
                type="email" 
                required 
                disabled={isSubmitting}
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-mono font-semibold text-text-primary placeholder-text-primary/35 w-full disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="text-xs font-mono uppercase font-bold text-text-primary/90 hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? "..." : "JOIN"}
              </button>
            </div>
            {error && (
              <span className="text-[10px] font-mono font-semibold text-red-500 uppercase tracking-wider mt-2 block animate-fade-in">
                {error}
              </span>
            )}
          </form>
        )}
      </div>

      {/* Bottom Right: Copyright (1.2 s fade delay) */}
      <div 
        className="hidden md:block absolute right-[8%] bottom-[8%] z-20 text-right pointer-events-auto animate-fade-slow"
        style={{ animationDelay: "1.2s" }}
      >
        <p className="text-[11px] font-mono font-bold text-text-primary/80 uppercase tracking-wider">
          © {new Date().getFullYear()} HYLUNIAN AI.
        </p>
      </div>

      {/* ─── MOBILE VERSION ─── */}
      <main className="md:hidden relative z-20 flex flex-col items-center justify-center flex-1 py-12 px-6 text-center">
        {/* Title (0.5 s fade delay) */}
        <h1 
          className="font-display text-[13vw] font-black leading-none text-text-primary tracking-tighter uppercase select-none mb-4 animate-fade-slow"
          style={{ letterSpacing: "-0.04em", animationDelay: "0.5s" }}
        >
          Coming Soon
        </h1>

        {/* Subtitle (0.7 s fade delay - Letter spacing reduced by ~5% to tracking-[0.09em]) */}
        <p 
          className="text-xs font-display font-bold tracking-[0.09em] text-text-primary/70 uppercase mb-16 animate-fade-slow"
          style={{ animationDelay: "0.7s" }}
        >
          Native intelligence for enterprises.
        </p>

        {/* Ultra-minimalist Email Waitlist (1.2 s fade delay) */}
        <div 
          className="w-full max-w-[280px] mx-auto mt-4 text-center animate-fade-slow"
          style={{ animationDelay: "1.2s" }}
        >
          {submitted ? (
            <div className="py-2 animate-fade-in">
              <span className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider block">
                ✓ CONNECTION ESTABLISHED
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col w-full">
              <span className="text-[11px] font-bold text-text-primary/80 font-mono uppercase tracking-[0.12em] mb-2 block">
                Join the waitlist
              </span>
              <div className="flex items-center gap-2 border-b border-text-primary/35 focus-within:border-text-primary/70 transition-colors py-1.5">
                <input 
                  type="email" 
                  required 
                  disabled={isSubmitting}
                  placeholder={placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-mono font-semibold text-text-primary placeholder-text-primary/35 w-full text-center disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="text-xs font-mono uppercase font-bold text-text-primary/90 hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "JOIN"}
                </button>
              </div>
              {error && (
                <span className="text-[10px] font-mono font-semibold text-red-500 uppercase tracking-wider mt-2 block text-center animate-fade-in">
                  {error}
                </span>
              )}
            </form>
          )}
        </div>
      </main>

      {/* ─── MOBILE FOOTER (1.2 s fade delay) ─── */}
      <footer 
        className="md:hidden relative z-20 w-full flex flex-col items-center py-6 text-center border-t border-border/5 animate-fade-slow"
        style={{ animationDelay: "1.2s" }}
      >
        <p className="text-[11px] font-mono font-bold text-text-primary/80 uppercase tracking-wider">
          © {new Date().getFullYear()} HYLUNIAN AI.
        </p>
      </footer>
    </div>
  );
}
