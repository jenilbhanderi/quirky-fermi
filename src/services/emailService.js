const nodemailer = require('nodemailer');

// ─── SMTP Configuration ────────────────────────────────────
let transporter = null;
let isEmailConfigured = false;

function initTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('⚠️  SMTP not configured — emails will be logged to console instead.');
    return;
  }

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
  });

  transporter
    .verify()
    .then(() => {
      isEmailConfigured = true;
      console.log('✅ SMTP connection verified');
    })
    .catch((err) => {
      console.error('⚠️  SMTP verification failed:', err.message);
      console.log('   Emails will be logged to console as fallback.');
    });
}

// ─── Branded HTML Email Template ────────────────────────────
function buildWaitlistEmail(email) {
  const appName = process.env.APP_NAME || 'Hylunian';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden;">
          
          <!-- Header with RGB accent bar -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height: 3px; background: linear-gradient(to right, #FF003C, #00FF66, #0033FF);"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Logo area -->
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
              <!-- RGB Subpixel Logo -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #141414; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 4px; height: 18px; background-color: #FF003C; border-radius: 2px;"></td>
                        <td style="width: 4px;"></td>
                        <td style="width: 4px; height: 18px; background-color: #00FF66; border-radius: 2px;"></td>
                        <td style="width: 4px;"></td>
                        <td style="width: 4px; height: 18px; background-color: #0033FF; border-radius: 2px;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">${appName}</p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 600; color: #ffffff; text-align: center; letter-spacing: -0.5px; line-height: 1.3;">
                You're on the list.
              </h1>
              <p style="margin: 0 0 24px; font-size: 15px; color: #a1a1aa; text-align: center; line-height: 1.7;">
                Your access request has been received. We're engineering the future of light — and you'll be among the first to experience it.
              </p>
              
              <!-- Status badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 28px;">
                <tr>
                  <td style="background-color: rgba(0, 255, 102, 0.08); border: 1px solid rgba(0, 255, 102, 0.2); border-radius: 100px; padding: 10px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 8px; height: 8px; background-color: #00FF66; border-radius: 50%;"></td>
                        <td style="width: 10px;"></td>
                        <td style="font-size: 13px; font-weight: 600; color: #00FF66; letter-spacing: 0.5px;">ACCESS REQUEST CONFIRMED</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Registered email display -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 4px; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Registered Email</p>
                    <p style="margin: 0; font-size: 15px; color: #ffffff; font-weight: 500;">${email}</p>
                  </td>
                </tr>
              </table>

              <!-- What's next -->
              <p style="margin: 0 0 12px; font-size: 13px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">What happens next</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; height: 24px; background-color: rgba(255, 0, 60, 0.1); border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="font-size: 11px; color: #FF003C; font-weight: 700;">1</span>
                        </td>
                        <td style="width: 12px;"></td>
                        <td style="font-size: 14px; color: #d4d4d8; line-height: 1.5;">We review your access request</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; height: 24px; background-color: rgba(0, 255, 102, 0.1); border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="font-size: 11px; color: #00FF66; font-weight: 700;">2</span>
                        </td>
                        <td style="width: 12px;"></td>
                        <td style="font-size: 14px; color: #d4d4d8; line-height: 1.5;">You'll receive an invitation when a spot opens</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 24px; height: 24px; background-color: rgba(0, 51, 255, 0.1); border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="font-size: 11px; color: #0033FF; font-weight: 700;">3</span>
                        </td>
                        <td style="width: 12px;"></td>
                        <td style="font-size: 14px; color: #d4d4d8; line-height: 1.5;">Get early access to Hylunian hardware</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height: 1px; background-color: rgba(255,255,255,0.06);"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #52525b;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #3f3f46;">
                Engineering the future of light.
              </p>
            </td>
          </tr>
          
        </table>
        <!-- /Main card -->
        
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to ${appName}!

Your access request has been confirmed.

Registered email: ${email}

What happens next:
1. We review your access request
2. You'll receive an invitation when a spot opens
3. Get early access to Hylunian hardware

© ${new Date().getFullYear()} ${appName}. All rights reserved.`;

  return { html, text };
}

// ─── Send Waitlist Confirmation ─────────────────────────────
async function sendWaitlistConfirmation(email) {
  const appName = process.env.APP_NAME || 'Hylunian';
  const { html, text } = buildWaitlistEmail(email);

  const mailOptions = {
    from: `"${appName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `You're on the ${appName} waitlist ✦`,
    html,
    text,
  };

  // Fallback: log to console if SMTP not configured
  if (!isEmailConfigured || !transporter) {
    console.log('📧 [Email Preview — SMTP not configured]');
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    console.log('   (Configure SMTP in .env to send real emails)\n');
    return null;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${email} (${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`⚠️  Failed to send email to ${email}:`, error.message);
    // Don't throw — email failure shouldn't block the signup
    return null;
  }
}

// ─── Branded Broadcast Email Template ────────────────────────
function buildBroadcastEmail(paper) {
  const appName = process.env.APP_NAME || 'Hylunian';
  const paperLink = `https://${process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',')[0].replace('https://', '') : 'hylunian.com'}/research/${paper.slug}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Research: ${paper.title}</title>
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #050505; color: #fff; font-family: sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; overflow: hidden;">
    <div style="height: 3px; background: linear-gradient(to right, #FF003C, #00FF66, #0033FF);"></div>
    <div style="padding: 40px;">
      <h2 style="font-size: 24px; margin-top: 0;">${paper.title}</h2>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">${paper.abstract}</p>
      <div style="margin-top: 30px;">
        <a href="${paperLink}" style="background: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">Read Full Paper</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `New Research from ${appName}: ${paper.title}\n\n${paper.abstract}\n\nRead more at: ${paperLink}`;
  return { html, text };
}

// ─── Send Broadcast ─────────────────────────────────────────
async function broadcastDailyPaper(paperData, waitlistEmails) {
  const appName = process.env.APP_NAME || 'Hylunian';
  const { html, text } = buildBroadcastEmail(paperData);

  if (!isEmailConfigured || !transporter) {
    console.log(`📧 [Broadcast Preview] Would send to ${waitlistEmails.length} users: ${paperData.title}`);
    return null;
  }

  const promises = waitlistEmails.map(email => {
    return transporter.sendMail({
      from: `"${appName} Research" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `New Display Tech Research: ${paperData.title}`,
      html,
      text,
    }).catch(err => console.error(`⚠️ Failed to broadcast to ${email}`, err.message));
  });

  await Promise.all(promises);
  console.log(\`✅ Broadcasted to \${waitlistEmails.length} users.\`);
}

module.exports = { initTransporter, sendWaitlistConfirmation, broadcastDailyPaper };
