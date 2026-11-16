"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, Loader2, Sparkles, Copy, Check } from "lucide-react";
import Cookies from "js-cookie";
import { ToastNotification } from "@/components/common/ToastNotification";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { SectionHeader, Input, Textarea, Button } from "@/components/ui";
import { useRobotCompanion } from "@/context/RobotCompanionContext";
import type { DeveloperConfig } from "@/config/portfolioConfig";

interface ContactProps {
  contactOptions?: {
    subjectOptions: string[];
    budgetRanges: Array<{ value: string; label: string }>;
  };
  developer?: DeveloperConfig;
}

const DEFAULT_DEV: DeveloperConfig = {
  name: "Hrishi Bhattacharya",
  firstName: "Hrishi",
  lastName: "Bhattacharyya",
  initials: "HB",
  role: "Senior Software Developer",
  title: "Senior Full Stack Engineer & System Architect",
  experienceYears: "4.4",
  email: "hrishisgp97@gmail.com",
  phone: "+91 62946 60141",
  whatsapp: "+91 62946 60141",
  location: "Kolkata, India",
  github: "https://github.com/Hrishi1176",
  linkedin: "https://linkedin.com/in/hrishi-bhattacharyya",
  instagram: "",
  facebook: "",
};

function getRefineTodayCookieKey() {
  const d = new Date();
  return `refine_req_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function Contact({ contactOptions: contactProp, developer: devProp }: ContactProps = {}) {
  const dev = devProp || DEFAULT_DEV;
  const SUBJECT_OPTIONS = contactProp?.subjectOptions || [];
  const BUDGET_RANGES = contactProp?.budgetRanges || [];

  const socialLinks = [
    {
      name: "LinkedIn",
      url: dev.linkedin,
      icon: LinkedinIcon,
      color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40",
    },
    {
      name: "GitHub",
      url: dev.github,
      icon: GithubIcon,
      color: "hover:text-slate-900 dark:hover:text-white hover:border-slate-400/60",
    },
    {
      name: "Instagram",
      url: dev.instagram,
      icon: InstagramIcon,
      color: "hover:text-[#E1306C] hover:border-[#E1306C]/40",
    },
    {
      name: "Facebook",
      url: dev.facebook,
      icon: FacebookIcon,
      color: "hover:text-[#1877F2] hover:border-[#1877F2]/40",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      label: "Email Me",
      value: dev.email,
      href: `mailto:${dev.email}`,
      style: "btn-primary",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: dev.whatsapp,
      href: `https://wa.me/${dev.whatsapp.replace(/[^0-9]/g, "")}`,
      style: "whatsapp",
    },
    {
      icon: Phone,
      label: "Call Me",
      value: dev.phone,
      href: `tel:${dev.phone.replace(/[^0-9+]/g, "")}`,
      style: "outline",
    },
  ];

  const MAX_DAILY_REFINEMENTS = 5;
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
  const [aiProvider, setAiProvider] = useState<"gemini" | "groq">("gemini");

  const { setActiveField, setState: setRobotState, triggerSuccess: triggerRobotSuccess, triggerError: triggerRobotError, triggerTyping: triggerRobotTyping } = useRobotCompanion();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [refinementCountToday, setRefinementCountToday] = useState(0);

  useEffect(() => {
    const key = getRefineTodayCookieKey();
    const count = Cookies.get(key);
    if (count) {
      const parsed = parseInt(count, 10);
      queueMicrotask(() => {
        setRefinementCountToday(parsed);
      });
    }
  }, []);

  const handleRefineRequirements = async () => {
    if (!formData.requirements.trim() || isRefining) return;

    const key = getRefineTodayCookieKey();
    const currentCount = parseInt(Cookies.get(key) || "0", 10);

    if (currentCount >= MAX_DAILY_REFINEMENTS) {
      setStatus({
        submitting: false,
        success: false,
        message: "Daily free AI refinement limit reached (5/5 for today). You can submit your requirements as is!",
      });
      setShowToast(true);
      return;
    }

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
          provider: aiProvider,
        }),
      });
      const data = await res.json();
      if (data.refinedRequirements) {
        setFormData((prev) => ({ ...prev, requirements: data.refinedRequirements }));
        const newCount = currentCount + 1;
        Cookies.set(key, String(newCount), { expires: 1, sameSite: "lax" });
        setRefinementCountToday(newCount);
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
    setRobotState("verifying");

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
        setShowToast(true);
        triggerRobotSuccess();
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
        setShowToast(true);
        triggerRobotError();
      }
    } catch (err) {
      console.error(err);
      setStatus({
        submitting: false,
        success: false,
        message: "Network connection error. Please try emailing directly at hrishisgp97@gmail.com.",
      });
      setShowToast(true);
      triggerRobotError();
    }
  };

  const remainingRefinements = Math.max(0, MAX_DAILY_REFINEMENTS - refinementCountToday);

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20 relative">
      {/* ── Reusable Toast Notification Component ── */}
      <ToastNotification
        show={showToast}
        type={status.success ? "success" : "error"}
        title={status.success ? "Inquiry Submitted Successfully!" : "Submission Alert"}
        message={status.message}
        onClose={() => setShowToast(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        <SectionHeader
          number="09."
          badge="Quantum Comm Link"
          title="Direct Connect ·"
          gradientText="Get In Touch"
          description="Whether you need a multi-tenant SaaS platform, high-scale workflow automation, or cloud data engineering — establish connection below."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-0 sm:p-2 space-y-6">
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
                      className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 bg-transparent hover:border-purple-500/30 hover:bg-white/[0.01] transition-all group gap-2"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-1">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {method.label}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors truncate">
                            {method.value}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.label === "Email Me" && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(method.value);
                              setCopiedEmail(true);
                              setTimeout(() => setCopiedEmail(false), 2000);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 text-xs font-mono font-medium text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer"
                            title="Copy email to clipboard"
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                        )}
                        <Send className="h-4 w-4 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                      </div>
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
            <div className="p-0 sm:p-2 lg:p-4 relative">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Submit Your Project Requirements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                All inquiries are received securely for direct follow-up and instant email confirmation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    required
                    name="name"
                    id="contact-name"
                    placeholder="John Doe"
                    value={formData.name}
                    onFocus={() => setActiveField("name")}
                    onBlur={() => setActiveField("none")}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      triggerRobotTyping("name");
                    }}
                  />

                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    name="email"
                    id="contact-email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField("none")}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      triggerRobotTyping("email");
                    }}
                  />
                </div>

                {/* Subject & Budget Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Subject / Expertise Topic
                    </label>
                    <select
                      suppressHydrationWarning
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
                          suppressHydrationWarning
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
                      suppressHydrationWarning
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-white/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Requirements & Message */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Project Requirements & Query *
                    </label>

                    <div className="flex items-center gap-2">
                      {/* AI Provider & Model Selector */}
                      <select
                        suppressHydrationWarning
                        value={aiProvider}
                        onChange={(e) => setAiProvider(e.target.value as "gemini" | "groq")}
                        className="text-[11px] font-bold rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-purple-600 dark:text-purple-300 focus:outline-none"
                      >
                        <option value="gemini" className="bg-slate-900 text-white">Google Gemini 1.5</option>
                        <option value="groq" className="bg-slate-900 text-white">Groq Llama 3.3 (70B)</option>
                      </select>

                      {/* AI Refine Button */}
                      <button
                        suppressHydrationWarning
                        type="button"
                        onClick={handleRefineRequirements}
                        disabled={!formData.requirements.trim() || isRefining || remainingRefinements <= 0}
                        className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 disabled:opacity-40 transition-colors"
                        title="Polishes & formats draft requirements into professional specification using your chosen AI model"
                      >
                        {isRefining ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Refining...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            Refine ({remainingRefinements}/5 left)
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <Textarea
                    required
                    name="requirements"
                    id="contact-requirements"
                    rows={4}
                    placeholder="Describe your project, feature requirements, scope, or timeline..."
                    value={formData.requirements}
                    onFocus={() => setActiveField("requirements")}
                    onBlur={() => setActiveField("none")}
                    onChange={(e) => {
                      setFormData({ ...formData, requirements: e.target.value });
                      triggerRobotTyping("requirements");
                    }}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={status.submitting}
                  leftIcon={<Send className="h-4 w-4" />}
                  className="w-full mt-2 shadow-lg hover:shadow-purple-500/25"
                >
                  Send Message & Requirements
                </Button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
