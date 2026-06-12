import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api'
);

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

export default function ResearchArticle() {
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

  const dateStr = new Date(paper.created_at || paper.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none mb-6 text-zinc-950">
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
        <h3 className="font-serif text-2xl mb-4 text-zinc-950">Hylunian R&D</h3>
        <p className="mb-8 font-light text-zinc-600">Explore our latest technical documentation and publications index.</p>
        <Link to="/research" className="inline-block px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors bg-zinc-950 text-beige-50 hover:bg-zinc-800">
          All Publications
        </Link>
      </div>
    </motion.article>
  );
}
