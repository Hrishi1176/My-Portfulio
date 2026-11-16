export interface ProposalMilestone {
  phase: string;
  title: string;
  timeline: string;
  deliverables: string[];
}

export interface ProposalEmailProps {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  overview: string;
  milestones?: ProposalMilestone[];
  totalInvestment?: string;
  estimatedTimeline?: string;
  techStack?: string[];
  devName: string;
  devTitle: string;
  devEmail: string;
  devWhatsapp: string;
  devGithub: string;
  devInitials: string;
  proposalDocUrl?: string;
  calendarBookingUrl?: string;
}

/**
 * Responsive HTML Email Template for Project Proposal & Deliverable Hand-off.
 * Formatted for enterprise presentation with milestones, tech stack chips,
 * and high-converting action CTAs.
 */
export function generateProposalEmail(props: ProposalEmailProps): string {
  const {
    clientName,
    projectTitle,
    overview,
    milestones = [
      {
        phase: "Phase 1",
        title: "Discovery & System Architecture",
        timeline: "Week 1",
        deliverables: [
          "Requirement blueprint & data flow diagrams",
          "Interactive Figma prototyping & UI/UX tokens",
          "Production stack initialization & CI/CD pipeline",
        ],
      },
      {
        phase: "Phase 2",
        title: "Core Feature Engineering & Integration",
        timeline: "Weeks 2 - 3",
        deliverables: [
          "Responsive frontend components & state management",
          "Backend API endpoints, authentication & database schemas",
          "3D interactive modules & real-time webhook listeners",
        ],
      },
      {
        phase: "Phase 3",
        title: "Rigorous QA, Audit & Production Launch",
        timeline: "Week 4",
        deliverables: [
          "Lighthouse 95+ performance optimization & SEO audit",
          "Cross-browser testing (Chrome, Safari, iOS, Android)",
          "Vercel/Cloudflare edge deployment & DNS handover",
        ],
      },
    ],
    totalInvestment = "Competitive Scope Quote",
    estimatedTimeline = "3 - 4 Weeks",
    techStack = ["Next.js 15", "TypeScript", "Tailwind CSS", "Three.js", "PostgreSQL", "Payload CMS"],
    devName,
    devTitle,
    devEmail,
    devWhatsapp,
    devGithub,
    devInitials,
    proposalDocUrl,
    calendarBookingUrl,
  } = props;

  const cleanWhatsapp = devWhatsapp.replace(/[^0-9]/g, "");

  const milestonesHtml = milestones
    .map(
      (m, idx) => `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 12px; border: 1px solid #1f2937; margin-bottom: 14px;">
      <tr>
        <td style="padding: 16px 18px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <span style="display: inline-block; background: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.4); color: #c084fc; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 6px; text-transform: uppercase;">
                  ${m.phase}
                </span>
                <strong style="color: #ffffff; font-size: 14px; margin-left: 8px;">${m.title}</strong>
              </td>
              <td align="right" style="color: #38bdf8; font-size: 12px; font-weight: 700; white-space: nowrap;">
                ⏱️ ${m.timeline}
              </td>
            </tr>
          </table>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
            ${m.deliverables.map((d) => `<li style="margin-bottom: 4px;">${d}</li>`).join("")}
          </ul>
        </td>
      </tr>
    </table>`
    )
    .join("");

  const techStackHtml = techStack
    .map(
      (t) => `
    <span style="display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #e2e8f0; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; margin: 3px 4px 3px 0;">
      ⚡ ${t}
    </span>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Project Proposal: ${projectTitle}</title>
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
      }
      .card-body {
        padding: 24px 18px !important;
      }
      .header-padding {
        padding: 30px 20px !important;
      }
      .btn-responsive {
        width: 100% !important;
        display: block !important;
        text-align: center !important;
        margin-bottom: 10px !important;
      }
    }
  </style>
</head>
<body style="background-color: #070913; margin: 0; padding: 24px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #f1f5f9;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #070913;">
    <tr>
      <td align="center" style="padding: 10px;">

        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #0d121f; border-radius: 20px; overflow: hidden; border: 1px solid rgba(168, 85, 247, 0.35); box-shadow: 0 25px 60px rgba(0,0,0,0.85);">
          
          <!-- Top Gradient Accent -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" class="header-padding" style="background: linear-gradient(135deg, #111827 0%, #1e1b4b 100%); padding: 36px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <div style="margin: 0 auto 14px auto; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; font-size: 18px; font-weight: 900; line-height: 48px; text-align: center; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.5);">
                ${devInitials}
              </div>

              <div style="display: inline-block; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); color: #60a5fa; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">
                📑 Architectural Project Proposal
              </div>

              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                ${projectTitle}
              </h1>

              <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">
                Prepared specifically for <strong style="color: #ffffff;">${clientName}</strong>
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="card-body" style="padding: 34px 28px;">
              <p style="margin-top: 0; margin-bottom: 20px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                Hi ${clientName},<br><br>
                Thank you for discussing your vision with me. Below is the tailored architectural proposal, roadmap, and milestone deliverable plan for <strong style="color: #c084fc;">${projectTitle}</strong>.
              </p>

              <!-- Overview Card -->
              <div style="background-color: #111827; border-left: 4px solid #8b5cf6; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #a78bfa; margin-bottom: 6px;">
                  Project Overview & Objectives
                </div>
                <div style="font-size: 14px; color: #e2e8f0; line-height: 1.6;">
                  ${overview}
                </div>
              </div>

              <!-- Scope & Investment Summary -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;" width="50%">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">Est. Timeline</div>
                    <div style="font-size: 16px; font-weight: 800; color: #38bdf8; margin-top: 4px;">⏱️ ${estimatedTimeline}</div>
                  </td>
                  <td style="padding: 16px 20px; border-left: 1px solid #334155;" width="50%">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">Total Investment</div>
                    <div style="font-size: 16px; font-weight: 800; color: #34d399; margin-top: 4px;">💰 ${totalInvestment}</div>
                  </td>
                </tr>
              </table>

              <!-- Recommended Tech Stack -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #94a3b8; margin-bottom: 10px;">
                  Recommended Technology Stack:
                </div>
                <div>
                  ${techStackHtml}
                </div>
              </div>

              <!-- Milestones Section -->
              <div style="margin-bottom: 26px;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px; color: #c084fc; margin-bottom: 12px;">
                  🚀 Project Milestones & Deliverables:
                </div>
                ${milestonesHtml}
              </div>

              <!-- Action Buttons -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    ${
                      calendarBookingUrl
                        ? `<a href="${calendarBookingUrl}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 14px 26px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: #ffffff !important; border-radius: 10px; font-size: 14px; font-weight: 800; text-decoration: none; margin-right: 8px; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45);">
                        📅 Schedule Kickoff Call
                      </a>`
                        : ""
                    }
                    <a href="https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      `Hi ${devName}, I reviewed the proposal for "${projectTitle}" and would like to proceed!`
                    )}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 14px 26px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; border-radius: 10px; font-size: 14px; font-weight: 800; text-decoration: none; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);">
                      💬 Accept via WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080c14; padding: 24px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
              <strong style="color: #cbd5e1;">${devName}</strong> • ${devTitle}<br>
              <a href="mailto:${devEmail}" style="color: #a78bfa; text-decoration: none;">${devEmail}</a> • 
              <a href="${devGithub}" target="_blank" style="color: #94a3b8; text-decoration: none;">GitHub</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
