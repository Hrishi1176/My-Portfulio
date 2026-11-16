export interface MeetingInviteEmailProps {
  clientName: string;
  clientEmail: string;
  meetingTitle?: string;
  meetingDate: string;
  meetingTime: string;
  meetingDuration?: string;
  meetingPlatform?: string;
  meetingLink: string;
  agenda?: string[];
  devName: string;
  devTitle: string;
  devEmail: string;
  devWhatsapp: string;
  devInitials: string;
}

/**
 * Responsive HTML Email Template for Discovery & Technical Consultation Calls.
 * Clean, calendar-friendly, mobile-first design with direct meeting link CTA.
 */
export function generateMeetingInviteEmail(props: MeetingInviteEmailProps): string {
  const {
    clientName,
    meetingTitle = "Technical Discovery & Architecture Consultation",
    meetingDate,
    meetingTime,
    meetingDuration = "30 Minutes",
    meetingPlatform = "Google Meet",
    meetingLink,
    agenda = [
      "Deep dive into project scope, core objectives, and user requirements",
      "Architectural feasibility & technical stack selection (Next.js, 3D, APIs)",
      "Timeline milestones, budget alignment, and Q&A",
    ],
    devName,
    devTitle,
    devEmail,
    devWhatsapp,
    devInitials,
  } = props;

  const cleanWhatsapp = devWhatsapp.replace(/[^0-9]/g, "");

  const agendaListHtml = agenda
    .map(
      (item, idx) => `
    <li style="margin-bottom: 8px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
      <strong style="color: #ffffff;">${idx + 1}.</strong> ${item}
    </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Meeting Confirmed: ${meetingTitle}</title>
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
      background-color: #060813;
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
        padding: 24px 18px !important;
      }
      .header-padding {
        padding: 28px 20px !important;
      }
      .btn-responsive {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        margin-bottom: 10px !important;
      }
      .meeting-slot-col {
        display: block !important;
        width: 100% !important;
        padding-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="background-color: #060813; margin: 0; padding: 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f1f5f9;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #060813;">
    <tr>
      <td align="center" style="padding: 10px;">

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #0c101d; border-radius: 20px; overflow: hidden; border: 1px solid rgba(59, 130, 246, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.85);">
          
          <!-- Top Accent -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" class="header-padding" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 36px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <div style="margin: 0 auto 14px auto; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: #ffffff; font-size: 18px; font-weight: 900; line-height: 48px; text-align: center; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.45);">
                ${devInitials}
              </div>

              <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #34d399; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                🗓️ Consultation Confirmed
              </div>

              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                ${meetingTitle}
              </h1>

              <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">
                With <strong style="color: #f1f5f9;">${devName}</strong> &amp; <strong style="color: #f1f5f9;">${clientName}</strong>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="card-body" style="padding: 34px 28px;">
              <p style="margin-top: 0; margin-bottom: 22px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                Hi ${clientName},<br><br>
                Looking forward to connecting with you. Our upcoming discovery consultation has been confirmed. Below are your meeting coordinates:
              </p>

              <!-- Meeting Details Badge Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 14px; border: 1px solid #1f2937; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="meeting-slot-col" width="50%" valign="top">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">📅 Date</div>
                          <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-top: 4px;">${meetingDate}</div>
                        </td>
                        <td class="meeting-slot-col" width="50%" valign="top">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">⏰ Time &amp; Duration</div>
                          <div style="font-size: 15px; font-weight: 800; color: #38bdf8; margin-top: 4px;">${meetingTime} (${meetingDuration})</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 14px; border-top: 1px solid #1f2937;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">💻 Location / Platform</div>
                          <div style="font-size: 14px; font-weight: 700; color: #34d399; margin-top: 4px;">
                            ${meetingPlatform} • Video Conference
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Agenda Section -->
              <div style="margin-bottom: 26px;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #a78bfa; margin-bottom: 12px;">
                  📋 Consultation Agenda:
                </div>
                <ul style="margin: 0; padding-left: 20px;">
                  ${agendaListHtml}
                </ul>
              </div>

              <!-- Meeting Link Primary CTA -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${meetingLink}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #10b981 0%, #2563eb 100%); color: #ffffff !important; border-radius: 12px; font-size: 15px; font-weight: 800; text-decoration: none; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);">
                      🎥 Join Video Call
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; text-align: center; font-size: 12px; color: #64748b;">
                Need to reschedule or run into an issue? WhatsApp me directly at
                <a href="https://wa.me/${cleanWhatsapp}" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 700;">${devWhatsapp}</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080c14; padding: 22px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
              <strong style="color: #cbd5e1;">${devName}</strong> • ${devTitle}<br>
              <a href="mailto:${devEmail}" style="color: #38bdf8; text-decoration: none;">${devEmail}</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
