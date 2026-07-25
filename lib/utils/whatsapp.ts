export function normalizeWhatsAppNumber(
  whatsappNumber: string | null | undefined,
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

  return null;
}

export function getWhatsAppUrl(whatsappNumber: string | null): string | null {
  const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);

  if (
    !normalizedNumber ||
    normalizedNumber.length < 8 ||
    normalizedNumber.length > 25
  ) {
    return null;
  }

  return `https://wa.me/${normalizedNumber}`;
}
