import { getPayload } from "payload";
import config from "@payload-config";
import portfolioConfig from "../config/portfolioConfig";

export async function seedPayloadDatabase() {
  console.log("Starting Payload CMS database seeding from portfolioConfig.json...");
  const payload = await getPayload({ config });

  // 1. Seed Projects
  const existingProjects = await payload.find({ collection: "projects", limit: 1 });
  if (existingProjects.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.projects.length} projects...`);
    for (let i = 0; i < portfolioConfig.projects.length; i++) {
      const p = portfolioConfig.projects[i];
      await payload.create({
        collection: "projects",
        data: {
          title: p.title,
          number: p.number,
          description: p.description,
          featured: p.featured || false,
          isPrivate: p.isPrivate || false,
          stars: p.stars || 0,
          github: p.github || "",
          live: p.live || "",
          tech: p.tech.map((t) => ({ name: t })),
          language: p.language || "",
          gradient: p.gradient || "from-purple-600/20 via-indigo-600/20 to-blue-600/20",
          tagColor: p.tagColor || "text-purple-600 dark:text-purple-300 border-purple-500/30",
          order: i,
        },
      });
    }
    console.log("✓ Projects seeded successfully.");
  } else {
    console.log("Projects already exist in database, skipping.");
  }

  // 2. Seed Experiences
  const existingExp = await payload.find({ collection: "experiences", limit: 1 });
  if (existingExp.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.experience.roles.length} experiences...`);
    for (let i = 0; i < portfolioConfig.experience.roles.length; i++) {
      const r = portfolioConfig.experience.roles[i];
      await payload.create({
        collection: "experiences",
        data: {
          company: r.company,
          role: r.role,
          period: r.period,
          location: r.location || "",
          badge: r.badge || "Full-Time",
          summary: "",
          responsibilities: (r.responsibilities || []).map((item: string) => ({ item })),
          tech: (r.tech || []).map((name: string) => ({ name })),
          order: i,
        },
      });
    }
    console.log("✓ Experiences seeded successfully.");
  }

  // 3. Seed Skills
  const existingSkills = await payload.find({ collection: "skills", limit: 1 });
  if (existingSkills.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.skills.categories.length} skill categories...`);
    for (let i = 0; i < portfolioConfig.skills.categories.length; i++) {
      const cat = portfolioConfig.skills.categories[i];
      await payload.create({
        collection: "skills",
        data: {
          title: cat.title,
          categoryIcon: cat.icon || "",
          order: i,
          skillsList: (cat.skills || []).map((s) => ({
            name: s.name,
            icon: s.icon,
            color: s.color || "",
          })),
        },
      });
    }
    console.log("✓ Skills seeded successfully.");
  }

  // 4. Seed Education
  const existingEdu = await payload.find({ collection: "education", limit: 1 });
  if (existingEdu.totalDocs === 0) {
    console.log(`Seeding ${portfolioConfig.education.length} education entries...`);
    for (let i = 0; i < portfolioConfig.education.length; i++) {
      const edu = portfolioConfig.education[i];
      await payload.create({
        collection: "education",
        data: {
          degree: edu.title,
          field: edu.field,
          institution: edu.school,
          period: edu.period || "",
          score: edu.grade || "",
          order: i,
        },
      });
    }
    console.log("✓ Education seeded successfully.");
  }

  // 5. Seed SiteContent Global
  try {
    const existingSiteContent = (await payload.findGlobal({ slug: "site-content" })) as Record<string, unknown> | null;
    if (!existingSiteContent || !existingSiteContent.name) {
      console.log("Seeding SiteContent Global from portfolioConfig.json...");
      await payload.updateGlobal({
        slug: "site-content",
        data: {
          name: portfolioConfig.developer.name,
          firstName: portfolioConfig.developer.firstName,
          lastName: portfolioConfig.developer.lastName,
          role: portfolioConfig.developer.role,
          title: portfolioConfig.developer.title,
          experienceYears: portfolioConfig.developer.experienceYears,
          email: portfolioConfig.developer.email,
          phone: portfolioConfig.developer.phone,
          whatsapp: portfolioConfig.developer.whatsapp,
          location: portfolioConfig.developer.location,
          socials: {
            github: portfolioConfig.developer.github,
            linkedin: portfolioConfig.developer.linkedin,
            instagram: portfolioConfig.developer.instagram,
            facebook: portfolioConfig.developer.facebook,
          },
          availabilityBadge: portfolioConfig.hero.availabilityBadge,
          tagline: portfolioConfig.hero.tagline,
          stats: portfolioConfig.hero.stats.map((s) => ({ value: s.value, label: s.label })),
          floatingBadges: portfolioConfig.hero.floatingBadges.map((b) => ({
            label: b.label,
            color: b.color,
            border: b.border,
            text: b.text,
            top: b.top,
            left: b.left,
            delay: b.delay,
          })),
          techStreams: portfolioConfig.hero.techStreams.map((ts) => ({
            name: ts.name,
            tag: ts.tag,
            speed: ts.speed,
            color: ts.color,
          })),
          bioParagraphs: portfolioConfig.about.bioParagraphs.map((p) => ({ paragraph: p })),
          traits: portfolioConfig.about.traits.map((t) => ({ trait: t })),
          focusAreas: portfolioConfig.about.focusAreas.map((fa) => ({
            label: fa.label,
            icon: fa.icon || "Cpu",
            color: fa.color,
          })),
          subjectOptions: portfolioConfig.contactOptions.subjectOptions.map((s) => ({ subject: s })),
          budgetRanges: portfolioConfig.contactOptions.budgetRanges.map((b) => ({
            value: b.value,
            label: b.label,
          })),
          aiChat: {
            maxDailyChats: portfolioConfig.aiChat.maxDailyChats,
            maxDailyRefinements: portfolioConfig.aiChat.maxDailyRefinements,
            suggestedPrompts: portfolioConfig.aiChat.suggestedPrompts.map((p) => ({ prompt: p })),
          },
          navigation: portfolioConfig.navigation.map((n) => ({
            name: n.name,
            href: n.href,
          })),
        },
      });
      console.log("✓ SiteContent Global seeded successfully.");
    } else {
      console.log("SiteContent Global already populated in database, skipping.");
    }
  } catch (err) {
    console.error("Error seeding SiteContent Global:", err);
  }

  console.log("Payload database seeding completed!");
}
