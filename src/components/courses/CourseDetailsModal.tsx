import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, Radio, GraduationCap, Check, MessageCircle } from "lucide-react";
import { useCourseDetails } from "@/context/CourseDetailsContext";
import details from "@/data/courseDetails.json";
import site from "@/data/site.json";

type Detail = {
  description: string;
  technologies: string[];
  learningPoints: string[];
  duration: string;
  mode: string;
  level: string;
};

const detailMap = details as Record<string, Detail>;

export function CourseDetailsModal() {
  const { course, close } = useCourseDetails();

  useEffect(() => {
    if (!course) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [course, close]);

  let derivedDuration = course?.duration || "6 Months";
  let derivedMode = course?.mode || "Online Live";
  let derivedLevel = course?.level || course?.difficulty || "All Levels";
  let derivedLearningPoints = (course as any)?.curriculum && (course as any).curriculum.length > 0 
    ? (course as any).curriculum 
    : ((course as any)?.features && (course as any).features.length > 0 ? (course as any).features : ["Comprehensive industry curriculum"]);

  if (course) {
    const title = course.title.toLowerCase();
    if (title.includes("frontend")) {
      derivedDuration = "3 Months";
      derivedMode = "Offline";
      derivedLevel = "All Levels";
      derivedLearningPoints = [
        "Modern responsive web development",
        "React and component architecture",
        "API integration",
        "State management",
        "Production-ready frontend deployment"
      ];
    } else if (title.includes("backend")) {
      derivedDuration = "3 Months";
      derivedMode = "Offline";
      derivedLevel = "All Levels";
      derivedLearningPoints = [
        "Node.js backend development",
        "REST API architecture",
        "PostgreSQL/MongoDB",
        "Authentication and authorization",
        "Deployment and scalable backend practices"
      ];
    } else if (title.includes("full stack") || title.includes("fullstack")) {
      derivedDuration = "6 Months";
      derivedMode = "Offline";
      derivedLevel = "All Levels";
      derivedLearningPoints = [
        "Complete frontend + backend development",
        "React application architecture",
        "Node.js and API development",
        "Database design",
        "Authentication",
        "Deployment and production workflows"
      ];
    }
  }

  const detail = course 
    ? detailMap[course.id] || {
        description: (course as any).fullDescription || course.shortDescription || "Course details coming soon.",
        technologies: course.technologies || [],
        learningPoints: derivedLearningPoints,
        duration: derivedDuration,
        mode: derivedMode,
        level: derivedLevel,
      }
    : null;


  const whatsappHref = course
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
        `Hi Techogies, I want the syllabus for the ${course.title} course.`,
      )}`
    : "#";

  return (
    <AnimatePresence>
      {course && detail && (
        <motion.div
          key="course-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.35)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close course details"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition hover:border-primary/60 hover:bg-primary hover:text-primary-foreground"
            >
              <X size={16} />
            </button>

            <div className="relative overflow-y-auto px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-foreground">
                  {course.difficulty}
                </span>
                {course.tag && (
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {course.tag}
                  </span>
                )}
              </div>

              <h2
                id="course-modal-title"
                className="pr-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {course.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {detail.description}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <InfoTile icon={<Clock size={14} />} label="Duration" value={detail.duration} />
                <InfoTile icon={<Radio size={14} />} label="Mode" value={detail.mode} />
                <InfoTile icon={<GraduationCap size={14} />} label="Level" value={detail.level} />
              </div>

              <Section title="Technologies Covered">
                <div className="flex flex-wrap gap-2">
                  {detail.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="What You Will Learn">
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {detail.learningPoints.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check size={12} />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            <div className="border-t border-border/60 bg-background/70 px-6 py-5 backdrop-blur sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.6)] sm:w-auto"
                >
                  <MessageCircle size={16} />
                  Download Syllabus
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
                Get the complete curriculum, batch details and admission guidance on WhatsApp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}