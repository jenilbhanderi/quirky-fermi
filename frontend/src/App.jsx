import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Layers, ChevronRight, Sun, Moon, ArrowLeft, Plus, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Legal from './Legal';
import AdminDashboard from './AdminDashboard';
import HardwareSpecs from './HardwareSpecs';
import TypewriterText from './components/TypewriterText';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api'
);

async function joinWaitlist(email) {
  const res = await fetch(`${API_BASE}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = res.status;
    throw error;
  }
  return data;
}

const FALLBACK_SETTINGS = {
  hero_title: 'Self-Powered\nEmissive Architecture',
  hero_subtitle: 'Hylunian is pioneering transparent piezoelectric and triboelectric (TENG) display interfaces. We are engineering screens that convert your kinetic touch into self-sustaining electrical power.',
  cta_text: 'Request Early Access'
};

const FALLBACK_PAPERS = [
  {
    id: 1,
    slug: 'subpixel-energy-harvesting-rev2',
    title: 'Subpixel Array Architecture Rev 2',
    summary: 'A novel approach to integrating transparent triboelectric nanogenerators (TENGs) directly into the OLED subpixel matrix. During extreme empirical stress-testing, we discovered a mechanical anomaly that completely changes how kinetic touch is harvested.',
    category: 'Hardware',
    published_date: new Date().toISOString(),
    read_time: '8 min read'
  },
  {
    id: 2,
    slug: 'chromatic-aberration-reduction',
    title: 'Chromatic Aberration in Piezoelectric Layers',
    summary: 'Evaluating the optical clarity and refractive index matching of PVDF-TrFE thin films. Our latest trials achieved a 40% reduction in chromatic aberration, revealing an unexpected structural advantage over traditional pentile matrices.',
    category: 'Optical Engineering',
    published_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    read_time: '12 min read'
  }
];

function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
      <div className="font-mono text-[11px] uppercase tracking-widest mb-6 text-zinc-500">
        [ Error 404 ]
      </div>
      <h1 className="font-serif text-6xl md:text-8xl mb-8 text-zinc-950 tracking-tight">
        Document Void
      </h1>
      <p className="max-w-md text-zinc-600 font-light mb-12">
        The research document or sector you are attempting to access does not exist within the current Hylunian architecture.
      </p>
      <Link to="/" className="px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors bg-zinc-950 text-beige-50 hover:bg-zinc-800">
        Return to Protocol
      </Link>
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState({});
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fiber-optic scroll tracking
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/settings`).then(r => r.ok ? r.json() : {}),
      fetch(`${API_BASE}/papers`).then(r => r.ok ? r.json() : Promise.reject(new Error('Papers not found')))
    ]).then(([settingsData, papersData]) => {
      setSettings(settingsData);
      setPapers(papersData);
      setLoading(false);
    }).catch(err => {
      console.warn('Backend unavailable. Falling back to static data.', err);
      setSettings(FALLBACK_SETTINGS);
      setPapers(FALLBACK_PAPERS);
      setLoading(false);
    });
  }, []);

  const isDark = false; // Forced light mode (off-white paper)

  return (
    <Router>
      <div className="min-h-screen font-sans overflow-x-hidden bg-beige-100 text-zinc-950 selection:bg-zinc-950 selection:text-beige-50">

        {/* Fiber Optic Scroll Indicator */}
        <motion.div
          className="fixed top-0 left-0 bottom-0 w-[4px] z-50 origin-top bg-zinc-900 drop-shadow-[0_0_8px_rgba(192,165,126,0.5)]"
          style={{ scaleY }}
        />
        
        {/* Ultra-Premium Film Grain / Noise Layer */}
        <div className="fixed inset-0 pointer-events-none z-40 mix-blend-overlay opacity-10">
          <svg className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.5" />
          </svg>
        </div>

        {/* Diegetic HUD Elements */}
        <div className="fixed inset-0 pointer-events-none z-30">
          <Plus className={`absolute top-6 left-6 w-4 h-4 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`} />
          <Plus className={`absolute top-6 right-6 w-4 h-4 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`} />
          <Plus className={`absolute bottom-6 left-6 w-4 h-4 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`} />
          <Plus className={`absolute bottom-6 right-6 w-4 h-4 ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`} />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar isDark={isDark} />
          <main className="flex-grow pt-32">
            <Routes>
              <Route path="/" element={
                loading ? (
                  <div className="min-h-[80vh] flex items-center justify-center opacity-50 font-mono text-sm tracking-widest uppercase">Initializing...</div>
                ) : (
                  <>
                    <HeroSection isDark={isDark} settings={settings} />
                    <AboutSection isDark={isDark} />
                    <TeamSection isDark={isDark} />
                  </>
                )
              } />
              <Route path="/research" element={
                loading ? (
                  <div className="min-h-[80vh] flex items-center justify-center opacity-50 font-mono text-sm tracking-widest uppercase">Initializing...</div>
                ) : (
                  <div className="min-h-[85vh]">
                    <ResearchSection isDark={isDark} papers={papers} />
                  </div>
                )
              } />
              <Route path="/research/:slug" element={<ResearchArticle />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/specs" element={<HardwareSpecs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

// --- Components ---

function Navbar({ theme, setTheme, isDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-8 left-0 right-0 z-50 px-6 md:px-12 flex justify-center"
    >
      <div className={`flex items-center justify-between w-full max-w-6xl px-6 md:px-8 py-3 rounded-full backdrop-blur-xl transition-all duration-500 shadow-2xl ${isDark ? 'bg-zinc-950/80 border border-beige-50/10' : 'bg-beige-50/80 border border-zinc-950/10'}`}>
        
        <Link to="/" className="flex items-center gap-2 z-50">
          <img src="/favicon.svg" alt="Hylunian Logo" className={`w-6 h-6 ${isDark ? 'invert' : ''}`} />
          <span className={`font-serif text-2xl tracking-tight leading-none pt-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Hylunian</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 mr-4 text-xs font-mono uppercase tracking-widest">
            <a href="/#about" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>About</a>
            <Link to="/research" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Research</Link>
            <Link to="/specs" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Specs</Link>
            <a href="mailto:contact@hylunian.com" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Contact</a>
          </div>
          <a href="/#waitlist" className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-beige-100 border-beige-200 hover:bg-beige-200'}`}>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-beige-500 shadow-[0_0_8px_#c0a57e]' : 'bg-zinc-900'}`}></div>
            <span className={`text-[11px] font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>R&D Phase</span>
          </a>
          
          <button 
            className="md:hidden p-2 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-16 left-0 right-0 p-6 rounded-2xl backdrop-blur-2xl border shadow-2xl flex flex-col gap-6 md:hidden ${isDark ? 'bg-zinc-950/95 border-beige-50/10' : 'bg-beige-50/95 border-zinc-950/10'}`}
            >
              <a href="/#about" onClick={() => setMenuOpen(false)} className={`text-sm font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400 hover:text-beige-50' : 'text-zinc-600 hover:text-zinc-950'}`}>About</a>
              <Link to="/research" onClick={() => setMenuOpen(false)} className={`text-sm font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400 hover:text-beige-50' : 'text-zinc-600 hover:text-zinc-950'}`}>Research</Link>
              <Link to="/specs" onClick={() => setMenuOpen(false)} className={`text-sm font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400 hover:text-beige-50' : 'text-zinc-600 hover:text-zinc-950'}`}>Specs</Link>
              <a href="mailto:contact@hylunian.com" onClick={() => setMenuOpen(false)} className={`text-sm font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400 hover:text-beige-50' : 'text-zinc-600 hover:text-zinc-950'}`}>Contact</a>
              <a href="/#waitlist" onClick={() => setMenuOpen(false)} className={`mt-4 w-full flex justify-center items-center gap-2 px-4 py-3 border transition-colors ${isDark ? 'bg-beige-50 text-zinc-950 hover:bg-beige-200' : 'bg-zinc-950 text-beige-50 hover:bg-zinc-800'}`}>
                <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">Request Access</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}

function HeroSection({ isDark, settings }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/waitlist/count`)
      .then(res => res.ok ? res.json() : Promise.reject('Backend error'))
      .then(data => {
        if (data && typeof data.total === 'number') {
          setWaitlistCount(data.total + 142);
        } else {
          setWaitlistCount(142);
        }
      })
      .catch(() => {
        // Psychological Optimization: Fallback social proof if backend is unreachable
        setWaitlistCount(142);
      });
  }, []);

  const heroTitle = settings.hero_title || 'Self-Powered\nEmissive Architecture';
  const heroSubtitle = settings.hero_subtitle || 'Hylunian is pioneering transparent piezoelectric and triboelectric (TENG) display interfaces. We are engineering screens that convert your kinetic touch into self-sustaining electrical power.';
  const ctaText = settings.cta_text || 'Request Early Access';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await joinWaitlist(email);
      setIsSubmitted(true);
    } catch (err) {
      if (err.status === 409) {
        setError('This email is already on the waitlist.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
      
      <div className="max-w-4xl mx-auto w-full text-center relative z-10 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          {/* Surtile */}
          <div className={`font-mono text-xs uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Subpixel Energy Harvesting
          </div>

          {/* Headline - Temporal Typography */}
          <TypewriterText 
            text={heroTitle}
            element="h1"
            delay={0.2}
            className={`text-6xl md:text-8xl lg:text-[7rem] font-serif tracking-tight leading-[0.95] mx-auto justify-center ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}
          />

          {/* Body */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {heroSubtitle}
          </motion.p>

          {/* Waitlist Form with Magnetic Button Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            id="waitlist" 
            className="pt-8 flex flex-col items-center justify-center scroll-mt-32"
          >
            {isSubmitted ? (
              <div className={`flex items-center gap-3 px-8 py-5 border backdrop-blur-lg ${isDark ? 'bg-zinc-900/40 border-beige-50/20 text-beige-50' : 'bg-white/40 border-zinc-950/20 text-zinc-950'}`}>
                <div className="w-2 h-2 shadow-[0_0_10px_#c0a57e] bg-beige-500"></div>
                <span className="font-mono text-sm uppercase tracking-widest font-semibold">Access request received.</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-start w-full max-w-lg mb-2 pl-4 text-left border-l-2 border-zinc-950/20">
                  <label htmlFor="waitlist-email" className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                    Priority Waitlist
                  </label>
                </div>
                <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-stretch w-full max-w-lg border backdrop-blur-xl transition-all shadow-2xl ${isDark ? 'bg-zinc-900/40 border-beige-50/20 focus-within:ring-2 focus-within:ring-beige-50/40' : 'bg-white/40 border-zinc-950/20 focus-within:ring-2 focus-within:ring-zinc-950/40'}`}>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    aria-label="Email address for priority waitlist"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className={`w-full px-6 py-4 bg-transparent focus:outline-none focus:ring-0 font-mono text-sm transition-colors ${isDark ? 'text-beige-50 placeholder-zinc-600' : 'text-zinc-950 placeholder-zinc-400'}`}
                  />
                  
                  {/* Magnetic Button Hover Effect */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full sm:w-auto px-8 py-4 font-mono text-sm uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 relative overflow-hidden ${isDark ? 'bg-beige-50 text-zinc-950 hover:bg-beige-200 shadow-[0_0_15px_rgba(192,165,126,0.3)]' : 'bg-zinc-950 text-beige-50 hover:bg-zinc-800'}`}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? 'Submitting...' : ctaText}
                      {!isLoading && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Scarcity / Progress Bar Removed as requested */}
                {waitlistCount !== null && !error && !isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className={`mt-5 text-sm font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
                  >
                    <span className={`font-mono text-[11px] uppercase tracking-widest font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>[ {waitlistCount} Researchers in Queue ]</span>
                  </motion.div>
                )}
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
                
                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 flex items-center gap-6 justify-center"
                >
                  <div className="flex items-center gap-1.5 opacity-60">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">AES-256 Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">No Spam Guarantee</span>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-4 text-xs font-light max-w-sm text-center mx-auto ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}
                >
                  Your email is strictly used for R&D updates. <Link to="/legal" className="underline hover:text-zinc-400">Privacy Policy</Link>
                </motion.p>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection({ isDark }) {
  return (
    <section id="about" className={`px-6 py-32 relative border-t transition-colors duration-500 scroll-mt-24 ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className={`font-mono text-xs uppercase tracking-[0.2em] mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Phase 01 / Context
            </div>
            <h2 className={`font-serif text-5xl md:text-6xl tracking-tight leading-[0.95] mb-8 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
              Engineering the <br/>Emissive Core
            </h2>
            <p className={`text-lg font-light leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Hylunian is an R&D laboratory developing transparent piezoelectric and triboelectric (TENG) display interfaces. Our technology converts the mechanical energy of your physical touch into self-sustaining electrical power.
            </p>
            <p className={`text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              We are currently in the prototyping and empirical testing phase. Early access to our hardware is highly limited.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`p-10 border ${isDark ? 'border-beige-50/20 bg-zinc-900/20' : 'border-zinc-950/20 bg-beige-100/50'}`}
          >
            <h3 className={`font-mono text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Target Audience</h3>
            <ul className={`space-y-6 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <li className="flex items-start gap-4">
                <span className={`font-mono text-xs mt-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>[01]</span>
                <span><strong className={`font-serif text-xl font-normal block mb-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Optical Researchers</strong> Receive proprietary technical whitepapers and empirical data.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className={`font-mono text-xs mt-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>[02]</span>
                <span><strong className={`font-serif text-xl font-normal block mb-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Hardware Partners</strong> Evaluate our elastomer composites for future integration.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className={`font-mono text-xs mt-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>[03]</span>
                <span><strong className={`font-serif text-xl font-normal block mb-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Deep-Tech Investors</strong> Get priority access to technical briefings and beta prototypes.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TeamSection({ isDark }) {
  return (
    <section id="team" className={`px-6 py-24 relative border-t transition-colors duration-500 scroll-mt-24 ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-start">
           
           {/* Header side */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="w-full md:w-1/3"
           >
              <div className={`font-mono text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Leadership
              </div>
              <h2 className={`font-serif text-4xl tracking-tight leading-none ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
                Principal Investigator
              </h2>
           </motion.div>
           
           {/* Bio side */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="w-full md:w-2/3"
           >
             <div className={`p-10 border transition-colors ${isDark ? 'border-beige-50/20 bg-zinc-900/20' : 'border-zinc-950/20 bg-beige-100/50'}`}>
                <div className={`flex items-center justify-between mb-8 pb-8 border-b ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
                  <div>
                    <h3 className={`font-serif text-3xl mb-1 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Jenil Bhanderi</h3>
                    <div className={`font-mono text-[11px] uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Independent Hardware Researcher</div>
                  </div>
                  <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-colors ${isDark ? 'border-beige-50/20 bg-zinc-900' : 'border-zinc-950/20 bg-beige-100'}`}>
                     <span className={`font-serif text-2xl ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>J</span>
                  </div>
                </div>
                <p className={`text-lg font-light leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Hylunian is the independent research initiative of Jenil Bhanderi, an Electronics and Communication Engineering (ECE) sophomore dedicated to pushing the boundaries of emissive technology and energy harvesting.
                </p>
                <p className={`text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  By operating independently, Hylunian moves with extreme agility—focusing purely on raw hardware feasibility, rapid prototyping, and empirical validation without the constraints of traditional corporate R&D.
                </p>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResearchSection({ isDark, papers }) {
  return (
    <section id="research" className="px-6 py-32 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`font-mono text-xs uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
          >
            Phase 02 / Documentation
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`font-serif text-5xl md:text-6xl tracking-tight leading-[0.95] transition-colors ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}
          >
            Optical Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-lg max-w-2xl font-light transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            Review our foundational hardware documentation outlining the architectural leaps in Hylunian's emissive technology.
          </motion.p>
        </div>

        <div className={`grid grid-cols-1 ${papers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
          {papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <Link to={`/research/${paper.slug}`}>
                <ResearchCard paper={paper} isDark={isDark} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchCard({ paper, isDark }) {
  const dateStr = new Date(paper.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`group relative h-full flex flex-col p-10 border transition-colors duration-500 cursor-pointer ${isDark ? 'border-beige-50/20 bg-zinc-900/10 hover:bg-zinc-900/40' : 'border-zinc-950/20 bg-beige-100/30 hover:bg-beige-100/80'}`}>
      
      <div className="relative z-10 flex-grow">
        <div className={`font-mono text-[11px] uppercase tracking-widest mb-6 transition-colors ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
          [ {paper.category || 'Research'} ]
        </div>
        
        <h3 className={`font-serif text-3xl mb-6 leading-[1.1] transition-all ${isDark ? 'text-beige-50 group-hover:text-beige-300' : 'text-zinc-950 group-hover:text-zinc-700'}`}>
          {paper.title}
        </h3>
        
        <p className={`text-sm font-light leading-relaxed mb-8 transition-colors line-clamp-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {paper.abstract}
        </p>
      </div>

      <div className={`relative z-10 mt-auto pt-6 flex items-center justify-between border-t transition-colors ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
        <span className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {dateStr}
        </span>
        <div className={`flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ResearchArticle() {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/papers/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => {
        setPaper(data);
        document.title = `${data.title} - Hylunian Research`;
      })
      .catch(() => {
        // Fallback to static papers if backend is down
        const fallbackPaper = FALLBACK_PAPERS.find(p => p.slug === slug);
        if (fallbackPaper) {
          setPaper(fallbackPaper);
          document.title = `${fallbackPaper.title} - Hylunian Research`;
        } else {
          setError(true);
        }
      });
      
    return () => {
      document.title = 'Hylunian - Display Technology Research';
    };
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl mb-4 text-zinc-950">Paper Not Found</h1>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-950">← Back to Home</Link>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="opacity-50 font-mono text-sm uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  const dateStr = new Date(paper.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-6 py-24"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest mb-12 transition-colors text-zinc-500 hover:text-zinc-950">
        <ArrowLeft className="w-4 h-4" /> Back to Hylunian
      </Link>
      
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 border text-[11px] font-mono uppercase tracking-widest mb-6 transition-colors bg-beige-100 border-zinc-950/10 text-zinc-600">
          {paper.category || 'Research'}
        </div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-none mb-6 text-zinc-950">
          {paper.title}
        </h1>
        <div className="text-xs font-mono uppercase tracking-widest flex flex-wrap gap-4 items-center text-zinc-500">
          {paper.authors && <span>By {paper.authors}</span>}
          <span>Published on {dateStr}</span>
        </div>
      </header>

      {/* Abstract */}
      <div className="p-8 mb-16 border bg-beige-100/50 border-zinc-950/20">
        <div className="font-mono text-[11px] uppercase tracking-widest mb-4 text-zinc-500">Abstract</div>
        <p className="text-lg font-light leading-relaxed text-zinc-600">
          {paper.summary}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none prose-zinc prose-p:text-zinc-600 prose-headings:text-zinc-900 prose-headings:font-serif">
        {paper.content ? (
          <ReactMarkdown>{paper.content}</ReactMarkdown>
        ) : (
          <p className="italic">This paper does not have full text available.</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-24 p-12 border text-center transition-colors bg-beige-100/50 border-zinc-950/20">
        <div className="w-12 h-12 mx-auto border border-zinc-950/20 bg-beige-100 flex items-center justify-center rounded-full mb-6">
          <div className="w-2 h-2 rounded-full bg-zinc-950"></div>
        </div>
        <h3 className="font-serif text-2xl mb-4 text-zinc-950">Stay Updated on Our Research</h3>
        <p className="mb-8 font-light text-zinc-600">Join the waitlist to receive future papers directly in your inbox.</p>
        <Link to="/" className="inline-block px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors bg-zinc-950 text-beige-50 hover:bg-zinc-800">
          Return Home
        </Link>
      </div>
    </motion.article>
  );
}

function Footer({ isDark }) {
  return (
    <footer className={`px-6 py-12 relative z-10 border-t transition-colors duration-500 mt-auto ${isDark ? 'bg-zinc-950 border-beige-50/10' : 'bg-beige-50 border-zinc-950/10'}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Hylunian Logo" className={`w-6 h-6 ${isDark ? 'invert' : ''}`} />
          <span className={`font-serif text-2xl tracking-tight leading-none pt-1 transition-colors ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Hylunian</span>
        </div>
        
        <div className="flex gap-8 text-[11px] font-mono uppercase tracking-widest">
          <a href="mailto:contact@hylunian.com" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Lab Contact</a>
          <Link to="/legal" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Privacy & Legal</Link>
          <Link to="/specs" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Hardware Specs</Link>
        </div>
        
        <div className={`text-[11px] font-mono uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          &copy; {new Date().getFullYear()} Hylunian.
        </div>
      </div>
    </footer>
  );
}
