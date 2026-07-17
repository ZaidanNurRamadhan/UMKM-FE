export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "jpg";
}

export function createStorageFileName(fileName: string): string {
  return `${crypto.randomUUID()}.${getFileExtension(fileName)}`;
}
