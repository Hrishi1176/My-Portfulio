"use client";

import { motion } from "framer-motion";
import { Mail, FileText, ExternalLink, Code2, Database, Layout, Server, Briefcase, GraduationCap, Phone, Menu, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaReact, FaPython, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt, FaRobot } from "react-icons/fa";
import { SiNextdotjs, SiJavascript, SiTypescript, SiMongodb, SiMysql, SiPostgresql, SiSnowflake } from "react-icons/si";
import { BiNetworkChart, BiCheckShield, BiChalkboard } from "react-icons/bi";
import { TbApi } from "react-icons/tb";
import { ParticleBackground } from "@/components/ParticleBackground";

// Social Icons SVGs
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76a5.2 5.2 0 0 0-1.4-3.5 5.2 5.2 0 0 0-.1-3.4s-1.1-.4-3.5 1.3a11.5 11.5 0 0 0-6 0C5.3 1.2 4.2 1.6 4.2 1.6a5.2 5.2 0 0 0-.1 3.4 5.2 5.2 0 0 0-1.4 3.5c0 5.2 3 6.5 6 6.76a4.8 4.8 0 0 0-1 3.24v4"></path>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "education"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    // { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
  ];

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/", icon: <LinkedinIcon className="w-5 h-5" /> },
    { name: "GitHub", url: "https://github.com/Hrishi1176", icon: <GithubIcon className="w-5 h-5" /> },
    { name: "Instagram", url: "https://instagram.com/invisible_hovercraft_king", icon: <InstagramIcon className="w-5 h-5" /> },
    { name: "Facebook", url: "https://www.facebook.com/share/1DRH2U5YCw/", icon: <FacebookIcon className="w-5 h-5" /> },
  ];

  return (
    <main className="min-h-screen text-slate-900 dark:text-white transition-colors duration-300 relative font-sans overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 z-[-2] bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/40 dark:bg-purple-900/20 rounded-full blur-[128px] animate-pulse pointer-events-none transition-colors duration-300" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/40 dark:bg-blue-900/20 rounded-full blur-[128px] animate-pulse pointer-events-none transition-colors duration-300" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>
      
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <ParticleBackground />
      </div>

      <header className="fixed top-0 w-full z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 z-50">
            HB.
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-purple-500 dark:hover:text-purple-400 ${activeSection === link.href.substring(1) ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-gray-400"}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-black/10 dark:border-white/10">
              <ThemeToggle />
              <Link href="#contact" className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-sm font-medium border border-black/5 dark:border-white/10">
                Contact Me
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle and Theme */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <ThemeToggle />
            <button
              className="p-2 text-slate-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/5 dark:border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl transition-colors duration-300"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors hover:text-purple-500 dark:hover:text-purple-400 ${activeSection === link.href.substring(1) ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-gray-400"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-3 mt-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors text-center font-medium text-white"
            >
              Contact Me
            </Link>
          </motion.div>
        )}
      </header>

      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        {/* Hero Section */}
        <section id="hero" className="min-h-[90vh] flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-12 py-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6 flex flex-col items-center md:items-start"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium mb-2 transition-colors duration-300">
              Available for new opportunities
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-slate-900 dark:text-white transition-colors duration-300">
              Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600 dark:from-purple-400 dark:to-blue-500">Hrishi</span><br />
              Bhattacharya
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">
              Senior Software Developer
            </h2>
            <blockquote className="border-l-4 border-purple-500 pl-4 text-slate-600 dark:text-gray-400 max-w-xl text-base sm:text-lg leading-relaxed transition-colors duration-300 italic">
              Full Stack Engineer specializing in scalable web applications, multi-tenant SaaS platforms, and data engineering solutions.
            </blockquote>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link href="#contact" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-medium text-white flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Get In Touch
              </Link>
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-6 py-3 rounded-lg border border-purple-600/30 hover:border-purple-600 dark:border-purple-400/30 dark:hover:border-purple-400 bg-white/50 hover:bg-purple-50 dark:bg-black/50 dark:hover:bg-purple-900/20 transition-all font-medium text-slate-700 dark:text-gray-300 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> View Resume
              </button>
            </div>
            {/* Statistics */}
            <div className="flex flex-wrap gap-8 pt-6 mt-4 border-t border-black/10 dark:border-white/10 w-full md:max-w-md">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">4.5+</div>
                <div className="text-xs tracking-wider text-slate-500 uppercase mt-1">Years Exp.</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">10+</div>
                <div className="text-xs tracking-wider text-slate-500 uppercase mt-1">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">30+</div>
                <div className="text-xs tracking-wider text-slate-500 uppercase mt-1">Skills</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center w-full relative mt-12 md:mt-0"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] flex items-center justify-center">
              {/* Animated outer rings */}
              <div className="absolute inset-0 rounded-full border border-purple-500/30 border-dashed animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-blue-500/20 border-dashed animate-[spin_30s_linear_infinite_reverse]" />

              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full p-2 bg-gradient-to-tr from-purple-500 to-blue-500 relative z-10">
                <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden relative border-4 border-white dark:border-black transition-colors duration-300">
                  <Image
                    src="/Hrishi.Bhattacharyya.jpg"
                    alt="Hrishi Bhattacharya"
                    fill
                    sizes="(max-width: 768px) 16rem, (max-width: 1024px) 24rem, 24rem"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Orbital Tags */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 sm:top-16 sm:-left-12 md:top-20 md:-left-16 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-500/30 text-sm font-medium shadow-lg z-20 text-slate-800 dark:text-gray-200"
              >
                React & Next.js
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 -right-6 sm:top-32 sm:-right-12 md:top-40 md:-right-16 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-500/30 text-sm font-medium shadow-lg z-20 text-slate-800 dark:text-gray-200"
              >
                Data Engineering
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 -left-4 sm:bottom-24 sm:-left-8 md:bottom-28 md:-left-10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-pink-500/30 text-sm font-medium shadow-lg z-20 text-slate-800 dark:text-gray-200"
              >
                System Design
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-10 -right-4 sm:bottom-16 sm:-right-8 md:bottom-20 md:-right-12 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-teal-500/30 text-sm font-medium shadow-lg z-20 text-slate-800 dark:text-gray-200"
              >
                Python & Node.js
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white transition-colors duration-300">
              <span className="text-purple-600 dark:text-purple-400">01.</span> About Me
            </h2>
            <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl backdrop-blur-sm transition-colors duration-300">
              <p className="text-slate-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6 transition-colors duration-300">
                I am a Senior Full Stack Developer with over 4.5 years of experience designing and delivering scalable web applications, multi-tenant SaaS platforms, workflow automation systems, and data engineering solutions.
              </p>
              <p className="text-slate-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed transition-colors duration-300">
                My journey involves leading teams, architecting enterprise applications, and building robust end-to-end solutions. I have strong expertise in software architecture, REST APIs, database design, and cloud-based data solutions, always aiming to deliver high-quality, performant software.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-900 dark:text-white transition-colors duration-300">
              <span className="text-purple-600 dark:text-purple-400">02.</span> Core Skills
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Frontend",
                  icon: <Layout className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
                  skills: [
                    { name: "React.js", icon: <FaReact className="w-5 h-5 text-[#61DAFB]" /> },
                    { name: "Next.js", icon: <SiNextdotjs className="w-5 h-5 text-black dark:text-white" /> },
                    { name: "JavaScript", icon: <SiJavascript className="w-5 h-5 text-[#F7DF1E]" /> },
                    { name: "TypeScript", icon: <SiTypescript className="w-5 h-5 text-[#3178C6]" /> },
                    { name: "HTML5", icon: <FaHtml5 className="w-5 h-5 text-[#E34F26]" /> },
                    { name: "CSS3", icon: <FaCss3Alt className="w-5 h-5 text-[#1572B6]" /> }
                  ]
                },
                {
                  title: "Backend",
                  icon: <Server className="w-6 h-6 text-green-600 dark:text-green-400" />,
                  skills: [
                    { name: "Python", icon: <FaPython className="w-5 h-5 text-[#3776AB]" /> },
                    { name: "Node.js", icon: <FaNodeJs className="w-5 h-5 text-[#339933]" /> },
                    { name: "REST APIs", icon: <TbApi className="w-5 h-5 text-slate-500 dark:text-slate-400" /> }
                  ]
                },
                {
                  title: "Databases",
                  icon: <Database className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
                  skills: [
                    { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-[#47A248]" /> },
                    { name: "MySQL", icon: <SiMysql className="w-5 h-5 text-[#4479A1]" /> },
                    { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5 text-[#4169E1]" /> },
                    { name: "Snowflake", icon: <SiSnowflake className="w-5 h-5 text-[#29B5E8]" /> }
                  ]
                },
                {
                  title: "Tools & AI",
                  icon: <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
                  skills: [
                    { name: "Artificial Intelligence", icon: <FaRobot className="w-5 h-5 text-purple-500" /> },
                    { name: "Git", icon: <FaGitAlt className="w-5 h-5 text-[#F05032]" /> },
                    { name: "System Design", icon: <BiNetworkChart className="w-5 h-5 text-teal-500" /> },
                    { name: "CI/CD", icon: <BiChalkboard className="w-5 h-5 text-blue-500" /> },
                    { name: "Agile", icon: <BiCheckShield className="w-5 h-5 text-orange-500" /> }
                  ]
                }
              ].map((category, idx) => (
                <div key={idx} className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6 text-slate-900 dark:text-white transition-colors duration-300">
                    {category.icon}
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {category.skills.map((skill, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-gray-300 transition-colors duration-300 font-medium">
                        <div className="flex items-center justify-center p-1.5 rounded-md bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 shadow-sm">
                          {skill.icon}
                        </div>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-900 dark:text-white transition-colors duration-300">
              <span className="text-purple-600 dark:text-purple-400">03.</span> Experience
            </h2>

            <div className="relative pl-6 sm:pl-8 border-l border-black/10 dark:border-white/10 space-y-12 transition-colors duration-300">
              <div className="relative">
                <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-5 h-5 rounded-full bg-white dark:bg-black border-4 border-purple-500 transition-colors duration-300" />
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Manager – Software Development Team</h3>
                <div className="text-purple-600 dark:text-purple-400 font-medium mb-4 flex flex-wrap items-center gap-2 text-sm sm:text-base transition-colors duration-300">
                  <Briefcase className="w-4 h-4" /> eDge Wrapper Technology Pvt. Ltd. | 2023 – June 2026
                </div>
                <ul className="space-y-3 text-slate-700 dark:text-gray-300 text-sm sm:text-base transition-colors duration-300">
                  <li className="flex gap-3"><span className="text-purple-600 dark:text-purple-500">▹</span> Led the design and development of a multi-tenant e-commerce platform using Next.js with RBAC.</li>
                  <li className="flex gap-3"><span className="text-purple-600 dark:text-purple-500">▹</span> Built an enterprise Office Management System with HR, leave management, expense tracking, and task management.</li>
                  <li className="flex gap-3"><span className="text-purple-600 dark:text-purple-500">▹</span> Managed and mentored software engineers across multiple concurrent projects.</li>
                  <li className="flex gap-3"><span className="text-purple-600 dark:text-purple-500">▹</span> Optimized MySQL and PostgreSQL database performance for high-volume transactional systems.</li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-5 h-5 rounded-full bg-white dark:bg-black border-4 border-slate-400 dark:border-gray-600 transition-colors duration-300" />
                <h3 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-gray-300 transition-colors duration-300">Associate Software Developer</h3>
                <div className="text-slate-500 dark:text-gray-400 font-medium mb-4 flex flex-wrap items-center gap-2 text-sm sm:text-base transition-colors duration-300">
                  <Briefcase className="w-4 h-4" /> eDge Wrapper Technology Pvt. Ltd. | 2022 – 2023
                </div>
                <ul className="space-y-3 text-slate-600 dark:text-gray-400 text-sm sm:text-base transition-colors duration-300">
                  <li className="flex gap-3"><span className="text-slate-400 dark:text-gray-600">▹</span> Developed a Snowflake and Python based data platform supporting ETL pipelines, reporting, and analytics.</li>
                  <li className="flex gap-3"><span className="text-slate-400 dark:text-gray-600">▹</span> Designed workflow automation applications supporting configurable business processes.</li>
                  <li className="flex gap-3"><span className="text-slate-400 dark:text-gray-600">▹</span> Delivered custom WordPress solutions with SEO optimization and responsive design.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        {/* <section id="projects" className="py-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-900 dark:text-white transition-colors duration-300">
              <span className="text-purple-600 dark:text-purple-400">04.</span> Featured Projects
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "Multi-tenant E-Commerce Platform",
                  description: "Designed and developed a scalable e-commerce solution using Next.js featuring Role-Based Access Control (RBAC), robust product management, and comprehensive order processing modules.",
                  tech: ["Next.js", "React", "TypeScript", "Node.js"],
                  link: "#"
                },
                {
                  title: "Enterprise Office Management System",
                  description: "Built a comprehensive internal management platform incorporating HR workflows, leave management, expense tracking, and advanced task management capabilities.",
                  tech: ["React", "PostgreSQL", "REST APIs"],
                  link: "#"
                }
              ].map((project, idx) => (
                <div key={idx} className="group relative bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 flex flex-col h-full backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-6">
                    <Code2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    <a href={project.link} className="text-slate-400 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{project.title}</h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-6 text-sm sm:text-base flex-grow transition-colors duration-300">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t, i) => (
                      <span key={i} className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 px-3 py-1 rounded-full transition-colors duration-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section> */}

        {/* Education Section */}
        <section id="education" className="py-20 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-900 dark:text-white transition-colors duration-300">
              <span className="text-purple-600 dark:text-purple-400">04.</span> Education
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-sm transition-colors duration-300">
                <div className="p-4 bg-purple-100 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0 transition-colors duration-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-300">Bachelor of Engineering</h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-1 transition-colors duration-300">Information Technology</p>
                  <p className="text-sm text-slate-500 dark:text-gray-500 transition-colors duration-300">University Institute of Technology, The University of Burdwan</p>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-sm transition-colors duration-300">
                <div className="p-4 bg-blue-100 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0 transition-colors duration-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-300">Diploma in Engineering</h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-1 transition-colors duration-300">Computer Science and Technology</p>
                  <p className="text-sm text-slate-500 dark:text-gray-500 transition-colors duration-300">Siliguri Government Polytechnic</p>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-sm transition-colors duration-300">
                <div className="p-4 bg-green-100 dark:bg-green-500/10 rounded-xl text-green-600 dark:text-green-400 shrink-0 transition-colors duration-300">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-300">Secondary</h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-1 transition-colors duration-300">Madhyamik</p>
                  <p className="text-sm text-slate-500 dark:text-gray-500 transition-colors duration-300">CoochBehar Rambhola High School</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 border-t border-black/10 dark:border-white/10 text-center max-w-2xl mx-auto transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-300">Let's Connect</h2>
            <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-10 transition-colors duration-300">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <a href="mailto:hrishishp97@gmail.com" className="px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors font-medium text-white flex items-center justify-center gap-3">
                <Mail className="w-5 h-5" /> hrishishp97@gmail.com
              </a>
              <a href="https://wa.me/916294660141" target="_blank" rel="noopener noreferrer" className="px-6 py-4 rounded-xl bg-[#25D366]/10 dark:bg-[#25D366]/20 hover:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30 text-[#128C7E] dark:text-[#25D366] transition-colors font-medium border border-[#25D366]/30 flex items-center justify-center gap-3">
                <WhatsappIcon className="w-5 h-5" /> WhatsApp Me
              </a>
              <a href="tel:+916294660141" className="px-6 py-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors font-medium border border-black/10 dark:border-white/10 flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Call Me
              </a>
            </div>

            {/* Large Social Icons in Contact */}
            <div className="flex justify-center gap-6">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2" title={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-black/10 dark:border-white/10 text-center text-slate-500 dark:text-gray-500 text-sm flex flex-col md:flex-row items-center justify-between transition-colors duration-300">
          <p>© {new Date().getFullYear()} Hrishi Bhattacharya. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {social.name}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsResumeModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-black/10 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Resume - Hrishi Bhattacharya
              </h3>
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-800/30 relative">
              <iframe
                src="resume/Hrishi_Bhattacharya_Resume.pdf"
                className="w-full h-full border-0"
                title="Hrishi Bhattacharya Resume"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
