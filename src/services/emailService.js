import nodemailer from 'nodemailer';

let transporter = null;
let isEmailConfigured = false;

export function initTransporter() {
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

// Initialize transporter proactively
initTransporter();

// Branded HTML Email Template
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
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden;">
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height: 3px; background: linear-gradient(to right, #FF003C, #00FF66, #0033FF);"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
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
                        <td style="width: 8px;"></td>
                        <td style="font-family: monospace; font-size: 14px; font-weight: bold; color: #ffffff; letter-spacing: 2px;">HYLUNIAN</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px; text-align: left;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; color: #ffffff; font-weight: 600; tracking: -0.5px;">Connection Established.</h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Your request to join the waitlist has been successfully recorded. We are building the next generation of enterprise intelligence, driven by high-fidelity optics and cognitive scale.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #141414; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 4px; font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Registered Email</p>
                    <p style="margin: 0; font-size: 15px; color: #ffffff; font-weight: 500;">${email}</p>
                  </td>
                </tr>
              </table>
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
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height: 1px; background-color: rgba(255,255,255,0.06);"></td>
                </tr>
              </table>
            </td>
          </tr>
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

// Send Waitlist Confirmation
export async function sendWaitlistConfirmation(email) {
  const appName = process.env.APP_NAME || 'Hylunian';
  const { html, text } = buildWaitlistEmail(email);

  const mailOptions = {
    from: `"${appName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `You're on the ${appName} waitlist ✦`,
    html,
    text,
  };

  // Re-verify/init transporter if needed
  if (!transporter) {
    initTransporter();
  }

  if (!isEmailConfigured || !transporter) {
    console.log('📧 [Email Preview — SMTP not configured]');
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    console.log('   (Configure SMTP in environment variables to send real emails)\n');
    return null;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${email} (${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`⚠️  Failed to send email to ${email}:`, error.message);
    return null;
  }
}
