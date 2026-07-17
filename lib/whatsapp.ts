export function normalizeWhatsAppNumber(
  whatsappNumber: string | null,
): string | null {
  const digits = whatsappNumber?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return null;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

export function getWhatsAppUrl(
  whatsappNumber: string | null,
  businessName: string,
): string | null {
  const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);

  if (!normalizedNumber) {
    return null;
  }

  const message = encodeURIComponent(
    `Halo, saya melihat ${businessName} melalui Website Katalog Potensi Desa. Saya ingin bertanya mengenai produk yang tersedia.`,
  );

  return `https://wa.me/${normalizedNumber}?text=${message}`;
}
