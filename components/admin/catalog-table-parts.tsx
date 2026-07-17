import Image from "next/image";

export function PhotoCell({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded border border-[#aeb3ae] bg-[#f8f8f8]">
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] rotate-45 bg-[#969c96]" />
        <span className="absolute left-[-8px] top-1/2 h-px w-[68px] -rotate-45 bg-[#969c96]" />
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded border border-[#d9ded9] bg-[#f8f8f8]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="48px" />
    </div>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#ace5ad] px-3 py-1 text-[10px] font-black text-[#0a1d0b]">
      {category}
    </span>
  );
}

export function PaginationButton({
  ariaLabel,
  children,
}: {
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="grid h-8 w-8 place-items-center rounded border border-white/90 transition hover:bg-white/10"
    >
      {children}
    </button>
  );
}
