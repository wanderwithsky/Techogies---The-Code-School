export type Course = {
  id: string;
  title: string;
  duration: string;
  level: string;
  image: string;
  tag?: string;
  categoryId: string;
  iconName: string;
  difficulty: string;
  shortDescription: string;
  fullDescription?: string;
  technologies: string[];
  curriculum?: string[];
  features?: string[];
  mode: "Online Live" | "Recorded" | "Hybrid";
  placement: boolean;
  internship: boolean;
  certificate: boolean;
  rating: number;
  enrolled: number;
  popularity: number;
  createdAt: string;
  durationMonths: number;
  careerGoals: string[];
  learningPath: string;
};

export type Filters = {
  search: string;
  learningPaths: string[];
  difficulty: string | null;
  durationBuckets: string[];
  modes: string[];
  placement: boolean;
  internship: boolean;
  certificate: boolean;
  technologies: string[];
  sort: string;
};

export const defaultFilters = (): Filters => ({
  search: "",
  learningPaths: [],
  difficulty: null,
  durationBuckets: [],
  modes: [],
  placement: false,
  internship: false,
  certificate: false,
  technologies: [],
  sort: "popular",
});