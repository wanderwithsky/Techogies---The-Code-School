import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Course } from "@/components/courses/types";

type Ctx = {
  course: Course | null;
  open: (course: Course) => void;
  close: () => void;
};

const CourseDetailsContext = createContext<Ctx | null>(null);

export function CourseDetailsProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<Course | null>(null);
  const open = useCallback((c: Course) => setCourse(c), []);
  const close = useCallback(() => setCourse(null), []);
  const value = useMemo(() => ({ course, open, close }), [course, open, close]);
  return <CourseDetailsContext.Provider value={value}>{children}</CourseDetailsContext.Provider>;
}

export function useCourseDetails() {
  const ctx = useContext(CourseDetailsContext);
  if (!ctx) throw new Error("useCourseDetails must be used within CourseDetailsProvider");
  return ctx;
}