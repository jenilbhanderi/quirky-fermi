import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Layers, Plus, Home, BookOpen, Cpu, Mail, ChevronRight, Search } from 'lucide-react';
import TypewriterText from './components/TypewriterText';

const Legal = lazy(() => import('./Legal'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const HardwareSpecs = lazy(() => import('./HardwareSpecs'));
const ResearchArticle = lazy(() => import('./ResearchArticle'));

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
  hero_title: 'Display that\ngives back.',
  hero_subtitle: 'Hylunian is pioneering transparent piezoelectric and triboelectric (TENG) display interfaces. We are engineering screens that convert your kinetic touch into self-sustaining electrical power.',
  cta_text: 'Request Early Access'
};

const FALLBACK_PAPERS = [
  {
    id: 1,
    slug: 'decoupling-teng-interference',
    title: 'Decoupling Triboelectric Interference in High-Transmittance TENG Displays',
    abstract: 'A novel architectural approach to isolating contact-electrification noise from capacitive touch signals in fully transparent, >85% transmittance triboelectric nanogenerator arrays.',
    category: 'TENG Physics',
    created_at: new Date().toISOString(),
    read_time: '8 min read'
  },
  {
    id: 2,
    slug: 'piezoelectric-elastomeric-composites',
    title: 'Hyper-Stretchable Piezoelectric Composites for Wearable Kinetic Interfaces',
    abstract: 'Formulating a PVDF-based polyurethane-urea elastomer that maintains piezoelectric integrity and optical clarity even under 300% mechanical strain.',
    category: 'Materials Science',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    read_time: '12 min read'
  },
  {
    id: 3,
    slug: 'self-powered-emissive-architecture',
    title: 'Self-Powered Subpixel Emissive Architecture using Transparent Harvesters',
    abstract: 'A comprehensive study on directly routing TENG-harvested energy into localized OLED subpixels to achieve localized micro-illumination without external power.',
    category: 'Display Architecture',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    read_time: '10 min read'
  },
  {
    id: 4,
    slug: 'refractive-matching-teng-layers',
    title: 'Refractive Index Matching in Multi-Layer PVDF-TrFE Thin Films',
    abstract: 'Mitigating reflection and scattering boundaries between transparent electrode composites and piezoelectric layers to achieve <1.2% total display reflectance.',
    category: 'Optical Engineering',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    read_time: '9 min read'
  },
  {
    id: 5,
    slug: 'elastomer-fatigue-teng-stress',
    title: 'Triboelectric Elastomer Degradation under Empirical Mechanical Stress',
    abstract: 'Evaluating the chemical and electrical fatigue life of transparent polydimethylsiloxane (PDMS) elastomer composites under 100,000 continuous touch stress cycles.',
    category: 'Materials Science',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    read_time: '14 min read'
  }
];

function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
      <div className="font-mono text-[11px] uppercase tracking-widest mb-6 text-zinc-500">
        [ Error 404 ]
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl md:text-8xl mb-8 text-zinc-950 tracking-tight">
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
          <ScrollToHash />
          <Navbar isDark={isDark} />
          <main className="flex-grow pt-24 md:pt-32">
              <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center opacity-50 font-mono text-sm tracking-widest uppercase">Loading Modules...</div>}>
                <Routes>
                  <Route path="/" element={
                    loading ? (
                      <div className="min-h-[80vh] flex items-center justify-center opacity-50 font-mono text-sm tracking-widest uppercase">Initializing...</div>
                    ) : (
                      <>
                        <HeroSection isDark={isDark} settings={settings} />
                        <LatestResearchSection isDark={isDark} papers={papers} />
                      </>
                    )
                  } />
                  <Route path="/about" element={
                    <>
                      <AboutSection isDark={isDark} />
                      <TeamSection isDark={isDark} />
                    </>
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
              </Suspense>
          </main>
          <MobileBottomNav isDark={isDark} />
          <Footer isDark={isDark} />
        </div>
      </div>
    </Router>
  );
}

// --- Components ---

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function Navbar({ isDark }) {
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
            <Link to="/about" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>About</Link>
            <Link to="/research" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Research</Link>
            <Link to="/specs" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Specs</Link>
            <a href="mailto:contact@hylunian.com" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>Contact</a>
          </div>
          <div className={`hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-beige-100 border-beige-200 text-zinc-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-beige-500 shadow-[0_0_8px_#c0a57e]' : 'bg-zinc-950'}`}></div>
            <span className="text-[10px] font-mono uppercase tracking-widest">R&D Phase</span>
          </div>
        </div>

      </div>
    </motion.nav>
  );
}

function MobileBottomNav({ isDark }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest < 10) {
      setHidden(false);
      return;
    }
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  const navItems = [
    { label: 'Home', path: '/', icon: Home, isAnchor: false },
    { label: 'About', path: '/about', icon: Layers, isAnchor: false },
    { label: 'Research', path: '/research', icon: BookOpen, isAnchor: false },
    { label: 'Specs', path: '/specs', icon: Cpu, isAnchor: false }
  ];

  const isActive = (item) => {
    if (item.isAnchor) return false;
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  return (
    <motion.div
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: 120, opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center md:hidden pointer-events-none"
    >
      <motion.div 
        layout
        className={`flex items-center justify-between w-full max-w-[360px] p-1.5 rounded-full backdrop-blur-xl border shadow-2xl pointer-events-auto transition-colors duration-500 ${
          isDark ? 'bg-zinc-950/80 border-beige-50/10' : 'bg-beige-50/80 border-zinc-950/10'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const Comp = item.isAnchor ? 'a' : Link;
          const props = item.isAnchor ? { href: item.path } : { to: item.path };
          
          return (
            <Comp
              key={item.label}
              {...props}
              className="focus:outline-none relative flex-1 flex justify-center py-1"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={`h-9 flex items-center justify-center rounded-full relative z-10 transition-colors duration-300 ${
                  active 
                    ? (isDark ? 'text-zinc-950' : 'text-beige-50') 
                    : 'text-zinc-500 hover:text-zinc-800'
                } ${active ? 'px-4' : 'w-9'}`}
              >
                {/* Bubble Background */}
                {active && (
                  <motion.div
                    layoutId="activeTabBubble"
                    className={`absolute inset-0 rounded-full -z-10 ${
                      isDark ? 'bg-beige-50 shadow-sm' : 'bg-zinc-950 shadow-sm'
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon size={18} className="flex-shrink-0 relative z-10" />
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                      animate={{ width: "auto", opacity: 1, marginLeft: 6 }}
                      exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] font-mono uppercase tracking-wider font-semibold overflow-hidden whitespace-nowrap relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Comp>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function HeroSection({ isDark, settings }) {
  const heroTitle = settings.hero_title || 'Display that\ngives back.';
  const heroSubtitle = settings.hero_subtitle || 'Hylunian is pioneering transparent piezoelectric and triboelectric (TENG) display interfaces. We are engineering screens that convert your kinetic touch into self-sustaining electrical power.';

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full text-center relative z-10 pt-4 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          {/* Surtile */}
          <div className={`font-mono text-xs uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Self-Powered Emissive Architecture
          </div>

          {/* Headline - Temporal Typography */}
          <TypewriterText 
            text={heroTitle}
            element="h1"
            delay={0.2}
            className={`text-3xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif tracking-tight leading-[0.95] mx-auto justify-center ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}
          />

          {/* Body */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className={`max-w-2xl mx-auto text-base md:text-xl font-light leading-relaxed transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}
          >
            {heroSubtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection({ isDark }) {
  return (
    <section id="about" className={`px-6 py-16 md:py-32 relative border-t transition-colors duration-500 scroll-mt-24 ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
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
            <h2 className={`font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95] mb-8 ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
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
    <section id="team" className={`px-6 py-16 md:py-24 relative border-t transition-colors duration-500 scroll-mt-24 ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
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
              <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight leading-none ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
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

function LatestResearchSection({ isDark, papers }) {
  return (
    <section className={`hidden md:block px-6 py-16 md:py-24 relative border-t transition-colors duration-500 ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Phase 02 / Documentation
            </div>
            <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight leading-none ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
              Latest Research
            </h2>
          </div>
          <Link to="/research" className={`font-mono text-xs uppercase tracking-widest flex items-center gap-1 transition-colors ${isDark ? 'text-zinc-400 hover:text-beige-50' : 'text-zinc-500 hover:text-zinc-950'}`}>
            All Papers <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.slice(0, 2).map((paper, index) => (
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

function ResearchSection({ isDark, papers }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="px-6 py-12 md:py-24 relative">
      <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
        
        {/* 1. Two-Column Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`font-serif text-5xl md:text-7xl tracking-tight leading-none ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
              Research
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className={`text-lg md:text-xl font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Our research laboratory investigates the physical layers, elastomer chemistry, and micro-grid subpixel architectures of self-powered emissive displays – engineering human-machine interfaces that convert touch pressure into electrical power.
            </p>
          </motion.div>
        </div>

        {/* 2. Publications Index Table with Search Filter */}
        <div id="publications-table" className={`pt-12 border-t ${isDark ? 'border-beige-50/10' : 'border-zinc-950/10'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight leading-none ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>
              Publications
            </h2>
            
            {/* Search Input matching Anthropic design */}
            <div className="relative w-full md:w-64">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-12 py-2 border rounded-full font-mono text-xs focus:outline-none transition-all ${
                  isDark 
                    ? 'bg-zinc-900 border-beige-50/10 text-beige-50 focus:border-beige-50/30' 
                    : 'bg-white border-zinc-950/10 text-zinc-950 focus:border-zinc-950/30'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono transition-colors ${
                    isDark ? 'text-zinc-500 hover:text-beige-300' : 'text-zinc-400 hover:text-zinc-950'
                  }`}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Table Headers (Desktop Only) */}
          <div className={`hidden md:grid grid-cols-[140px_180px_1fr] pb-4 border-b font-mono text-[10px] uppercase tracking-widest ${
            isDark ? 'border-beige-50/10 text-zinc-500' : 'border-zinc-950/10 text-zinc-500'
          }`}>
            <span>Date</span>
            <span>Category</span>
            <span>Title</span>
          </div>

          {/* List Items */}
          <div className="divide-y divide-zinc-950/10 dark:divide-beige-50/10">
            <AnimatePresence>
              {filteredPapers.length > 0 ? (
                filteredPapers.map((paper) => {
                  const formattedDate = new Date(paper.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  return (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Link 
                        to={`/research/${paper.slug}`} 
                        className={`block py-5 group transition-colors duration-200 ${
                          isDark ? 'text-beige-50' : 'text-zinc-950'
                        }`}
                      >
                        {/* Desktop view */}
                        <div className="hidden md:grid grid-cols-[140px_180px_1fr] items-baseline">
                          <span className="font-mono text-xs text-zinc-500">
                            {formattedDate}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                            {paper.category}
                          </span>
                          <span className={`font-serif text-lg leading-snug transition-colors ${
                            isDark ? 'group-hover:text-beige-300' : 'group-hover:text-zinc-700'
                          }`}>
                            {paper.title}
                          </span>
                        </div>

                        {/* Mobile view */}
                        <div className="flex md:hidden flex-col gap-1.5">
                          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                            <span>{formattedDate}</span>
                            <span>•</span>
                            <span>{paper.category}</span>
                          </div>
                          <h3 className={`font-serif text-base leading-snug transition-colors ${
                            isDark ? 'group-hover:text-beige-300' : 'group-hover:text-zinc-700'
                          }`}>
                            {paper.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-8 text-center font-mono text-xs text-zinc-500">
                  No publications matched your search criteria.
                </div>
              )}
            </AnimatePresence>
          </div>
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
        
        <h3 className={`font-serif text-2xl sm:text-3xl mb-6 leading-[1.1] transition-all ${isDark ? 'text-beige-50 group-hover:text-beige-300' : 'text-zinc-950 group-hover:text-zinc-700'}`}>
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



function Footer({ isDark }) {
  return (
    <footer className={`px-6 py-12 relative z-10 border-t transition-colors duration-500 mt-auto ${isDark ? 'bg-zinc-950 border-beige-50/10' : 'bg-beige-50 border-zinc-950/10'}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Hylunian Logo" className={`w-6 h-6 ${isDark ? 'invert' : ''}`} />
            <span className={`font-serif text-2xl tracking-tight leading-none pt-1 transition-colors ${isDark ? 'text-beige-50' : 'text-zinc-950'}`}>Hylunian</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Display that gives back.
          </span>
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
