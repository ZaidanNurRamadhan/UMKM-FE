# Katalog Potensi Desa Mangli & Munggangsari

Website katalog potensi desa untuk publik dan admin desa. Aplikasi memuat halaman publik, dashboard admin, autentikasi Supabase, CRUD UMKM, warung, artikel, upload gambar, dan integrasi tombol WhatsApp.

## Teknologi

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, dan Storage
- Zod dan React Hook Form

## Struktur Folder

| Folder | Fungsi |
|---|---|
| `app/` | Route Next.js, halaman publik, halaman login, dan route admin. |
| `app/admin/` | Page-level admin wrapper untuk dashboard, daftar katalog, form tambah/edit, dan sign-in. |
| `components/admin/` | Komponen kecil khusus admin, misalnya bagian tabel katalog. |
| `components/layout/` | Layout reusable seperti sidebar admin, header admin, dan logo desa. |
| `components/icons/` | Ikon SVG reusable untuk area admin. |
| `components/animations/` | Komponen animasi halaman publik. |
| `config/` | Metadata dan konfigurasi situs. |
| `constants/` | Konfigurasi katalog, desa, dan storage. |
| `hooks/` | Hook client reusable, misalnya preview gambar. |
| `lib/` | Supabase client, error mapper, dan utility umum. |
| `services/` | Semua akses Supabase per domain bisnis. |
| `types/` | Type lintas modul, database model, dan result service. |
| `validations/` | Schema validasi form dengan pesan berbahasa Indonesia. |
| `public/images/` | Asset gambar publik yang masih digunakan halaman. |

## Menjalankan Project

```bash
npm install
npm run dev
```

Validasi sebelum merge:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment Variable

Buat `.env` lokal berisi konfigurasi Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jangan menyimpan service role key di frontend.

## Lokasi Fitur Utama

| Fitur | Lokasi |
|---|---|
| Sidebar admin | `components/layout/admin-sidebar.tsx` |
| Header admin | `components/layout/admin-header.tsx` |
| Logo desa admin | `components/layout/village-logo.tsx` |
| Login | `app/admin/sign-in/` dan `services/auth.service.ts` |
| Dashboard admin | `app/admin/admin-dashboard.tsx` |
| Daftar katalog admin | `app/admin/manage-umkm-page.tsx` |
| Side panel UMKM | `app/admin/manage-umkm-panel-page.tsx` |
| Form tambah/edit katalog | `app/admin/catalog-form-page.tsx` dan `app/admin/catalog-admin-form.tsx` |
| Side panel tambah UMKM dari dashboard | `app/admin/admin-dashboard-client.tsx` |
| CRUD UMKM | `services/umkm.service.ts` |
| CRUD Warung | `services/warung.service.ts` |
| CRUD Artikel | `services/article.service.ts` |
| Upload gambar | `services/storage.service.ts` |
| Supabase client | `lib/supabase/client.ts` |
| Metadata situs | `config/site.ts` |
| Validasi UMKM | `validations/umkm.schema.ts` |
| Validasi Warung | `validations/warung.schema.ts` |
| Validasi Artikel | `validations/article.schema.ts` |
| Konfigurasi katalog | `constants/catalog.ts` |
| Konfigurasi desa | `constants/villages.ts` |
| Konfigurasi storage | `constants/storage.ts` |

## Route Penting

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/mangli` | `app/mangli/page.tsx` |
| `/mangli/umkm` | `app/mangli/umkm/page.tsx` |
| `/munggangsari` | `app/munggangsari/page.tsx` |
| `/munggangsari/umkm` | `app/munggangsari/umkm/page.tsx` |
| `/munggangsari/warung` | `app/munggangsari/warung/page.tsx` |
| `/admin/sign-in` | `app/admin/sign-in/page.tsx` |
| `/admin/mangli` | `app/admin/mangli/page.tsx` |
| `/admin/mangli/umkm` | `app/admin/mangli/umkm/page.tsx` |
| `/admin/mangli/warung` | `app/admin/mangli/warung/page.tsx` |
| `/admin/mangli/artikel` | `app/admin/mangli/artikel/page.tsx` |
| `/admin/munggangsari` | `app/admin/munggangsari/page.tsx` |
| `/admin/munggangsari/umkm` | `app/admin/munggangsari/umkm/page.tsx` |
| `/admin/munggangsari/warung` | `app/admin/munggangsari/warung/page.tsx` |
| `/admin/munggangsari/artikel` | `app/admin/munggangsari/artikel/page.tsx` |

## Menambah Halaman Baru

1. Tambahkan route di `app/` sesuai URL yang diinginkan.
2. Jika halaman membutuhkan data Supabase, buat atau pakai fungsi di `services/`.
3. Letakkan komponen UI reusable di `components/`, bukan langsung diduplikasi di page.
4. Tambahkan schema validasi di `validations/` jika ada form.

## Menambah Menu Sidebar Admin

1. Tambahkan label dan segment di `constants/catalog.ts` jika menu adalah katalog baru.
2. Tambahkan item ke prop `items` pada pemanggilan `AdminSidebar`.
3. Pastikan route file tersedia di `app/admin/[desa]/...`.

## Menambah Service Supabase

1. Buat file domain di `services/`.
2. Semua query `.from()`, `.insert()`, `.update()`, `.delete()`, `.storage.from()`, atau `auth.*` tetap berada di service.
3. Gunakan `ServiceResult<T>` untuk mutasi data.
4. Gunakan `mapSupabaseError` agar pesan error konsisten.

## Catatan Maintenance Data

- UMKM dibuat tanpa mengirim `village_id` dan `created_by` dari frontend karena field tersebut dikelola database/RLS.
- Warung dan artikel masih mengirim `village_id` dari hasil lookup `getVillageBySlug`.
- Path upload UMKM menggunakan `${villageSlug}/umkm/${filename}`.
- Path upload warung menggunakan `${villageSlug}/warungs/${filename}`.
- Jika upload foto berhasil tetapi insert/update database gagal, form menghapus foto yang baru diunggah.

## Role Admin

- Admin Mangli diarahkan ke `/admin/mangli`.
- Admin Munggangsari diarahkan ke `/admin/munggangsari`.
- Akun non-admin yang berhasil login diarahkan kembali ke halaman publik.
