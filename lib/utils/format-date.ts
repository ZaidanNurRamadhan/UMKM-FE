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

const dashboardDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
});

export function formatDashboardDateTime(value: string | null): string {
  if (!value) {
    return "Belum ada data";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Belum ada data";
  }

  return dashboardDateTimeFormatter.format(date).replace(".", ":");
}
