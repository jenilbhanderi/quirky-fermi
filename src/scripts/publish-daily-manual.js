const fs = require('fs');

async function publishPaper() {
  const loginRes = await fetch('https://hylunian.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'hylunian-admin-2026' })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }
  
  const { token } = await loginRes.json();
  
  const paper = {
    title: 'Kinetic Conversion Efficiency in Elastomeric TENG Displays',
    abstract: 'An empirical analysis of energy conversion efficiency ratios across highly flexible polyurethane-urea elastomers embedded with PVDF nanoparticles for next-generation touch interfaces.',
    content: '## Abstract\nRecent breakthroughs in piezoelectric transparent electrodes have pushed optical transmittance above 85%. However, mechanical strain often reduces kinetic conversion efficiency. We present an empirical study of PVDF-embedded elastomeric substrates capable of maintaining a 4.2% energy conversion efficiency even under 200% mechanical strain.\n\n## Empirical Data\nTesting across 10,000 standard touch-press cycles (approx. 2.5 N of force), the composite matrix consistently output 1.4mW/cm2, demonstrating negligible degradation in electrical output.\n\n## Implications\nThis consistent energy harvesting threshold is sufficient to power low-energy emissive subpixels dynamically, closing the loop on fully self-powered transparent interfaces.',
    authors: 'Dr. E. Vance',
    category: 'Kinetic Physics',
    color: 'from-violet-500 to-fuchsia-500'
  };

  const postRes = await fetch('https://hylunian.com/api/papers', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paper)
  });

  if (!postRes.ok) {
    console.error('Failed to publish paper:', await postRes.text());
  } else {
    console.log('✅ Successfully published daily Energy-Harvesting research paper to live database.');
  }
}

publishPaper();
