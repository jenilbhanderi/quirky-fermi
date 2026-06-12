/**
 * Seed script — creates a default admin account.
 * Run with: npm run seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { statements, pool } = require('./database');

const SALT_ROUNDS = 12;

async function seed() {
  const username = 'admin';
  const password = 'hylunian-admin-2026'; // Change this immediately after first login

  console.log('🌱 Seeding database...\n');

  // Check if admin already exists
  const existing = await statements.getAdminByUsername.get(username);
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await statements.insertAdmin.run(username, passwordHash);
    console.log('✅ Default admin account created:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Change this password immediately after your first login!\n');
  } else {
    console.log(`⚠️  Admin user "${username}" already exists. Skipping admin creation.\n`);
  }



  console.log('📚 Seeding Energy-Harvesting Research Papers...');
  await pool.query('TRUNCATE TABLE research_papers RESTART IDENTITY CASCADE');

  const papers = [
    {
      slug: 'decoupling-teng-interference',
      title: 'Decoupling Triboelectric Interference in High-Transmittance TENG Displays',
      abstract: 'A novel architectural approach to isolating contact-electrification noise from capacitive touch signals in fully transparent, >85% transmittance triboelectric nanogenerator arrays.',
      content: '## Abstract\nThe integration of Triboelectric Nanogenerators (TENG) into standard touch-capacitive arrays has historically suffered from signal cross-talk. This paper demonstrates a novel elastomer-based isolation layer that effectively decouples contact-electrification noise, achieving a 99% signal purity while maintaining 88% optical transmittance.\n\n## Methodology\nBy utilizing an ionic liquid-infused polyurethane matrix, we constructed a micro-grid layer between the TENG surface and the capacitive subpixel array...\n\n## Results\nThe array successfully harvested 1.2mW/cm2 during standard typing intervals without causing false-positive touch registers.',
      authors: 'Dr. E. Vance, A. Sterling',
      category: 'TENG Physics',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      slug: 'piezoelectric-elastomeric-composites',
      title: 'Hyper-Stretchable Piezoelectric Composites for Wearable Kinetic Interfaces',
      abstract: 'Formulating a PVDF-based polyurethane-urea elastomer that maintains piezoelectric integrity and optical clarity even under 300% mechanical strain.',
      content: '## Abstract\nWearable interfaces require extreme durability. Traditional ITO-based electrodes fracture under strain. We introduce a PVDF-composite elastomer that generates 0.8V per standard tap while stretching up to 300%.\n\n## Architecture\nThe composite is synthesized via electrospinning, creating an aligned microfiber network that enhances the piezoelectric d33 coefficient...\n\n## Conclusion\nThis material sets a new benchmark for self-powered e-skin and kinetic display interfaces.',
      authors: 'Dr. M. Chen',
      category: 'Materials Science',
      color: 'from-amber-500 to-orange-500'
    },
    {
      slug: 'self-powered-emissive-architecture',
      title: 'Self-Powered Subpixel Emissive Architecture using Transparent Harvesters',
      abstract: 'A comprehensive study on directly routing TENG-harvested energy into localized OLED subpixels to achieve localized micro-illumination without external power.',
      content: '## Abstract\nWe propose a direct-drive micro-architecture where localized triboelectric energy is routed to adjacent OLED subpixels. This achieves instant visual feedback driven entirely by the user’s kinetic touch energy.\n\n## System Design\nThe display matrix is segmented into 100μm autonomous nodes. A press event generates a localized 5V spike, which is rectified and directly drives the blue-diode subpixel...\n\n## Implications\nThis represents the first step toward a completely battery-free human-machine interface for specialized, low-power diagnostic environments.',
      authors: 'J. Bhanderi, T. R&D',
      category: 'Display Architecture',
      color: 'from-fuchsia-500 to-rose-500'
    },
    {
      slug: 'refractive-matching-teng-layers',
      title: 'Refractive Index Matching in Multi-Layer PVDF-TrFE Thin Films',
      abstract: 'Mitigating reflection and scattering boundaries between transparent electrode composites and piezoelectric layers to achieve <1.2% total display reflectance.',
      content: '## Abstract\nMulti-layer transparent piezoelectric displays suffer from parasitic reflections at internal material interfaces. We report an index-matching methodology for poly(vinylidene fluoride-trifluoroethylene) [PVDF-TrFE] thin films using sub-wavelength silicon dioxide nanoparticle dispersions.\n\n## Optical Optimization\nBy tuning the nanoparticle volume fraction, we matched the film index from n = 1.42 to n = 1.48, eliminating parallax refraction...\n\n## Conclusion\nThe resulting multi-layer stack achieved 91% total light transmission and zero visible rainbow artifacts.',
      authors: 'A. Vance, Dr. H. Pascal',
      category: 'Optical Engineering',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      slug: 'elastomer-fatigue-teng-stress',
      title: 'Triboelectric Elastomer Degradation under Empirical Mechanical Stress',
      abstract: 'Evaluating the chemical and electrical fatigue life of transparent polydimethylsiloxane (PDMS) elastomer composites under 100,000 continuous touch stress cycles.',
      content: '## Abstract\nLong-term durability is a critical obstacle for commercial triboelectric display skins. This study monitors the mechanical degradation of micro-structured PDMS over 100,000 cycles. We show that fluorinated silanes maintain surface charge density with minimal structural fatigue.\n\n## Stress Profile\nA pneumatic actuator applied a localized 5N force at 2Hz. Electrical output was tracked in real-time, showing a minor 8% drop in peak voltage after 100k cycles...\n\n## Results\nThe micro-pillars retained their elastic recovery, proving the material is suitable for high-frequency user touch interfaces.',
      authors: 'Dr. K. Zhao, J. Bhanderi',
      category: 'Materials Science',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  for (const p of papers) {
    await statements.insertPaper.run(
      p.slug, p.title, p.abstract, p.content, p.authors, p.category, p.color
    );
  }
  
  console.log('✅ Inserted 3 foundational Energy-Harvesting research papers.');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
