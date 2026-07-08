"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/",
    icon: LinkedinIcon,
    color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40",
  },
  {
    name: "GitHub",
    url: "https://github.com/Hrishi1176",
    icon: GithubIcon,
    color: "hover:text-slate-900 dark:hover:text-white hover:border-slate-400/60",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/invisible_hovercraft_king",
    icon: InstagramIcon,
    color: "hover:text-[#E1306C] hover:border-[#E1306C]/40",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1DRH2U5YCw/",
    icon: FacebookIcon,
    color: "hover:text-[#1877F2] hover:border-[#1877F2]/40",
  },
];

const contactMethods = [
  {
    icon: Mail,
    label: "Email Me",
    value: "hrishisgp97@gmail.com",
    href: "mailto:hrishisgp97@gmail.com",
    style: "btn-primary",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: "https://wa.me/916294660141",
    style: "whatsapp",
  },
  {
    icon: Phone,
    label: "Call Me",
    value: "+91 62946 60141",
    href: "tel:+916294660141",
    style: "outline",
  },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Label */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="section-num text-base">06.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Get In Touch
          </span>
        </div>

        <h2 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Let&apos;s <span className="gradient-text">Connect</span>
        </h2>

        <p className="mx-auto mb-10 max-w-xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
          I&apos;m currently looking for new opportunities. Whether you have a project, a question,
          or just want to say hi — my inbox is always open.
        </p>

        <div className="mx-auto max-w-2xl">
          <div className="glass p-6 sm:p-10 text-center">
            {/* Contact CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {contactMethods.map(({ icon: Icon, label, value, href, style }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group flex flex-col items-center gap-1.5 rounded-2xl border px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    style === "btn-primary"
                      ? "btn-primary border-transparent"
                      : style === "whatsapp"
                      ? "border-[#25D366]/40 bg-[#25D366]/08 dark:bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366]/60"
                      : "border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:border-purple-400/40 hover:bg-purple-50/50 dark:hover:bg-purple-900/15"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{label}</span>
                  <span className={`text-xs ${style === "btn-primary" ? "text-purple-200" : "text-slate-500 dark:text-slate-500"}`}>
                    {value}
                  </span>
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs text-slate-400 dark:text-slate-600 font-medium tracking-widest uppercase">or find me on</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Social icons */}
            <div className="flex justify-center gap-4">
              {socialLinks.map(({ name, url, icon: Icon, color }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-500 dark:text-slate-500 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
