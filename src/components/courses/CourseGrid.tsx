import { motion } from "framer-motion";
import type { Course } from "./types";
import { CourseCard } from "./CourseCard";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </motion.div>
  );
}