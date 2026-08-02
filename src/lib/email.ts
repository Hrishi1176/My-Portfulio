import nodemailer from "nodemailer";

interface SendContactEmailProps {
  toEmail: string;
  userName: string;
  subject: string;
  requirements: string;
  budget: string;
}

export async function sendThankYouEmail({
  toEmail,
  userName,
  subject,
  requirements,
  budget,
}: SendContactEmailProps) {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser || "hrishisgp97@gmail.com";

  // Check if SMTP credentials exist
  if (!smtpUser || !smtpPass) {
    console.log(
      `[DEV EMAIL SIMULATION] SMTP credentials not set in .env.local. Thank you email would be sent to: ${toEmail} (${userName})`
    );
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // ── 1. Client Thank You Email Template ──
    const clientHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Reaching Out</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080612; color: #e2e8f0; margin: 0; padding: 20px; -webkit-font-smoothing: antialiased; }
    .email-card { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(168,85,247,0.25); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header-banner { background: linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header-title { font-size: 26px; font-weight: 800; margin: 0; tracking: -0.02em; letter-spacing: -0.5px; }
    .header-subtitle { font-size: 13px; font-weight: 500; opacity: 0.9; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 12px; }
    .body-content { padding: 32px 28px; line-height: 1.65; color: #cbd5e1; font-size: 15px; }
    .greeting { font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 12px; }
    .summary-card { background: #1e293b; border-radius: 14px; padding: 20px; margin: 24px 0; border: 1px solid #334155; }
    .summary-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #c084fc; tracking: 1px; margin-bottom: 12px; letter-spacing: 1px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .meta-table td { padding: 6px 0; font-size: 13px; }
    .meta-label { color: #94a3b8; font-weight: 600; width: 120px; }
    .meta-value { color: #f1f5f9; font-weight: 600; }
    .quote-box { background: #090d16; border-left: 3px solid #a855f7; padding: 12px 16px; border-radius: 8px; font-style: italic; color: #e2e8f0; font-size: 14px; margin-top: 8px; }
    .timeline { margin: 24px 0; padding-left: 0; list-style: none; }
    .timeline-item { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 13px; }
    .timeline-step { background: #a855f7; color: #fff; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; margin-right: 12px; flex-shrink: 0; margin-top: 2px; }
    .action-row { text-align: center; margin: 28px 0 12px 0; }
    .btn-primary { display: inline-block; padding: 13px 28px; background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; shadow: 0 4px 15px rgba(147,51,234,0.4); }
    .footer { background: #090d16; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
    .footer-links a { color: #a855f7; text-decoration: none; margin: 0 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="header-banner">
      <div class="badge">✓ Request Confirmation</div>
      <h1 class="header-title">Hrishi Bhattacharya</h1>
      <div class="header-subtitle">Senior Software Developer & Full Stack Engineer</div>
    </div>

    <div class="body-content">
      <div class="greeting">Hi ${userName},</div>
      <p>Thank you for reaching out through my portfolio portal! Your project inquiry regarding <strong>"${subject}"</strong> has been successfully received and saved to my database.</p>

      <div class="summary-card">
        <div class="summary-title">📋 Submitted Requirement Summary</div>
        <table class="meta-table">
          <tr>
            <td class="meta-label">Full Name:</td>
            <td class="meta-value">${userName}</td>
          </tr>
          <tr>
            <td class="meta-label">Email Address:</td>
            <td class="meta-value">${toEmail}</td>
          </tr>
          <tr>
            <td class="meta-label">Subject / Topic:</td>
            <td class="meta-value">${subject}</td>
          </tr>
          <tr>
            <td class="meta-label">Est. Budget:</td>
            <td class="meta-value">${budget}</td>
          </tr>
        </table>
        <div class="quote-box">
          "${requirements}"
        </div>
      </div>

      <div style="font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Next Steps:</div>
      <ul class="timeline">
        <li class="timeline-item">
          <span class="timeline-step">1</span>
          <span><strong>Request Received & Logged</strong> — Your query is safely stored in database.</span>
        </li>
        <li class="timeline-item">
          <span class="timeline-step">2</span>
          <span><strong>Technical Review</strong> — I am reviewing your project scope and architecture requirements.</span>
        </li>
        <li class="timeline-item">
          <span class="timeline-step">3</span>
          <span><strong>Direct Reply (within 24 hours)</strong> — I will contact you via email or WhatsApp to schedule a discussion.</span>
        </li>
      </ul>

      <div class="action-row">
        <a href="https://github.com/Hrishi1176" class="btn-primary" target="_blank">Explore GitHub Projects</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin-bottom: 12px;"><strong>Hrishi Bhattacharya</strong> • Senior Software Developer<br>Kolkata, West Bengal, India</p>
      <div class="footer-links">
        <a href="https://github.com/Hrishi1176" target="_blank">GitHub</a> •
        <a href="https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/" target="_blank">LinkedIn</a> •
        <a href="https://wa.me/916294660141" target="_blank">WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Send thank you email to client
    const clientMailOptions = {
      from: `"Hrishi Bhattacharya" <${fromEmail}>`,
      to: toEmail,
      subject: `Thank you for reaching out! — Re: ${subject}`,
      html: clientHtmlContent,
    };

    const info = await transporter.sendMail(clientMailOptions);
    console.log("Thank-you email dispatched to user successfully:", info.messageId);

    // ── 2. Admin Notification Email Template (Sent to Hrishi) ──
    const adminHtmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid #334155;">
    <h2 style="color: #a855f7; margin-top: 0;">🚀 New Project Requirement Received!</h2>
    <p>A user submitted a new query on your portfolio site:</p>
    <ul>
      <li><strong>Name:</strong> ${userName}</li>
      <li><strong>Email:</strong> ${toEmail}</li>
      <li><strong>Subject:</strong> ${subject}</li>
      <li><strong>Budget:</strong> ${budget}</li>
    </ul>
    <div style="background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7;">
      <strong>Requirements:</strong><br>
      ${requirements}
    </div>
    <div style="margin-top: 20px; text-align: center;">
      <a href="mailto:${toEmail}" style="background: #9333ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reply to Client</a>
    </div>
  </div>
</body>
</html>
    `;

    // Also notify Hrishi if toEmail is not Hrishi's own email
    if (toEmail.toLowerCase() !== fromEmail.toLowerCase()) {
      await transporter.sendMail({
        from: `"Portfolio Alerts" <${fromEmail}>`,
        to: fromEmail,
        subject: `🔥 New Contact Submission from ${userName} (${subject})`,
        html: adminHtmlContent,
      });
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending emails:", error);
    return { success: false, error };
  }
}
