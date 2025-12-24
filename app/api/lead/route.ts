import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, context, leadType } = await request.json();

        // Validate - need at least phone OR email
        if (!phone && !email) {
            return NextResponse.json(
                { error: 'Phone number or email is required' },
                { status: 400 }
            );
        }

        // Create transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const isEarlyAccess = leadType === 'early_access';
        const subject = isEarlyAccess
            ? 'New Early Access Request - HITROO'
            : 'New Lead from HITROO AI Chat';

        // Email content
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.LEAD_EMAIL_RECIPIENT,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF79C6;">${isEarlyAccess ? 'Early Access Request' : 'New Lead Captured'}</h2>
          <hr style="border: 1px solid #eee;" />
          
          ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          
          <p><strong>${isEarlyAccess ? 'Why they are interested:' : 'User Query / Context:'}</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${context || 'No context provided'}
          </div>
          
          <p><strong>Type:</strong> ${isEarlyAccess ? 'Early Access Signup' : 'AI Chat Lead'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          
          <hr style="border: 1px solid #eee;" />
          <p style="color: #888; font-size: 12px;">Captured from HITROO website.</p>
        </div>
      `,
            text: `
${isEarlyAccess ? 'Early Access Request' : 'New Lead'} - HITROO

${name ? `Name: ${name}` : ''}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}
Context: ${context || 'No context provided'}
Type: ${isEarlyAccess ? 'Early Access' : 'AI Chat'}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Submitted successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { error: 'Failed to submit. Please try calling us directly.' },
            { status: 500 }
        );
    }
}
