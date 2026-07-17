"use client";

import { useEffect, useState } from "react";
import {
  ArticleIcon,
  CloseIcon,
  DashboardIcon,
  PlusIcon,
  StoreIcon,
} from "@/components/icons/admin-icons";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { formatRelativeTime } from "@/lib/utils/format-date";
import type {
  DashboardActivity,
  DashboardData,
} from "@/types/admin-dashboard";
import type { VillageSlug } from "@/types/database";
import { CatalogAdminForm } from "./catalog-admin-form";

type AdminDashboardClientProps = {
  village: VillageSlug;
  dashboardData: DashboardData;
  config: {
    primaryLabel: string;
    manageLabel: string;
    addLabel: string;
    manageSegment: "umkm" | "warung";
  };
};

export function AdminDashboardClient({
  village,
  dashboardData,
  config,
}: AdminDashboardClientProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const manageHref = `/admin/${village}/${config.manageSegment}`;
  const usesUmkmPanel = config.manageSegment === "umkm";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function openPanel() {
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[325px_1fr]">
        <AdminSidebar
          village={village}
          items={[
            {
              href: `/admin/${village}`,
              label: "Dashboard",
              icon: <DashboardIcon className="h-5 w-5" />,
              active: true,
            },
            {
              href: manageHref,
              label: config.manageLabel,
              icon: <StoreIcon className="h-5 w-5" />,
            },
          ]}
          primaryAction={
            usesUmkmPanel
              ? {
                  label: config.addLabel,
                  icon: <PlusIcon className="h-5 w-5" />,
                  onClick: openPanel,
                }
              : {
                  href: `${manageHref}/tambah`,
                  label: config.addLabel,
                  icon: <PlusIcon className="h-5 w-5" />,
                }
          }
        />

        <div>
          <AdminHeader village={village} />

          <section
            id="dashboard"
            className="mx-auto max-w-5xl px-6 py-10 md:px-10"
          >
            {dashboardData.error && (
              <div className="mb-8 rounded-lg border border-[#d0d0d0] bg-[#fff7f7] px-5 py-4 text-sm font-bold text-[#9a2a2a]">
                {dashboardData.error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <StatCard
                icon={<StoreIcon className="h-11 w-11" />}
                label={config.primaryLabel}
                value={dashboardData.primaryCount}
              />
              <StatCard
                icon={<ArticleIcon className="h-11 w-11" />}
                label="Total Artikel Potensi"
                value={dashboardData.articleCount}
              />
            </div>

            <section
              id="kelola"
              className="mt-14 overflow-hidden rounded-lg border border-[#111]"
            >
              <div className="px-6 py-5">
                <h2 className="text-base font-black uppercase">
                  Aktivitas Terkini
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-[#2f662d] text-white">
                    <tr>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Data
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Kategori
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Status
                      </th>
                      <th className="px-7 py-4 text-xs font-black uppercase">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activities.length > 0 ? (
                      dashboardData.activities.map((activity) => (
                        <tr
                          key={activity.id}
                          className="border-b border-[#a5a5a5] last:border-b-0"
                        >
                          <td className="px-7 py-5 text-sm font-black">
                            {activity.name}
                          </td>
                          <td className="px-7 py-5 text-sm">
                            {activity.category}
                          </td>
                          <td className="px-7 py-5 text-sm">
                            <StatusBadge status={activity.status} />
                          </td>
                          <td className="px-7 py-5 text-sm text-[#777]">
                            {formatRelativeTime(activity.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-7 py-12 text-center text-sm font-bold text-[#777]"
                        >
                          Belum ada aktivitas terbaru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </div>

      {usesUmkmPanel && (
        <>
          <div
            aria-hidden={!isPanelOpen}
            className={`fixed inset-0 z-40 bg-[#101828]/45 transition-opacity duration-300 ${
              isPanelOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onClick={closePanel}
          />
          <aside
            aria-label="Tambah UMKM"
            className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-none flex-col bg-white shadow-[-22px_0_50px_rgb(15_23_42/0.2)] transition-transform duration-300 ease-out sm:w-[75vw] ${
              isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-start justify-between border-b border-[#dfe6df] px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-2xl font-black text-[#202a37]">
                  Tambah UMKM
                </h2>
                <p className="mt-1 text-sm font-medium text-[#667085]">
                  Lengkapi data UMKM tanpa berpindah halaman.
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup panel"
                onClick={closePanel}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d7dfd7] text-[#2e6230] transition hover:bg-[#f3f8ef]"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {isPanelOpen && (
                <CatalogAdminForm
                  kind="umkm"
                  mode="create"
                  village={village}
                  variant="panel"
                  onCancel={closePanel}
                  onSaved={closePanel}
                />
              )}
            </div>
          </aside>
        </>
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-lg border border-[#111] px-6 py-8">
      <div className="text-[#2e6230]">{icon}</div>
      <h2 className="mt-7 text-2xl font-black">{label}</h2>
      <p className="mt-6 text-7xl font-black leading-none text-[#d47300]">
        {value}
      </p>
    </article>
  );
}

function StatusBadge({ status }: { status: DashboardActivity["status"] }) {
  const isActive = status === "AKTIF";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-black ${
        isActive
          ? "border-[#1f3f58] bg-[#69bdff] text-[#00121f]"
          : "border-[#c99253] bg-[#f3bf82] text-[#8d5e2e]"
      }`}
    >
      {status}
    </span>
  );
}
