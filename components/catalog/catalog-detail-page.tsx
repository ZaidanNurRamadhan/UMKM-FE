import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  PublicFooter,
  PublicHeader,
} from "@/components/layout/public-site-shell";
import { getGoogleMapsUrlFromAddress } from "@/lib/utils/location";
import { getWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { CatalogDetailData } from "@/types/catalog-detail";

type DetailField = {
  label: string;
  value: string;
  href?: string;
};

type IconProps = {
  className?: string;
};

type CatalogDetailPageProps = {
  detail: CatalogDetailData;
};

export function CatalogDetailPage({ detail }: CatalogDetailPageProps) {
  const village = detail.villageSlug ?? "all";
  const villageRoute = detail.villageSlug ? `/${detail.villageSlug}` : undefined;
  const backHref = detail.villageSlug
    ? `${villageRoute}/${detail.kind}`
    : `/${detail.kind}`;
  const whatsappUrl = getWhatsAppUrl(detail.whatsappNumber);
  const fields = getDetailFields(detail);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#101510] transition-colors dark:bg-[#10150f] dark:text-[#f5f7f2]">
      <PublicHeader village={village} catalog={detail.kind} mode="catalog" />

      <section className="bg-[#eef8ec] py-8 md:py-14 dark:bg-[#151c14]">
        <div className="px-5 md:px-[40px]">
          <Link
            href={backHref}
            className="focus-ring inline-flex items-center gap-2 text-xs font-black text-[#2e6b35] transition hover:underline md:text-sm dark:text-[#8bc98c]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Link>

          <div
            className={`mt-6 grid gap-8 md:mt-8 lg:items-start ${
              detail.photoUrl
                ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
                : "lg:grid-cols-1"
            }`}
          >
            {detail.photoUrl && (
              <FadeIn>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#d5ddd1] bg-white shadow-sm md:rounded-[22px] dark:border-[#344233] dark:bg-[#172017]">
                  <Image
                    src={detail.photoUrl}
                    alt={detail.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    priority
                  />
                </div>
              </FadeIn>
            )}

            <FadeIn className="max-w-3xl">
              <h1 className="text-[2.05rem] font-black leading-tight md:text-6xl">
                {detail.name}
              </h1>

              {"description" in detail && detail.description && (
                <p className="mt-5 text-sm font-semibold leading-7 text-[#39433a] md:text-lg md:leading-9 dark:text-[#d7e0d3]">
                  {detail.description}
                </p>
              )}

              {fields.length > 0 && (
                <dl className="mt-8 divide-y divide-[#d5ddd1] border-y border-[#d5ddd1] dark:divide-[#344233] dark:border-[#344233]">
                  {fields.map((field) => (
                    <div
                      key={field.label}
                      className="grid gap-1 py-4 md:grid-cols-[190px_1fr] md:gap-6"
                    >
                      <dt className="text-xs font-black uppercase text-[#2e6b35] md:text-sm dark:text-[#8bc98c]">
                        {field.label}
                      </dt>
                      <dd className="text-sm font-semibold leading-6 text-[#39433a] md:text-base md:leading-7 dark:text-[#d7e0d3]">
                        {field.href ? (
                          <a
                            href={field.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus-ring inline-flex text-[#2e6b35] underline underline-offset-4 transition hover:text-[#25572b] dark:text-[#8bc98c] dark:hover:text-[#a9d8aa]"
                          >
                            {field.value}
                          </a>
                        ) : (
                          field.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-motion focus-ring mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1dc95b] px-5 text-sm font-black text-white transition hover:bg-[#17ae4e] sm:w-fit md:h-14 md:px-7 md:text-base"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Hubungi melalui WhatsApp
                </a>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      <FadeIn>
        <PublicFooter route={villageRoute} />
      </FadeIn>
    </main>
  );
}

function getDetailFields(detail: CatalogDetailData): DetailField[] {
  return [
    detail.kind === "warung"
      ? createField("Nama pemilik", detail.ownerName)
      : null,
    createField("Alamat", detail.address, getGoogleMapsUrlFromAddress(detail.address)),
    createField("Nomor WhatsApp", detail.whatsappNumber),
  ].filter((field): field is DetailField => Boolean(field));
}

function createField(
  label: string,
  value: string | null,
  href?: string | null,
): DetailField | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return {
    label,
    value: trimmedValue,
    href: href ?? undefined,
  };
}

function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className={className}
    >
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.56 2 2.1 6.41 2.1 11.84c0 1.73.46 3.41 1.33 4.89L2 22l5.4-1.4a10.1 10.1 0 0 0 4.64 1.15c5.48 0 9.94-4.41 9.94-9.84C21.98 6.41 17.52 2 12.04 2Zm0 18.05a8.4 8.4 0 0 1-4.27-1.17l-.31-.18-3.2.83.86-3.08-.2-.32a8.05 8.05 0 0 1-1.24-4.29c0-4.48 3.75-8.14 8.36-8.14 4.61 0 8.36 3.66 8.36 8.14 0 4.56-3.75 8.21-8.36 8.21Zm4.58-6.15c-.25-.12-1.48-.72-1.71-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.97-.15.16-.3.18-.55.06-.25-.12-1.06-.38-2.02-1.21-.75-.65-1.25-1.45-1.4-1.7-.15-.24-.02-.37.11-.49.12-.11.25-.29.38-.43.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.57-1.35-.78-1.84-.2-.47-.41-.41-.57-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.84-.87 2.04s.89 2.36 1.02 2.53c.13.16 1.76 2.65 4.27 3.72.6.25 1.06.4 1.43.52.6.19 1.14.16 1.57.1.48-.07 1.48-.59 1.69-1.16.21-.57.21-1.06.15-1.16-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
