import { useMemo, useState } from "react";
import coursesData from "@/data/courses.json";
import meta from "@/data/coursesMeta.json";
import type { Course } from "./types";
import { CoursesHero } from "./CoursesHero";
import { SortBar } from "./SortBar";
import { CourseGrid } from "./CourseGrid";
import { CallbackSection } from "./CallbackSection";
import { InfoBanner } from "./InfoBanner";
import { StillConfused } from "./StillConfused";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function CoursesPage() {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState("popular");

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
      .channel('public-courses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Map database fields to the frontend Course interface
  const courses: Course[] = useMemo(() => {
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

  const results = useMemo(() => {
    let list = [...courses];
    switch (sort) {
      case "newest":
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "duration":
        list.sort((a, b) => a.durationMonths - b.durationMonths);
        break;
      case "popular":
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [sort, courses]);

  const totalCourses = courses.length;

  return (
    <>
      <CoursesHero totalCourses={totalCourses} />

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="min-w-0">
          <SortBar
            count={results.length}
            total={totalCourses}
            sort={sort}
            onSort={setSort}
          />
          <InfoBanner />
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">Loading courses...</div>
          ) : results.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">No courses available at the moment.</div>
          ) : (
            <CourseGrid courses={results} />
          )}
        </div>
      </section>

      <CallbackSection courses={courses} />
      <StillConfused />
    </>
  );
}