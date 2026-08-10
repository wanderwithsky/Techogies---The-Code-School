import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import coursesData from "@/data/courses.json";
import { CourseCard } from "@/components/courses/CourseCard";
import type { Course } from "@/components/courses/types";

// Type assertion safely matches existing course objects
const courses = coursesData as Course[];

export function ExplorePrograms() {
  // Extract strictly the required courses
  const selectedCourses = courses.filter((c) =>
    ["frontend", "fullstack", "cyber"].includes(c.id)
  );

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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {selectedCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
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
