import {
  Category,
  Chapter,
  Course,
  Purchase,
  UserProgress,
} from "@prisma/client";

export type ExtendedCourse = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

export type SelectedCourse = Course & {
  chapters: (Chapter & { userProgresses: UserProgress[] | null })[];
};

export type DashboardCourse = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

export type Dashboard = {
  completedCourses: DashboardCourse[];
  inProgressCourses: DashboardCourse[];
};

export type AnalyticsPurchase = Purchase & {
  course: Course;
};
