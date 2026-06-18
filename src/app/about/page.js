import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";

/*
  ═══════════════════════════════════════════════════════════════
  ABOUT PAGE — /about
  Editorial Lab Style
  ═══════════════════════════════════════════════════════════════
*/

export const metadata = {
  title: "About",
  description:
    "Learn about Hylunian — an independent research initiative pioneering transparent piezoelectric and triboelectric (TENG) display interfaces that convert touch energy into electrical power.",
};

const values = [
  {
    title: "Open Research",
    description:
      "We publish findings, share methodologies, and believe transparency accelerates breakthroughs. Science moves faster when knowledge flows freely.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M16 4v24M4 16h24M8 8l16 16M24 8L8 24" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: "Rapid Prototyping",
    description:
      "Move from hypothesis to hardware in days, not months. Iteration speed is our competitive advantage — every failed prototype is a data point.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="4" y="4" width="10" height="10" rx="1" />
        <rect x="18" y="18" width="10" height="10" rx="1" />
        <path d="M14 9h4M9 14v4M18 23h-4M23 18v-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "First Principles",
    description:
      "We decompose every problem to its fundamental truths before building up. No assumptions inherited — only physics and evidence.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <polygon points="16,4 28,24 4,24" strokeLinejoin="round" />
        <line x1="16" y1="12" x2="16" y2="18" strokeLinecap="round" />
        <circle cx="16" cy="21" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Quantitative Rigor",
    description:
      "From energy output metrics to material thickness — we share the real numbers. Investors and collaborators deserve complete visibility.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="16" cy="16" r="11" />
        <circle cx="16" cy="16" r="6" opacity="0.6" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <article className="relative bg-background min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-border overflow-hidden">
        {/* Background draftsman grid */}
        <div className="absolute inset-0 grid-blueprint opacity-60" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label mb-4">About</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-text-primary max-w-4xl">
            About Hylunian
          </h1>
          <p className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
            An independent research initiative exploring the physics of self-powered display technology — where every touch generates electrical potential.
          </p>
        </div>
      </section>

      {/* ─── MISSION SECTION ─── */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden bg-surface-elevated">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text column */}
            <div>
              <SectionHeader
                label="01 / Mission"
                title="Capturing user touch energy"
                subtitle="We build transparent piezoelectric and triboelectric display overlay structures to harvest electrical power from device input interaction."
              />
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
                Every day, billions of human fingers tap and swipe on mobile screens, dissipating kinetic energy as structural micro-vibrations and heat. Hylunian researches polymer lamination techniques to capture this kinetic energy and convert it to electrical currents.
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                By combining transparent piezoelectric copolymer films with friction-active triboelectric nanogenerator (TENG) networks, we aim to design zero-loss overlay laminates that function silently and invisibly.
              </p>
            </div>

            {/* Scientific Figure: Dipole Cell Schematic */}
            <div className="glass-card p-6 rounded-lg max-w-md mx-auto w-full">
              <div className="border-b border-border pb-3 mb-4 flex justify-between items-center">
                <span className="font-mono text-[9px] text-accent font-semibold uppercase tracking-wider">
                  Figure 1.2 / Molecular Model
                </span>
                <span className="font-mono text-[8px] text-text-muted">Lattice Strain</span>
              </div>
              
              <div className="aspect-[4/3] relative flex items-center justify-center bg-background rounded border border-border p-4">
                {/* SVG Lattice Schematic */}
                <svg width="100%" height="100%" viewBox="0 0 240 180" fill="none" className="text-text-primary">
                  {/* Grid background inside SVG */}
                  <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(20,22,25,0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#smallGrid)" />

                  {/* Draw unit cell borders */}
                  <rect x="50" y="40" width="140" height="100" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Force strain arrows */}
                  <path d="M120 15v15M120 30l-4-4M120 30l4-4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M120 165v-15M120 150l-4 4M120 150l4 4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
                  <text x="128" y="24" className="font-mono text-[9px] fill-accent font-semibold">Force (F)</text>
                  
                  {/* Lattice Nodes (Cations & Anions) */}
                  {/* Top Cations */}
                  <circle cx="50" cy="40" r="6" fill="var(--color-primary)" />
                  <text x="50" y="43" textAnchor="middle" className="font-mono text-[7px] fill-white font-bold">+</text>
                  
                  <circle cx="190" cy="40" r="6" fill="var(--color-primary)" />
                  <text x="190" y="43" textAnchor="middle" className="font-mono text-[7px] fill-white font-bold">+</text>

                  {/* Bottom Cations */}
                  <circle cx="50" cy="140" r="6" fill="var(--color-primary)" />
                  <text x="50" y="143" textAnchor="middle" className="font-mono text-[7px] fill-white font-bold">+</text>

                  <circle cx="190" cy="140" r="6" fill="var(--color-primary)" />
                  <text x="190" y="143" textAnchor="middle" className="font-mono text-[7px] fill-white font-bold">+</text>

                  {/* Polarized Anion (Displaced Center) */}
                  <circle cx="120" cy="102" r="10" fill="var(--color-accent)" stroke="white" strokeWidth="1" />
                  <text x="120" y="105" textAnchor="middle" className="font-mono text-[9px] fill-white font-bold">-</text>

                  {/* Dipole Direction Arrow */}
                  <path d="M120 85v-15M117 74l3-4M123 74l-3-4" stroke="var(--color-primary)" strokeWidth="1.2" />
                  <text x="126" y="77" className="font-mono text-[8px] fill-primary font-bold">Dipole P</text>
                  
                  {/* Annotations */}
                  <line x1="50" y1="40" x2="120" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                  <line x1="190" y1="40" x2="120" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                  <line x1="50" y1="140" x2="120" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                  <line x1="190" y1="140" x2="120" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                </svg>
              </div>
              <p className="font-mono text-[8px] text-text-muted mt-3 leading-relaxed">
                Diagram illustrates PVDF polymer dipole polarization vector shifting under mechanical lamination stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES SECTION ─── */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            label="02 / Values"
            title="Operational constraints we prioritize"
            subtitle="Our research principles steer clear of typical tech generalizations, focusing entirely on evidence and mechanical precision."
            centered
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="glass-card p-6 rounded-lg flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-primary-light text-primary flex items-center justify-center mb-5">
                    {value.icon}
                  </div>
                  <p className="font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">
                    Parameter 0{index + 1}
                  </p>
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative py-20 px-6 lg:px-8 bg-surface-elevated overflow-hidden text-center">
        <div className="absolute inset-0 grid-blueprint opacity-30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
            Curious about our research?
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Review our stack calculations, material parameters, and 6-month prototype validation roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/technology">
              Explore Technology
            </Button>
            <Button href="/research" variant="secondary">
              View Research Roadmap
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
