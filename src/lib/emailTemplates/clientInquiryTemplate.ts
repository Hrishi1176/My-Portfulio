export interface ClientInquiryEmailProps {
  userName: string;
  toEmail: string;
  subject: string;
  requirements: string;
  budget: string;
  devName: string;
  devTitle: string;
  devEmail: string;
  devPhone: string;
  devWhatsapp: string;
  devLocation: string;
  devGithub: string;
  devLinkedin: string;
  devInitials: string;
}

/**
 * Responsive HTML Email Template for Client Inquiry Confirmation.
 * Engineered with inline styles, fluid tables, and MSO conditionals for 100%
 * cross-client compatibility (Gmail, Apple Mail, Outlook, Yahoo, iOS/Android).
 */
export function generateClientInquiryEmail(props: ClientInquiryEmailProps): string {
  const {
    userName,
    toEmail,
    subject,
    requirements,
    budget,
    devName,
    devTitle,
    devEmail,
    devWhatsapp,
    devLocation,
    devGithub,
    devLinkedin,
    devInitials,
  } = props;

  const cleanWhatsapp = devWhatsapp.replace(/[^0-9]/g, "");
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Inquiry Received — ${devName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background-color: #070913;
    }
    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      box-sizing: border-box;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        border: none !important;
      }
      .card-body {
        padding: 24px 18px !important;
      }
      .header-padding {
        padding: 32px 18px !important;
      }
      .summary-box {
        padding: 16px 12px !important;
      }
      .btn-responsive {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        margin-bottom: 10px !important;
      }
      .meta-col {
        display: block !important;
        width: 100% !important;
        padding-bottom: 6px !important;
      }
      .responsive-title {
        font-size: 22px !important;
        line-height: 28px !important;
      }
    }
  </style>
</head>
<body style="background-color: #070913; margin: 0; padding: 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #e2e8f0;">
  <!-- Main Outer Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #070913;">
    <tr>
      <td align="center" style="padding: 12px;">
        
        <!-- Email Container Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(168,85,247,0.3); box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
          
          <!-- Top Cyber Gradient Accent Line -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #00f0ff 0%, #a855f7 50%, #10b981 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" class="header-padding" style="background: linear-gradient(180deg, #161a30 0%, #0f172a 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
              
              <!-- Brand Monogram -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                <tr>
                  <td align="center" style="width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #00f0ff 0%, #a855f7 100%); color: #ffffff; font-size: 20px; font-weight: 900; line-height: 52px; text-align: center; box-shadow: 0 8px 24px rgba(0,240,255,0.35);">
                    ${devInitials}
                  </td>
                </tr>
              </table>

              <!-- Verified Status Badge -->
              <div style="display: inline-block; background-color: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 5px 16px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #10b981; margin-bottom: 12px;">
                ✓ Inquiry Registered & Confirmed
              </div>

              <h1 class="responsive-title" style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                ${devName}
              </h1>
              <div style="font-size: 13px; font-weight: 600; color: #38bdf8; margin-top: 4px; letter-spacing: 0.5px;">
                ${devTitle}
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="card-body" style="padding: 34px 30px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
              
              <div style="font-size: 17px; font-weight: 800; color: #f8fafc; margin-bottom: 10px;">
                Hello ${userName},
              </div>

              <p style="margin-top: 0; margin-bottom: 20px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                Thank you for reaching out through my portfolio. Your project requirements for <strong style="color: #c084fc;">&quot;${subject}&quot;</strong> have been safely received and logged into my workflow queue. I am reviewing the scope and will respond within <strong>24 hours</strong>.
              </p>

              <!-- Specification Summary Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="summary-box" style="background-color: #161e2e; border-radius: 14px; border: 1px solid #1e293b; margin: 24px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #00f0ff; margin-bottom: 12px;">
                      📋 Project Specification Summary
                    </div>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td class="meta-col" style="padding: 6px 0; color: #94a3b8; font-weight: 600; width: 130px;">Client Name:</td>
                        <td class="meta-col" style="padding: 6px 0; color: #f1f5f9; font-weight: 700;">${userName}</td>
                      </tr>
                      <tr>
                        <td class="meta-col" style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Email Address:</td>
                        <td class="meta-col" style="padding: 6px 0; color: #38bdf8; font-weight: 700;">${toEmail}</td>
                      </tr>
                      <tr>
                        <td class="meta-col" style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Subject Topic:</td>
                        <td class="meta-col" style="padding: 6px 0; color: #ffffff; font-weight: 700;">${subject}</td>
                      </tr>
                      <tr>
                        <td class="meta-col" style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Budget Allocation:</td>
                        <td class="meta-col" style="padding: 6px 0; color: #34d399; font-weight: 800;">${budget}</td>
                      </tr>
                      <tr>
                        <td class="meta-col" style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Submission Date:</td>
                        <td class="meta-col" style="padding: 6px 0; color: #cbd5e1; font-weight: 600;">${formattedDate}</td>
                      </tr>
                    </table>

                    <!-- Requirements Quote Box -->
                    <div style="margin-top: 14px; background-color: #090d16; border-left: 3px solid #a855f7; border-radius: 8px; padding: 12px 16px; font-style: italic; color: #e2e8f0; font-size: 13px; line-height: 1.6;">
                      &quot;${requirements}&quot;
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Next Steps Timeline -->
              <div style="font-weight: 800; color: #f8fafc; font-size: 15px; margin-bottom: 12px;">
                🚀 What to Expect Next:
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="padding-bottom: 12px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #7c3aed; color: #ffffff; width: 22px; height: 22px; border-radius: 50%; text-align: center; font-weight: 900; font-size: 11px; line-height: 22px;" valign="middle">1</td>
                        <td style="padding-left: 12px; color: #cbd5e1; font-size: 13px;">
                          <strong style="color: #ffffff;">Technical Review:</strong> Analyzing scope requirements, architectural fit, and delivery estimates.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;" valign="top">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #00f0ff; color: #080612; width: 22px; height: 22px; border-radius: 50%; text-align: center; font-weight: 900; font-size: 11px; line-height: 22px;" valign="middle">2</td>
                        <td style="padding-left: 12px; color: #cbd5e1; font-size: 13px;">
                          <strong style="color: #ffffff;">Direct Follow-up:</strong> You will receive a direct proposal and invitation to discuss next steps.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Dual Quick Action Buttons -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(devName)}%2C%20I%20just%20submitted%20the%20portfolio%20contact%20form%20for%20${encodeURIComponent(subject)}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 12px 26px; background-color: #25d366; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 13px; margin: 4px; box-shadow: 0 4px 16px rgba(37,211,102,0.35);">
                      💬 Connect Instantly on WhatsApp
                    </a>
                    <a href="${devGithub}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 12px 26px; background-color: #1e293b; color: #38bdf8 !important; border: 1px solid #334155; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 13px; margin: 4px;">
                      ⚡ Browse GitHub Repositories
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #090d16; padding: 24px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06);">
              <div style="font-weight: 800; color: #cbd5e1; font-size: 13px; margin-bottom: 2px;">
                ${devName}
              </div>
              <div style="color: #64748b; font-size: 11px; margin-bottom: 12px;">
                ${devTitle} · ${devLocation}
              </div>
              <div style="margin-bottom: 12px;">
                <a href="mailto:${devEmail}" style="color: #a855f7; text-decoration: none; font-weight: 700; margin: 0 8px;">📧 ${devEmail}</a> •
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" style="color: #25d366; text-decoration: none; font-weight: 700; margin: 0 8px;">💬 ${devWhatsapp}</a>
              </div>
              <div style="font-size: 10px; color: #475569;">
                <a href="${devGithub}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 6px;">GitHub</a> |
                <a href="${devLinkedin}" target="_blank" style="color: #94a3b8; text-decoration: none; margin: 0 6px;">LinkedIn</a>
              </div>
              <div style="margin-top: 14px; font-size: 10px; color: #334155;">
                © ${new Date().getFullYear()} ${devName}. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
