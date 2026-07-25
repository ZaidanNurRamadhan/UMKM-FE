export type DashboardActivity = {
  id: string;
  name: string;
  category: string;
  status: "AKTIF" | "DRAFT";
  createdAt: string;
};

export type DashboardData = {
  primaryCount: number;
  lastUpdatedAt: string | null;
  activities: DashboardActivity[];
  error: string | null;
};
