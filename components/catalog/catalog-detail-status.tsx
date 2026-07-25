import Link from "next/link";
import {
  PublicFooter,
  PublicHeader,
} from "@/components/layout/public-site-shell";
import type { CatalogKind } from "@/types/catalog";

type CatalogDetailStatusProps = {
  kind: CatalogKind;
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function CatalogDetailStatus({
  kind,
  title,
  message,
  actionHref,
  actionLabel,
}: CatalogDetailStatusProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#101510] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village="all" catalog={kind} mode="catalog" />
      <section className="bg-[#eef8ec] px-5 py-20 md:px-[40px] md:py-28 dark:bg-[#151c14]">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-sm font-semibold leading-7 text-[#39433a] md:text-lg dark:text-[#d7e0d3]">
            {message}
          </p>
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="btn-motion focus-ring mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-[#2e6b35] px-6 text-sm font-black text-white transition hover:bg-[#25572b] md:h-14 md:text-base dark:bg-[#8bc98c] dark:text-[#10150f]"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
