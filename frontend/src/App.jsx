import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, ChevronRight, Sun, Moon, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Legal from './Legal';
import AdminDashboard from './AdminDashboard';
import HardwareSpecs from './HardwareSpecs';

// ─── API Configuration ──────────────────────────────────────
// In production, frontend and backend share the same origin, so use relative /api.
// In dev, Vite runs on :5173 and backend on :3001, so we need the full URL.
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

export default function App() {
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({});
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/settings`).then(r => r.ok ? r.json() : {}),
      fetch(`${API_BASE}/papers`).then(r => r.ok ? r.json() : [])
    ]).then(([settingsData, papersData]) => {
      setSettings(settingsData);
      setPapers(papersData);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch data', err);
      setLoading(false);
    });
  }, []);

  const isDark = theme === 'dark';

  return (
    <Router>
      <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-[#050505] text-zinc-100 selection:bg-white/20' : 'bg-zinc-50 text-zinc-900 selection:bg-black/20'}`}>
        
        {/* Ambient Backlight / Optical Flare Effects */}
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center transition-all duration-700 ${isDark ? 'mix-blend-screen' : 'mix-blend-normal'}`}>
          <div 
            className={`absolute w-[60vw] h-[60vw] rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4 transition-opacity duration-700 ${isDark ? 'opacity-30' : 'opacity-[0.25]'}`} 
            style={{ backgroundColor: '#FF003C' }} 
          />
          <div 
            className={`absolute w-[50vw] h-[50vw] rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 transition-opacity duration-700 ${isDark ? 'opacity-30' : 'opacity-[0.25]'}`} 
            style={{ backgroundColor: '#00FF66' }} 
          />
          <div 
            className={`absolute w-[55vw] h-[55vw] rounded-full blur-[100px] translate-y-1/3 transition-opacity duration-700 ${isDark ? 'opacity-30' : 'opacity-[0.25]'}`} 
            style={{ backgroundColor: '#0033FF' }} 
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar theme={theme} setTheme={setTheme} isDark={isDark} />
          <main className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={
                loading ? (
                  <div className="min-h-[80vh] flex items-center justify-center opacity-50">Initializing...</div>
                ) : (
                  <>
                    <HeroSection isDark={isDark} settings={settings} />
                    {papers.length > 0 && <ResearchSection isDark={isDark} papers={papers} />}
                  </>
                )
              } />
              <Route path="/research/:slug" element={<ResearchArticle isDark={isDark} />} />
              <Route path="/legal" element={<Legal isDark={isDark} />} />
              <Route path="/admin" element={<AdminDashboard isDark={isDark} />} />
              <Route path="/specs" element={<HardwareSpecs isDark={isDark} />} />
            </Routes>
          </main>
          <Footer isDark={isDark} />
        </div>
      </div>
    </Router>
  );
}

// --- Components ---

function Navbar({ theme, setTheme, isDark }) {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center"
    >
      <div className={`flex items-center justify-between w-full max-w-5xl px-6 py-4 rounded-full backdrop-blur-xl transition-all duration-500 shadow-xl ${isDark ? 'bg-black/40 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white/60 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.05)]'}`}>
        
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Hylunian Logo" className="w-8 h-8" />
          <span className={`font-semibold tracking-tight text-lg ${isDark ? 'text-white' : 'text-black'}`}>Hylunian</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors ${isDark ? 'bg-black/60 border-white/5' : 'bg-black/5 border-black/5'}`}>
            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_#00FF66]" style={{ backgroundColor: '#00FF66' }}></div>
            <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>R&D Lab Phase</span>
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

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
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    fetch(`${API_BASE}/waitlist/count`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.total === 'number') {
          // Adding a base aesthetic offset of 142 (simulates earlier un-tracked signups) to build initial social proof
          setWaitlistCount(data.total + 142);
        }
      })
      .catch(() => {});
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setCursorPos({ x: -1000, y: -1000 });
  };

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
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Emissive Cursor Aura */}
      <div 
        className={`absolute pointer-events-none rounded-full blur-[80px] transition-opacity duration-300 ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{
          width: '500px',
          height: '500px',
          background: isDark ? 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)' : 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 60%)',
          transform: `translate(${cursorPos.x - 250}px, ${cursorPos.y - 250}px)`,
          left: 0,
          top: 0,
          zIndex: 0
        }}
      />
      <div className="max-w-4xl mx-auto w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tighter leading-[1.1] transition-colors whitespace-pre-line ${isDark ? 'text-white' : 'text-black'}`}>
            {heroTitle}
          </h1>

          {/* Body */}
          <p className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {heroSubtitle}
          </p>

          {/* Waitlist Form */}
          <div id="waitlist" className="pt-8 flex flex-col items-center justify-center scroll-mt-32">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-3 px-8 py-5 rounded-full border backdrop-blur-lg ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-black'}`}
              >
                <div className="w-2 h-2 rounded-full shadow-[0_0_10px_#00FF66]" style={{ backgroundColor: '#00FF66' }}></div>
                <span className="font-medium">Access request received. We will be in touch.</span>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center w-full max-w-lg p-1.5 rounded-full border backdrop-blur-xl transition-all shadow-2xl ${isDark ? 'bg-white/5 border-white/10 focus-within:bg-white/10 focus-within:border-white/20' : 'bg-white border-black/10 focus-within:bg-zinc-50 focus-within:border-black/20'}`}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className={`w-full px-6 py-4 bg-transparent focus:outline-none transition-colors ${isDark ? 'text-white placeholder-zinc-500' : 'text-black placeholder-zinc-400'}`}
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full sm:w-auto px-8 py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50 relative ${isDark ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-black text-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]'}`}
                  >
                    {isLoading ? 'Submitting...' : ctaText}
                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </motion.button>
                </form>
                {waitlistCount !== null && !error && !isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className={`mt-5 text-sm font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                  >
                    Join <span className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{waitlistCount}+</span> researchers on the waitlist.
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ResearchSection({ isDark, papers }) {
  return (
    <section className="px-6 py-32 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 shadow-inner transition-colors ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-black/5 border-black/10 text-zinc-600'}`}
          >
            <Layers className="w-5 h-5" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl md:text-5xl font-semibold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-black'}`}
          >
            Optical Research & Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-lg max-w-2xl font-light transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
          >
            Review our foundational hardware documentation outlining the architectural leaps in Hylunian's emissive technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  const gradientClass = paper.color && paper.color.includes('from-') ? paper.color : 'from-blue-500 to-purple-500';

  return (
    <div className={`group relative h-full flex flex-col p-8 rounded-3xl border backdrop-blur-md overflow-hidden transition-colors duration-500 cursor-pointer ${isDark ? 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/80' : 'bg-white border-black/5 hover:bg-zinc-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
      
      {/* Soft Hover Backlight */}
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 ease-out pointer-events-none ${gradientClass}`} />
      
      <div className="relative z-10 flex-grow">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6 transition-colors ${isDark ? 'bg-black/80 border-white/10 text-zinc-300' : 'bg-zinc-100 border-black/5 text-zinc-600'}`}>
          {paper.category || 'Research'}
        </div>
        
        <h3 className={`text-xl font-semibold mb-4 leading-snug transition-all ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400' : 'text-black group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-500'}`}>
          {paper.title}
        </h3>
        
        <p className={`text-sm font-light leading-relaxed mb-8 transition-colors line-clamp-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {paper.abstract}
        </p>
      </div>

      <div className={`relative z-10 mt-auto pt-6 flex items-center justify-between border-t transition-colors ${isDark ? 'border-white/10' : 'border-black/5'}`}>
        <span className={`text-xs font-medium transition-colors ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          {dateStr}
        </span>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 group-hover:scale-110 ${isDark ? 'bg-white/10 group-hover:bg-white/20 text-white' : 'bg-black/5 group-hover:bg-black/10 text-black'}`}>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function ResearchArticle({ isDark }) {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/papers/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => {
        setPaper(data);
        // Dynamic SEO injection
        document.title = `${data.title} - Hylunian Research`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = data.abstract || data.title;
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = data.title;
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = data.abstract || data.title;
      })
      .catch(() => setError(true));
      
    return () => {
      // Cleanup on unmount
      document.title = 'Hylunian - Display Technology Research';
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = "Hylunian develops proprietary display architectures, focusing on hardware-level HMI integration, optical clarity, and subpixel optimization.";
    };
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-4">Paper Not Found</h1>
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="opacity-50">Loading article...</div>
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
      <Link to="/" className={`inline-flex items-center gap-2 text-sm mb-12 transition-colors hover:underline ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Hylunian
      </Link>
      
      <header className="mb-16">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6 transition-colors ${isDark ? 'bg-black/80 border-white/10 text-zinc-300' : 'bg-zinc-100 border-black/5 text-zinc-600'}`}>
          {paper.category || 'Research'}
        </div>
        <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
          {paper.title}
        </h1>
        <div className={`text-sm flex flex-wrap gap-4 items-center ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {paper.authors && <span>By {paper.authors}</span>}
          <span>Published on {dateStr}</span>
        </div>
      </header>

      <div className={`prose prose-lg max-w-none transition-colors duration-500 ${isDark ? 'prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-strong:text-white' : 'prose-zinc prose-p:text-zinc-600 prose-headings:text-zinc-900'}`}>
        {paper.content ? (
          <ReactMarkdown>{paper.content}</ReactMarkdown>
        ) : (
          <p className="italic">This paper does not have full text available.</p>
        )}
      </div>

      <div className={`mt-24 p-8 rounded-3xl border text-center transition-colors ${isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-zinc-50 border-black/10'}`}>
        <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>Don't miss the next breakthrough</h3>
        <p className={`mb-6 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Get our daily display technology research delivered straight to your inbox.</p>
        <a href="/#waitlist" className={`inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-colors ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
          Request Early Access
        </a>
      </div>
    </motion.article>
  );
}

function Footer({ isDark }) {
  return (
    <footer className={`px-6 py-12 relative z-10 border-t transition-colors duration-500 mt-auto ${isDark ? 'bg-[#050505] border-white/5' : 'bg-zinc-100 border-black/5'}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          
          {/* Full-Sized Custom Logo for Footer (Matches Navbar perfectly) */}
          <img src="/favicon.svg" alt="Hylunian Logo" className="w-8 h-8" />
          
          <span className={`font-semibold tracking-tight text-lg transition-colors ${isDark ? 'text-white' : 'text-black'}`}>Hylunian</span>
        </div>
        
        <div className="flex gap-8 text-sm font-light">
          <a href="mailto:contact@hylunian.com" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>Lab Contact</a>
          <Link to="/legal" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>Privacy & Legal</Link>
          <Link to="/specs" className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>Hardware Specs</Link>
        </div>
        
        <div className={`text-sm transition-colors ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          &copy; {new Date().getFullYear()} Hylunian.
        </div>
      </div>
    </footer>
  );
}
