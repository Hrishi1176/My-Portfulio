import nodemailer from "nodemailer";
import { PayloadService } from "@/services/payloadService";
import {
  generateClientInquiryEmail,
  generateAdminAlertEmail,
  generateProposalEmail,
  generateMeetingInviteEmail,
  ProposalMilestone,
} from "./emailTemplates";

interface SendContactEmailProps {
  toEmail: string;
  userName: string;
  subject: string;
  requirements: string;
  budget: string;
  phone?: string;
}

interface SendProposalEmailProps {
  toEmail: string;
  userName: string;
  projectTitle: string;
  overview: string;
  milestones?: ProposalMilestone[];
  totalInvestment?: string;
  estimatedTimeline?: string;
  techStack?: string[];
  proposalDocUrl?: string;
  calendarBookingUrl?: string;
}

interface SendMeetingInviteEmailProps {
  toEmail: string;
  userName: string;
  meetingTitle?: string;
  meetingDate: string;
  meetingTime: string;
  meetingDuration?: string;
  meetingPlatform?: string;
  meetingLink: string;
  agenda?: string[];
}

/**
 * Helper to build authenticated nodemailer transporter with standard SMTP configuration
 */
function createEmailTransporter() {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }),
    smtpUser,
  };
}

/**
 * Dispatches responsive client confirmation & developer alert emails upon contact form submission.
 */
export async function sendThankYouEmail({
  toEmail,
  userName,
  subject,
  requirements,
  budget,
  phone,
}: SendContactEmailProps) {
  const siteContent = await PayloadService.getSiteContent();
  const dev = siteContent.developer;

  const mailSetup = createEmailTransporter();
  const fromEmail = process.env.FROM_EMAIL || mailSetup?.smtpUser || dev.email;

  // Build responsive email markup
  const clientHtml = generateClientInquiryEmail({
    userName,
    toEmail,
    subject,
    requirements,
    budget,
    devName: dev.name,
    devTitle: dev.title,
    devEmail: dev.email,
    devPhone: dev.phone,
    devWhatsapp: dev.whatsapp,
    devLocation: dev.location,
    devGithub: dev.github,
    devLinkedin: dev.linkedin,
    devInitials: dev.initials,
  });

  const adminHtml = generateAdminAlertEmail({
    userName,
    clientEmail: toEmail,
    subject,
    requirements,
    budget,
    devName: dev.name,
    devEmail: dev.email,
    devWhatsapp: dev.whatsapp,
    clientPhone: phone,
  });

  // Check if SMTP credentials exist
  if (!mailSetup) {
    console.log(
      `[DEV EMAIL SIMULATION] SMTP credentials not set. Simulated dispatch to ${toEmail} (${userName}) & alert to ${dev.email}`
    );
    return { success: true, simulated: true };
  }

  try {
    const { transporter } = mailSetup;

    // 1. Send confirmation to client
    const clientInfo = await transporter.sendMail({
      from: `"${dev.name}" <${fromEmail}>`,
      to: toEmail,
      subject: `Inquiry Received: ${subject} — ${dev.name}`,
      html: clientHtml,
    });

    console.log("Confirmation email dispatched to client successfully:", clientInfo.messageId);

    // 2. Notify developer alert
    if (toEmail.toLowerCase() !== fromEmail.toLowerCase()) {
      await transporter.sendMail({
        from: `"Portfolio Lead Alert" <${fromEmail}>`,
        to: fromEmail,
        subject: `🔥 New Lead Alert from ${userName} (${subject})`,
        html: adminHtml,
      });
    }

    return { success: true, messageId: clientInfo.messageId };
  } catch (error) {
    console.error("Error sending thank you/admin emails:", error);
    return { success: false, error };
  }
}

/**
 * Dispatches responsive project proposal email to client
 */
export async function sendProposalEmail({
  toEmail,
  userName,
  projectTitle,
  overview,
  milestones,
  totalInvestment,
  estimatedTimeline,
  techStack,
  proposalDocUrl,
  calendarBookingUrl,
}: SendProposalEmailProps) {
  const siteContent = await PayloadService.getSiteContent();
  const dev = siteContent.developer;

  const mailSetup = createEmailTransporter();
  const fromEmail = process.env.FROM_EMAIL || mailSetup?.smtpUser || dev.email;

  const proposalHtml = generateProposalEmail({
    clientName: userName,
    clientEmail: toEmail,
    projectTitle,
    overview,
    milestones,
    totalInvestment,
    estimatedTimeline,
    techStack,
    devName: dev.name,
    devTitle: dev.title,
    devEmail: dev.email,
    devWhatsapp: dev.whatsapp,
    devGithub: dev.github,
    devInitials: dev.initials,
    proposalDocUrl,
    calendarBookingUrl,
  });

  if (!mailSetup) {
    console.log(
      `[DEV EMAIL SIMULATION] Proposal simulated for ${toEmail}: ${projectTitle}`
    );
    return { success: true, simulated: true };
  }

  try {
    const info = await mailSetup.transporter.sendMail({
      from: `"${dev.name}" <${fromEmail}>`,
      to: toEmail,
      subject: `Project Proposal: ${projectTitle} — ${dev.name}`,
      html: proposalHtml,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending proposal email:", error);
    return { success: false, error };
  }
}

/**
 * Dispatches responsive meeting consultation confirmation email
 */
export async function sendMeetingInviteEmail({
  toEmail,
  userName,
  meetingTitle,
  meetingDate,
  meetingTime,
  meetingDuration,
  meetingPlatform,
  meetingLink,
  agenda,
}: SendMeetingInviteEmailProps) {
  const siteContent = await PayloadService.getSiteContent();
  const dev = siteContent.developer;

  const mailSetup = createEmailTransporter();
  const fromEmail = process.env.FROM_EMAIL || mailSetup?.smtpUser || dev.email;

  const meetingHtml = generateMeetingInviteEmail({
    clientName: userName,
    clientEmail: toEmail,
    meetingTitle,
    meetingDate,
    meetingTime,
    meetingDuration,
    meetingPlatform,
    meetingLink,
    agenda,
    devName: dev.name,
    devTitle: dev.title,
    devEmail: dev.email,
    devWhatsapp: dev.whatsapp,
    devInitials: dev.initials,
  });

  if (!mailSetup) {
    console.log(
      `[DEV EMAIL SIMULATION] Meeting invite simulated for ${toEmail} on ${meetingDate}`
    );
    return { success: true, simulated: true };
  }

  try {
    const info = await mailSetup.transporter.sendMail({
      from: `"${dev.name}" <${fromEmail}>`,
      to: toEmail,
      subject: `Confirmed: ${meetingTitle || "Discovery Consultation"} with ${dev.name}`,
      html: meetingHtml,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending meeting email:", error);
    return { success: false, error };
  }
}
