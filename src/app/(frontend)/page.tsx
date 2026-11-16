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
import { AIChatbot } from "@/components/AIChatbot";
import { PayloadService } from "@/services/payloadService";

export const revalidate = 60;

export default async function Home() {
  const [siteContent, projects, experiences, skills, education, reviews] = await Promise.all([
    PayloadService.getSiteContent(),
    PayloadService.getProjects(),
    PayloadService.getExperiences(),
    PayloadService.getSkills(),
    PayloadService.getEducation(),
    PayloadService.getReviews(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Persistent Full-Screen Single 3D Experience Canvas ── */}
      <ExperienceCanvas />

      {/* ── Navigation Header ── */}
      <Header navigation={siteContent.navigation} developer={siteContent.developer} />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16 2xl:px-24 pb-16 pt-20 lg:pt-24">
        <Hero hero={siteContent.hero} developer={siteContent.developer} />

        <About about={siteContent.about} />

        <ImpactSlider />

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
        <Footer
          developer={siteContent.developer}
          navigation={siteContent.navigation}
        />
      </div>

      {/* Floating AI Assistant Chatbot */}
      <AIChatbot
        aiConfig={siteContent.aiChat}
        developer={siteContent.developer}
      />
    </main>
  );
}
