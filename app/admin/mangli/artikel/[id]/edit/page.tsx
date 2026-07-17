import { notFound } from "next/navigation";
import UmkmFormPage from "../../../../umkm-form-page";
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
    <UmkmFormPage
      village="mangli"
      kind="article"
      mode="edit"
      initialData={article}
    />
  );
}
