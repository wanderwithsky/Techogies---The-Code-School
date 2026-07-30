import { memo } from "react";
import { motion } from "framer-motion";
import { Clock, Star, Users, Radio, Briefcase, ArrowRight } from "lucide-react";
import type { Course } from "./types";
import { useCourseDetails } from "@/context/CourseDetailsContext";

function CourseCardImpl({ course }: { course: Course }) {
  const inr = (n: number) => new Intl.NumberFormat("en-IN").format(n);
  const { open } = useCourseDetails();

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.45)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {course.mode === "Online Live" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              <Radio size={10} /> Live
            </span>
          )}
          {course.placement && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              <Briefcase size={10} /> Placement
            </span>
          )}
        </div>
        {course.tag && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
            {course.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-foreground">
              {course.difficulty}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {course.duration}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {course.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {course.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {course.technologies.length > 4 && (
            <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              +{course.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> {inr(course.enrolled)} enrolled
          </span>
        </div>

        <div className="mt-auto border-t border-border/50 pt-4">
          <button
            type="button"
            onClick={() => open(course)}
            className="group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_hsl(var(--primary)/0.7)]"
          >
            <span className="relative z-10">Know More</span>
            <ArrowRight size={15} className="relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export const CourseCard = memo(CourseCardImpl);