# Katalog Potensi Desa Mangli & Munggangsari

Website katalog potensi desa untuk publik dan admin desa. Aplikasi ini memuat landing page, halaman desa, katalog UMKM dan warung, halaman detail katalog, arsip potensi desa, dashboard admin, autentikasi Supabase, CRUD data katalog, upload gambar, serta integrasi WhatsApp dan Google Maps.

## Teknologi

- Next.js App Router 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Database, dan Storage
- Zod dan React Hook Form
- Framer Motion

## Fitur Utama

- Landing page gabungan untuk Desa Mangli dan Desa Munggangsari.
- Halaman Desa Mangli dengan katalog UMKM dan ringkasan artikel dari menu Potensi.
- Halaman Desa Munggangsari dengan katalog warung dan ringkasan artikel dari menu Potensi.
- Halaman Potensi Mangli berisi artikel UMKM, pertanian, dan tradisi dengan gambar lokal.
- Halaman Potensi Munggangsari berbentuk arsip digital wisata air terjun dari PDF, lengkap dengan gambar dan lightbox.
- Halaman detail UMKM dan warung dengan foto, alamat, tombol WhatsApp, dan tautan Google Maps.
- Dashboard admin per desa dengan summary total katalog dan card "terakhir diperbarui".
- CRUD UMKM dan warung melalui panel admin.
- Upload foto katalog ke Supabase Storage dengan batas maksimal 500 KB.
- Dark mode dan animasi halaman publik.

## Struktur Folder

| Folder | Fungsi |
|---|---|
| `app/` | Route Next.js untuk halaman publik, halaman detail, admin, login, dan style global. |
| `app/admin/` | Dashboard admin, halaman daftar katalog, form tambah/edit, delete action, dan sign-in. |
| `app/mangli/` | Halaman publik Desa Mangli, UMKM Mangli, dan Potensi Mangli. |
| `app/munggangsari/` | Halaman publik Desa Munggangsari, UMKM, warung, dan Potensi Munggangsari. |
| `components/admin/` | Komponen kecil khusus tabel dan UI admin. |
| `components/catalog/` | Komponen reusable halaman detail katalog. |
| `components/layout/` | Header publik, footer publik, sidebar admin, header admin, logout, dan logo desa. |
| `components/icons/` | Ikon SVG reusable untuk area admin. |
| `components/animations/` | Komponen animasi halaman publik. |
| `components/ui/` | Komponen UI umum seperti dialog konfirmasi. |
| `config/` | Metadata dan konfigurasi situs. |
| `constants/` | Konfigurasi katalog, desa, storage, dan batas upload. |
| `hooks/` | Hook client reusable. |
| `lib/` | Supabase client, error mapper, motion variants, dan utility umum. |
| `services/` | Semua akses Supabase per domain bisnis. |
| `types/` | Type lintas modul, database model, detail katalog, dan result service. |
| `validations/` | Schema validasi form dengan pesan berbahasa Indonesia. |
| `public/images/` | Asset gambar publik untuk landing page, artikel Mangli, dan arsip Munggangsari. |

## Menjalankan Project

Gunakan Node.js `20.19.0` atau lebih baru.

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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Jangan menyimpan service role key di frontend.

## Konfigurasi Supabase

- Storage bucket publik: `village-assets`.
- Folder upload UMKM: `${villageSlug}/umkm/${filename}`.
- Folder upload warung: `${villageSlug}/warungs/${filename}`.
- Tipe foto yang diterima: JPEG, PNG, dan WebP.
- Ukuran foto maksimal: 500 KB.
- Field `village_id` dan `created_by` untuk UMKM dikelola database/RLS, sehingga tidak dikirim dari frontend.
- Warung tetap mengirim `village_id` dari hasil lookup desa.

## Route Publik

| Route | Fungsi | File |
|---|---|---|
| `/` | Landing page gabungan Mangli dan Munggangsari | `app/page.tsx` |
| `/mangli` | Halaman utama Desa Mangli | `app/mangli/page.tsx` |
| `/mangli/umkm` | Katalog UMKM Mangli | `app/mangli/umkm/page.tsx` |
| `/mangli/potensi` | Artikel potensi Desa Mangli | `app/mangli/potensi/page.tsx` |
| `/munggangsari` | Halaman utama Desa Munggangsari | `app/munggangsari/page.tsx` |
| `/munggangsari/umkm` | Katalog UMKM Munggangsari | `app/munggangsari/umkm/page.tsx` |
| `/munggangsari/warung` | Katalog warung Munggangsari | `app/munggangsari/warung/page.tsx` |
| `/munggangsari/potensi` | Arsip digital potensi air terjun | `app/munggangsari/potensi/page.tsx` |
| `/umkm/[id]` | Detail UMKM | `app/umkm/[id]/page.tsx` |
| `/warung/[id]` | Detail warung | `app/warung/[id]/page.tsx` |

## Route Admin

| Route | Fungsi | File |
|---|---|---|
| `/admin` | Entry admin | `app/admin/page.tsx` |
| `/admin/sign-in` | Login admin | `app/admin/sign-in/page.tsx` |
| `/admin/mangli` | Dashboard admin Mangli | `app/admin/mangli/page.tsx` |
| `/admin/mangli/umkm` | Kelola UMKM Mangli | `app/admin/mangli/umkm/page.tsx` |
| `/admin/mangli/warung` | Kelola warung Mangli | `app/admin/mangli/warung/page.tsx` |
| `/admin/mangli/warung/tambah` | Tambah warung Mangli | `app/admin/mangli/warung/tambah/page.tsx` |
| `/admin/mangli/warung/[id]/edit` | Edit warung Mangli | `app/admin/mangli/warung/[id]/edit/page.tsx` |
| `/admin/munggangsari` | Dashboard admin Munggangsari | `app/admin/munggangsari/page.tsx` |
| `/admin/munggangsari/umkm` | Kelola UMKM Munggangsari | `app/admin/munggangsari/umkm/page.tsx` |
| `/admin/munggangsari/warung` | Kelola warung Munggangsari | `app/admin/munggangsari/warung/page.tsx` |
| `/admin/munggangsari/warung/tambah` | Tambah warung Munggangsari | `app/admin/munggangsari/warung/tambah/page.tsx` |
| `/admin/munggangsari/warung/[id]/edit` | Edit warung Munggangsari | `app/admin/munggangsari/warung/[id]/edit/page.tsx` |

## Lokasi Fitur Penting

| Fitur | Lokasi |
|---|---|
| Shell halaman publik | `components/layout/public-site-shell.tsx` |
| Landing dan halaman desa reusable | `app/village-page.tsx` |
| Halaman katalog reusable | `app/umkm-page.tsx` dan `app/warung-page.tsx` |
| Halaman detail katalog reusable | `components/catalog/catalog-detail-page.tsx` |
| Potensi Mangli | `app/mangli/potensi/page.tsx` |
| Potensi Munggangsari | `app/munggangsari/potensi/munggangsari-archive-client.tsx` |
| Dashboard admin | `app/admin/admin-dashboard.tsx` dan `app/admin/admin-dashboard-client.tsx` |
| Form tambah/edit katalog | `app/admin/catalog-form-page.tsx` dan `app/admin/catalog-admin-form.tsx` |
| Tabel kelola katalog | `app/admin/manage-catalog-table.tsx` |
| Sidebar admin | `components/layout/admin-sidebar.tsx` |
| Header admin | `components/layout/admin-header.tsx` |
| Login dan logout | `services/auth.service.ts` dan `components/layout/admin-logout-button.tsx` |
| CRUD UMKM | `services/umkm.service.ts` |
| CRUD Warung | `services/warung.service.ts` |
| Upload gambar | `services/storage.service.ts` |
| Supabase client | `lib/supabase/client.ts` |
| Validasi upload file | `validations/file.schema.ts` |
| Konfigurasi storage | `constants/storage.ts` |

## Asset Publik

- Gambar artikel Potensi Mangli berada di `public/images/mangli-article/`.
- Thumbnail hero Potensi Mangli berada di `public/images/mangli-potensi-thumb.webp`.
- Gambar arsip air terjun Munggangsari berada di `public/images/munggangsari-waterfall/`.
- Gambar pada folder `public/images/` dapat dipakai langsung dengan path `/images/nama-file`.

## Role Admin

- Admin Mangli diarahkan ke `/admin/mangli`.
- Admin Munggangsari diarahkan ke `/admin/munggangsari`.
- Akun non-admin yang berhasil login diarahkan kembali ke halaman publik.

## Deploy Vercel

Project siap dideploy sebagai aplikasi Next.js di Vercel.

1. Import repository ke Vercel.
2. Pastikan Node.js menggunakan versi `20.19.0` atau lebih baru.
3. Tambahkan environment variable `NEXT_PUBLIC_SUPABASE_URL`.
4. Tambahkan environment variable `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Gunakan command build bawaan:

```bash
npm install
npm run build
```

## Catatan Maintenance

- Simpan query Supabase di folder `services/`.
- Gunakan `ServiceResult<T>` untuk mutasi data.
- Gunakan `mapSupabaseError` agar pesan error konsisten.
- Letakkan komponen UI reusable di `components/`, bukan diduplikasi langsung di page.
- Tambahkan schema validasi di `validations/` jika menambah form baru.
- Jangan menghapus asset publik yang masih dipakai oleh route aktif.
