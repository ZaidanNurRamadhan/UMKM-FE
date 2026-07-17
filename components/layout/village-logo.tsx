import Image from "next/image";
import Link from "next/link";

type VillageLogoProps = {
  href?: string;
};

export function VillageLogo({ href = "/" }: VillageLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className="h-12 w-auto"
      />
      <div>
        <p className="text-2xl font-black leading-[0.88] text-[#2e6230]">
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-xs font-black text-[#8aa100]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
  );
}
