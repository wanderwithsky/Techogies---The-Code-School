import { useMemo, useReducer, useState } from "react";
import coursesData from "@/data/courses.json";
import meta from "@/data/coursesMeta.json";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Course, Filters } from "./types";
import { defaultFilters } from "./types";
import { CoursesHero } from "./CoursesHero";
import { FiltersSidebar } from "./FiltersSidebar";
import { FiltersSheet } from "./FiltersSheet";
import { SortBar } from "./SortBar";
import { CourseGrid } from "./CourseGrid";
import { EmptyState } from "./EmptyState";
import { CallbackSection } from "./CallbackSection";
import { InfoBanner } from "./InfoBanner";
import { StillConfused } from "./StillConfused";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

type Action =
  | { type: "patch"; value: Partial<Filters> }
  | { type: "toggleArray"; key: keyof Filters; value: string }
  | { type: "reset" };

function reducer(state: Filters, action: Action): Filters {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.value };
    case "toggleArray": {
      const arr = state[action.key] as string[];
      const exists = arr.includes(action.value);
      return {
        ...state,
        [action.key]: exists ? arr.filter((v) => v !== action.value) : [...arr, action.value],
      } as Filters;
    }
    case "reset":
      return defaultFilters();
    default:
      return state;
  }
}

export function CoursesPage() {
  const queryClient = useQueryClient();
  const [filters, dispatch] = useReducer(reducer, defaultFilters());
  const [sheetOpen, setSheetOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(filters.search, 250);

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
    const q = debouncedSearch.trim().toLowerCase();
    let list = courses.filter((c) => {
      if (q) {
        const haystack = [
          c.title,
          c.shortDescription,
          c.learningPath,
          c.categoryId,
          ...c.technologies,
          ...c.careerGoals,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.learningPaths.length) {
        const coursePath = (c.learningPath || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const matches = filters.learningPaths.some((lp) => {
          const filterPath = lp.toLowerCase().replace(/[^a-z0-9]/g, "");
          return filterPath.includes(coursePath) || coursePath.includes(filterPath);
        });
        if (!matches) return false;
      }
      if (filters.difficulty && !c.difficulty.toLowerCase().includes(filters.difficulty.toLowerCase())) return false;
      if (filters.durationBuckets.length) {
        const matches = filters.durationBuckets.some((id) => {
          const b = meta.durationBuckets.find((db) => db.id === id);
          return b ? c.durationMonths > b.min && c.durationMonths <= b.max : false;
        });
        if (!matches) return false;
      }
      if (filters.technologies.length) {
        const has = filters.technologies.every((t) => c.technologies.includes(t));
        if (!has) return false;
      }
      return true;
    });

    switch (filters.sort) {
      case "newest":
        list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "duration":
        list = [...list].sort((a, b) => a.durationMonths - b.durationMonths);
        break;
      case "popular":
      default:
        list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    console.log("DEBUG: Filters applied:", filters);
    console.log("DEBUG: Search query:", q);
    console.log("DEBUG: Courses loaded:", courses.length);
    console.log("DEBUG: Results after filter:", list.length);
    return list;
  }, [debouncedSearch, filters, courses]);

  const totalCourses = courses.length;

  return (
    <>
      <CoursesHero
        totalCourses={totalCourses}
        search={filters.search}
        onSearch={(v) => dispatch({ type: "patch", value: { search: v } })}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <FiltersSidebar filters={filters} dispatch={dispatch} />
          </aside>

          <div className="min-w-0">
            <SortBar
              count={results.length}
              total={totalCourses}
              sort={filters.sort}
              onSort={(v) => dispatch({ type: "patch", value: { sort: v } })}
              onOpenFilters={() => setSheetOpen(true)}
              activeFilterCount={countActive(filters)}
            />
            <InfoBanner />
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground">Loading courses...</div>
            ) : results.length === 0 ? (
              <EmptyState onReset={() => dispatch({ type: "reset" })} />
            ) : (
              <CourseGrid courses={results} />
            )}
          </div>
        </div>
      </section>

      <CallbackSection courses={courses} />
      <StillConfused />

      <FiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        dispatch={dispatch}
      />
    </>
  );
}

function countActive(f: Filters) {
  return (
    f.learningPaths.length +
    (f.difficulty ? 1 : 0) +
    f.durationBuckets.length +
    f.technologies.length
  );
}