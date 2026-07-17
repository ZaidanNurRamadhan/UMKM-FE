import { ADMIN_NAMES } from "@/constants/villages";
import { UserIcon } from "@/components/icons/admin-icons";
import type { VillageSlug } from "@/types/database";

type AdminHeaderProps = {
  village: VillageSlug;
  variant?: "default" | "form";
};

export function AdminHeader({ village, variant = "default" }: AdminHeaderProps) {
  if (variant === "form") {
    return (
      <header className="flex min-h-[114px] items-center justify-between border-b border-[#dfe6df] bg-white px-6 py-6 shadow-[0_4px_18px_rgb(15_23_42/0.04)] md:px-10">
        <div>
          <h1 className="text-2xl font-black text-[#0f6b24]">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm font-medium text-[#6a7280]">
            Katalog Potensi Desa
          </p>
        </div>
        <div className="flex items-center gap-5 text-[#0f6b24]">
          <p className="hidden text-base font-black sm:block">
            {ADMIN_NAMES[village]}
          </p>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d8edcf]">
            <UserIcon className="h-7 w-7 text-[#118331]" />
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="flex min-h-[100px] items-center justify-between border-b border-[#111] px-6 py-6 md:px-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-black text-[#2e6230]">
          Dashboard Overview
        </h1>
        <p className="text-sm font-bold text-[#8aa100]">
          Katalog Potensi Desa
        </p>
      </div>
      <div className="flex items-center gap-5 text-[#2e6230]">
        <p className="hidden text-xl font-black sm:block">
          {ADMIN_NAMES[village]}
        </p>
        <UserIcon className="h-10 w-10 text-[#95ac00]" />
      </div>
    </header>
  );
}
