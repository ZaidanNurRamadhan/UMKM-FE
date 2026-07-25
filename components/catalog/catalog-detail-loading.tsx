import { PublicHeader } from "@/components/layout/public-site-shell";
import type { CatalogKind } from "@/types/catalog";

type CatalogDetailLoadingProps = {
  kind: CatalogKind;
};

export function CatalogDetailLoading({ kind }: CatalogDetailLoadingProps) {
  return (
    <main className="min-h-screen bg-[#eef8ec] text-[#101510] transition-colors dark:bg-[#151c14] dark:text-[#f5f7f2]">
      <PublicHeader village="all" catalog={kind} mode="catalog" />
      <section className="px-5 py-8 md:px-[40px] md:py-14">
        <div className="h-5 w-24 animate-pulse rounded bg-[#d5ddd1] dark:bg-[#344233]" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-[#d5ddd1] md:rounded-[22px] dark:bg-[#344233]" />
          <div>
            <div className="h-12 w-4/5 animate-pulse rounded-lg bg-[#d5ddd1] dark:bg-[#344233]" />
            <div className="mt-5 h-5 w-full animate-pulse rounded bg-[#d5ddd1] dark:bg-[#344233]" />
            <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-[#d5ddd1] dark:bg-[#344233]" />
            <div className="mt-8 space-y-4 border-y border-[#d5ddd1] py-4 dark:border-[#344233]">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-6 w-full animate-pulse rounded bg-[#d5ddd1] dark:bg-[#344233]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
