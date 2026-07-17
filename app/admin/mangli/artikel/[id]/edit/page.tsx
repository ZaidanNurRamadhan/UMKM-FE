import { notFound } from "next/navigation";
import CatalogFormPage from "../../../../catalog-form-page";
import { getArticleById } from "@/services/article.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMangliEditArtikelPage({
  params,
}: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article || article.villages?.slug !== "mangli") {
    notFound();
  }

  return (
    <CatalogFormPage
      village="mangli"
      kind="article"
      mode="edit"
      initialData={article}
    />
  );
}
