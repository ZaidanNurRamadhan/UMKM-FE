import { DashboardIcon, StoreIcon } from "@/components/icons/admin-icons";
import { CATALOG_CONFIG } from "@/constants/catalog";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { CatalogAdminForm } from "./catalog-admin-form";
import type { CatalogFormMode, CatalogKind } from "@/types/catalog";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";

type CatalogFormPageProps = {
  village: VillageSlug;
  kind?: CatalogKind;
  mode?: CatalogFormMode;
  initialData?: Umkm | Warung | Article | null;
};

export default function CatalogFormPage({
  village,
  kind = "umkm",
  mode = "create",
  initialData = null,
}: CatalogFormPageProps) {
  const copy = CATALOG_CONFIG[kind];
  const listHref = `/admin/${village}/${copy.segment}`;
  const pageTitle = mode === "edit" ? copy.titleEdit : copy.titleCreate;

  return (
    <main className="min-h-screen bg-[#f7faf4] text-[#1f2937]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[340px_minmax(0,1fr)]">
        <AdminSidebar
          village={village}
          variant="form"
          items={[
            {
              href: `/admin/${village}`,
              label: "Dashboard",
              icon: <DashboardIcon className="h-5 w-5" />,
            },
            {
              href: `/admin/${village}/umkm`,
              label: "Kelola UMKM",
              icon: <StoreIcon className="h-5 w-5" />,
              active: kind === "umkm",
            },
            ...(kind !== "umkm"
              ? [
                  {
                    href: listHref,
                    label: copy.manageLabel,
                    icon: <StoreIcon className="h-5 w-5" />,
                    active: true,
                  },
                ]
              : []),
          ]}
        />

        <div className="min-w-0">
          <AdminHeader village={village} variant="form" />

          <section className="relative min-h-[calc(100vh-114px)] overflow-hidden px-5 pb-12 pt-8 md:px-10 lg:px-11">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[238px] overflow-hidden bg-[linear-gradient(180deg,#fbfdf9_0%,#f5faf2_100%)]">
              <AdminLandscape />
            </div>

            <div className="relative z-10 mx-auto max-w-[1500px]">
              <div className="flex min-h-[138px] items-center gap-6">
                <div className="grid h-[86px] w-[86px] shrink-0 place-items-center rounded-xl bg-[#e8f5df] text-[#0f7a2b] shadow-[0_16px_36px_rgb(15_122_43/0.08)]">
                  <StoreIcon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-black leading-tight text-[#202a37] md:text-4xl">
                    {pageTitle}
                  </h2>
                  <p className="mt-2 text-base font-medium text-[#687286]">
                    {copy.formDescription}
                  </p>
                </div>
              </div>

              <CatalogAdminForm
                kind={kind}
                mode={mode}
                village={village}
                initialData={initialData}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function AdminLandscape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 980 238"
      fill="none"
      className="absolute bottom-0 right-0 h-full w-[74%] min-w-[720px]"
      preserveAspectRatio="none"
    >
      <path
        d="M0 232C92 222 119 166 194 166C239 166 270 190 318 176C373 160 405 105 471 105C541 105 577 176 646 183C720 190 741 131 805 142C864 152 879 209 980 190V238H0V232Z"
        fill="#dcebd3"
      />
      <path
        d="M184 238C267 220 303 141 386 142C453 143 472 198 542 202C629 207 666 152 740 168C804 182 834 222 980 214V238H184Z"
        fill="#c9e0bc"
      />
      <path d="M770 151h73l-12-28h-49l-12 28Z" fill="#74b858" />
      <path d="M781 151h50v53h-50V151Z" fill="#8cca71" />
      <path d="M790 166h13v18h-13V166Z" fill="#eaf5dd" />
      <path d="M812 166h13v38h-13V166Z" fill="#eaf5dd" />
      <path d="M770 151c3 12 18 12 21 0c3 12 18 12 21 0c3 12 18 12 21 0c3 12 18 12 21 0" fill="#69ae4f" />
      <path d="M902 89c14 36 25 83 0 93c-25-10-14-57 0-93Z" fill="#91c57f" />
      <path d="M902 142v61" stroke="#6da85d" strokeWidth="5" strokeLinecap="round" />
      <path d="M846 116c12 31 21 72 0 80c-21-8-12-49 0-80Z" fill="#9ccc8b" />
      <path d="M846 160v44" stroke="#6da85d" strokeWidth="4" strokeLinecap="round" />
      <path d="M626 96c5-16 29-16 34 0c13-4 26 5 27 18h-89c2-13 15-22 28-18Z" fill="#d8e9cf" />
      <path d="M902 95c7-23 41-23 48 0c18-6 36 7 38 25H862c3-19 22-31 40-25Z" fill="#d8e9cf" />
      <path d="M737 93c6-14 27-14 33 0c10-2 20 5 22 16h-76c1-11 11-18 21-16Z" fill="#d8e9cf" />
    </svg>
  );
}
