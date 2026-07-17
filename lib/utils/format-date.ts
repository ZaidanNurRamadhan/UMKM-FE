export function formatRelativeTime(value: string): string {
  const timestamp = new Date(value).getTime();
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? "baru saja" : `${diffMinutes} menit lalu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} hari lalu`;
}
