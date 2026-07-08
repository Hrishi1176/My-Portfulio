"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

const socials = [
  { name: "GitHub",    url: "https://github.com/Hrishi1176",                               icon: GithubIcon    },
  { name: "LinkedIn",  url: "https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/", icon: LinkedinIcon  },
  { name: "Instagram", url: "https://instagram.com/invisible_hovercraft_king",              icon: InstagramIcon },
  { name: "Facebook",  url: "https://www.facebook.com/share/1DRH2U5YCw/",                  icon: FacebookIcon  },
];

const navLinks = [
  { name: "Home",       href: "#hero"       },
  { name: "About",      href: "#about"      },
  { name: "Skills",     href: "#skills"     },
  { name: "Experience", href: "#experience" },
  { name: "Projects",   href: "#projects"   },
  { name: "Education",  href: "#education"  },
  { name: "Contact",    href: "#contact"    },
];

export function Footer() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] pt-10 pb-8">
      <div className="grid gap-8 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        {/* Brand */}
        <div>
          <div className="text-2xl font-extrabold gradient-text">HB.</div>
          <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-slate-500 dark:text-slate-500">
            Senior Software Developer & Full Stack Engineer.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-center">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-sm text-slate-500 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2">
          {socials.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400/40 transition-all duration-200"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[var(--border)] pt-5 sm:flex-row">
        <p className="text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Hrishi Bhattacharya. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-600">
          Built with <Heart className="h-3 w-3 text-pink-400 fill-pink-400" /> using Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
