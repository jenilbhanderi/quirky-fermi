import { NextResponse } from 'next/server';
import { statements } from '@/db/database';
import { sendWaitlistConfirmation } from '@/services/emailService';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate
    const existing = await statements.getWaitlistByEmail.get(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist.' },
        { status: 409 }
      );
    }

    // Resolve client IP address
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

    // Insert waitlist user
    const result = await statements.insertWaitlist.run(normalizedEmail, ip);

    // Trigger non-blocking waitlist confirmation email
    sendWaitlistConfirmation(normalizedEmail).catch((err) => {
      console.error(`⚠️ Failed to send waitlist confirmation to ${normalizedEmail}:`, err.message);
    });

    return NextResponse.json(
      { message: 'Access request received. We will be in touch.', id: result.lastInsertRowid },
      { status: 201 }
    );
  } catch (err) {
    console.error('❌ API Error in waitlist handler:', err);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
