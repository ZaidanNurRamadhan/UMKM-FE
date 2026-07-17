export function emptyStringToNull(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue || null;
}
