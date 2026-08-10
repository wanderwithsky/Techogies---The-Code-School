import { Toaster } from "sonner";
import { EnrollProvider } from "@/context/EnrollContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";

import { Stats } from "@/components/sections/Stats";
import { Hero } from "@/components/sections/Hero";
import { Roadmap } from "@/components/sections/Roadmap";
import { CareerPaths } from "@/components/sections/CareerPaths";
import { ExplorePrograms } from "@/components/sections/ExplorePrograms";
import { WhyTechogies } from "@/components/sections/WhyTechogies";
import { Testimonials } from "@/components/sections/Testimonials";
import { Mentors } from "@/components/sections/Mentors";
import { ImpactSection } from "@/components/Impact/ImpactSection";
import { CounsellingCTA } from "@/components/sections/CounsellingCTA";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FooterBrand } from "@/components/FooterBrand/FooterBrand";
import { EnrollModal } from "@/components/enrollment/EnrollModal";
import { CourseDetailsProvider } from "@/context/CourseDetailsContext";
import { CourseDetailsModal } from "@/components/courses/CourseDetailsModal";

export function Landing() {
  return (
    <EnrollProvider>
      <CourseDetailsProvider>
        <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ExplorePrograms />
        <Roadmap />
        <CareerPaths />
        <WhyTechogies />
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
      <Toaster position="top-center" richColors />
      <EnrollModal />
      <CourseDetailsModal />
      </CourseDetailsProvider>
    </EnrollProvider>
  );
}