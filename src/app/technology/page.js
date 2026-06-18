import SectionHeader from "@/components/SectionHeader";
import Button from "@/components/Button";

/*
  ═══════════════════════════════════════════════════════════════
  TECHNOLOGY PAGE — /technology
  Editorial Lab Style (Static, Minimal, and Scientific)
  ═══════════════════════════════════════════════════════════════
*/

export const metadata = {
  title: "Technology Concept",
  description:
    "Discover Hylunian's research in transparent display interfaces. Conceptualizing systems that combine piezoelectric and triboelectric layers to harvest kinetic touch energy.",
};

const layers = [
  {
    id: "touch",
    label: "01 / Protective Friction Overlay",
    subtitle: "Micro-textured Polydimethylsiloxane (PDMS)",
    role: "Provides high-durability contact charging surface for triboelectric induction.",
    optic: "High Transmittance",
  },
  {
    id: "electrode-top",
    label: "02 / Collector Grid Interface",
    subtitle: "Silver Nanowire (AgNW) Mesh Array",
    role: "Collects induced surface electrostatic charge with high electrical conductivity.",
    optic: "Optically Transparent",
  },
  {
    id: "active",
    label: "03 / Piezoelectric copolymer",
    subtitle: "Poly(vinylidene fluoride-co-trifluoroethylene) (PVDF-TrFE)",
    role: "Crystalline polymer layer polarizing under compressive mechanical strain.",
    optic: "High Transmittance",
  },
  {
    id: "decoupling",
    label: "04 / Refractive Index Match Layer",
    subtitle: "Optically Clear Elastomer Spacer",
    role: "Refractive index matched spacer to isolate charges and eliminate reflections.",
    optic: "Optically Clear",
  },
  {
    id: "display",
    label: "05 / Substrate Display Layer",
    subtitle: "Standard Emissive Matrix (OLED/LCD)",
    role: "Main display output layer generating system light output.",
    optic: "Active Substrate",
  },
];

export default function TechnologyPage() {
  return (
    <article className="relative bg-background min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-border overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-blueprint opacity-60" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <p className="label mb-4">Technology Concept</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-text-primary max-w-4xl">
            Lamination Architecture
          </h1>
          <p className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
            We are exploring a multi-layered transparent film architecture integrated directly above standard display layers, combining dual energy harvesting pathways.
          </p>
        </div>
      </section>

      {/* ─── LAMINATION STACK DRAWING ─── */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden bg-surface-elevated">
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            label="01 / Layer Stack"
            title="Lamination schematic & material specs"
            subtitle="Cross-section diagram illustrating how the active polymer stack overlays the display substrate without creating visual occlusion."
            centered
          />

          <div className="max-w-3xl mx-auto space-y-6">
            {layers.map((layer, index) => (
              <div 
                key={layer.id} 
                className="glass-card p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary transition-colors"
              >
                <div className="flex-1">
                  <span className="font-mono text-[9px] text-accent font-semibold block mb-1">
                    {layer.label}
                  </span>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {layer.subtitle}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1 max-w-xl">
                    {layer.role}
                  </p>
                </div>
                
                <div className="shrink-0 text-right md:self-center">
                  <div className="px-3 py-1 bg-background border border-border rounded text-center">
                    <span className="block font-mono text-[8px] text-text-muted leading-none uppercase mb-0.5">Optics</span>
                    <span className="font-mono text-[10px] font-bold text-text-primary uppercase">{layer.optic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHYSICAL MECHANISMS SECTION (WITH STATIC SCHEMATIC SVG FIGURES) ─── */}
      <section className="relative py-20 md:py-28 px-6 lg:px-8 border-b border-border overflow-hidden bg-background">
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            label="02 / Mechanisms"
            title="Physical principles under evaluation"
            subtitle="We study three physical domains in parallel to configure transparent, touch-activated kinetic power."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Mechanism 1: Piezoelectric Strain */}
            <div className="glass-card p-6 md:p-8 rounded-lg flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-[9px] text-accent font-semibold block mb-2">Figure 2.1 / Mechanical Compression</span>
                
                {/* SVG Schematic */}
                <div className="aspect-[4/3] bg-background border border-border rounded p-4 mb-6 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" className="text-text-primary">
                    <rect width="100%" height="100%" fill="var(--color-surface)" />
                    
                    {/* Upper compression arrow */}
                    <path d="M100 10v20M100 30l-4-4M100 30l4-4" stroke="var(--color-accent)" strokeWidth="1.5" />
                    <text x="108" y="20" className="font-mono text-[8px] fill-accent font-bold">Strain (F)</text>

                    {/* Polarized Crystal Model */}
                    <rect x="50" y="45" width="100" height="70" rx="3" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
                    
                    {/* Charges aligning under compression */}
                    <text x="100" y="60" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">PVDF Crystalline Phase</text>
                    
                    {/* Positive top layer */}
                    <circle cx="70" cy="80" r="5" fill="var(--color-primary)" />
                    <text x="70" y="82" textAnchor="middle" className="font-mono text-[6px] fill-white">+</text>
                    <circle cx="130" cy="80" r="5" fill="var(--color-primary)" />
                    <text x="130" y="82" textAnchor="middle" className="font-mono text-[6px] fill-white">+</text>

                    {/* Negative bottom layer */}
                    <circle cx="70" cy="100" r="5" fill="var(--color-accent)" />
                    <text x="70" y="102" textAnchor="middle" className="font-mono text-[6px] fill-white">-</text>
                    <circle cx="130" cy="100" r="5" fill="var(--color-accent)" />
                    <text x="130" y="102" textAnchor="middle" className="font-mono text-[6px] fill-white">-</text>

                    {/* Voltage output line */}
                    <path d="M150 80h15v20h-15" stroke="currentColor" strokeWidth="0.8" />
                    <text x="170" y="93" className="font-mono text-[8px] fill-primary font-bold">V(t)</text>
                  </svg>
                </div>
                
                <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                  Piezoelectric Potential
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Tapping deforms the PVDF-TrFE copolymer phase, displacing charge centers within the carbon-fluorine dipole structure. This molecular polarization yields a transient electrical voltage spike.
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block">Key Parameter</span>
                <span className="font-mono text-xs font-bold text-primary mt-0.5 block">Piezoelectric coefficient d33</span>
              </div>
            </div>

            {/* Mechanism 2: Triboelectric Contact Charging */}
            <div className="glass-card p-6 md:p-8 rounded-lg flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-[9px] text-accent font-semibold block mb-2">Figure 2.2 / Surface Friction</span>
                
                {/* SVG Schematic */}
                <div className="aspect-[4/3] bg-background border border-border rounded p-4 mb-6 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" className="text-text-primary">
                    <rect width="100%" height="100%" fill="var(--color-surface)" />

                    {/* Friction Swipe Horizontal Arrow */}
                    <path d="M60 25h80M140 25l-4-4M140 25l-4 4" stroke="var(--color-accent)" strokeWidth="1.2" />
                    <text x="100" y="18" textAnchor="middle" className="font-mono text-[8px] fill-accent font-bold">Frictional Swipe</text>

                    {/* Finger skin contact layer (Top) */}
                    <rect x="40" y="45" width="120" height="15" rx="1" stroke="currentColor" strokeWidth="1" fill="white" />
                    <text x="100" y="55" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">Skin Layer (Positive)</text>
                    {/* Positive charges on Skin */}
                    <text x="50" y="50" className="font-mono text-[8px] fill-primary font-bold">+</text>
                    <text x="140" y="50" className="font-mono text-[8px] fill-primary font-bold">+</text>

                    {/* Air Gap / Contact Interface */}
                    <line x1="40" y1="68" x2="160" y2="68" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />

                    {/* Micro-textured PDMS layer (Bottom) */}
                    <rect x="40" y="75" width="120" height="20" rx="1" stroke="currentColor" strokeWidth="1" fill="var(--color-surface-elevated)" />
                    <text x="100" y="88" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">Textured PDMS (Negative)</text>
                    {/* Negative charges on PDMS */}
                    <text x="50" y="80" className="font-mono text-[8px] fill-accent font-bold">-</text>
                    <text x="140" y="80" className="font-mono text-[8px] fill-accent font-bold">-</text>

                    {/* Induced charge grid line */}
                    <path d="M100 95v15h15" stroke="currentColor" strokeWidth="0.8" />
                    <text x="120" y="113" className="font-mono text-[8px] fill-primary font-bold">I(t)</text>
                  </svg>
                </div>
                
                <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                  Triboelectric Induction
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  Friction and contacts between finger skin (highly electropositive) and micro-textured PDMS (electronegative) generate localized surface charges. Kinetic movement drives induction currents through electrodes.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block">Key Parameter</span>
                <span className="font-mono text-xs font-bold text-primary mt-0.5 block">Surface Charge Density σ</span>
              </div>
            </div>

            {/* Mechanism 3: Optical Transmittance */}
            <div className="glass-card p-6 md:p-8 rounded-lg flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-[9px] text-accent font-semibold block mb-2">Figure 2.3 / Optical Index Ray Model</span>
                
                {/* SVG Schematic */}
                <div className="aspect-[4/3] bg-background border border-border rounded p-4 mb-6 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 200 150" fill="none" className="text-text-primary">
                    <rect width="100%" height="100%" fill="var(--color-surface)" />

                    {/* Layer Boundaries */}
                    <rect x="40" y="30" width="120" height="25" stroke="currentColor" strokeWidth="0.8" fill="white" />
                    <text x="100" y="45" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">Active Layer</text>
                    
                    <rect x="40" y="55" width="120" height="35" stroke="currentColor" strokeWidth="0.8" fill="var(--color-surface-elevated)" />
                    <text x="100" y="75" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">Spacer (Index-Matched)</text>

                    <rect x="40" y="90" width="120" height="25" stroke="currentColor" strokeWidth="0.8" fill="white" />
                    <text x="100" y="105" textAnchor="middle" className="font-mono text-[8px] fill-text-secondary">OLED Substrate</text>

                    {/* Straight Light Ray (Zero Reflection) */}
                    <path d="M100 125V20M100 20l-3 4M100 20l3 4" stroke="var(--color-accent)" strokeWidth="1.5" />
                    <text x="106" y="23" className="font-mono text-[8px] fill-accent font-bold">Unrefracted Ray</text>
                  </svg>
                </div>
                
                <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                  Optically Matched Clarity
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
                  To overlay displays cleanly, films must remain transparent. We study thickness thresholds and match refractive indexes ($n \approx 1.41$) across interfaces to mitigate scattering and display haze.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider block">Key Parameter</span>
                <span className="font-mono text-xs font-bold text-primary mt-0.5 block">Minimum Haze &amp; Scatter</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── ROADMAP DIRECT REDIRECT CTA ─── */}
      <section className="relative py-20 px-6 lg:px-8 bg-surface-elevated text-center overflow-hidden">
        <div className="absolute inset-0 grid-blueprint opacity-20" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-4">
            See our developmental timeline
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            We operate in qualitative research phases to deliver the first validated lamination modules for showcases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/research">
              View Roadmap Details
            </Button>
            <Button href="/about" variant="secondary">
              About Our Team
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
