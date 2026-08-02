"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, Award, ShieldCheck, Eye, Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CertificateModal } from "./CertificateModal";

const experiences = [
  {
    role: "Manager – Software Development Team",
    company: "eDge Wrapper Technology Pvt. Ltd.",
    period: "2023 – June 2026",
    type: "past",
    hasCertificate: true,
    bullets: [
      "Led the design and development of a multi-tenant e-commerce platform using Next.js with RBAC.",
      "Built an enterprise Office Management System with HR, leave management, expense tracking, and task management.",
      "Managed and mentored software engineers across multiple concurrent projects.",
      "Optimised MySQL and PostgreSQL database performance for high-volume transactional systems.",
    ],
  },
  {
    role: "Associate Software Developer",
    company: "eDge Wrapper Technology Pvt. Ltd.",
    period: "2022 – 2023",
    type: "past",
    hasCertificate: true,
    bullets: [
      "Developed a Snowflake and Python-based data platform supporting ETL pipelines, reporting, and analytics.",
      "Designed workflow automation applications supporting configurable business processes.",
      "Delivered custom WordPress solutions with SEO optimisation and responsive design.",
    ],
  },
];

export function Experience() {
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  return (
    <>
      <section id="experience" className="scroll-mt-24 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65 }}
        >
          {/* Label */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="section-num text-base">03.</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Work History
              </span>
            </div>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all shadow-sm"
            >
              <Award className="h-4 w-4 text-emerald-500" />
              View Experience Certificate
            </button>
          </div>

          <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Professional <span className="gradient-text">Experience</span>
          </h2>

          <div className="glass p-6 sm:p-8 lg:p-10 space-y-10">
            {/* Timeline */}
            <div className="relative space-y-10">
              {/* Vertical track */}
              <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-purple-500 via-blue-400 to-slate-200 dark:to-slate-700 hidden sm:block" />

              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.role}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                  className="relative sm:pl-10"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[1px] top-1 hidden sm:flex h-6 w-6 items-center justify-center rounded-full border-2 ${exp.type === "current"
                      ? "border-purple-500 bg-purple-100 dark:bg-purple-900/40"
                      : "border-slate-400 bg-slate-100 dark:bg-slate-800 dark:border-slate-600"
                      }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${exp.type === "current" ? "bg-purple-500" : "bg-slate-400 dark:bg-slate-500"
                        }`}
                    />
                  </div>

                  <div className={`card p-5 sm:p-6 ${exp.type === "current" ? "border-purple-400/25 dark:border-purple-500/20" : ""}`}>
                    {/* Role & meta */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3
                          className={`text-lg font-bold sm:text-xl ${exp.type === "current"
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          {exp.role}
                        </h3>

                        {exp.hasCertificate && (
                          <button
                            onClick={() => setIsCertModalOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all"
                          >
                            <Award className="h-3.5 w-3.5 text-purple-500" />
                            Certificate
                          </button>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                          <span className={exp.type === "current" ? "font-semibold text-purple-600 dark:text-purple-400" : ""}>
                            {exp.company}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          On-Site
                        </span>
                      </div>
                    </div>

                    {/* Bullet points */}
                    <ul className="space-y-2.5">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                          <span
                            className={`mt-[3px] shrink-0 text-base leading-none ${exp.type === "current" ? "text-purple-500 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"
                              }`}
                          >
                            ▹
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Featured Experience Certificate Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 p-5 sm:p-6 backdrop-blur-md relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Certificate Thumbnail */}
                <div 
                  onClick={() => setIsCertModalOpen(true)}
                  className="relative group w-full md:w-64 shrink-0 aspect-[4/3] rounded-xl overflow-hidden border border-emerald-500/30 cursor-pointer shadow-md bg-slate-900"
                >
                  <Image
                    src="/certificates/experience-certificate.png"
                    alt="Edgewrapper Technology Experience Certificate"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white group-hover:scale-105 transition-transform">
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      View Certificate
                    </span>
                  </div>
                </div>

                {/* Certificate Information */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Document
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Official Certificate of Experience
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Issued by <strong className="text-slate-800 dark:text-slate-200">eDge Wrapper Technology Private Limited</strong> for work tenure from <strong className="text-slate-800 dark:text-slate-200">01st March 2022 to 29th June 2026</strong>. Highlights initial appointment as Associate and promotion to Manager.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => setIsCertModalOpen(true)}
                      className="btn-primary text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md border-0"
                    >
                      <Eye className="h-4 w-4" />
                      View Full Certificate
                    </button>
                    <a
                      href="/certificates/experience-certificate.png"
                      download="Hrishi_Bhattacharya_Experience_Certificate.png"
                      className="btn-outline text-xs sm:text-sm py-2 px-4 rounded-xl flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Copy
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {isCertModalOpen && (
        <CertificateModal onClose={() => setIsCertModalOpen(false)} />
      )}
    </>
  );
}

