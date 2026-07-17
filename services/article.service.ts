import { supabase } from "@/lib/supabase/client";
import { getSupabaseErrorMessage, mapSupabaseError } from "@/lib/errors/supabase-error";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  VillageSlug,
} from "@/types/database";
import type { ServiceResult } from "@/types/service-result";
import {
  normalizeVillageRelation,
  type VillageRelation,
} from "./village-relation";

const ARTICLE_SELECT = `
  id,
  village_id,
  title,
  description,
  article_url,
  created_at,
  updated_at,
  villages!inner (
    id,
    name,
    slug
  )
`;

type ListOptions = {
  villageSlug?: VillageSlug;
  limit?: number;
};

type ArticleQueryRow = Omit<Article, "villages"> & {
  villages: VillageRelation;
};

export async function getArticles(
  options: ListOptions = {},
): Promise<Article[]> {
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .order("created_at", { ascending: false });

  if (options.villageSlug) {
    query = query.eq("villages.slug", options.villageSlug);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Data tidak dapat dimuat. Silakan coba lagi."),
    );
  }

  return ((data ?? []) as unknown as ArticleQueryRow[]).map(
    normalizeArticleRow,
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(
      getSupabaseErrorMessage(error, "Data tidak dapat dimuat. Silakan coba lagi."),
    );
  }

  return data ? normalizeArticleRow(data as unknown as ArticleQueryRow) : null;
}

export async function createArticle(
  payload: CreateArticleInput,
): Promise<ServiceResult<Article>> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .insert(payload)
      .select(ARTICLE_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal disimpan.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data artikel tidak berhasil disimpan.",
      };
    }

    return {
      success: true,
      data: normalizeArticleRow(data as unknown as ArticleQueryRow),
      message: "Artikel berhasil ditambahkan.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal disimpan.");
  }
}

export async function updateArticle(
  payload: UpdateArticleInput,
): Promise<ServiceResult<Article>> {
  const { id, ...values } = payload;

  try {
    const { data, error } = await supabase
      .from("articles")
      .update(values)
      .eq("id", id)
      .select(ARTICLE_SELECT)
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal diperbarui.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data artikel tidak berhasil diperbarui.",
      };
    }

    return {
      success: true,
      data: normalizeArticleRow(data as unknown as ArticleQueryRow),
      message: "Artikel berhasil diperbarui.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal diperbarui.");
  }
}

export async function deleteArticle(
  id: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return mapSupabaseError(error, "Data gagal dihapus.");
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Data artikel tidak berhasil dihapus.",
      };
    }

    return {
      success: true,
      data: data as { id: string },
      message: "Artikel berhasil dihapus.",
    };
  } catch (error) {
    return mapSupabaseError(error, "Data gagal dihapus.");
  }
}

function normalizeArticleRow(row: ArticleQueryRow): Article {
  return {
    ...row,
    villages: normalizeVillageRelation(row.villages),
  };
}
