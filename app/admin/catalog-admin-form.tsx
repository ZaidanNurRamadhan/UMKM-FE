"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type DragEvent } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import {
  ImageIcon,
  InfoIcon,
  LocateIcon,
  MapPinIcon,
  SaveIcon,
  UploadCloudIcon,
  WhatsAppIcon,
} from "@/components/icons/admin-icons";
import { CATALOG_CONFIG } from "@/constants/catalog";
import { PHOTO_ACCEPT_ATTRIBUTE } from "@/constants/storage";
import { focusFirstFieldError } from "@/lib/errors/validation-error";
import {
  formatCurrentLocationAddress,
  getGoogleMapsUrlFromAddress,
} from "@/lib/utils/location";
import { emptyStringToNull } from "@/lib/utils/string";
import { normalizeWhatsAppNumber } from "@/lib/utils/whatsapp";
import { useImagePreview } from "@/hooks/use-image-preview";
import { signOutAdmin } from "@/services/auth.service";
import { deletePhoto, getVillageAssetUrl, uploadPhoto } from "@/services/storage.service";
import { createUmkm, updateUmkm } from "@/services/umkm.service";
import { getVillageBySlug } from "@/services/village.service";
import { createWarung, updateWarung } from "@/services/warung.service";
import type { CatalogFormMode, CatalogKind } from "@/types/catalog";
import type { Umkm, VillageSlug, Warung } from "@/types/database";
import type { UmkmFormValues } from "@/validations/umkm.schema";
import { umkmFormSchema } from "@/validations/umkm.schema";
import type { WarungFormValues } from "@/validations/warung.schema";
import { warungFormSchema } from "@/validations/warung.schema";

type CatalogAdminFormProps = {
  kind: CatalogKind;
  mode: CatalogFormMode;
  village: VillageSlug;
  initialData?: Umkm | Warung | null;
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

function getVillageLocationQuery(village: VillageSlug): string {
  return village === "mangli"
    ? "Desa Mangli, Kaliangkrik, Magelang"
    : "Desa Munggangsari, Kaliangkrik, Magelang";
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "Izin lokasi ditolak. Aktifkan izin lokasi browser lalu coba lagi.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Lokasi saat ini belum dapat ditemukan.";
  }

  if (error.code === error.TIMEOUT) {
    return "Pengambilan lokasi memerlukan waktu terlalu lama.";
  }

  return "Lokasi saat ini belum dapat digunakan.";
}

function AddressLocationTools({
  address,
  compact = false,
  onAddressChange,
  village,
}: {
  address: string;
  compact?: boolean;
  onAddressChange: (address: string) => void;
  village: VillageSlug;
}) {
  const [isLocating, setIsLocating] = useState(false);
  const locationButtonClass = `inline-flex items-center justify-center gap-2 rounded-md border border-[#cfd6df] bg-white px-3 text-sm font-black text-[#2e6230] transition hover:border-[#168333] hover:bg-[#f3f8ef] disabled:cursor-not-allowed disabled:opacity-60 ${
    compact ? "h-9 text-xs" : "h-10"
  }`;

  function openMaps() {
    const mapsUrl =
      getGoogleMapsUrlFromAddress(address) ??
      getGoogleMapsUrlFromAddress(getVillageLocationQuery(village));

    if (!mapsUrl) {
      return;
    }

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      toast.error("Browser tidak mendukung akses lokasi.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onAddressChange(
          formatCurrentLocationAddress(
            position.coords.latitude,
            position.coords.longitude,
          ),
        );
        setIsLocating(false);
        toast.success("Lokasi saat ini berhasil ditambahkan.");
      },
      (error) => {
        setIsLocating(false);
        toast.error(getGeolocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 15_000,
      },
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isLocating}
        onClick={useCurrentLocation}
        className={locationButtonClass}
      >
        <LocateIcon className="h-4 w-4" />
        {isLocating ? "Mencari..." : "Lokasi saya"}
      </button>
      <button
        type="button"
        onClick={openMaps}
        className={locationButtonClass}
      >
        <MapPinIcon className="h-4 w-4" />
        Maps
      </button>
    </div>
  );
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
  if (kind === "warung") {
    return (
      <WarungAdminForm
        mode={mode}
        village={village}
        variant={variant}
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
        initialData && "description" in initialData ? initialData : null
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

  function updateAddress(address: string) {
    setValue("address", address, { shouldDirty: true, shouldValidate: true });
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
      ? "mt-4 grid gap-y-5 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-3"
      : "mt-6 grid gap-x-8 gap-y-7 lg:grid-cols-2";
  const compactControlClass =
    variant === "panel" ? "lg:h-10 lg:text-sm" : "";
  const compactTextareaClass =
    variant === "panel"
      ? "lg:min-h-[112px] lg:py-2 lg:pb-8 lg:text-sm lg:leading-5"
      : "";
  const helperTextClass = `mt-3 text-sm font-medium text-[#667085] ${
    variant === "panel" ? "lg:hidden" : ""
  }`;
  const photoLabelClass = `mt-7 block border-t border-[#e3e8e1] pt-6 ${
    variant === "panel" ? "lg:mt-3 lg:pt-3" : ""
  }`;
  const photoTitleClass = `text-xl font-black text-[#202a37] ${
    variant === "panel" ? "lg:text-base" : ""
  }`;
  const uploadBoxClass = `mt-6 grid min-h-[164px] cursor-pointer place-items-center rounded-xl border-2 border-dashed bg-[#fbfcfd] text-[#202a37] transition hover:border-[#168333] hover:bg-[#f6fbf3] ${
    variant === "panel" ? "lg:mt-3 lg:min-h-[82px]" : ""
  }`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={
        variant === "panel"
          ? "flex h-full flex-col overflow-hidden bg-white"
          : "mt-2 overflow-hidden rounded-xl border border-[#dfe6df] bg-white shadow-[0_22px_60px_rgb(15_23_42/0.08)]"
      }
      noValidate
    >
      <div
        className={
          variant === "panel"
            ? "min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 lg:overflow-hidden lg:px-6 lg:py-4"
            : "px-6 py-7 md:px-8 lg:px-8"
        }
      >
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
              className={`${inputClass(Boolean(errors.name))} ${compactControlClass}`}
              {...register("name")}
            />
            <p className={helperTextClass}>
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
                className={`${inputClass(Boolean(errors.whatsapp_number))} pl-12 ${compactControlClass}`}
                {...register("whatsapp_number")}
              />
            </div>
            <p className={helperTextClass}>
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
                className={`${textareaClass(Boolean(errors.description))} min-h-[190px] pb-10 ${compactTextareaClass}`}
                {...register("description")}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 text-sm font-medium text-[#687286]">
                {Math.min(descriptionValue.length, 500)}/500
              </span>
            </div>
            <p className={helperTextClass}>
              Deskripsi membantu pelanggan memahami usaha Anda.
            </p>
            <FieldError
              id={errorId("description")}
              message={errors.description?.message}
            />
          </label>

          <div className="block">
            <label
              htmlFor="umkm-address"
              className="text-sm font-black text-[#202a37]"
            >
              Alamat Lengkap <RequiredMark />
            </label>
            <div className="relative">
              <textarea
                id="umkm-address"
                placeholder="Masukkan alamat lengkap usaha Anda..."
                rows={6}
                maxLength={300}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? errorId("address") : undefined
                }
                className={`${textareaClass(Boolean(errors.address))} min-h-[190px] pb-10 ${compactTextareaClass}`}
                {...register("address")}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 text-sm font-medium text-[#687286]">
                {Math.min(addressValue.length, 300)}/300
              </span>
            </div>
            <AddressLocationTools
              address={addressValue}
              compact={variant === "panel"}
              onAddressChange={updateAddress}
              village={village}
            />
            <p className={helperTextClass}>
              Alamat akan digunakan pelanggan untuk menemukan lokasi Anda.
            </p>
            <FieldError
              id={errorId("address")}
              message={errors.address?.message}
            />
          </div>
        </div>

        <label className={photoLabelClass}>
          <span className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-[#0f7a2b]" />
            <span>
              <span className={photoTitleClass}>
                Foto UMKM
              </span>{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
              <span className={helperTextClass}>
                Foto yang menarik dapat meningkatkan kepercayaan pelanggan
              </span>
            </span>
          </span>
          <div
            className={`${uploadBoxClass} ${
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
              <UploadCloudIcon
                className={`mx-auto h-11 w-11 text-[#0f7a2b] ${
                  variant === "panel" ? "lg:h-7 lg:w-7" : ""
                }`}
              />
              <p
                className={`mt-3 text-sm font-black ${
                  variant === "panel" ? "lg:mt-1 lg:text-xs" : ""
                } ${
                  previewUrl || existingPhotoUrl ? "text-white" : "text-[#202a37]"
                }`}
              >
                {previewUrl || existingPhotoUrl
                  ? "Klik untuk mengganti foto"
                  : "Klik untuk unggah atau drag & drop foto di sini"}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  variant === "panel" ? "lg:hidden" : ""
                } ${
                  previewUrl || existingPhotoUrl
                    ? "text-white/90"
                    : "text-[#667085]"
                }`}
              >
                Format: JPG, PNG, WebP
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
          <span className="mt-2 block text-xs font-medium text-[#667085]">
            Maks. ukuran foto 500 KB.
          </span>
          <FieldError id={errorId("photo")} message={errors.photo?.message} />
        </label>
      </div>
      <SubmitActions
        isSubmitting={isSubmitting}
        listHref={listHref}
        onCancel={onCancel}
        variant={variant}
        submitLabel={mode === "edit" ? "Simpan Perubahan" : "Simpan UMKM"}
      />
    </form>
  );
}

function WarungAdminForm({
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
    control,
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
  const addressValue = useWatch({ control, name: "address" }) ?? "";

  function updatePhoto(file: File | null) {
    setValue("photo", file, { shouldDirty: true, shouldValidate: true });
    setPreviewFile(file);
  }

  function updateAddress(address: string) {
    setValue("address", address, { shouldDirty: true, shouldValidate: true });
  }

  function handlePhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    updatePhoto(event.dataTransfer.files?.[0] ?? null);
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

  const fieldGridClass =
    variant === "panel"
      ? "mt-4 grid gap-y-5 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-3"
      : "mt-6 grid gap-x-8 gap-y-7 lg:grid-cols-2";
  const compactControlClass =
    variant === "panel" ? "lg:h-10 lg:text-sm" : "";
  const compactTextareaClass =
    variant === "panel"
      ? "lg:min-h-[112px] lg:py-2 lg:pb-8 lg:text-sm lg:leading-5"
      : "";
  const helperTextClass = `mt-3 text-sm font-medium text-[#667085] ${
    variant === "panel" ? "lg:hidden" : ""
  }`;
  const photoLabelClass = `mt-7 block border-t border-[#e3e8e1] pt-6 ${
    variant === "panel" ? "lg:mt-3 lg:pt-3" : ""
  }`;
  const photoTitleClass = `text-xl font-black text-[#202a37] ${
    variant === "panel" ? "lg:text-base" : ""
  }`;
  const uploadBoxClass = `mt-6 grid min-h-[164px] cursor-pointer place-items-center rounded-xl border-2 border-dashed bg-[#fbfcfd] text-[#202a37] transition hover:border-[#168333] hover:bg-[#f6fbf3] ${
    variant === "panel" ? "lg:mt-3 lg:min-h-[82px]" : ""
  }`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={
        variant === "panel"
          ? "flex h-full flex-col overflow-hidden bg-white"
          : "mt-2 overflow-hidden rounded-xl border border-[#dfe6df] bg-white shadow-[0_22px_60px_rgb(15_23_42/0.08)]"
      }
      noValidate
    >
      <div
        className={
          variant === "panel"
            ? "min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 lg:overflow-hidden lg:px-6 lg:py-4"
            : "px-6 py-7 md:px-8 lg:px-8"
        }
      >
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-0.5 h-6 w-6 shrink-0 text-[#0f7a2b]" />
          <div>
            <h3 className="text-xl font-black text-[#0f7a2b]">
              Informasi Warung
            </h3>
            <p className="mt-1 text-sm font-medium text-[#6a7280]">
              Lengkapi detail warung dan kuliner lokal desa.
            </p>
          </div>
        </div>

        <div className={fieldGridClass}>
          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Nama Warung <RequiredMark />
            </span>
            <input
              type="text"
              placeholder="Contoh: Warung Makan Bu Sari"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId("name") : undefined}
              className={`${inputClass(Boolean(errors.name))} ${compactControlClass}`}
              {...register("name")}
            />
            <p className={helperTextClass}>
              Masukkan nama warung atau tempat kuliner.
            </p>
            <FieldError
              id={errorId("name")}
              message={errors.name?.message}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Nama Pemilik{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
            </span>
            <input
              type="text"
              placeholder="Contoh: Siti Aminah"
              aria-invalid={Boolean(errors.owner_name)}
              aria-describedby={
                errors.owner_name ? errorId("owner_name") : undefined
              }
              className={`${inputClass(Boolean(errors.owner_name))} ${compactControlClass}`}
              {...register("owner_name")}
            />
            <p className={helperTextClass}>
              Nama pemilik membantu pelanggan mengenali warung.
            </p>
            <FieldError
              id={errorId("owner_name")}
              message={errors.owner_name?.message}
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#202a37]">
              Nomor WhatsApp{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
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
                className={`${inputClass(Boolean(errors.whatsapp_number))} pl-12 ${compactControlClass}`}
                {...register("whatsapp_number")}
              />
            </div>
            <p className={helperTextClass}>
              Nomor ini dapat ditampilkan ke publik.
            </p>
            <FieldError
              id={errorId("whatsapp_number")}
              message={errors.whatsapp_number?.message}
            />
          </label>

          <div className="block">
            <label
              htmlFor="warung-address"
              className="text-sm font-black text-[#202a37]"
            >
              Alamat{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
            </label>
            <div className="relative">
              <textarea
                id="warung-address"
                placeholder="Masukkan alamat lengkap warung..."
                rows={6}
                maxLength={500}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? errorId("address") : undefined
                }
                className={`${textareaClass(Boolean(errors.address))} min-h-[190px] pb-10 ${compactTextareaClass}`}
                {...register("address")}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 text-sm font-medium text-[#687286]">
                {Math.min(addressValue.length, 500)}/500
              </span>
            </div>
            <AddressLocationTools
              address={addressValue}
              compact={variant === "panel"}
              onAddressChange={updateAddress}
              village={village}
            />
            <p className={helperTextClass}>
              Alamat membantu pelanggan menemukan lokasi warung.
            </p>
            <FieldError
              id={errorId("address")}
              message={errors.address?.message}
            />
          </div>
        </div>

        <label className={photoLabelClass}>
          <span className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-[#0f7a2b]" />
            <span>
              <span className={photoTitleClass}>
                Foto Warung
              </span>{" "}
              <span className="text-sm font-semibold text-[#667085]">
                (Opsional)
              </span>
              <span className={helperTextClass}>
                Foto yang menarik dapat meningkatkan kepercayaan pelanggan
              </span>
            </span>
          </span>
          <div
            className={`${uploadBoxClass} ${
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
              <UploadCloudIcon
                className={`mx-auto h-11 w-11 text-[#0f7a2b] ${
                  variant === "panel" ? "lg:h-7 lg:w-7" : ""
                }`}
              />
              <p
                className={`mt-3 text-sm font-black ${
                  variant === "panel" ? "lg:mt-1 lg:text-xs" : ""
                } ${
                  previewUrl || existingPhotoUrl ? "text-white" : "text-[#202a37]"
                }`}
              >
                {previewUrl || existingPhotoUrl
                  ? "Klik untuk mengganti foto"
                  : "Klik untuk unggah atau drag & drop foto di sini"}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  variant === "panel" ? "lg:hidden" : ""
                } ${
                  previewUrl || existingPhotoUrl
                    ? "text-white/90"
                    : "text-[#667085]"
                }`}
              >
                Format: JPG, PNG, WebP
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
          <span className="mt-2 block text-xs font-medium text-[#667085]">
            Maks. ukuran foto 500 KB.
          </span>
          <FieldError id={errorId("photo")} message={errors.photo?.message} />
        </label>
      </div>

      <SubmitActions
        isSubmitting={isSubmitting}
        listHref={listHref}
        onCancel={onCancel}
        variant={variant}
        submitLabel={mode === "edit" ? "Simpan Perubahan" : "Simpan Warung"}
      />
    </form>
  );
}

function SubmitActions({
  isSubmitting,
  listHref,
  onCancel,
  submitLabel = "Simpan",
  variant = "page",
}: {
  isSubmitting: boolean;
  listHref: string;
  onCancel?: () => void;
  submitLabel?: string;
  variant?: "page" | "panel";
}) {
  const actionClass =
    variant === "panel"
      ? "border-t border-[#e3e8e1] bg-white px-5 py-4 sm:px-7 lg:px-6 lg:py-3"
      : "border-t border-[#e3e8e1] bg-white px-6 py-6 md:px-8";
  const cancelClass =
    "inline-flex h-14 min-w-[136px] items-center justify-center rounded-md border border-[#cfd6df] bg-white px-9 text-base font-black text-[#ff1f1f] transition hover:border-[#ffb5b5] hover:bg-[#fff5f5]" +
    (variant === "panel" ? " lg:h-10 lg:px-6 lg:text-sm" : "");
  const submitClass =
    "inline-flex h-14 min-w-[212px] items-center justify-center gap-3 rounded-md bg-[#0f7a2b] px-9 text-base font-black text-white shadow-[0_16px_30px_rgb(15_122_43/0.18)] transition hover:bg-[#0a6822] disabled:cursor-not-allowed disabled:opacity-60" +
    (variant === "panel" ? " lg:h-10 lg:min-w-[180px] lg:px-6 lg:text-sm" : "");

  return (
    <div className={actionClass}>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className={cancelClass}
          >
            Batal
          </button>
        ) : (
          <Link
            href={listHref}
            className={cancelClass}
          >
            Batal
          </Link>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={submitClass}
        >
          <SaveIcon className="h-5 w-5" />
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
