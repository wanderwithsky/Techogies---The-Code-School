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
import { WhyChooseTechogies } from "./WhyChooseTechogies";
import { CallbackSection } from "./CallbackSection";
import { InfoBanner } from "./InfoBanner";
import { StillConfused } from "./StillConfused";

const courses = coursesData as Course[];

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
      return defaultFilters(meta.priceRange.max);
    default:
      return state;
  }
}

export function CoursesPage() {
  const [filters, dispatch] = useReducer(reducer, defaultFilters(meta.priceRange.max));
  const [sheetOpen, setSheetOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(filters.search, 250);

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
      if (filters.learningPaths.length && !filters.learningPaths.includes(c.learningPath)) return false;
      if (filters.difficulty && !c.difficulty.toLowerCase().includes(filters.difficulty.toLowerCase())) return false;
      if (filters.durationBuckets.length) {
        const matches = filters.durationBuckets.some((id) => {
          const b = meta.durationBuckets.find((db) => db.id === id);
          return b ? c.durationMonths > b.min && c.durationMonths <= b.max : false;
        });
        if (!matches) return false;
      }
      if (filters.modes.length && !filters.modes.includes(c.mode)) return false;
      if (c.offerPrice > filters.priceMax) return false;
      if (filters.placement && !c.placement) return false;
      if (filters.internship && !c.internship) return false;
      if (filters.certificate && !c.certificate) return false;
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
      case "priceAsc":
        list = [...list].sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "popular":
      default:
        list = [...list].sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [debouncedSearch, filters]);

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
            {results.length === 0 ? (
              <EmptyState onReset={() => dispatch({ type: "reset" })} />
            ) : (
              <CourseGrid courses={results} />
            )}
          </div>
        </div>
      </section>

      <WhyChooseTechogies />
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
    f.modes.length +
    (f.priceMax < meta.priceRange.max ? 1 : 0) +
    (f.placement ? 1 : 0) +
    (f.internship ? 1 : 0) +
    (f.certificate ? 1 : 0) +
    f.technologies.length
  );
}