import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ImpactSlider } from "@/components/sections/ImpactSlider";
import { Skills } from "@/components/sections/Skills";
import { ExperienceElevator } from "@/components/sections/ExperienceElevator";
import { Projects } from "@/components/sections/Projects";
import { Reviews } from "@/components/sections/Reviews";
import { LiveAnalytics } from "@/components/sections/LiveAnalytics";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { ExperienceCanvas } from "@/components/3d/ExperienceCanvas";
import { GlobalRobotCompanion } from "@/components/3d/GlobalRobotCompanion";
import { RobotCompanionHUD } from "@/components/3d/RobotCompanionHUD";
import { RobotStoryBanner } from "@/components/3d/RobotStoryBanner";
import { RobotTourGuide } from "@/components/3d/RobotTourGuide";
import { AIChatbot } from "@/components/AIChatbot";
import { WhatsAppToggle } from "@/components/WhatsAppToggle";
import { PayloadService } from "@/services/payloadService";

export const revalidate = 60;

export default async function Home() {
  const [siteContent, projects, experiences, skills, education, reviews, impactMetrics] = await Promise.all([
    PayloadService.getSiteContent(),
    PayloadService.getProjects(),
    PayloadService.getExperiences(),
    PayloadService.getSkills(),
    PayloadService.getEducation(),
    PayloadService.getReviews(),
    PayloadService.getImpactMetrics(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Persistent Full-Screen Single 3D Experience Canvas ── */}
      <ExperienceCanvas />

      {/* ── 3D Interactive Cyber Robot Companion & Telemetry HUD ── */}
      <GlobalRobotCompanion />
      <RobotCompanionHUD />
      <RobotStoryBanner />
      <RobotTourGuide />

      {/* ── Navigation Header ── */}
      <Header navigation={siteContent.navigation} developer={siteContent.developer} />

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 2xl:px-16 pt-20 lg:pt-24">
        <Hero hero={siteContent.hero} developer={siteContent.developer} />

        <About about={siteContent.about} />

        <ImpactSlider metrics={impactMetrics} />

        <Skills categories={skills} />

        <ExperienceElevator roles={experiences} />

        <Projects initialProjects={projects} />

        <Reviews initialReviews={reviews} />

        <LiveAnalytics />

        <Education education={education} />

        <Contact
          contactOptions={siteContent.contactOptions}
          developer={siteContent.developer}
        />
      </div>

      <Footer
        developer={siteContent.developer}
        navigation={siteContent.navigation}
      />

      {/* Direct WhatsApp Chat Quick Toggle */}
      <WhatsAppToggle developer={siteContent.developer} />

      {/* Floating AI Assistant Chatbot */}
      <AIChatbot
        aiConfig={siteContent.aiChat}
        developer={siteContent.developer}
      />
    </main>
  );
}
