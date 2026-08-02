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

    // ── 1. Fully Responsive Client Thank You Email Template ──
    const clientHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Inquiry Received — Hrishi Bhattacharya</title>
  <style>
    /* Reset & Base Styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #080612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }
    
    /* Responsive Breakpoints */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .header-padding { padding: 28px 18px !important; }
      .body-padding { padding: 24px 18px !important; }
      .summary-padding { padding: 16px 14px !important; }
      .btn-responsive { width: 100% !important; text-align: center !important; box-sizing: border-box !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .title-text { font-size: 22px !important; }
    }
  </style>
</head>
<body style="background-color: #080612; margin: 0; padding: 20px 0;">

  <!-- Main Container Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Wrapper Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(168,85,247,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" class="header-padding" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 36px 28px; text-align: center; color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #ffffff; margin-bottom: 14px;">
                      ✓ Inquiry Confirmed
                    </span>
                  </td>
                </tr>
              </table>
              <h1 class="title-text" style="margin: 0; font-size: 26px; font-weight: 800; tracking: -0.02em; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                Hrishi Bhattacharya
              </h1>
              <div style="font-size: 13px; font-weight: 600; opacity: 0.95; margin-top: 6px; color: #e0e7ff; letter-spacing: 0.5px;">
                Senior Software Developer & Full Stack Engineer
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="body-padding" style="padding: 32px 28px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
              
              <div style="font-size: 18px; font-weight: 700; color: #f8fafc; margin-bottom: 12px;">
                Dear ${userName},
              </div>

              <p style="margin-top: 0; margin-bottom: 20px;">
                Thank you for reaching out! Your project requirement regarding <strong style="color: #c084fc;">&quot;${subject}&quot;</strong> has been successfully received. I am reviewing your request and will get back to you shortly with technical insights and next steps.
              </p>

              <!-- Requirement Summary Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; margin: 24px 0;">
                <tr>
                  <td class="summary-padding" style="padding: 22px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #c084fc; margin-bottom: 14px;">
                      📋 Submitted Project Details
                    </div>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600; width: 130px;">Client Name:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #f1f5f9; font-weight: 700;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">Email Address:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #f1f5f9; font-weight: 700;">${toEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">Subject / Topic:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #f1f5f9; font-weight: 700;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">Estimated Budget:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #38bdf8; font-weight: 700;">${budget}</td>
                      </tr>
                    </table>

                    <!-- Quote Block -->
                    <div style="margin-top: 14px; background-color: #0b0f19; border-left: 3px solid #a855f7; border-radius: 8px; padding: 12px 16px; font-style: italic; color: #e2e8f0; font-size: 13px; line-height: 1.6;">
                      &quot;${requirements}&quot;
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Process Timeline -->
              <div style="font-weight: 700; color: #f8fafc; font-size: 15px; margin-bottom: 12px;">
                What Happens Next?
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #a855f7; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; font-weight: 800; font-size: 11px; line-height: 22px; margin-right: 10px;">1</td>
                        <td style="padding-left: 10px; font-size: 13px; color: #cbd5e1;">
                          <strong style="color: #ffffff;">Technical Assessment:</strong> Reviewing project scope, features, and architecture requirements.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #a855f7; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; font-weight: 800; font-size: 11px; line-height: 22px; margin-right: 10px;">2</td>
                        <td style="padding-left: 10px; font-size: 13px; color: #cbd5e1;">
                          <strong style="color: #ffffff;">Direct Response (within 24 hours):</strong> I will contact you via email or WhatsApp to schedule a discussion.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Callouts -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://github.com/Hrishi1176" target="_blank" class="btn-responsive" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 6px 20px rgba(124,58,237,0.4);">
                      Explore My GitHub Projects →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0f19; padding: 24px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
              
              <div style="font-weight: 700; color: #94a3b8; font-size: 13px; margin-bottom: 4px;">
                Hrishi Bhattacharya
              </div>
              <div style="color: #64748b; margin-bottom: 12px;">
                Senior Software Developer & Full Stack Engineer<br>
                Kolkata & Cooch Behar, West Bengal, India
              </div>

              <!-- Contact Pills -->
              <div style="margin-bottom: 16px;">
                <a href="mailto:hrishisgp97@gmail.com" style="color: #c084fc; text-decoration: none; font-weight: 600; margin: 0 6px;">hrishisgp97@gmail.com</a> •
                <a href="https://wa.me/916294660141" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 600; margin: 0 6px;">WhatsApp: +91 62946 60141</a>
              </div>

              <!-- Social Links -->
              <div style="font-size: 11px; color: #475569;">
                <a href="https://github.com/Hrishi1176" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">GitHub</a> |
                <a href="https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">LinkedIn</a> |
                <a href="https://work-pilot-ai.vercel.app" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">WorkPilot AI</a> |
                <a href="https://cloud-ledger-coral.vercel.app" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">CloudLedger</a>
              </div>

              <div style="margin-top: 16px; font-size: 10px; color: #334155;">
                © ${new Date().getFullYear()} Hrishi Bhattacharya. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    // Send thank you email to client
    const clientMailOptions = {
      from: `"Hrishi Bhattacharya" <${fromEmail}>`,
      to: toEmail,
      subject: `Inquiry Received: ${subject} — Hrishi Bhattacharya`,
      html: clientHtmlContent,
    };

    const info = await transporter.sendMail(clientMailOptions);
    console.log("Thank-you email dispatched to client successfully:", info.messageId);

    // ── 2. Professional Admin Notification Email Template (Sent to Hrishi) ──
    const adminHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #080612; color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 28px; border: 1px solid rgba(168,85,247,0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-b: 1px solid #334155; padding-bottom: 16px;">
      <h2 style="color: #c084fc; margin: 0; font-size: 20px;">🚀 New Portfolio Client Inquiry</h2>
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; width: 120px; font-weight: 600;">Client Name:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700;">${userName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Client Email:</td>
        <td style="padding: 6px 0; color: #38bdf8; font-weight: 700;">
          <a href="mailto:${toEmail}" style="color: #38bdf8; text-decoration: none;">${toEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Subject Topic:</td>
        <td style="padding: 6px 0; color: #ffffff; font-weight: 700;">${subject}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Budget Range:</td>
        <td style="padding: 6px 0; color: #4ade80; font-weight: 700;">${budget}</td>
      </tr>
    </table>

    <div style="background-color: #0f172a; padding: 18px; border-radius: 12px; border-left: 4px solid #c084fc; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px;">
        Requirements Message:
      </div>
      <div style="font-size: 14px; color: #f1f5f9; line-height: 1.6; white-space: pre-wrap;">
        ${requirements}
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <a href="mailto:${toEmail}?subject=Re: ${encodeURIComponent(subject)} - Hrishi Bhattacharya" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; margin-right: 10px;">
            📧 Reply to Client
          </a>
          <a href="https://wa.me/916294660141" target="_blank" style="display: inline-block; padding: 12px 24px; background: #25d366; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px;">
            💬 Open WhatsApp
          </a>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>
    `;

    // Also notify Hrishi if toEmail is not Hrishi's own email
    if (toEmail.toLowerCase() !== fromEmail.toLowerCase()) {
      await transporter.sendMail({
        from: `"Portfolio Client Alert" <${fromEmail}>`,
        to: fromEmail,
        subject: `🔥 New Project Inquiry from ${userName} (${subject})`,
        html: adminHtmlContent,
      });
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending emails:", error);
    return { success: false, error };
  }
}
