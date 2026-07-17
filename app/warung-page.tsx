import UmkmPage from "./umkm-page";
import type { VillageSlug } from "@/types/database";

type WarungPageProps = {
  village: VillageSlug;
};

export default function WarungPage({ village }: WarungPageProps) {
  return <UmkmPage village={village} catalog="warung" />;
}
