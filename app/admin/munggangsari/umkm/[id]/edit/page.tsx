import { notFound } from "next/navigation";
import UmkmFormPage from "../../../../umkm-form-page";
import { getUmkmById } from "@/services/umkm.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMunggangsariEditUmkmPage({
  params,
}: PageProps) {
  const { id } = await params;
  const umkm = await getUmkmById(id);

  if (!umkm || umkm.villages?.slug !== "munggangsari") {
    notFound();
  }

  return (
    <UmkmFormPage
      village="munggangsari"
      kind="umkm"
      mode="edit"
      initialData={umkm}
    />
  );
}
