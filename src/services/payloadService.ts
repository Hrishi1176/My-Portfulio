import { getPayload } from "payload";
import config from "@payload-config";
import type {
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

export interface ImpactMetricDoc {
  label: string;
  before: string;
  after: string;
  unit: string;
  detail: string;
}

export interface RobotCMSDoc {
  id: string;
  agentId: string;
  name: string;
  codename: string;
  role: string;
  sector: string;
  sceneNumber: number;
  targetElementId: string;
  modelPath: string;
  glowColor: string;
  glowRgba: string;
  voicePitch: number;
  description: string;
  transmission: string;
  status: string;
  badgeColor: string;
  borderColor: string;
  tourSpeech?: string | null;
  tourActionLabel?: string | null;
  order?: number | null;
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
  impactMetrics: ImpactMetricDoc[];
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

interface PayloadRobotDoc {
  id: string | number;
  agentId: string;
  name: string;
  codename: string;
  role: string;
  sector: string;
  sceneNumber: number;
  targetElementId?: string | null;
  modelPath?: string | null;
  glowColor?: string | null;
  glowRgba?: string | null;
  voicePitch?: number | null;
  description: string;
  transmission: string;
  status?: string | null;
  badgeColor?: string | null;
  borderColor?: string | null;
  tourSpeech?: string | null;
  tourActionLabel?: string | null;
  order?: number | null;
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
  impactMetrics?: ImpactMetricDoc[] | null;
}

const DEFAULT_BLANK_SITE_CONTENT: SiteContentData = {
  developer: {
    name: "",
    firstName: "",
    lastName: "",
    initials: "HB",
    role: "",
    title: "",
    experienceYears: "0",
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    github: "",
    linkedin: "",
    instagram: "",
    facebook: "",
  },
  hero: {
    availabilityBadge: "Available for new opportunities",
    tagline: "",
    stats: [],
    floatingBadges: [],
    techStreams: [],
  },
  about: {
    bioParagraphs: [],
    traits: [],
    focusAreas: [],
  },
  contactOptions: {
    subjectOptions: [],
    budgetRanges: [],
  },
  aiChat: {
    maxDailyChats: 10,
    maxDailyRefinements: 5,
    suggestedPrompts: [],
  },
  navigation: [],
  impactMetrics: [],
};

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
    try {
      const payload = await this.getSafePayload();
      if (!payload) return DEFAULT_BLANK_SITE_CONTENT;

      const doc = (await payload.findGlobal({
        slug: "site-content",
      })) as unknown as PayloadSiteContentGlobalDoc;

      if (!doc || !doc.name) {
        return DEFAULT_BLANK_SITE_CONTENT;
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

      const firstInitial = doc.firstName ? doc.firstName[0].toUpperCase() : "H";
      const lastInitial = doc.lastName ? doc.lastName[0].toUpperCase() : "B";
      const initials = `${firstInitial}${lastInitial}`;

      return {
        developer: {
          name: doc.name || "",
          firstName: doc.firstName || "",
          lastName: doc.lastName || "",
          initials,
          role: doc.role || "",
          title: doc.title || "",
          experienceYears: doc.experienceYears || "0",
          email: doc.email || "",
          phone: doc.phone || "",
          whatsapp: doc.whatsapp || "",
          location: doc.location || "",
          github: doc.socials?.github || "",
          linkedin: doc.socials?.linkedin || "",
          instagram: doc.socials?.instagram || "",
          facebook: doc.socials?.facebook || "",
        },
        hero: {
          availabilityBadge: doc.availabilityBadge || "Available for new opportunities",
          tagline: doc.tagline || "",
          stats: doc.stats || [],
          floatingBadges: doc.floatingBadges || [],
          techStreams: doc.techStreams || [],
        },
        about: {
          bioParagraphs,
          traits,
          focusAreas: doc.focusAreas || [],
        },
        contactOptions: {
          subjectOptions,
          budgetRanges: doc.budgetRanges || [],
        },
        aiChat: {
          maxDailyChats: doc.aiChat?.maxDailyChats || 10,
          maxDailyRefinements: doc.aiChat?.maxDailyRefinements || 5,
          suggestedPrompts,
        },
        navigation: doc.navigation || [],
        impactMetrics: doc.impactMetrics || [],
      };
    } catch (error) {
      console.warn("Error fetching siteContent from Payload CMS:", error);
      return DEFAULT_BLANK_SITE_CONTENT;
    }
  }

  static async getImpactMetrics(): Promise<ImpactMetricDoc[]> {
    try {
      const siteContent = await this.getSiteContent();
      return siteContent.impactMetrics || [];
    } catch (error) {
      console.warn("Error fetching impactMetrics from Payload CMS:", error);
      return [];
    }
  }

  static async getProjects(): Promise<ProjectConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "projects",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
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
      console.warn("Error fetching projects from Payload CMS:", error);
      return [];
    }
  }

  static async getExperiences(): Promise<RoleConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "experiences",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
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
      console.warn("Error fetching experiences from Payload CMS:", error);
      return [];
    }
  }

  static async getSkills(): Promise<SkillCategoryConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "skills",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
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
      console.warn("Error fetching skills from Payload CMS:", error);
      return [];
    }
  }

  static async getEducation(): Promise<EducationConfig[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "education",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
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
      console.warn("Error fetching education from Payload CMS:", error);
      return [];
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
      console.warn("Error fetching reviews from Payload CMS:", error);
      return [];
    }
  }

  static async getRobots(): Promise<RobotCMSDoc[]> {
    try {
      const payload = await this.getSafePayload();
      if (!payload) return [];

      const result = await payload.find({
        collection: "robots",
        sort: "order",
        limit: 50,
      });

      if (!result.docs || result.docs.length === 0) {
        return [];
      }

      return (result.docs as unknown as PayloadRobotDoc[]).map((doc) => ({
        id: String(doc.id),
        agentId: doc.agentId,
        name: doc.name,
        codename: doc.codename,
        role: doc.role,
        sector: doc.sector,
        sceneNumber: doc.sceneNumber,
        targetElementId: doc.targetElementId || "hero",
        modelPath: doc.modelPath || "/models/robot-mecha.glb",
        glowColor: doc.glowColor || "#00f0ff",
        glowRgba: doc.glowRgba || "rgba(0, 240, 255, 0.25)",
        voicePitch: typeof doc.voicePitch === "number" ? doc.voicePitch : 1.0,
        description: doc.description,
        transmission: doc.transmission,
        status: doc.status || "ONLINE",
        badgeColor: doc.badgeColor || "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        borderColor: doc.borderColor || "border-cyan-500/30",
        tourSpeech: doc.tourSpeech || null,
        tourActionLabel: doc.tourActionLabel || "Explore Next Lab",
        order: doc.order || 0,
      }));
    } catch (error) {
      console.warn("Error fetching robots from Payload CMS:", error);
      return [];
    }
  }
}
