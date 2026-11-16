export interface AdminAlertEmailProps {
  userName: string;
  clientEmail: string;
  subject: string;
  requirements: string;
  budget: string;
  devName: string;
  devEmail: string;
  devWhatsapp: string;
  submittedAt?: string;
  clientPhone?: string;
}

/**
 * Responsive HTML Email Template for Admin Lead Alerts (dispatched to Portfolio Owner).
 * Styled with cyber-modern dark theme, clear high-priority lead markers,
 * and one-click direct communication CTAs (Email Reply & WhatsApp launch).
 */
export function generateAdminAlertEmail(props: AdminAlertEmailProps): string {
  const {
    userName,
    clientEmail,
    subject,
    requirements,
    budget,
    devName,
    devWhatsapp,
    submittedAt,
    clientPhone,
  } = props;

  const cleanWhatsapp = devWhatsapp.replace(/[^0-9]/g, "");
  const formattedDate =
    submittedAt ||
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Calculate budget highlight badge style
  const isHighBudget =
    budget.includes("$5,000+") ||
    budget.includes("$10,000+") ||
    budget.includes("Enterprise") ||
    budget.includes("₹");

  const replyMailto = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(
    `Re: ${subject} — ${devName} Portfolio Follow-up`
  )}&body=${encodeURIComponent(
    `Hi ${userName},\n\nThank you for reaching out regarding "${subject}". I have reviewed your requirements:\n\n"${requirements}"\n\nI would love to discuss next steps with you.`
  )}`;

  const waTarget = clientPhone ? clientPhone.replace(/[^0-9]/g, "") : cleanWhatsapp;
  const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(
    `Hi ${userName}, this is ${devName} following up on your portfolio inquiry: "${subject}".`
  )}`;

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>🔥 New Lead Alert — ${userName}</title>
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
      background-color: #05060b;
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
      }
      .card-body {
        padding: 22px 16px !important;
      }
      .header-padding {
        padding: 26px 18px !important;
      }
      .btn-responsive {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        margin-bottom: 10px !important;
      }
      .meta-label {
        width: 100px !important;
      }
    }
  </style>
</head>
<body style="background-color: #05060b; margin: 0; padding: 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f1f5f9;">

  <!-- Outer wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #05060b;">
    <tr>
      <td align="center" style="padding: 8px;">

        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #0b0f19; border-radius: 20px; overflow: hidden; border: 1px solid rgba(239, 68, 68, 0.4); box-shadow: 0 25px 60px rgba(0,0,0,0.85);">
          
          <!-- Urgent Lead Gradient Accent -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #ef4444 0%, #f59e0b 45%, #a855f7 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" class="header-padding" style="background: linear-gradient(135deg, #180918 0%, #0b0f19 100%); padding: 32px 26px; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: center;">
              
              <div style="display: inline-block; padding: 5px 14px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 20px; font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                🚨 High-Priority Lead Alert
              </div>

              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                New Portfolio Inquiry Received
              </h1>
              
              <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">
                Client: <strong style="color: #f1f5f9;">${userName}</strong> • ${formattedDate}
              </div>
            </td>
          </tr>

          <!-- Lead Details Body -->
          <tr>
            <td class="card-body" style="padding: 32px 28px;">
              
              <!-- Quick Overview Grid -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 14px; border: 1px solid #1f2937; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="meta-label" style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600; width: 130px;">
                          👤 Full Name:
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 800;">
                          ${userName}
                        </td>
                      </tr>
                      <tr>
                        <td class="meta-label" style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                          ✉️ Email Address:
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #38bdf8; font-weight: 700;">
                          <a href="mailto:${clientEmail}" style="color: #38bdf8; text-decoration: underline;">${clientEmail}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="meta-label" style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                          🎯 Subject / Goal:
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #facc15; font-weight: 800;">
                          ${subject}
                        </td>
                      </tr>
                      <tr>
                        <td class="meta-label" style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                          💰 Budget Tier:
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: ${isHighBudget ? "#10b981" : "#34d399"}; font-weight: 900;">
                          ${budget} ${isHighBudget ? "⭐ [HIGH VALUE]" : ""}
                        </td>
                      </tr>
                      ${
                        clientPhone
                          ? `<tr>
                        <td class="meta-label" style="padding: 6px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                          📱 Phone / WA:
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #a78bfa; font-weight: 700;">
                          ${clientPhone}
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Requirements Scope Box -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #a855f7; margin-bottom: 8px;">
                  📝 Client Scope & Project Brief:
                </div>
                <div style="background-color: #030712; border-left: 4px solid #ef4444; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.7; color: #e2e8f0; white-space: pre-wrap; font-family: ui-monospace, Menlo, Consolas, monospace;">
${requirements}
                </div>
              </div>

              <!-- Quick Action Center -->
              <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #94a3b8; margin-bottom: 12px; text-align: center;">
                ⚡ Fast Response Actions
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <!-- Email Client CTA -->
                    <a href="${replyMailto}" class="btn-responsive" style="display: inline-block; padding: 13px 22px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff !important; border-radius: 10px; font-size: 13px; font-weight: 800; margin-right: 8px; text-decoration: none; box-shadow: 0 6px 18px rgba(124, 58, 237, 0.4);">
                      ✉️ Reply by Email
                    </a>
                    
                    <!-- WhatsApp Client CTA -->
                    <a href="${waUrl}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 13px 22px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; border-radius: 10px; font-size: 13px; font-weight: 800; text-decoration: none; box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);">
                      💬 Message on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #030712; padding: 20px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b;">
              Lead dispatched from <strong>${devName}'s Developer Portfolio Engine</strong>.
              <br>
              Automatic notification system • Instant dispatch confirmation.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
