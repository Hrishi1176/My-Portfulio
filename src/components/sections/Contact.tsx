"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
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
    value: "+91 62946 60141",
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    requirements: "",
    budget: "$5k - $15k",
  });

  const [status, setStatus] = useState<{
    submitting: boolean;
    success: boolean | null;
    message: string;
  }>({
    submitting: false,
    success: null,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, message: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          submitting: false,
          success: true,
          message: "Thank you! Your query & requirements have been saved successfully to MongoDB.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          requirements: "",
          budget: "$5k - $15k",
        });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: data.error || "Failed to submit form. Please check your details and try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        submitting: false,
        success: false,
        message: "Network error submitting form. Please try emailing directly.",
      });
    }
  };

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
          <span className="section-num text-base">07.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Get In Touch
          </span>
        </div>

        <h2 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Let&apos;s Build Something <span className="gradient-text">Great Together</span>
        </h2>

        <p className="mx-auto mb-10 max-w-xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
          Have a project in mind, need custom software development, or want to explore collaboration? Fill in your query & requirements below.
        </p>

        <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Contact & Social Links Info (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-[var(--border)] pb-3">
                Contact Channels
              </h3>

              <div className="space-y-3">
                {contactMethods.map(({ icon: Icon, label, value, href, style }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-3.5 rounded-2xl border p-3.5 text-sm font-medium transition-all duration-200 ${
                      style === "btn-primary"
                        ? "btn-primary border-transparent justify-center"
                        : style === "whatsapp"
                        ? "border-[#25D366]/40 bg-[#25D366]/08 dark:bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366]/60"
                        : "border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:border-purple-400/40 hover:bg-purple-50/50 dark:hover:bg-purple-900/15"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="font-bold">{label}</div>
                      <div className="text-xs opacity-80">{value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="pt-2 border-t border-[var(--border)]">
                <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-3">
                  Follow & Connect
                </div>
                <div className="flex gap-3">
                  {socialLinks.map(({ name, url, icon: Icon, color }) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={name}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-500 dark:text-slate-500 transition-all duration-200 hover:scale-110 ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Requirement & Query Form (Right Column) */}
          <div className="lg:col-span-7">
            <div className="glass p-6 sm:p-8">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                Submit Your Project Requirements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                All submissions are securely saved in database for direct follow-up.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Subject & Budget Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="SaaS Development / Web App"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="<$1k">&lt; $1,000 (Consultation / Audit)</option>
                      <option value="$1k - $5k">$1,000 - $5,000</option>
                      <option value="$5k - $15k">$5,000 - $15,000</option>
                      <option value="$15k+">$15,000+ (Full System / Enterprise)</option>
                    </select>
                  </div>
                </div>

                {/* Requirements & Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Project Requirements & Query *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project, feature requirements, scope, or timeline..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>

                {/* Status Alert Notification */}
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3.5 rounded-xl text-xs font-semibold ${
                      status.success
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {status.success ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving to MongoDB...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message & Requirements
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
