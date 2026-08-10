import { createFileRoute } from "@tanstack/react-router";
import { EnrollProvider } from "@/context/EnrollContext";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { FooterBrand } from "@/components/FooterBrand/FooterBrand";
import { CoursesPage } from "@/components/courses/CoursesPage";
import { EnrollModal } from "@/components/enrollment/EnrollModal";
import { CourseDetailsProvider } from "@/context/CourseDetailsContext";
import { CourseDetailsModal } from "@/components/courses/CourseDetailsModal";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Techogies Courses | Industry-Focused Tech Programs" },
      {
        name: "description",
        content:
          "Explore practical, project-based tech courses designed to make you industry-ready with live mentorship, real projects, internships, and placement support.",
      },
      { property: "og:title", content: "Techogies Courses | Industry-Focused Tech Programs" },
      {
        property: "og:description",
        content:
          "Explore practical, project-based tech courses designed to make you industry-ready with live mentorship, real projects, internships, and placement support.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/courses" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesRoute,
});

function CoursesRoute() {
  return (
    <EnrollProvider>
        <CourseDetailsProvider>
          <ScrollProgress />
          <Navbar />
          <main>
            <CoursesPage />
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