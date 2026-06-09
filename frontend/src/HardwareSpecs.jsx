import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function HardwareSpecs({ isDark }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-24"
    >
      <Link to="/" className={`inline-flex items-center gap-2 text-sm mb-12 transition-colors hover:underline ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Hylunian
      </Link>
      
      <header className="mb-16">
        <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          Hardware Specifications
        </h1>
        <p className={`text-lg font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          The architectural details behind our next-generation optical technology.
        </p>
      </header>

      <div className={`space-y-12 transition-colors duration-500 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
        
        {/* Spec Block 1 */}
        <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Subpixel Array Architecture</h2>
          <p className="mb-4 font-light leading-relaxed">
            Our proprietary subpixel structure abandons the traditional RGB pentile matrix. Instead, we utilize an interleaved quantum-dot grid that reduces chromatic aberration by 40% and achieves perfect subpixel rendering at the hardware level.
          </p>
          <ul className="list-disc list-inside space-y-2 font-mono text-sm opacity-80">
            <li>Density: 850 PPI (Pixels Per Inch)</li>
            <li>Subpixel Geometry: Hexagonal interleaved</li>
            <li>Peak Brightness: 4,000 Nits (HDR burst)</li>
          </ul>
        </div>

        {/* Spec Block 2 */}
        <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-white border-black/10'}`}>
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Optical Clarity & HMI Integration</h2>
          <p className="mb-4 font-light leading-relaxed">
            By fusing the touch interface layer directly into the photon-emission substrate, we eliminate the air gap entirely. This results in zero parallax error, providing a true 1:1 human-machine interaction surface.
          </p>
          <ul className="list-disc list-inside space-y-2 font-mono text-sm opacity-80">
            <li>Reflectivity: &lt;0.5% (Anti-Reflective Coating)</li>
            <li>Touch Polling Rate: 1000Hz</li>
            <li>Glass Durability: 9H Mohs scale</li>
          </ul>
        </div>

      </div>
    </motion.article>
  );
}
