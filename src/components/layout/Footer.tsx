"use client";

import Link from "next/link";
import { Heart, ArrowUp, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import { portfolioConfig } from "@/config/portfolioConfig";

const dev = portfolioConfig.developer;
const navLinks = portfolioConfig.navigation;

const socialMap = [
  { name: "GitHub", url: dev.github, icon: GithubIcon },
  { name: "LinkedIn", url: dev.linkedin, icon: LinkedinIcon },
  { name: "Instagram", url: dev.instagram, icon: InstagramIcon },
  { name: "Facebook", url: dev.facebook, icon: FacebookIcon },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-gradient-to-b from-transparent via-purple-950/5 to-purple-950/20 pt-14 pb-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                {dev.initials}
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {dev.name}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {dev.title} with {dev.experienceYears} years of experience designing scalable SaaS platforms, automated pipelines, and cloud data architecture.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> All Systems Operational • 99.98% Uptime
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Navigation Index
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors py-1 flex items-center gap-1.5"
                >
                  <span className="h-1 w-1 rounded-full bg-purple-500/40" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Channels & Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Connect Across Web
            </h4>
            <div className="flex items-center gap-2">
              {socialMap.map(({ name, url, icon: Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 hover:text-purple-500 hover:border-purple-500/40 transition-all shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="text-xs text-slate-500 space-y-1 pt-2">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-purple-400" /> {dev.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-purple-400" /> {dev.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Scroll to Top */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} {dev.name}. Designed & Engineered with{" "}
            <Heart className="inline h-3.5 w-3.5 text-rose-500 fill-rose-500" /> using Next.js 16 & TypeScript.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all group"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
