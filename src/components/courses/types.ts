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
  sort: string;
};

export const defaultFilters = (): Filters => ({
  sort: "popular",
});