"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, type DragEvent } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import {
  CameraIcon,
  ImageIcon,
  InfoIcon,
  SaveIcon,
  UploadCloudIcon,
  WhatsAppIcon,
} from "@/components/icons/admin-icons";
import { CATALOG_CONFIG } from "@/constants/catalog";
import { PHOTO_ACCEPT_ATTRIBUTE } from "@/constants/storage";
import { focusFirstFieldError } from "@/lib/errors/validation-error";
import { emptyStringToNull } from "@/lib/utils/string";
import { normalizeWhatsAppNumber } from "@/lib/utils/whatsapp";
import { useImagePreview } from "@/hooks/use-image-preview";
import { createArticle, updateArticle } from "@/services/article.service";
import { signOutAdmin } from "@/services/auth.service";
import { deletePhoto, getVillageAssetUrl, uploadPhoto } from "@/services/storage.service";
import { createUmkm, updateUmkm } from "@/services/umkm.service";
import { getVillageBySlug } from "@/services/village.service";
import { createWarung, updateWarung } from "@/services/warung.service";
import type { CatalogFormMode, CatalogKind } from "@/types/catalog";
import type { Article, Umkm, VillageSlug, Warung } from "@/types/database";
import type { ArticleFormValues } from "@/validations/article.schema";
import { articleFormSchema } from "@/validations/article.schema";
import type { UmkmFormValues } from "@/validations/umkm.schema";
import { umkmFormSchema } from "@/validations/umkm.schema";
import type { WarungFormValues } from "@/validations/warung.schema";
import { warungFormSchema } from "@/validations/warung.schema";

type CatalogAdminFormProps = {
  kind: CatalogKind;
  mode: CatalogFormMode;
  village: VillageSlug;
  initialData?: Umkm | Warung | Article | null;
  variant?: "page" | "panel";
  onCancel?: () => void;
  onSaved?: () => void;
};

function getListHref(village: VillageSlug, kind: CatalogKind): string {
  return `/admin/${village}/${CATALOG_CONFIG[kind].segment}`;
}

function inputClass(hasError: boolean): string {
  return `mt-2 h-14 w-full rounded-md border bg-white px-4 text-base font-medium text-[#344054] outline-none transition placeholder:text-[#7a8496] focus:border-[#168333] focus:ring-4 focus:ring-[#168333]/10 ${
    hasError ? "border-[#d92d20]" : "border-[#cfd6df]"
  }`;
}

function textareaClass(hasError: boolean): string {
  return `mt-2 w-full resize-none rounded-md border bg-white px-4 py-4 text-base font-medium leading-7 text-[#344054] outline-none transition placeholder:text-[#7a8496] focus:border-[#168333] focus:ring-4 focus:ring-[#168333]/10 ${
    hasError ? "border-[#d92d20]" : "border-[#cfd6df]"
  }`;
}

function errorId(name: string): string {
  return `${name}-error`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} className="mt-2 block text-xs font-bold text-[#d92d20]">
      {message}
    </span>
  );
}

function RequiredMark() {
  return <span className="text-[#ff1f1f]">*</span>;
}

async function handleSessionExpired(message: string, router: ReturnType<typeof useRouter>) {
  if (
    message === "Sesi login telah berakhir. Silakan login kembali." ||
    message === "Sesi login tidak ditemukan. Silakan login kembali."
  ) {
    await signOutAdmin();
    router.push("/admin/sign-in");
  }
}

export function CatalogAdminForm({
  kind,
  mode,
  village,
  initialData,
  variant = "page",
  onCancel,
  onSaved,
}: CatalogAdminFormProps) {
  if (kind === "article") {
    return (
      <ArticleAdminForm
        mode={mode}
        village={village}
        initialData={initialData && "article_url" in initialData ? initialData : null}
        onCancel={onCancel}
        onSaved={onSaved}
      />
    );
  }

  if (kind === "warung") {
    return (
      <WarungAdminForm
        mode={mode}
        village={village}
        initialData={initialData && "owner_name" in initialData ? initialData : null}
        onCancel={onCancel}
        onSaved={onSaved}
      />
    );
  }

  return (
    <UmkmAdminForm
      mode={mode}
      village={village}
      variant={variant}
      initialData={
        initialData && "description" in initialData && !("article_url" in initialData)
          ? initialData
          : null
      }
      onCancel={onCancel}
      onSaved={onSaved}
    />
  );
}

function UmkmAdminForm({
  mode,
  village,
  variant,
  initialData,
  onCancel,
  onSaved,
}: {
  mode: CatalogFormMode;
  village: VillageSlug;
  variant: "page" | "panel";
  initialData: Umkm | null;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const listHref = getListHref(village, "umkm");
  const { previewUrl, setPreviewFile } = useImagePreview();
  const existingPhotoUrl = useMemo(
    () => getVillageAssetUrl(initialData?.photo_path ?? null),
    [initialData?.photo_path],
  );
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UmkmFormValues>({
    resolver: zodResolver(umkmFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      whatsapp_number: initialData?.whatsapp_number ?? "",
      address: initialData?.address ?? "",
      photo: null,
    },
  });
  const descriptionValue = useWatch({ control, name: "description" }) ?? "";
  const addressValue = useWatch({ control, name: "address" }) ?? "";

  function updatePhoto(file: File | null) {
    setValue("photo", file, { shouldDirty: true, shouldValidate: true });
    setPreviewFile(file);
  }

  function handlePhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    updatePhoto(event.dataTransfer.files?.[0] ?? null);
  }

  async function onSubmit(values: UmkmFormValues) {
    let uploadedPhotoPath: string | null = null;

    try {
      if (values.photo) {
        const uploadResult = await uploadPhoto(values.photo, {
          folder: CATALOG_CONFIG.umkm.folder,
          villageSlug: village,
        });

        if (!uploadResult.success) {
          toast.error(uploadResult.message);
          await handleSessionExpired(uploadResult.message, router);
          return;
        }

        uploadedPhotoPath = uploadResult.data.path;
      }

      if (mode === "edit" && initialData) {
        const updateResult = await updateUmkm({
          id: initialData.id,
          name: values.name,
          description: values.description,
          whatsapp_number: normalizeWhatsAppNumber(values.whatsapp_number),
          address: emptyStringToNull(values.address),
          photo_path: uploadedPhotoPath ?? initialData.photo_path,
        });

        if (!updateResult.success) {
          if (uploadedPhotoPath) {
            await deletePhoto(uploadedPhotoPath);
          }

          toast.error(updateResult.message);
          await handleSessionExpired(updateResult.message, router);
          return;
        }

        if (uploadedPhotoPath && initialData.photo_path) {
          const deleteResult = await deletePhoto(initialData.photo_path);

          if (!deleteResult.success) {
            toast.warning("Data diperbarui, tetapi foto lama belum terhapus.");
          }
        }

        toast.success(updateResult.message || CATALOG_CONFIG.umkm.successUpdate);
        onSaved?.();
        if (!onSaved) {
          router.push(listHref);
        }
        router.refresh();
        return;
      }

      const createResult = await createUmkm({
        name: values.name,
        description: values.description,
        whatsapp_number: normalizeWhatsAppNumber(values.whatsapp_number),
        address: emptyStringToNull(values.address),
        photo_path: uploadedPhotoPath,
      });

      if (!createResult.success) {
        if (uploadedPhotoPath) {
          await deletePhoto(uploadedPhotoPath);
        }

        toast.error(createResult.message);
        await handleSessionExpired(createResult.message, router);
        return;
      }

      toast.success(createResult.message || CATALOG_CONFIG.umkm.successCreate);
      reset();
      setPreviewFile(null);
      onSaved?.();
      if (!onSaved) {
        router.push(listHref);
      }
      router.refresh();
    } catch (error) {
      if (uploadedPhotoPath) {
        await deletePhoto(uploadedPhotoPath);
      }

      toast.error(error instanceof Error ? error.message : "Data gagal disimpan.");
    }
  }

  function onInvalid(fieldErrors: FieldErrors<UmkmFormValues>) {
    focusFirstFieldError(fieldErrors, setFocus);
  }

  const fieldGridClass =
    variant === "panel"
      ? "mt-6 grid gap-y-7"
      : "mt-6 grid gap-x-8 gap-y-7 lg:grid-cols-2";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={
        variant === "panel"
          ? "overflow-hidden bg-white"
          : "mt-2 overflow-hidden rounded-xl border border-[#dfe6df] bg-white shadow-[0_22px_60px_rgb(15_23_42/0.08)]"
      }
      noValidate
    >
      <div className={variant === "panel" ? "px-5 py-6 sm:px-7" : "px-6 py-7 md:px-8 lg:px-8"}>
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-0.5 h-6 w-6 shrink-0 text-[#0f7a2b]" />
          <div>
            <h3 className="text-xl font-black text-[#0f7a2b]">
              Informasi UMKM
            </h3>
            <p className="mt-1 text-sm font-medium text-[#6a7280]">
              Lengkapi detail usaha Anda
            </p>
          </div>
        </div>

        <div className={fieldGridClass}>
          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Nama UMKM <RequiredMark />
            </span>
            <input
              type="text"
              placeholder="Contoh: Keripik Pisang Mangli"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId("name") : undefined}
              className={inputClass(Boolean(errors.name))}
              {...register("name")}
            />
            <p className="mt-3 text-sm font-medium text-[#667085]">
              Masukkan nama usaha Anda.
            </p>
            <FieldError id={errorId("name")} message={errors.name?.message} />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Nomor WhatsApp <RequiredMark />
            </span>
            <div className="relative">
              <WhatsAppIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0f9a3d]" />
              <input
                type="tel"
                placeholder="08xxxxxxxxxxx"
                aria-invalid={Boolean(errors.whatsapp_number)}
                aria-describedby={
                  errors.whatsapp_number
                    ? errorId("whatsapp_number")
                    : undefined
                }
                className={`${inputClass(Boolean(errors.whatsapp_number))} pl-12`}
                {...register("whatsapp_number")}
              />
            </div>
            <p className="mt-3 text-sm font-medium text-[#667085]">
              Nomor ini akan ditampilkan ke publik.
            </p>
            <FieldError
              id={errorId("whatsapp_number")}
              message={errors.whatsapp_number?.message}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Deskripsi Usaha <RequiredMark />
            </span>
            <div className="relative">
              <textarea
                placeholder="Jelaskan produk, layanan, keunggulan, dan informasi penting lainnya..."
                rows={6}
                maxLength={500}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? errorId("description") : undefined
                }
                className={`${textareaClass(Boolean(errors.description))} min-h-[190px] pb-10`}
                {...register("description")}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 text-sm font-medium text-[#687286]">
                {Math.min(descriptionValue.length, 500)}/500
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-[#667085]">
              Deskripsi membantu pelanggan memahami usaha Anda.
            </p>
            <FieldError
              id={errorId("description")}
              message={errors.description?.message}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Alamat Lengkap <RequiredMark />
            </span>
            <div className="relative">
              <textarea
                placeholder="Masukkan alamat lengkap usaha Anda..."
                rows={6}
                maxLength={300}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? errorId("address") : undefined
                }
                className={`${textareaClass(Boolean(errors.address))} min-h-[190px] pb-10`}
                {...register("address")}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 text-sm font-medium text-[#687286]">
                {Math.min(addressValue.length, 300)}/300
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-[#667085]">
              Alamat akan digunakan pelanggan untuk menemukan lokasi Anda.
            </p>
            <FieldError
              id={errorId("address")}
              message={errors.address?.message}
            />
          </label>
        </div>

        <label className="mt-7 block border-t border-[#e3e8e1] pt-6">
          <span className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-[#0f7a2b]" />
            <span>
              <span className="text-xl font-black text-[#202a37]">
                Foto UMKM
              </span>{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
              <span className="mt-1 block text-sm font-medium text-[#667085]">
                Foto yang menarik dapat meningkatkan kepercayaan pelanggan
              </span>
            </span>
          </span>
          <div
            className={`mt-6 grid min-h-[164px] cursor-pointer place-items-center rounded-xl border-2 border-dashed bg-[#fbfcfd] text-[#202a37] transition hover:border-[#168333] hover:bg-[#f6fbf3] ${
              errors.photo ? "border-[#d92d20]" : "border-[#d5dbe5]"
            }`}
            style={
              previewUrl || existingPhotoUrl
                ? {
                    backgroundImage: `linear-gradient(rgb(15 23 42 / 0.22), rgb(15 23 42 / 0.22)), url(${previewUrl ?? existingPhotoUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }
                : undefined
            }
            onDragOver={(event) => event.preventDefault()}
            onDrop={handlePhotoDrop}
          >
            <div className="px-4 text-center">
              <UploadCloudIcon className="mx-auto h-11 w-11 text-[#0f7a2b]" />
              <p
                className={`mt-3 text-sm font-black ${
                  previewUrl || existingPhotoUrl ? "text-white" : "text-[#202a37]"
                }`}
              >
                {previewUrl || existingPhotoUrl
                  ? "Klik untuk mengganti foto"
                  : "Klik untuk unggah atau drag & drop foto di sini"}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  previewUrl || existingPhotoUrl
                    ? "text-white/90"
                    : "text-[#667085]"
                }`}
              >
                Format: JPG, PNG, WebP (Max 2MB)
              </p>
            </div>
          </div>
          <input
            type="file"
            accept={PHOTO_ACCEPT_ATTRIBUTE}
            className="sr-only"
            aria-invalid={Boolean(errors.photo)}
            aria-describedby={errors.photo ? errorId("photo") : undefined}
            onChange={(event) => updatePhoto(event.target.files?.[0] ?? null)}
          />
          <FieldError id={errorId("photo")} message={errors.photo?.message} />
        </label>
      </div>
      <SubmitActions
        isSubmitting={isSubmitting}
        listHref={listHref}
        onCancel={onCancel}
        submitLabel={mode === "edit" ? "Simpan Perubahan" : "Simpan UMKM"}
      />
    </form>
  );
}

function WarungAdminForm({
  mode,
  village,
  initialData,
  onCancel,
  onSaved,
}: {
  mode: CatalogFormMode;
  village: VillageSlug;
  initialData: Warung | null;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const listHref = getListHref(village, "warung");
  const { previewUrl, setPreviewFile } = useImagePreview();
  const existingPhotoUrl = useMemo(
    () => getVillageAssetUrl(initialData?.photo_path ?? null),
    [initialData?.photo_path],
  );
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarungFormValues>({
    resolver: zodResolver(warungFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      owner_name: initialData?.owner_name ?? "",
      address: initialData?.address ?? "",
      whatsapp_number: initialData?.whatsapp_number ?? "",
      photo: null,
    },
  });

  function updatePhoto(file: File | null) {
    setValue("photo", file, { shouldDirty: true, shouldValidate: true });
    setPreviewFile(file);
  }

  async function onSubmit(values: WarungFormValues) {
    const villageResult = await getVillageBySlug(village);

    if (!villageResult.success) {
      toast.error(villageResult.message);
      await handleSessionExpired(villageResult.message, router);
      return;
    }

    let uploadedPhotoPath: string | null = null;

    try {
      if (values.photo) {
        const uploadResult = await uploadPhoto(values.photo, {
          folder: CATALOG_CONFIG.warung.folder,
          villageSlug: village,
        });

        if (!uploadResult.success) {
          toast.error(uploadResult.message);
          await handleSessionExpired(uploadResult.message, router);
          return;
        }

        uploadedPhotoPath = uploadResult.data.path;
      }

      if (mode === "edit" && initialData) {
        const updateResult = await updateWarung({
          id: initialData.id,
          village_id: villageResult.data.id,
          name: values.name,
          owner_name: emptyStringToNull(values.owner_name),
          address: emptyStringToNull(values.address),
          whatsapp_number: normalizeWhatsAppNumber(values.whatsapp_number),
          photo_path: uploadedPhotoPath ?? initialData.photo_path,
        });

        if (!updateResult.success) {
          if (uploadedPhotoPath) {
            await deletePhoto(uploadedPhotoPath);
          }

          toast.error(updateResult.message);
          await handleSessionExpired(updateResult.message, router);
          return;
        }

        if (uploadedPhotoPath && initialData.photo_path) {
          const deleteResult = await deletePhoto(initialData.photo_path);

          if (!deleteResult.success) {
            toast.warning("Data diperbarui, tetapi foto lama belum terhapus.");
          }
        }

        toast.success(
          updateResult.message || CATALOG_CONFIG.warung.successUpdate,
        );
        onSaved?.();
        if (!onSaved) {
          router.push(listHref);
        }
        router.refresh();
        return;
      }

      const createResult = await createWarung({
        village_id: villageResult.data.id,
        name: values.name,
        owner_name: emptyStringToNull(values.owner_name),
        address: emptyStringToNull(values.address),
        whatsapp_number: normalizeWhatsAppNumber(values.whatsapp_number),
        photo_path: uploadedPhotoPath,
      });

      if (!createResult.success) {
        if (uploadedPhotoPath) {
          await deletePhoto(uploadedPhotoPath);
        }

        toast.error(createResult.message);
        await handleSessionExpired(createResult.message, router);
        return;
      }

      toast.success(
        createResult.message || CATALOG_CONFIG.warung.successCreate,
      );
      reset();
      setPreviewFile(null);
      onSaved?.();
      if (!onSaved) {
        router.push(listHref);
      }
      router.refresh();
    } catch (error) {
      if (uploadedPhotoPath) {
        await deletePhoto(uploadedPhotoPath);
      }

      toast.error(error instanceof Error ? error.message : "Data gagal disimpan.");
    }
  }

  function onInvalid(fieldErrors: FieldErrors<WarungFormValues>) {
    focusFirstFieldError(fieldErrors, setFocus);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mt-10 border border-[#9ee09e] px-6 py-7 md:px-10"
      noValidate
    >
      <div className="grid gap-7 lg:grid-cols-2">
        <div className="space-y-6">
          <label className="block">
            <span className="text-xs font-medium uppercase">Nama Warung</span>
            <input
              type="text"
              placeholder="Input teks..."
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId("name") : undefined}
              className={inputClass(Boolean(errors.name))}
              {...register("name")}
            />
            <FieldError id={errorId("name")} message={errors.name?.message} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase">Nama Pemilik</span>
            <input
              type="text"
              placeholder="Input nama pemilik..."
              aria-invalid={Boolean(errors.owner_name)}
              aria-describedby={
                errors.owner_name ? errorId("owner_name") : undefined
              }
              className={inputClass(Boolean(errors.owner_name))}
              {...register("owner_name")}
            />
            <FieldError
              id={errorId("owner_name")}
              message={errors.owner_name?.message}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase">Nomor WhatsApp</span>
            <input
              type="tel"
              placeholder="08..."
              aria-invalid={Boolean(errors.whatsapp_number)}
              aria-describedby={
                errors.whatsapp_number ? errorId("whatsapp_number") : undefined
              }
              className={inputClass(Boolean(errors.whatsapp_number))}
              {...register("whatsapp_number")}
            />
            <FieldError
              id={errorId("whatsapp_number")}
              message={errors.whatsapp_number?.message}
            />
          </label>
        </div>

        <div className="space-y-6">
          <label className="block">
            <span className="text-xs font-medium uppercase">Foto Warung</span>
            <div
              className={`mt-2 grid min-h-[220px] cursor-pointer place-items-center border bg-[#e5e5e5] text-[#454c48] ${
                errors.photo ? "border-[#b32323]" : "border-[#7f877f]"
              }`}
              style={
                previewUrl || existingPhotoUrl
                  ? {
                      backgroundImage: `url(${previewUrl ?? existingPhotoUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : undefined
              }
            >
              {!previewUrl && !existingPhotoUrl && (
                <div className="text-center">
                  <CameraIcon className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-xs font-medium uppercase">
                    Unggah Foto
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept={PHOTO_ACCEPT_ATTRIBUTE}
              className="sr-only"
              aria-invalid={Boolean(errors.photo)}
              aria-describedby={errors.photo ? errorId("photo") : undefined}
              onChange={(event) => updatePhoto(event.target.files?.[0] ?? null)}
            />
            <span className="mt-2 block text-xs italic text-[#555]">
              *Format: JPG, PNG, WebP (Max 2MB)
            </span>
            <FieldError id={errorId("photo")} message={errors.photo?.message} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase">Alamat</span>
            <textarea
              placeholder="Input alamat lengkap..."
              rows={4}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? errorId("address") : undefined}
              className={textareaClass(Boolean(errors.address))}
              {...register("address")}
            />
            <FieldError
              id={errorId("address")}
              message={errors.address?.message}
            />
          </label>
        </div>
      </div>

      <SubmitActions
        isSubmitting={isSubmitting}
        listHref={listHref}
        onCancel={onCancel}
      />
    </form>
  );
}

function ArticleAdminForm({
  mode,
  village,
  initialData,
  onCancel,
  onSaved,
}: {
  mode: CatalogFormMode;
  village: VillageSlug;
  initialData: Article | null;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const listHref = getListHref(village, "article");
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      article_url: initialData?.article_url ?? "",
    },
  });

  async function onSubmit(values: ArticleFormValues) {
    const villageResult = await getVillageBySlug(village);

    if (!villageResult.success) {
      toast.error(villageResult.message);
      await handleSessionExpired(villageResult.message, router);
      return;
    }

    if (mode === "edit" && initialData) {
      const updateResult = await updateArticle({
        id: initialData.id,
        village_id: villageResult.data.id,
        title: values.title,
        description: values.description,
        article_url: values.article_url,
      });

      if (!updateResult.success) {
        toast.error(updateResult.message);
        await handleSessionExpired(updateResult.message, router);
        return;
      }

      toast.success(
        updateResult.message || CATALOG_CONFIG.article.successUpdate,
      );
      onSaved?.();
      if (!onSaved) {
        router.push(listHref);
      }
      router.refresh();
      return;
    }

    const createResult = await createArticle({
      village_id: villageResult.data.id,
      title: values.title,
      description: values.description,
      article_url: values.article_url,
    });

    if (!createResult.success) {
      toast.error(createResult.message);
      await handleSessionExpired(createResult.message, router);
      return;
    }

    toast.success(
      createResult.message || CATALOG_CONFIG.article.successCreate,
    );
    reset();
    onSaved?.();
    if (!onSaved) {
      router.push(listHref);
    }
    router.refresh();
  }

  function onInvalid(fieldErrors: FieldErrors<ArticleFormValues>) {
    focusFirstFieldError(fieldErrors, setFocus);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mt-10 border border-[#9ee09e] px-6 py-7 md:px-10"
      noValidate
    >
      <div className="grid gap-7 lg:grid-cols-2">
        <div className="space-y-6">
          <label className="block">
            <span className="text-xs font-medium uppercase">Judul Artikel</span>
            <input
              type="text"
              placeholder="Input judul artikel..."
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? errorId("title") : undefined}
              className={inputClass(Boolean(errors.title))}
              {...register("title")}
            />
            <FieldError id={errorId("title")} message={errors.title?.message} />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase">Link Artikel</span>
            <input
              type="url"
              placeholder="https://medium.com/..."
              aria-invalid={Boolean(errors.article_url)}
              aria-describedby={
                errors.article_url ? errorId("article_url") : undefined
              }
              className={inputClass(Boolean(errors.article_url))}
              {...register("article_url")}
            />
            <FieldError
              id={errorId("article_url")}
              message={errors.article_url?.message}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-medium uppercase">Deskripsi</span>
          <textarea
            placeholder="Input deskripsi panjang..."
            rows={8}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? errorId("description") : undefined
            }
            className={textareaClass(Boolean(errors.description))}
            {...register("description")}
          />
          <FieldError
            id={errorId("description")}
            message={errors.description?.message}
          />
        </label>
      </div>

      <SubmitActions
        isSubmitting={isSubmitting}
        listHref={listHref}
        onCancel={onCancel}
      />
    </form>
  );
}

function SubmitActions({
  isSubmitting,
  listHref,
  onCancel,
  submitLabel = "Simpan",
}: {
  isSubmitting: boolean;
  listHref: string;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  return (
    <div className="border-t border-[#e3e8e1] bg-white px-6 py-6 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-14 min-w-[136px] items-center justify-center rounded-md border border-[#cfd6df] bg-white px-9 text-base font-black text-[#ff1f1f] transition hover:border-[#ffb5b5] hover:bg-[#fff5f5]"
          >
            Batal
          </button>
        ) : (
          <Link
            href={listHref}
            className="inline-flex h-14 min-w-[136px] items-center justify-center rounded-md border border-[#cfd6df] bg-white px-9 text-base font-black text-[#ff1f1f] transition hover:border-[#ffb5b5] hover:bg-[#fff5f5]"
          >
            Batal
          </Link>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-14 min-w-[212px] items-center justify-center gap-3 rounded-md bg-[#0f7a2b] px-9 text-base font-black text-white shadow-[0_16px_30px_rgb(15_122_43/0.18)] transition hover:bg-[#0a6822] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SaveIcon className="h-5 w-5" />
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
