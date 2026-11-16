"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Send } from "lucide-react";
import { useState, useEffect } from "react";
import type { DeveloperConfig, NavigationItem } from "@/config/portfolioConfig";

interface HeaderProps {
  navigation?: NavigationItem[];
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

export function Header({ navigation: navProp, developer: devProp }: HeaderProps = {}) {
  const navLinks = navProp || [];
  const developer = devProp || DEFAULT_DEV;
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const ids = navLinks.map((l) => l.href.substring(1));
      const offset = window.innerHeight * 0.35;

      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  // Lock body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-2.5 border-b border-purple-500/20 bg-slate-950/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(139,92,246,0.18)]"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-16 2xl:px-24">
        {/* Brand Logo */}
        <Link
          href="#hero"
          className="relative z-50 flex items-center gap-2.5 text-xl font-black tracking-tight select-none group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-md group-hover:scale-110 group-hover:shadow-purple-500/40 transition-all duration-300">
            {developer.initials}
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span className="gradient-text font-black text-lg sm:text-xl">{developer.firstName}</span>
            <span className="text-white font-extrabold text-lg sm:text-xl hidden sm:inline">
              .{developer.lastName}
            </span>
          </div>
        </Link>

        {/* Desktop Floating Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-purple-500/25 bg-slate-950/75 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-colors duration-200 ${
                  isActive
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-purple-500/20 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls & CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="#contact"
            className="btn-primary text-xs py-2 px-5 rounded-full font-extrabold flex items-center gap-1.5 shadow-md hover:shadow-purple-500/35 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            Hire Me
          </Link>
        </div>

        {/* Mobile controls & toggle button */}
        <div className="flex items-center gap-2 lg:hidden z-50">
          <button
            suppressHydrationWarning
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-purple-500/30 bg-slate-950/80 backdrop-blur-md text-slate-100 hover:text-cyan-400 transition-colors shadow-sm cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden border-b border-purple-500/20 bg-slate-950/95 backdrop-blur-2xl lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-1 px-4 py-5 max-w-7xl mx-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      activeSection === link.href.substring(1)
                        ? "text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/25"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-3 mt-2 border-t border-[var(--border)]">
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full py-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="h-4 w-4" />
                  Hire Me / Submit Inquiry
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
