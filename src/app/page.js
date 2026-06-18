"use client";

/*
  ═══════════════════════════════════════════════════════════════
   EDITORIAL LAB HOMEPAGE

   This is a clean, minimal scientific journal-style layout.
   No animations, no mouse-tracking grids, and no sandbox.
   Clean typography, draftsman grids, and high-end print look.
  ═══════════════════════════════════════════════════════════════
*/

import Link from "next/link";
import Button from "@/components/Button";

/* ─── Static Feature Card (Tactile Flat Offset Card) ─── */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card p-8 rounded-lg flex flex-col justify-between h-full">
      <div>
        <div className="w-12 h-12 rounded bg-primary-light flex items-center justify-center mb-6 text-primary">
          {icon}
        </div>
        <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Static Application Card (Flat Offset Card) ─── */
function ApplicationCard({ category, title, description, borderAccent }) {
  return (
    <div className="glass-card p-8 rounded-lg flex flex-col justify-between h-full relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ backgroundColor: borderAccent }} 
      />
      <div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold block mb-3">
          {category}
        </span>
        <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Flat Scientific Diagram (Draftsman Blueprint Style) ─── */
function TechLayerBlueprint() {
  const layers = [
    { name: "Protective Overlay", material: "Textured PDMS", optic: "High Transmittance", role: "Triboelectric Friction Interface" },
    { name: "Top Electrode Grid", material: "AgNW Network", optic: "Optically Transparent", role: "Charge Collection Grid Array" },
    { name: "Active Copolymer Layer", material: "PVDF-TrFE", optic: "High Transmittance", role: "Piezoelectric Crystalline Transducer" },
    { name: "Decoupling Elastomer", material: "Index-Matched Polymer", optic: "Optically Clear", role: "Electrical Isolation & Shear Relief" },
    { name: "Substrate Panel", material: "OLED/LCD Emissive Matrix", optic: "Active Display", role: "Display Substrate Layer" },
  ];

  return (
    <div className="glass-card p-6 md:p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <div>
          <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-semibold block">
            Figure 1.1 / Stack Schematic
          </span>
          <h3 className="font-display text-md font-bold text-text-primary mt-1">
            Display Lamination Cross-Section
          </h3>
        </div>
        <span className="font-mono text-[9px] text-text-muted border border-border px-2 py-0.5 bg-background rounded">
          Scale: Conceptual
        </span>
      </div>

      <div className="space-y-4">
        {layers.map((layer, idx) => (
          <div 
            key={idx} 
            className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border bg-background/50 rounded relative group hover:border-primary transition-colors"
          >
            {/* Index Label */}
            <div className="font-mono text-[10px] text-text-muted font-bold shrink-0">
              [0{idx + 1}]
            </div>

            {/* Simulated cross section sheet bar */}
            <div className="w-full md:w-32 h-3.5 bg-surface border border-border relative rounded overflow-hidden shrink-0">
              <div 
                className="absolute inset-0 bg-primary opacity-[0.08]" 
                style={{ opacity: 0.25 - idx * 0.04 }} 
              />
              {idx === 2 && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-accent opacity-60" />
              )}
            </div>

            {/* Layer Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-sm font-semibold text-text-primary">
                  {layer.name}
                </span>
                <span className="font-mono text-[9px] text-text-muted">
                  ({layer.material})
                </span>
              </div>
              <p className="font-mono text-[9px] text-text-muted mt-0.5 uppercase tracking-wider">
                {layer.role}
              </p>
            </div>

            {/* Technical Parameters */}
            <div className="shrink-0 text-right md:self-center">
              <div className="px-2 py-1 bg-white border border-border rounded text-center">
                <span className="font-mono text-[8px] text-text-muted leading-none uppercase block mb-0.5">Optics</span>
                <span className="font-mono text-[9px] font-semibold text-text-primary uppercase">{layer.optic}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <p className="font-mono text-[8px] text-text-muted max-w-lg leading-relaxed">
          * PVDF-TrFE: Poly(vinylidene fluoride-co-trifluoroethylene). AgNW: Silver Nanowire.
        </p>
        <span className="font-mono text-[8px] text-accent font-semibold uppercase tracking-widest">
          Hylunian R&D Lamination Stack
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background border-b border-border">
        {/* Background draftsman grid */}
        <div className="absolute inset-0 grid-blueprint opacity-[0.7]" aria-hidden="true" />
        
        {/* Structural draftsman hairline guides */}
        <div className="absolute inset-y-0 left-12 w-[1px] bg-border/40" />
        <div className="absolute inset-y-0 right-12 w-[1px] bg-border/40" />
        <div className="absolute inset-x-0 top-32 h-[1px] bg-border/40" />

        {/* Gradient rising from the bottom */}
        <div 
          className="absolute inset-x-0 bottom-0 h-96 pointer-events-none" 
          style={{ background: "linear-gradient(to top, rgba(30, 86, 219, 0.32) 0%, rgba(16, 185, 129, 0.14) 50%, rgba(255, 255, 255, 0) 100%)" }}
          aria-hidden="true" 
        />

        {/* Static page content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-24 pb-16">
          {/* Scientific Stage Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border bg-white mb-8 shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
              Research Specification R-03
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary mb-8 leading-[1.05] max-w-4xl mx-auto">
            Display that
            <br />
            <span className="gradient-text">gives back.</span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10">
            We are researching transparent piezoelectric and triboelectric lamination layers designed to convert mechanical finger pressure and friction into self-sustaining power for next-generation displays.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/technology" variant="primary">
              Explore Stack Configuration
            </Button>
            <Button href="/research" variant="secondary">
              Review Research Timeline
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ THREE CORE INNOVATIONS ═══ */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="label mb-4">Core Principles</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
              Three physical mechanics
            </h2>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
              Our research targets the integration of mechanical polarization, static contact charges, and light transmission in a single thin-film stacked device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
              title="Piezoelectric Potential"
              description="Slight mechanical compression of the PVDF-TrFE copolymer layer deforms its crystalline structure, polarizing charges and inducing measurable voltages."
            />
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              }
              title="Triboelectric Friction"
              description="Contact electrification captures electrical charge generated by skin friction sliding across micro-structured top polymer layers during touch interactions."
            />
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
              title="Transmittance Optics"
              description="We refine chemical layering and match material refractive indexes to achieve high visible transmittance, preventing display haze and discoloration."
            />
          </div>
        </div>
      </section>

      {/* ═══ APPLICATIONS ═══ */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 bg-surface-elevated border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="label mb-4">Commercial Targets</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
              Real-world application vectors
            </h2>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
              By collecting wasted kinetic energy directly from interface inputs, we aim to augment secondary power cells and extend longevity in massive global markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ApplicationCard
              category="01 / Portable Wearables"
              title="Device Longevity Augmentation"
              description="Integrating harvesting layers behind capacitive panels on smartwatches to capture frequent screen interaction energy, extending active battery cycle runtimes."
              borderAccent="var(--color-primary)"
            />
            <ApplicationCard
              category="02 / Public Infrastructure"
              title="Self-Powered Kiosk Terminals"
              description="Developing touch lamination films for public terminals, ticketing gates, and smart building interfaces that power local micro-controllers from visitor usage."
              borderAccent="var(--color-accent)"
            />
            <ApplicationCard
              category="03 / Industrial Logistics"
              title="Battery-Free Screen Modules"
              description="Enabling zero-maintenance status displays and passive telemetry tags in automotive controls that harvest operating power from driver interactions."
              borderAccent="var(--color-primary)"
            />
          </div>
        </div>
      </section>

      {/* ═══ TECHNOLOGY DIAGRAM OVERVIEW ═══ */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Details Column */}
          <div className="lg:col-span-5">
            <p className="label mb-4">Architecture</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-6">
              Engineering the active display stack
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
              The Hylunian display stack is assembled with multiple transparent films overlaying a standard emissive matrix panel. Frictional electrostatic charges and piezoelectric polarization are collected via silver nanowire (AgNW) electrodes.
            </p>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8">
              A index-matched decoupling elastomer absorbs physical shear stress and isolates electric charge fields, keeping the entire lamination structurally stable and transparent.
            </p>
            <Button href="/technology" variant="primary">
              Read Technology Details
            </Button>
          </div>

          {/* Diagram Column */}
          <div className="lg:col-span-7">
            <TechLayerBlueprint />
          </div>
        </div>
      </section>

      {/* ═══ BRIEFING UPDATE CTA ═══ */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 bg-surface-elevated overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label mb-4">Briefings</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-6">
            Stay aligned with our R&D roadmap
          </h2>
          <p className="text-base text-text-secondary leading-relaxed mb-10 max-w-xl mx-auto">
            We publish progress summaries detailing materials calibration, lamination testing, and proof-of-concept prototype milestones.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="mailto:contact@hylunian.com" variant="secondary">
              Direct Contact
            </Button>
            <Button href="/about" variant="ghost">
              About Our Initiative
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
