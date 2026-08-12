import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CourseCard } from "@/components/courses/CourseCard";
import type { Course } from "@/components/courses/types";

export function ExplorePrograms() {
  const [i, setI] = useState(0);
  const queryClient = useQueryClient();

  const { data: dbCourses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "active")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('public-courses-changes-explore')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const rawCourses: Course[] = useMemo(() => {
    return dbCourses.map((c: any) => ({
      id: c.slug || c.id,
      title: c.title,
      duration: c.duration || "6 Months",
      level: "All Levels",
      image: c.image_url || "",
      tag: c.category,
      categoryId: c.category || "all",
      iconName: "Layers",
      difficulty: "Intermediate",
      shortDescription: c.short_description || "",
      fullDescription: c.full_description,
      technologies: c.technologies || [],
      curriculum: c.curriculum || [],
      features: c.features || [],
      mode: "Online Live",
      placement: true,
      internship: true,
      certificate: true,
      rating: 4.8,
      enrolled: 1000,
      popularity: 90,
      createdAt: c.created_at,
      durationMonths: parseInt(c.duration) || 6,
      careerGoals: [],
      learningPath: c.category || c.title || "General"
    }));
  }, [dbCourses]);

  // Enforce initial exact order: Frontend, Backend, Next Gen AI
  const courses = useMemo(() => {
    if (rawCourses.length === 0) return [];

    const initialMatchStrings = [
      "Frontend Development",
      "Backend Development",
      "Next Gen AI - Next Digital Marketing"
    ];
    
    const initialCourses = initialMatchStrings
      .map((matchTitle) => rawCourses.find((c) => c.title === matchTitle || c.title.includes(matchTitle)))
      .filter(Boolean) as Course[];
      
    const initialIds = initialCourses.map(c => c.id);
    const remainingCourses = rawCourses.filter((c) => !initialIds.includes(c.id));
    
    return [...initialCourses, ...remainingCourses];
  }, [rawCourses]);

  const count = courses.length;

  const visibleCourses = useMemo(() => {
    const visible: Course[] = [];
    if (count > 0) visible.push(courses[i % count]);
    if (count > 1) visible.push(courses[(i + 1) % count]);
    if (count > 2) visible.push(courses[(i + 2) % count]);
    return visible;
  }, [courses, count, i]);

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >
          <span className="text-sm font-bold tracking-widest text-[color:var(--brand)] uppercase">
            OUR PROGRAMS
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Explore Our Programs
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg max-w-2xl">
            Choose a path. Build real skills. Work on real projects.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mt-12 flex justify-center py-12 text-muted-foreground">
            Loading programs...
          </div>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleCourses.map((course, idx) => (
                  <motion.div
                    key={`${course.id}-${i}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="h-full"
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-end gap-2">
              <button
                onClick={() => setI((n) => (n - 1 + count) % count)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent disabled:opacity-50"
                aria-label="Previous"
                disabled={count === 0}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => setI((n) => (n + 1) % count)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-accent disabled:opacity-50"
                aria-label="Next"
                disabled={count === 0}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand)] hover:text-foreground transition-colors"
          >
            View All Courses
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
