import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Legal() {
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
        <div className="font-mono text-[11px] uppercase tracking-widest mb-6 text-zinc-500">
          [ Compliance ]
        </div>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight leading-none mb-6 text-zinc-950">
          Legal Practices & Privacy
        </h1>
        <p className="text-lg font-light text-zinc-600">
          Our commitment to your privacy, data security, and legal compliance.
        </p>
      </header>

      <div className="prose prose-lg max-w-none prose-zinc prose-p:text-zinc-600 prose-headings:text-zinc-900 prose-headings:font-serif">
        <h2>1. Privacy Policy</h2>
        <p>At Hylunian, we prioritize your privacy. We collect only the information necessary to provide our services and communicate with you, such as your email address when you join our waitlist or subscribe to our research papers.</p>
        <p>We do not sell, rent, or trade your personal information to third parties. All data is securely stored and protected by industry-standard encryption protocols.</p>
        
        <h2>2. Terms of Service</h2>
        <p>By accessing our website and consuming our research papers on display technology, you agree to use our content for informational purposes only. The research we publish, unless otherwise stated, is proprietary or derived from public scientific literature properly cited.</p>
        
        <h2>3. Intellectual Property</h2>
        <p>All original research papers, architectural diagrams, and written content published on this site are the intellectual property of Hylunian. You may not reproduce or distribute this content without express written permission, except for brief excerpts with proper attribution.</p>
        
        <h2>4. Data Deletion & Rights</h2>
        <p>You have the right to request the deletion of your email from our databases at any time. Simply reply to any of our communications or contact our support team, and we will promptly erase your records in accordance with GDPR and CCPA guidelines.</p>

        <h2>5. Compliance</h2>
        <p>We are dedicated to adhering to international legal standards regarding data collection and user privacy. We regularly review our practices to ensure compliance with the latest regulations.</p>
      </div>
    </motion.article>
  );
}
