import { Toaster } from "sonner";
import { EnrollProvider } from "@/context/EnrollContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useRef } from "react";
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
import { useEnroll } from "@/context/EnrollContext";

function AutoOpenSequence() {
  const { openEnroll, isEnrollOpen } = useEnroll();
  const sequenceStarted = useRef(false);
  const wasOpen = useRef(false);

  // Set flag in render phase to avoid race condition with TechieChat's mount effect
  if (typeof window !== "undefined" && !sessionStorage.getItem("hasAutoOpenedEnroll")) {
    sessionStorage.setItem("techieWaitingForEnroll", "true");
  }

  useEffect(() => {
    if (!sessionStorage.getItem("hasAutoOpenedEnroll")) {
      sessionStorage.setItem("hasAutoOpenedEnroll", "true");
      sequenceStarted.current = true;
      // Delay slightly so layout finishes before modal popup
      setTimeout(() => openEnroll(), 300);
    }
  }, [openEnroll]);

  useEffect(() => {
    if (isEnrollOpen) {
      wasOpen.current = true;
    } else if (wasOpen.current && sequenceStarted.current) {
      // Modal just closed
      wasOpen.current = false;
      sequenceStarted.current = false;
      sessionStorage.removeItem("techieWaitingForEnroll");
      window.dispatchEvent(new Event("start_techie_timer"));
    }
  }, [isEnrollOpen]);

  return null;
}

export function Landing() {
  return (
    <EnrollProvider>
      <CourseDetailsProvider>
        <AutoOpenSequence />
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