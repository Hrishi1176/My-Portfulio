import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#080612" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://work-pilot-ai.vercel.app"), // Replace with primary portfolio domain
  title: {
    default: "Hrishi Bhattacharya — Senior Software Developer & Full Stack Engineer",
    template: "%s | Hrishi Bhattacharya",
  },
  description:
    "Senior Full Stack Developer & System Architect with 4.5+ years of experience designing scalable multi-tenant SaaS platforms, Next.js web applications, Python automation engines, and cloud data solutions.",
  keywords: [
    "Hrishi Bhattacharya",
    "Senior Software Developer",
    "Full Stack Engineer",
    "Next.js Developer",
    "React Developer",
    "Python Developer",
    "SaaS Architect",
    "Cloud Data Engineering",
    "Snowflake ETL",
    "Software Manager",
    "Portfolio",
  ],
  authors: [{ name: "Hrishi Bhattacharya", url: "https://github.com/Hrishi1176" }],
  creator: "Hrishi Bhattacharya",
  publisher: "Hrishi Bhattacharya",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/Hrishi1176",
    title: "Hrishi Bhattacharya — Senior Software Developer & Full Stack Engineer",
    description:
      "Full-stack portfolio featuring enterprise SaaS platforms, AI agent automation, cloud financial ledgers, and dynamic telemetry analytics.",
    siteName: "Hrishi Bhattacharya Portfolio",
    images: [
      {
        url: "/certificates/experience-certificate.png",
        width: 1200,
        height: 630,
        alt: "Hrishi Bhattacharya Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hrishi Bhattacharya — Senior Software Developer & Full Stack Engineer",
    description:
      "Senior Full Stack Developer with 4.5+ years experience building Next.js apps, SaaS platforms, and cloud solutions.",
    creator: "@Hrishi1176",
    images: ["/certificates/experience-certificate.png"],
  },
  alternates: {
    canonical: "https://github.com/Hrishi1176",
  },
};

// JSON-LD Structured Data Schema for Google Search Indexing
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hrishi Bhattacharya",
  jobTitle: "Senior Software Developer & Manager",
  worksFor: {
    "@type": "Organization",
    name: "eDge Wrapper Technology Pvt. Ltd.",
  },
  url: "https://github.com/Hrishi1176",
  sameAs: [
    "https://github.com/Hrishi1176",
    "https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/",
    "https://instagram.com/invisible_hovercraft_king",
  ],
  knowsAbout: [
    "Full Stack Software Engineering",
    "React.js & Next.js 16",
    "Python & Node.js",
    "Multi-Tenant SaaS Architecture",
    "Cloud Data Engineering & Snowflake",
    "MongoDB & PostgreSQL Database Optimization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
