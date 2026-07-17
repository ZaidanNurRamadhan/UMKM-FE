import type { FieldErrors, FieldValues, Path, UseFormSetFocus } from "react-hook-form";
import type { ZodError } from "zod";

export function getFirstFieldError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
): Path<TFieldValues> | null {
  const firstKey = Object.keys(errors)[0];

  return firstKey ? (firstKey as Path<TFieldValues>) : null;
}

export function focusFirstFieldError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  setFocus: UseFormSetFocus<TFieldValues>,
): void {
  const firstField = getFirstFieldError(errors);

  if (firstField) {
    setFocus(firstField);
  }
}

export function getFirstZodErrorMessage(
  error: ZodError,
  fallbackMessage = "Data yang dimasukkan belum valid.",
): string {
  return error.issues[0]?.message ?? fallbackMessage;
}
