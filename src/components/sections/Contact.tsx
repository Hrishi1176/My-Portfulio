"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
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

const SUBJECT_OPTIONS = [
  "Multi-Tenant SaaS & E-Commerce Platform",
  "Enterprise Office & HR Management System",
  "Cloud Data Engineering & Snowflake ETL",
  "Workflow Automation Suite",
  "Full Stack Next.js / React / Python App",
  "AI Agent & LLM Integration",
  "Custom Subject (Specify Below)",
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Multi-Tenant SaaS & E-Commerce Platform",
    customSubject: "",
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

  const [isRefining, setIsRefining] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-dismiss floating toast after 6 seconds
  useEffect(() => {
    if (status.message && status.success !== null) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [status.message, status.success]);

  const handleRefineRequirements = async () => {
    if (!formData.requirements.trim() || isRefining) return;
    setIsRefining(true);

    const finalSubject =
      formData.subject === "Custom Subject (Specify Below)"
        ? formData.customSubject || "Custom Inquiry"
        : formData.subject;

    try {
      const res = await fetch("/api/refine-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftRequirements: formData.requirements,
          subject: finalSubject,
          budget: formData.budget,
        }),
      });
      const data = await res.json();
      if (data.refinedRequirements) {
        setFormData((prev) => ({ ...prev, requirements: data.refinedRequirements }));
      }
    } catch (err) {
      console.error("Refinement error:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, message: "" });

    const finalSubject =
      formData.subject === "Custom Subject (Specify Below)"
        ? formData.customSubject || "Custom Inquiry"
        : formData.subject;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: finalSubject,
          requirements: formData.requirements,
          budget: formData.budget,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          submitting: false,
          success: true,
          message: "Thank you! Your requirements have been received. A confirmation email has been dispatched to your inbox.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "Multi-Tenant SaaS & E-Commerce Platform",
          customSubject: "",
          requirements: "",
          budget: "$5k - $15k",
        });
      } else {
        setStatus({
          submitting: false,
          success: false,
          message: data.error || "Failed to process your request. Please check your details and try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        submitting: false,
        success: false,
        message: "Network connection error. Please try emailing directly at hrishisgp97@gmail.com.",
      });
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20 relative">
      {/* ── Sleek Floating Toast Notification ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-24 right-4 sm:right-8 z-[70] max-w-md w-[calc(100vw-2rem)]"
          >
            <div
              className={`glass-raised p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3.5 relative overflow-hidden ${
                status.success
                  ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-100"
                  : "border-rose-500/40 bg-rose-950/80 text-rose-100"
              }`}
            >
              {/* Icon */}
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  status.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {status.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </div>

              {/* Message Content */}
              <div className="flex-1 pr-4">
                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                  {status.success ? "Inquiry Submitted Successfully!" : "Submission Alert"}
                  {status.success && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                </h4>
                <p className="text-xs leading-relaxed opacity-90 mt-0.5">{status.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowToast(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Progress Bar Animation */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${
                  status.success ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          Let&apos;s Build Something <span className="gradient-text">Exceptional</span>
        </h2>

        <p className="mx-auto mb-12 max-w-xl text-center text-base text-slate-600 dark:text-slate-400">
          Whether you need a multi-tenant SaaS platform, workflow automation, custom full-stack application, or cloud data engineering — I&apos;m here to help.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Direct Contact Channels
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Reach out directly via email, WhatsApp, or phone. I typically respond within a few hours.
              </p>

              <div className="space-y-3.5">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {method.label}
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {method.value}
                          </div>
                        </div>
                      </div>
                      <Send className="h-4 w-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Connect Across Web
                </div>
                <div className="flex items-center gap-3">
                  {socialLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 transition-all hover:scale-110 shadow-sm ${s.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Requirements Submission Form */}
          <div className="lg:col-span-7">
            <div className="glass-raised p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Submit Your Project Requirements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                All inquiries are received securely for direct follow-up and instant email confirmation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      Subject / Expertise Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {/* Conditional Input for Custom Subject */}
                    {formData.subject === "Custom Subject (Specify Below)" && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2.5"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Enter your custom subject..."
                          value={formData.customSubject}
                          onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                          className="w-full rounded-xl border border-purple-500/40 bg-purple-500/5 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                      </motion.div>
                    )}
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Project Requirements & Query *
                    </label>

                    <button
                      type="button"
                      onClick={handleRefineRequirements}
                      disabled={!formData.requirements.trim() || isRefining}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 disabled:opacity-40 transition-colors"
                      title="Polishes & formats draft requirements into professional specification using Google Gemini AI"
                    >
                      {isRefining ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Refining with Gemini...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          Refine with Gemini AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project, feature requirements, scope, or timeline..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  {status.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Dispatching Requirements...
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
