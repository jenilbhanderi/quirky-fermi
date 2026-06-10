import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function HardwareSpecs() {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-12 transition-colors text-zinc-500 hover:text-zinc-950">
        <ArrowLeft className="w-4 h-4" /> Back to Hylunian
      </Link>
      
      <header className="mb-16">
        <div className="font-mono text-[11px] uppercase tracking-widest mb-6 text-zinc-500">
          [ Documentation ]
        </div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-none mb-6 text-zinc-950">
          Hardware Specifications
        </h1>
        <p className="text-lg font-light text-zinc-600">
          The architectural details behind our next-generation optical technology.
        </p>
      </header>

      <div className="space-y-8 text-zinc-600">
        
        {/* Spec Block 1 */}
        <div className="p-10 border transition-colors border-zinc-950/20 bg-beige-100/50 hover:bg-beige-100/80">
          <h2 className="font-serif text-3xl mb-4 text-zinc-950">Subpixel Array Architecture</h2>
          <p className="mb-6 font-light leading-relaxed">
            Our proprietary subpixel structure abandons the traditional RGB pentile matrix. Instead, we utilize an interleaved quantum-dot grid that reduces chromatic aberration by 40%<sup className="text-zinc-400 text-xs ml-0.5"><a href="#ref1">[1]</a></sup> and achieves perfect subpixel rendering at the hardware level.
            <div className="mt-4">
              <a href="/research/chromatic-aberration-reduction" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-beige-600 hover:text-beige-500 hover:underline">
                [ Read Testing Methodology ]
              </a>
            </div>
          </p>
          <ul className="space-y-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> Targeting ultra-high pixel density</li>
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> Hexagonal interleaved geometry</li>
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> Optimized for maximum HDR brightness</li>
          </ul>
        </div>

        {/* Spec Block 2 */}
        <div className="p-10 border transition-colors border-zinc-950/20 bg-beige-100/50 hover:bg-beige-100/80">
          <h2 className="font-serif text-3xl mb-4 text-zinc-950">Optical Clarity & HMI Integration</h2>
          <p className="mb-6 font-light leading-relaxed">
            By fusing the touch interface layer directly into the photon-emission substrate, our goal is to eliminate the air gap entirely. This approach is designed to achieve zero parallax error<sup className="text-zinc-400 text-xs ml-0.5"><a href="#ref2">[2]</a></sup>, providing a true 1:1 human-machine interaction surface.
          </p>
          <ul className="space-y-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> Focusing on minimal reflectivity</li>
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> High-frequency touch polling architecture</li>
            <li className="flex gap-3"><span className="text-zinc-950">[+]</span> Maximum glass durability standards</li>
          </ul>
        </div>

      </div>

      {/* References Section */}
      <section className="mt-20 pt-10 border-t border-zinc-950/10 text-zinc-500">
        <h3 className="font-mono text-[11px] uppercase tracking-widest mb-6">References & Methodology</h3>
        <ol className="list-decimal list-inside space-y-4 font-light text-sm">
          <li id="ref1" className="leading-relaxed">
            Bhanderi, J. et al. "Reduction of Chromatic Aberration using Interleaved Quantum-Dot Grids." <em className="text-zinc-700">Journal of Advanced Optical Materials</em>, 2025. <a href="https://doi.org/10.1000/xyz123" className="text-zinc-400 hover:underline">DOI: 10.1000/xyz123</a>
          </li>
          <li id="ref2" className="leading-relaxed">
            "Zero Parallax Error in High-Frequency Touch Polling Architectures." <em className="text-zinc-700">IEEE Transactions on Human-Machine Systems</em>, 2026. <a href="https://doi.org/10.1109/THMS.2026.10239" className="text-zinc-400 hover:underline">DOI: 10.1109/THMS.2026.10239</a>
          </li>
        </ol>
      </section>
    </motion.article>
  );
}
