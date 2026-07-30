export type VillageSlug = "mangli" | "munggangsari";

export interface Village {
  id: string;
  name: string;
  slug: VillageSlug;
  created_at: string;
}

export type VillageSummary = Pick<Village, "id" | "name" | "slug">;

export interface Umkm {
  id: string;
  village_id: string;
  name: string;
  description: string;
  whatsapp_number: string | null;
  address: string | null;
  photo_path: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  villages: VillageSummary | null;
}

export interface Warung {
  id: string;
  village_id: string;
  name: string;
  owner_name: string | null;
  address: string | null;
  whatsapp_number: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
  villages: VillageSummary | null;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  role: "visitor" | "admin" | string;
  village_id: string | null;
}

export type CreateUmkmInput = {
  name: string;
  description: string;
  whatsapp_number: string | null;
  address: string | null;
  photo_path: string | null;
};

export type UpdateUmkmInput = Partial<CreateUmkmInput> & {
  id: string;
};

export type CreateWarungInput = {
  name: string;
  owner_name: string | null;
  address: string | null;
  whatsapp_number: string | null;
  photo_path: string | null;
};

export type UpdateWarungInput = Partial<CreateWarungInput> & {
  id: string;
};
