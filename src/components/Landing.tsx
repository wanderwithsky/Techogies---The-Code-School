import { Toaster } from "sonner";
import { EnrollProvider } from "@/context/EnrollContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Stats } from "@/components/sections/Stats";
import { Hero } from "@/components/sections/Hero";
import { WhyUs } from "@/components/sections/WhyUs";
import { Roadmap } from "@/components/sections/Roadmap";
import { Projects } from "@/components/sections/Projects";
import { CareerPaths } from "@/components/sections/CareerPaths";
import { Partners } from "@/components/sections/Partners";
import { WhyTechogies } from "@/components/sections/WhyTechogies";
import { Testimonials } from "@/components/sections/Testimonials";
import { Mentors } from "@/components/sections/Mentors";
import { ImpactSection } from "@/components/Impact/ImpactSection";
import { CounsellingCTA } from "@/components/sections/CounsellingCTA";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FooterBrand } from "@/components/FooterBrand/FooterBrand";
import { EnrollModal } from "@/components/enrollment/EnrollModal";

export function Landing() {
  return (
    <EnrollProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <WhyUs />
        <WhyTechogies />
        <Roadmap />
        <Partners />
        <Projects />
        <CareerPaths />
        <ImpactSection />
        <Mentors />
        <Testimonials />
        <CounsellingCTA />
        <FAQ />
        <Contact />
        <FooterBrand />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFab />
      <Toaster position="top-center" richColors />
      <EnrollModal />
    </EnrollProvider>
  );
}