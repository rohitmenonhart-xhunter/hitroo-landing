import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const {
            name,
            email,
            phone,
            linkedin,
            portfolio,
            whyHitroo,
            whyPosition,
            experience,
            availability,
            position,
            positionTitle,
            resumeName,
            resumeData
        } = data;

        if (!name || !email || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // Prepare attachment if resume exists
        const attachments = [];
        if (resumeData && resumeName) {
            // Remove the data URL prefix to get pure base64
            const base64Data = resumeData.replace(/^data:application\/pdf;base64,/, '');
            attachments.push({
                filename: resumeName,
                content: base64Data,
                encoding: 'base64',
            });
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.LEAD_EMAIL_RECIPIENT,
            subject: `New Job Application: ${positionTitle} - ${name}`,
            attachments,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #FF79C6;">New Job Application</h2>
          <hr style="border: 1px solid #eee;" />
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; width: 150px;">Position</td>
              <td style="padding: 10px;">${positionTitle} (${position})</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Name</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Email</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone</td>
              <td style="padding: 10px;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            ${linkedin ? `
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">LinkedIn</td>
              <td style="padding: 10px;"><a href="${linkedin}">${linkedin}</a></td>
            </tr>
            ` : ''}
            ${portfolio ? `
            <tr>
              <td style="padding: 10px; font-weight: bold;">Portfolio/GitHub</td>
              <td style="padding: 10px;"><a href="${portfolio}">${portfolio}</a></td>
            </tr>
            ` : ''}
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Experience</td>
              <td style="padding: 10px;">${experience || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Availability</td>
              <td style="padding: 10px;">${availability || 'Not specified'}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 20px;">Why HITROO?</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${whyHitroo || 'Not provided'}
          </div>
          
          <h3 style="color: #333; margin-top: 20px;">Why This Position?</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${whyPosition || 'Not provided'}
          </div>
          
          ${resumeName ? `
          <p style="margin-top: 20px;"><strong>📎 Resume attached:</strong> ${resumeName}</p>
          ` : '<p style="color: #888;">No resume attached</p>'}
          
          <hr style="border: 1px solid #eee; margin-top: 30px;" />
          <p style="color: #888; font-size: 12px;">
            Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            <br/>This application was submitted via the HITROO Careers page.
          </p>
        </div>
      `,
            text: `
New Job Application - ${positionTitle}

Name: ${name}
Email: ${email}
Phone: ${phone}
LinkedIn: ${linkedin || 'Not provided'}
Portfolio: ${portfolio || 'Not provided'}
Experience: ${experience || 'Not specified'}
Availability: ${availability || 'Not specified'}

Why HITROO?
${whyHitroo || 'Not provided'}

Why This Position?
${whyPosition || 'Not provided'}

Resume: ${resumeName ? 'Attached' : 'Not provided'}

Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Career application error:', error);
        return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }
}
