import { getUmkm } from "@/services/umkm.service";
import { getWarungs } from "@/services/warung.service";
import type { DashboardActivity, DashboardData } from "@/types/admin-dashboard";
import type { Umkm, VillageSlug, Warung } from "@/types/database";
import { AdminDashboardClient } from "./admin-dashboard-client";

type AdminDashboardProps = {
  village: VillageSlug;
};

const adminConfig = {
  mangli: {
    primaryLabel: "Total UMKM",
    manageLabel: "Kelola UMKM",
    addLabel: "Tambah UMKM",
    manageSegment: "umkm",
  },
  munggangsari: {
    primaryLabel: "Total Warung",
    manageLabel: "Kelola Warung",
    addLabel: "Tambah Warung",
    manageSegment: "warung",
  },
} satisfies Record<
  VillageSlug,
  {
    primaryLabel: string;
    manageLabel: string;
    addLabel: string;
    manageSegment: "umkm" | "warung";
  }
>;

export default async function AdminDashboard({ village }: AdminDashboardProps) {
  const config = adminConfig[village];
  const dashboardData = await loadDashboardData(village);

  return (
    <AdminDashboardClient
      village={village}
      dashboardData={dashboardData}
      config={config}
    />
  );
}

async function loadDashboardData(village: VillageSlug): Promise<DashboardData> {
  try {
    const [umkm, warungs] = await Promise.all([
      getUmkm({ villageSlug: village }),
      getWarungs({ villageSlug: village }),
    ]);
    const primaryItems =
      village === "mangli"
        ? umkm.map((item) => mapUmkmActivity(item))
        : warungs.map((item) => mapWarungActivity(item));
    const activities = primaryItems.sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    );

    return {
      primaryCount: village === "mangli" ? umkm.length : warungs.length,
      activities,
      error: null,
    };
  } catch (error) {
    return {
      primaryCount: 0,
      activities: [],
      error:
        error instanceof Error
          ? error.message
          : "Data dashboard belum dapat dimuat saat ini.",
    };
  }
}

function mapUmkmActivity(item: Umkm): DashboardActivity {
  return {
    id: `umkm-${item.id}`,
    name: item.name,
    category: "UMKM",
    status: "AKTIF",
    createdAt: item.created_at,
  };
}

function mapWarungActivity(item: Warung): DashboardActivity {
  return {
    id: `warung-${item.id}`,
    name: item.name,
    category: "Warung",
    status: "AKTIF",
    createdAt: item.created_at,
  };
}
