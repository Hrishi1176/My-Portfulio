import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Referrer Policy
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // XSS Protection
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Strict Transport Security (HSTS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Permissions Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Global security headers for all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Allow PDFs in /resume/ to be embedded via <iframe> on the same origin.
        // Next.js defaults to X-Frame-Options: SAMEORIGIN, but Vercel can override
        // it to "deny". We explicitly set SAMEORIGIN here so the ResumeModal iframe works.
        source: "/resume/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
