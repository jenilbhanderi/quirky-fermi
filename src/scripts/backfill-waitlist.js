require('dotenv').config();
const { statements } = require('../db/database');
const { initTransporter, sendWaitlistConfirmation } = require('../services/emailService');

async function backfillWaitlist() {
  console.log('🚀 Initializing Email Transporter...');
  initTransporter();

  // Wait a moment for transporter verification to complete asynchronously
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    console.log('📦 Fetching waitlist entries from database...');
    // Fetch all waitlist entries (limit 10000 should safely cover them)
    const entries = await statements.getAllWaitlist.all(10000, 0);
    
    if (!entries || entries.length === 0) {
      console.log('⚠️ No waitlist entries found.');
      process.exit(0);
    }

    console.log(`✉️ Starting backfill for ${entries.length} users...`);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < entries.length; i++) {
      const email = entries[i].email;
      console.log(`[${i + 1}/${entries.length}] Sending to ${email}...`);
      
      try {
        const info = await sendWaitlistConfirmation(email);
        if (info) {
          successCount++;
        } else {
          failCount++; // If it returns null, it might be due to unconfigured SMTP or error
        }
      } catch (err) {
        console.error(`❌ Failed to send to ${email}:`, err.message);
        failCount++;
      }

      // Add a slight delay to avoid rate-limiting from the SMTP provider (e.g. Gmail limits)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Backfill Complete!');
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);

  } catch (err) {
    console.error('❌ Database error during backfill:', err);
  } finally {
    process.exit(0);
  }
}

backfillWaitlist();
