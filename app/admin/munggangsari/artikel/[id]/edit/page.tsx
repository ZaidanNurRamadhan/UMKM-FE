import { notFound } from "next/navigation";
import CatalogFormPage from "../../../../catalog-form-page";
import { getArticleById } from "@/services/article.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMunggangsariEditArtikelPage({
  params,
}: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article || article.villages?.slug !== "munggangsari") {
    notFound();
  }

  return (
    <CatalogFormPage
      village="munggangsari"
      kind="article"
      mode="edit"
      initialData={article}
    />
  );
}
