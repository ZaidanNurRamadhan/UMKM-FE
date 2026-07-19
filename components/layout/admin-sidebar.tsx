import Link from "next/link";
import { ADMIN_NAMES } from "@/constants/villages";
import { MenuIcon } from "@/components/icons/admin-icons";
import { AdminLogoutButton } from "@/components/layout/admin-logout-button";
import { VillageLogo } from "@/components/layout/village-logo";
import type { VillageSlug } from "@/types/database";

export type AdminSidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

export type AdminSidebarAction = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type AdminSidebarProps = {
  village?: VillageSlug;
  items: AdminSidebarItem[];
  variant?: "default" | "form";
  showAdminName?: boolean;
  primaryAction?: AdminSidebarAction | AdminSidebarAction[];
};

export function AdminSidebar({
  village,
  items,
  variant = "default",
  showAdminName = false,
}: AdminSidebarProps) {
  const isForm = variant === "form";
  const asideClass = isForm
    ? "relative flex border-b border-[#e3e8e1] bg-white px-6 py-6 shadow-[10px_0_30px_rgb(15_23_42/0.03)] lg:sticky lg:top-0 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r"
    : "relative flex border-b border-[#111] bg-white px-6 py-6 lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r";
  const mobileMenuButtonClass = isForm
    ? "grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-[#d7dfd7] text-[#116b27] transition hover:bg-[#f3f8ef]"
    : "grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-[#d0d0d0] text-[#2e6230] transition hover:bg-[#f3f8ef]";
  const mobileMenuPanelClass = isForm
    ? "absolute right-0 top-[calc(100%+0.75rem)] z-30 w-72 max-w-[calc(100vw-3rem)] rounded-lg border border-[#d7dfd7] bg-white p-4 shadow-[0_18px_48px_rgb(15_23_42/0.18)]"
    : "absolute right-0 top-[calc(100%+0.75rem)] z-30 w-72 max-w-[calc(100vw-3rem)] rounded-lg border border-[#111] bg-white p-4 shadow-[0_18px_48px_rgb(15_23_42/0.18)]";
  const mobileLogoutClass = isForm
    ? "flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#fff0f0] text-sm font-black text-[#ef1b1b] transition hover:bg-[#ffe2e2]"
    : "flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#ffc9cf] text-sm font-black text-[#111] transition hover:bg-[#ffb9c1]";
  const navClass = isForm
    ? "hidden space-y-4 lg:block" : "hidden space-y-4 lg:block pt-10";
  const logoutClass = isForm
    ? "flex h-12 w-full items-center justify-center gap-4 rounded-lg bg-[#fff0f0] text-base font-black text-[#ef1b1b] transition hover:bg-[#ffe2e2]"
    : "flex h-12 w-full items-center justify-center gap-4 rounded-lg bg-[#ffc9cf] text-base font-black text-[#111] transition hover:bg-[#ffb9c1]";

  return (
    <aside className={asideClass}>
      <div className="flex w-full items-center justify-between gap-6 lg:block">
        <div>
          <VillageLogo />
          {showAdminName && village && (
            <p className="mt-5 text-base font-black text-[#2e6230]">
              {ADMIN_NAMES[village]}
            </p>
          )}
        </div>
        <details className="relative lg:hidden">
          <summary
            aria-label="Buka menu admin"
            className={`${mobileMenuButtonClass} list-none [&::-webkit-details-marker]:hidden`}
            title="Menu admin"
          >
            <MenuIcon className="h-6 w-6" />
          </summary>
          <div className={mobileMenuPanelClass}>
            <nav className="space-y-3" aria-label="Menu admin">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getItemClass(variant, Boolean(item.active))}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-[#e3e8e1] pt-4">
              <AdminLogoutButton
                className={mobileLogoutClass}
                iconClassName="h-5 w-5"
                label="Keluar"
              />
            </div>
          </div>
        </details>
      </div>

      <nav className={navClass}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={getItemClass(variant, Boolean(item.active))}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={`mt-auto hidden space-y-5 ${isForm ? "pb-7" : "pb-10"} lg:block`}>
        <AdminLogoutButton
          className={logoutClass}
          iconClassName="h-6 w-6"
          label="Log Out"
        />
      </div>
    </aside>
  );
}

function getItemClass(variant: "default" | "form", active: boolean): string {
  if (variant === "form") {
    return active
      ? "relative flex h-12 items-center gap-4 rounded-lg bg-[#eef8e9] px-7 text-base font-extrabold text-[#116b27] shadow-[0_12px_28px_rgb(17_107_39/0.08)] before:absolute before:left-0 before:top-1.5 before:h-9 before:w-1 before:rounded-full before:bg-[#118331]"
      : "flex h-12 items-center gap-4 rounded-lg px-7 text-base font-extrabold text-[#293445] transition hover:bg-[#f3f8ef] hover:text-[#116b27]";
  }

  return active
    ? "flex h-10 items-center gap-4 rounded-lg bg-[#dcf8d6] px-6 text-base font-black text-[#2e6230]"
    : "flex h-10 items-center gap-4 rounded-lg border border-[#d0d0d0] px-6 text-base font-black text-[#2e6230] transition hover:bg-[#f3f8ef]";
}
