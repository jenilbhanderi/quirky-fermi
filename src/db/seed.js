/**
 * Seed script — creates a default admin account.
 * Run with: npm run seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { statements } = require('./database');

const SALT_ROUNDS = 12;

async function seed() {
  const username = 'admin';
  const password = 'hylunian-admin-2026'; // Change this immediately after first login

  console.log('🌱 Seeding database...\n');

  // Check if admin already exists
  const existing = await statements.getAdminByUsername.get(username);
  if (existing) {
    console.log(`⚠️  Admin user "${username}" already exists. Skipping.\n`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await statements.insertAdmin.run(username, passwordHash);

  console.log('✅ Default admin account created:');
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log('\n⚠️  Change this password immediately after your first login!\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
