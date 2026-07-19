"use client";

import { useEffect, useId } from "react";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  isConfirming = false,
  onConfirm,
  onOpenChange,
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isConfirming) {
        onOpenChange(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConfirming, onOpenChange, open]);

  if (!open) {
    return null;
  }

  function closeDialog() {
    if (!isConfirming) {
      onOpenChange(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#101828]/55 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-lg border border-[#e3e8e1] bg-white p-6 shadow-[0_24px_70px_rgb(15_23_42/0.24)]"
      >
        <h2 id={titleId} className="text-xl font-black text-[#202a37]">
          {title}
        </h2>
        <p
          id={descriptionId}
          className="mt-3 text-sm font-medium leading-6 text-[#667085]"
        >
          {description}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isConfirming}
            onClick={closeDialog}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#cfd6df] bg-white px-5 text-sm font-black text-[#344054] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#d92d20] px-5 text-sm font-black text-white transition hover:bg-[#b42318] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
