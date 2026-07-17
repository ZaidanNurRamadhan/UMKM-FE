import { notFound } from "next/navigation";
import CatalogFormPage from "../../../../catalog-form-page";
import { getWarungById } from "@/services/warung.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMunggangsariEditWarungPage({
  params,
}: PageProps) {
  const { id } = await params;
  const warung = await getWarungById(id);

  if (!warung || warung.villages?.slug !== "munggangsari") {
    notFound();
  }

  return (
    <CatalogFormPage
      village="munggangsari"
      kind="warung"
      mode="edit"
      initialData={warung}
    />
  );
}
