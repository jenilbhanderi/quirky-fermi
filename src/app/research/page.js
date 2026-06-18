import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";

/*
  ═══════════════════════════════════════════════════════════════
  RESEARCH PAGE — /research
  Editorial Lab Style (Static, Minimal, and Scientific)
  ═══════════════════════════════════════════════════════════════
*/

export const metadata = {
  title: "Research Scope & Roadmap",
  description:
    "Explore Hylunian's research direction in transparent display interfaces and our 6-month developmental roadmap. Open science for a self-powered future.",
};

const researchAreas = [
  {
    category: "Materials Science",
    title: "Nanocomposite Active Layers",
    description:
      "Optimizing the crystalline phase and structural alignment of PVDF-TrFE films to achieve peak piezoelectric output under micro-strains, while maintaining transparency in the visible spectrum.",
    metric: "High Clarity",
    metricLabel: "Optical Transmittance Target",
  },
  {
    category: "Energy Harvesting",
    title: "Triboelectric Surface Texturing",
    description:
      "Modeling contact electrification between human skin and engineered polymer layers. Research focuses on micro-patterned geometries to amplify electrostatic induction during swiping gestures.",
    metric: "Maximized",
    metricLabel: "Frictional Charge Yield",
  },
  {
    category: "Device Integration",
    title: "Transparent Electrode Grids",
    description:
      "Evaluating silver nanowire networks and conductive polymer combinations to replace brittle Indium Tin Oxide (ITO). Focus is on routing micro-conductors without creating visual occlusions.",
    metric: "Low Loss",
    metricLabel: "Sheet Resistance Target",
  },
];

const roadmapSteps = [
  {
    phase: "Phase 1 / Months 1–2",
    title: "Material Synthesis & Optical Calibration",
    focus: "Clarity Optimization",
    description:
      "Synthesizing PVDF-TrFE copolymer layers with modified organic additives. The primary objective is to optimize film thicknesses to maximize optical clarity across the visible light spectrum, validating the material composition.",
  },
  {
    phase: "Phase 2 / Months 3–4",
    title: "Signal Conditioning & Energy Management",
    focus: "Collector Circuit Design",
    description:
      "Modeling low-noise charge amplifier interfaces and low-draw power conditioning logic. Focus is on capturing transient voltage spikes and buffering charge with minimal circuit sleep draw.",
  },
  {
    phase: "Phase 3 / Months 5–6",
    title: "Integrated Touch Panel Prototype",
    focus: "System Validation",
    description:
      "Assembling the nanocomposite layer, transparent electrode grid, and display panel into a unified physical stack. The final milestone is a functional touch-activated module demonstrating self-powered telemetry for investor showcases.",
  },
];

export default function ResearchPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-border overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-blueprint opacity-60" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            label="Research"
            title="Research Scope & Roadmap"
            subtitle="We believe the future of self-powered display interfaces must be built on rigorous physics and open collaboration. Rather than rushing products, we are executing a systematic 6-month developmental roadmap."
          />
        </div>
      </section>

      {/* ─── FOCUS AREAS SECTION ─── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <p className="label mb-6">01 / Focus Areas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchAreas.map((area) => (
            <div
              key={area.title}
              className="glass-card p-6 rounded-lg flex flex-col justify-between h-full"
            >
              <div>
                <div className="mb-4">
                  <span className="px-2 py-0.5 rounded bg-primary-light text-primary text-[9px] font-semibold uppercase tracking-wider">
                    {area.category}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-text-primary mb-2">
                  {area.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  {area.description}
                </p>
              </div>
              <div className="pt-4 border-t border-border flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-accent">
                  {area.metric}
                </span>
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider font-semibold">
                  {area.metricLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROADMAP TIMELINE SECTION ─── */}
      <section className="relative py-20 bg-surface-elevated border-t border-b border-border px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="label mb-3">02 / Development Timeline</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
              6-Month Roadmap to Proof-of-Concept
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              We address materials, circuit conditioning, and stack-up lamination milestones sequentially to build a validated demonstrator unit.
            </p>
          </div>

          {/* Minimal Vertical Timeline (Static and Clean) */}
          <div className="relative border-l border-border ml-4 md:ml-6 space-y-12 max-w-3xl">
            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-10">
                {/* Timeline Dot */}
                <span className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-white ring-2 ring-border" />
                
                <div className="glass-card p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3 pb-2 border-b border-border-light">
                    <div>
                      <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-wider">
                        {step.phase}
                      </span>
                      <h3 className="font-display text-base font-bold text-text-primary mt-0.5">
                        {step.title}
                      </h3>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded border border-border bg-background text-[9px] font-mono text-text-secondary font-semibold uppercase shrink-0 self-start md:self-center">
                      Focus: {step.focus}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COLLABORATION SECTION ─── */}
      <section className="relative py-20 px-6 lg:px-8 overflow-hidden bg-background">
        <div className="absolute inset-0 grid-blueprint opacity-20" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="label mb-4">Get Involved</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary mb-4">
            Academic &amp; Industrial Cooperation
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
            We partner with materials research groups, IC designer labs, and display lamination scientists to refine these self-powered interface concepts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="mailto:contact@hylunian.com">
              Contact Research Group
            </Button>
            <Button href="/technology" variant="secondary">
              Review Concept Sheet
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
