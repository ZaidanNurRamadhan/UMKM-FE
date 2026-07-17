import { notFound } from "next/navigation";
import UmkmFormPage from "../../../../umkm-form-page";
import { getWarungById } from "@/services/warung.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMangliEditWarungPage({ params }: PageProps) {
  const { id } = await params;
  const warung = await getWarungById(id);

  if (!warung || warung.villages?.slug !== "mangli") {
    notFound();
  }

  return (
    <UmkmFormPage
      village="mangli"
      kind="warung"
      mode="edit"
      initialData={warung}
    />
  );
}
