import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RobotCompanionProvider } from "@/context/RobotCompanionContext";
import { Analytics } from "@vercel/analytics/react";
import { PayloadService } from "@/services/payloadService";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030014",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await PayloadService.getSiteContent();
  const dev = content.developer;
  const hero = content.hero;

  return {
    metadataBase: new URL("https://work-pilot-ai.vercel.app"),
    title: {
      default: `${dev.name} — ${dev.title}`,
      template: `%s | ${dev.name}`,
    },
    description: hero.tagline,
    keywords: [
      dev.name,
      dev.role,
      dev.title,
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
    authors: [{ name: dev.name, url: dev.github }],
    creator: dev.name,
    publisher: dev.name,
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
      url: dev.github,
      title: `${dev.name} — ${dev.title}`,
      description: hero.tagline,
      siteName: `${dev.name} Portfolio`,
      images: [
        {
          url: "/Hrishi.Bhattacharyya.jpg",
          width: 1200,
          height: 630,
          alt: `${dev.name} Developer Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dev.name} — ${dev.title}`,
      description: hero.tagline,
      creator: "@Hrishi1176",
      images: ["/Hrishi.Bhattacharyya.jpg"],
    },
    alternates: {
      canonical: dev.github,
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const robots = await PayloadService.getRobots();
  const content = await PayloadService.getSiteContent();
  const dev = content.developer;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: dev.name,
    jobTitle: dev.role,
    worksFor: {
      "@type": "Organization",
      name: "eDge Wrapper Technology Pvt. Ltd.",
    },
    url: dev.github,
    sameAs: [
      dev.github,
      dev.linkedin,
      dev.instagram,
      dev.facebook,
    ].filter(Boolean),
    knowsAbout: [
      "Full Stack Software Engineering",
      "React.js & Next.js 16",
      "Python & Node.js",
      "Multi-Tenant SaaS Architecture",
      "Cloud Data Engineering & Snowflake",
      "MongoDB & PostgreSQL Database Optimization",
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased bg-[#030014] text-slate-100`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <RobotCompanionProvider initialRobots={robots}>
            {children}
          </RobotCompanionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
