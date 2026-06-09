require('dotenv').config();
const { statements } = require('../db/database');
const { initTransporter, broadcastDailyPaper } = require('../services/emailService');

async function runBroadcast(paperSlug) {
  initTransporter();

  try {
    let paper;
    if (paperSlug) {
      paper = await statements.getPaperBySlug.get(paperSlug);
    } else {
      const papers = await statements.getAllPapers.all();
      paper = papers[0]; // Gets the most recent
    }

    if (!paper) {
      console.log('No paper found to broadcast.');
      process.exit(0);
    }

    const waitlist = await statements.getWaitlist.all(100000, 0); // Get all users
    const emails = waitlist.map(w => w.email);

    if (emails.length === 0) {
      console.log('No users on waitlist.');
      process.exit(0);
    }

    console.log(`Broadcasting "${paper.title}" to ${emails.length} users...`);
    await broadcastDailyPaper(paper, emails);

    process.exit(0);
  } catch (error) {
    console.error('Broadcast failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const slug = process.argv[2];
  runBroadcast(slug);
}

module.exports = { runBroadcast };
