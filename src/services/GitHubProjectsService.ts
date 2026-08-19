import { portfolioConfig, ProjectConfig } from "@/config/portfolioConfig";

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  topics?: string[];
  pushed_at: string;
  created_at: string;
  updated_at: string;
}

const COLOR_THEMES = [
  {
    gradient: "from-cyan-500/15 via-blue-500/10 to-transparent",
    accentBorder: "border-cyan-500/35 dark:border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.12)]",
    tagColor: "text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    gradient: "from-purple-500/15 via-violet-500/10 to-transparent",
    accentBorder: "border-purple-500/35 dark:border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
    tagColor: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    accentBorder: "border-emerald-500/35 dark:border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
    tagColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    gradient: "from-blue-500/15 via-indigo-500/10 to-transparent",
    accentBorder: "border-blue-500/35 dark:border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.12)]",
    tagColor: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent",
    accentBorder: "border-amber-500/35 dark:border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    tagColor: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    gradient: "from-rose-500/15 via-pink-500/10 to-transparent",
    accentBorder: "border-rose-500/35 dark:border-rose-400/30 shadow-[0_0_20px_rgba(244,63,94,0.12)]",
    tagColor: "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
  {
    gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
    accentBorder: "border-violet-500/35 dark:border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.12)]",
    tagColor: "text-violet-600 dark:text-violet-400 border-violet-500/30 bg-violet-500/10",
  },
];

/**
 * Extract GitHub username from configured URL or fallback
 */
export function getGitHubUsername(): string {
  const url = portfolioConfig.developer.github || "https://github.com/Hrishi1176";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] || "Hrishi1176";
}

/**
 * Format repository name to user-friendly readable title
 */
function formatRepoTitle(repoName: string): string {
  // Convert kebab-case, snake_case or PascalCase to Title Case
  return repoName
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Construct clean title avoiding duplicate name prefixes
 */
function buildCleanTitle(repoName: string, description: string | null): string {
  const formattedName = formatRepoTitle(repoName);
  if (!description || description.trim() === "") return formattedName;
  const desc = description.trim();
  
  if (desc.toLowerCase().startsWith(repoName.toLowerCase())) {
    return desc;
  }
  if (desc.includes("—")) {
    const afterDash = desc.split("—").slice(1).join("—").trim();
    return `${formattedName} — ${afterDash}`;
  }
  return `${formattedName} — ${desc}`;
}

/**
 * Service to dynamically fetch, parse, and enrich GitHub projects in real-time.
 */
export class GitHubProjectsService {
  /**
   * Fetches public repositories from GitHub and seamlessly integrates them with portfolio projects.
   */
  public static async getDynamicProjects(): Promise<ProjectConfig[]> {
    const username = getGitHubUsername();
    const configProjects = portfolioConfig.projects || [];

    try {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      };

      if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      // Fetch public repos sorted by most recently updated
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
        headers,
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!res.ok) {
        console.warn(`GitHub API responded with status ${res.status}. Falling back to portfolio config.`);
        return configProjects;
      }

      const repos: GitHubRepoItem[] = await res.json();
      if (!Array.isArray(repos)) {
        return configProjects;
      }

      // Filter out forks or archived repos if needed (keep original public repos)
      const validRepos = repos.filter((repo) => !repo.fork && !repo.archived);

      // Create a map of existing configured projects for rapid matching
      const configMap = new Map<string, ProjectConfig>();
      configProjects.forEach((proj) => {
        if (proj.github) {
          const repoSlug = proj.github.toLowerCase().split("/").pop() || "";
          configMap.set(repoSlug, proj);
        }
        // Also map by title prefix
        const titleKey = proj.title.toLowerCase().split("—")[0].trim().replace(/[^a-z0-9]/g, "");
        if (titleKey) {
          configMap.set(titleKey, proj);
        }
      });

      const processedProjects: ProjectConfig[] = [];
      const handledSlugs = new Set<string>();

      // 1. Process all fetched GitHub repositories
      validRepos.forEach((repo, index) => {
        const slug = repo.name.toLowerCase();
        const slugClean = slug.replace(/[^a-z0-9]/g, "");
        handledSlugs.add(slug);
        handledSlugs.add(slugClean);

        const existing = configMap.get(slug) || configMap.get(slugClean);
        const theme = COLOR_THEMES[index % COLOR_THEMES.length];

        // Gather tech tags from topics and primary language
        const techSet = new Set<string>();
        if (existing?.tech) {
          existing.tech.forEach((t) => techSet.add(t));
        }
        if (repo.language) {
          techSet.add(repo.language);
        }
        if (repo.topics && Array.isArray(repo.topics)) {
          repo.topics.forEach((t) => {
            const formattedTag = t.charAt(0).toUpperCase() + t.slice(1);
            techSet.add(formattedTag);
          });
        }
        // If empty tech stack, fallback to Web Development
        if (techSet.size === 0) {
          techSet.add("Web App");
        }

        const projectItem: ProjectConfig = {
          number: existing?.number || String(index + 1).padStart(2, "0"),
          title: existing?.title || buildCleanTitle(repo.name, repo.description),
          description:
            existing?.description ||
            repo.description ||
            `${formatRepoTitle(repo.name)} application engineered with modern full-stack technologies and deployed on cloud architecture.`,
          tech: Array.from(techSet).slice(0, 6),
          github: repo.html_url,
          live: existing?.live || repo.homepage || null,
          isPrivate: repo.private,
          featured: existing?.featured ?? index < 3,
          gradient: existing?.gradient || theme.gradient,
          accentBorder: existing?.accentBorder || theme.accentBorder,
          tagColor: existing?.tagColor || theme.tagColor,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.pushed_at || repo.updated_at,
          language: repo.language || undefined,
          topics: repo.topics || [],
        };

        processedProjects.push(projectItem);
      });

      // 2. Include any private or custom projects from portfolioConfig.json that aren't on public GitHub
      configProjects.forEach((proj) => {
        const repoSlug = proj.github ? proj.github.toLowerCase().split("/").pop() || "" : "";
        const titleKey = proj.title.toLowerCase().split("—")[0].trim().replace(/[^a-z0-9]/g, "");

        if (!handledSlugs.has(repoSlug) && !handledSlugs.has(titleKey)) {
          processedProjects.push(proj);
        }
      });

      // 3. Sort: Featured projects first, then by last updated
      processedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return 0;
      });

      // 4. Re-index formatted numbers "01", "02", "03"...
      return processedProjects.map((p, idx) => ({
        ...p,
        number: String(idx + 1).padStart(2, "0"),
      }));
    } catch (error) {
      console.error("Error in GitHubProjectsService.getDynamicProjects:", error);
      return configProjects;
    }
  }
}
