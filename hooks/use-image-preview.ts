"use client";

import { useEffect, useState } from "react";

export function useImagePreview() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function setPreviewFile(file: File | null) {
    setPreviewUrl((currentUrl) => {
      if (currentUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
  }

  return {
    previewUrl,
    setPreviewFile,
  };
}
