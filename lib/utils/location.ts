const GOOGLE_MAPS_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:(?:google\.[^\s/]+|maps\.google\.[^\s/]+)\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)[^\s]*/i;

export function buildGoogleMapsSearchUrl(query: string): string | null {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    normalizedQuery,
  )}`;
}

export function buildGoogleMapsCoordinateUrl(
  latitude: number,
  longitude: number,
): string {
  const coordinates = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

  return `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
}

export function formatCurrentLocationAddress(
  latitude: number,
  longitude: number,
): string {
  return `Lokasi Google Maps: ${buildGoogleMapsCoordinateUrl(
    latitude,
    longitude,
  )}`;
}

export function getGoogleMapsUrlFromAddress(
  address: string | null,
): string | null {
  const normalizedAddress = address?.trim();

  if (!normalizedAddress) {
    return null;
  }

  const mapsUrl = normalizedAddress.match(GOOGLE_MAPS_URL_PATTERN)?.[0];

  if (mapsUrl) {
    return mapsUrl.replace(/[),.]+$/, "");
  }

  return buildGoogleMapsSearchUrl(normalizedAddress);
}

export function getAddressDisplayText(address: string | null): string | null {
  const normalizedAddress = address?.trim();

  if (!normalizedAddress) {
    return null;
  }

  const displayText = normalizedAddress
    .replace(GOOGLE_MAPS_URL_PATTERN, "")
    .replace(/\b(?:Lokasi|Google Maps)\b\s*:?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return displayText || null;
}
