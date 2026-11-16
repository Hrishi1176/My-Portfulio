import { getPayload } from "payload";
import config from "@payload-config";
import portfolioConfig, {
  ProjectConfig,
  RoleConfig,
  SkillCategoryConfig,
  EducationConfig,
  DeveloperConfig,
  HeroConfig,
  AboutConfig,
  NavigationItem,
} from "@/config/portfolioConfig";

export interface ReviewItem {
  _id: string;
  clientName: string;
  clientRole: string;
  company: string;
  rating: number;
  reviewText: string;
  createdAt?: string;
  isVerified?: boolean;
}

export interface SiteContentData {
  developer: DeveloperConfig;
  hero: HeroConfig;
  about: AboutConfig;
  contactOptions: {
    subjectOptions: string[];
    budgetRanges: Array<{ value: string; label: string }>;
  };
  aiChat: {
    maxDailyChats: number;
    maxDailyRefinements: number;
    suggestedPrompts: string[];
  };
  navigation: NavigationItem[];
}

interface PayloadProjectDoc {
  number?: string | null;
  title: string;
  description: string;
  tech?: Array<{ name: string } | string> | null;
  github?: string | null;
  live?: string | null;
  isPrivate?: boolean | null;
  featured?: boolean | null;
  gradient?: string | null;
  accentBorder?: string | null;
  tagColor?: string | null;
  stars?: number | null;
  language?: string | null;
}

interface PayloadExperienceDoc {
  period: string;
  role: string;
  company: string;
  location?: string | null;
  badge?: string | null;
  responsibilities?: Array<{ item: string } | string> | null;
  tech?: Array<{ name: string } | string> | null;
}

interface PayloadSkillDoc {
  title: string;
  categoryIcon?: string | null;
  skillsList?: Array<{ name: string; icon: string; color?: string | null }> | null;
}

interface PayloadEducationDoc {
  degree: string;
  field?: string | null;
  institution: string;
  period?: string | null;
  score?: string | null;
}

interface PayloadReviewDoc {
  id: string | number;
  clientName: string;
  clientRole?: string | null;
  company?: string | null;
  rating?: number | null;
  reviewText: string;
  createdAt?: string | Date | null;
}

interface PayloadSiteContentGlobalDoc {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
  title?: string | null;
  experienceYears?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  location?: string | null;
  socials?: {
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    facebook?: string | null;
  } | null;
  availabilityBadge?: string | null;
  tagline?: string | null;
  stats?: Array<{ value: string; label: string }> | null;
  floatingBadges?: Array<{
    label: string;
    color: string;
    border: string;
    text: string;
    top: string;
    left: string;
    delay: number;
  }> | null;
  techStreams?: Array<{
    name: string;
    tag: string;
    speed: string;
    color: string;
  }> | null;
  bioParagraphs?: Array<{ paragraph: string } | string> | null;
  traits?: Array<{ trait: string } | string> | null;
  focusAreas?: Array<{ label: string; icon?: string; color: string }> | null;
  subjectOptions?: Array<{ subject: string } | string> | null;
  budgetRanges?: Array<{ value: string; label: string }> | null;
  aiChat?: {
    maxDailyChats?: number | null;
    maxDailyRefinements?: number | null;
    suggestedPrompts?: Array<{ prompt: string } | string> | null;
  } | null;
  navigation?: Array<{ name: string; href: string }> | null;
}

export class PayloadService {
  private static async getSafePayload() {
    try {
      return await getPayload({ config });
    } catch (err) {
      console.warn("Payload CMS initialization deferred or offline:", err);
      return null;
    }
  }

  static async getSiteContent(): Promise<SiteContentData> {
    const fallback: SiteContentData = {
      developer: portfolioConfig.developer,
      hero: portfolioConfig.hero,
      about: portfolioConfig.about,
      contactOptions: portfolioConfig.contactOptions,
      aiChat: portfolioConfig.aiChat,
      navigation: portfolioConfig.navigation,
    };

    try {
      const payload = await this.getSafePayload();
      if (!payload) return fallback;

      const doc = (await payload.findGlobal({
        slug: "site-content",
      })) as unknown as PayloadSiteContentGlobalDoc;

      if (!doc || !doc.name) {
        return fallback;
      }

      const bioParagraphs = (doc.bioParagraphs || [])
        .map((p) => (typeof p === "string" ? p : p.paragraph))
        .filter(Boolean);

      const traits = (doc.traits || [])
        .map((t) => (typeof t === "string" ? t : t.trait))
        .filter(Boolean);

      const subjectOptions = (doc.subjectOptions || [])
        .map((s) => (typeof s === "string" ? s : s.subject))
        .filter(Boolean);

      const suggestedPrompts = (doc.aiChat?.suggestedPrompts || [])
        .map((p) => (typeof p === "string" ? p : p.prompt))
        .filter(Boolean);

      return {
        developer: {
          name: doc.name || fallback.developer.name,
          firstName: doc.firstName || fallback.developer.firstName,
          lastName: doc.lastName || fallback.developer.lastName,
          initials: fallback.developer.initials,
          role: doc.role || fallback.developer.role,
          title: doc.title || fallback.developer.title,
          experienceYears: doc.experienceYears || fallback.developer.experienceYears,
          email: doc.email || fallback.developer.email,
          phone: doc.phone || fallback.developer.phone,
          whatsapp: doc.whatsapp || fallback.developer.whatsapp,
          location: doc.location || fallback.developer.location,
          github: doc.socials?.github || fallback.developer.github,
          linkedin: doc.socials?.linkedin || fallback.developer.linkedin,
          instagram: doc.socials?.instagram || fallback.developer.instagram,
          facebook: doc.socials?.facebook || fallback.developer.facebook,
        },
        hero: {
          availabilityBadge: doc.availabilityBadge || fallback.hero.availabilityBadge,
          tagline: doc.tagline || fallback.hero.tagline,
          stats: doc.stats && doc.stats.length > 0 ? doc.stats : fallback.hero.stats,
          floatingBadges:
            doc.floatingBadges && doc.floatingBadges.length > 0
              ? doc.floatingBadges
              : fallback.hero.floatingBadges,
          techStreams:
            doc.techStreams && doc.techStreams.length > 0
              ? doc.techStreams
              : fallback.hero.techStreams,
        },
        about: {
          bioParagraphs:
            bioParagraphs.length > 0 ? bioParagraphs : fallback.about.bioParagraphs,
          traits: traits.length > 0 ? traits : fallback.about.traits,
          focusAreas:
            doc.focusAreas && doc.focusAreas.length > 0
              ? doc.focusAreas
              : fallback.about.focusAreas,
        },
        contactOptions: {
          subjectOptions:
            subjectOptions.length > 0
              ? subjectOptions
              : fallback.contactOptions.subjectOptions,
          budgetRanges:
            doc.budgetRanges && doc.budgetRanges.length > 0
              ? doc.budgetRanges
              : fallback.contactOptions.budgetRanges,
        },
        aiChat: {
          maxDailyChats:
            doc.aiChat?.maxDailyChats || fallback.aiChat.maxDailyChats,
          maxDailyRefinements:
            doc.aiChat?.maxDailyRefinements || fallback.aiChat.maxDailyRefinements,
          suggestedPrompts:
            suggestedPrompts.length > 0
              ? suggestedPrompts
              : fallback.aiChat.suggestedPrompts,
        },
        navigation:
          doc.navigation && doc.navigation.length > 0
            ? doc.navigation
            : fallback.navigation,
      };
    } catch (error) {
      console.warn("Falling back to static siteContent config:", error);
      return fallback;
    }
  }

  static async getProjects(): Promise<ProjectConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return portfolioConfig.projects;

      const result = await payload.find({
        collection: "projects",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return portfolioConfig.projects;
      }

      return (result.docs as unknown as PayloadProjectDoc[]).map((doc, i) => ({
        number: doc.number || `0${i + 1}`,
        title: doc.title,
        description: doc.description,
        tech: (doc.tech || []).map((t) => (typeof t === "string" ? t : t.name)),
        github: doc.github || null,
        live: doc.live || null,
        isPrivate: Boolean(doc.isPrivate),
        featured: Boolean(doc.featured),
        gradient: doc.gradient || "from-purple-600/20 via-indigo-600/20 to-blue-600/20",
        accentBorder: doc.accentBorder || "border-purple-500/30",
        tagColor: doc.tagColor || "text-purple-600 dark:text-purple-300 border-purple-500/30",
        stars: doc.stars || 0,
        language: doc.language || undefined,
      }));
    } catch (error) {
      console.warn("Falling back to static projects config:", error);
      return portfolioConfig.projects;
    }
  }

  static async getExperiences(): Promise<RoleConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return portfolioConfig.experience.roles;

      const result = await payload.find({
        collection: "experiences",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return portfolioConfig.experience.roles;
      }

      return (result.docs as unknown as PayloadExperienceDoc[]).map((doc) => ({
        period: doc.period,
        role: doc.role,
        company: doc.company,
        location: doc.location || "",
        badge: doc.badge || "Full-Time",
        type: doc.badge === "Current" ? "current" : "past",
        responsibilities: (doc.responsibilities || []).map((r) =>
          typeof r === "string" ? r : r.item
        ),
        tech: (doc.tech || []).map((t) =>
          typeof t === "string" ? t : t.name
        ),
      }));
    } catch (error) {
      console.warn("Falling back to static experiences config:", error);
      return portfolioConfig.experience.roles;
    }
  }

  static async getSkills(): Promise<SkillCategoryConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return portfolioConfig.skills.categories;

      const result = await payload.find({
        collection: "skills",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return portfolioConfig.skills.categories;
      }

      return (result.docs as unknown as PayloadSkillDoc[]).map((doc) => ({
        title: doc.title,
        icon: doc.categoryIcon || "Code2",
        iconColor: "text-purple-500",
        accent: "from-purple-500/20 to-indigo-500/10",
        border: "border-purple-500/30",
        skills: (doc.skillsList || []).map((s) => ({
          name: s.name,
          icon: s.icon,
          color: s.color || undefined,
        })),
      }));
    } catch (error) {
      console.warn("Falling back to static skills config:", error);
      return portfolioConfig.skills.categories;
    }
  }

  static async getEducation(): Promise<EducationConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return portfolioConfig.education;

      const result = await payload.find({
        collection: "education",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return portfolioConfig.education;
      }

      return (result.docs as unknown as PayloadEducationDoc[]).map((doc) => ({
        title: doc.degree,
        field: doc.field || "",
        school: doc.institution,
        period: doc.period || "",
        grade: doc.score || "",
        gradient: "from-purple-500/10 via-indigo-500/5 to-transparent",
        iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        iconColor: "text-purple-500",
        border: "border-purple-500/20 hover:border-purple-500/50",
      }));
    } catch (error) {
      console.warn("Falling back to static education config:", error);
      return portfolioConfig.education;
    }
  }

  static async getReviews(): Promise<ReviewItem[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "reviews",
        where: {
          status: {
            equals: "approved",
          },
        },
        sort: "-createdAt",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
      }

      return (result.docs as unknown as PayloadReviewDoc[]).map((doc) => ({
        _id: String(doc.id),
        clientName: doc.clientName,
        clientRole: doc.clientRole || "Client",
        company: doc.company || "",
        rating: doc.rating || 5,
        reviewText: doc.reviewText,
        createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
        isVerified: true,
      }));
    } catch (error) {
      console.warn("Falling back to empty/static reviews:", error);
      return [];
    }
  }
}
