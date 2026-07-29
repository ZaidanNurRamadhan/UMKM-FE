"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOutIcon } from "@/components/icons/admin-icons";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { signOutAdmin } from "@/services/auth.service";
import { removeAdminSessionCookie } from "@/lib/admin-session";

type AdminLogoutButtonProps = {
  className: string;
  iconClassName: string;
  label: string;
};

export function AdminLogoutButton({
  className,
  iconClassName,
  label,
}: AdminLogoutButtonProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function confirmLogout() {
    setIsSigningOut(true);

    const result = await signOutAdmin();

    if (!result.success) {
      toast.error(result.message);
      setIsSigningOut(false);
      return;
    }

    removeAdminSessionCookie();
    router.replace("/admin/sign-in");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className={className}
      >
        <LogOutIcon className={iconClassName} />
        {label}
      </button>
      <ConfirmationDialog
        open={isConfirmOpen}
        title="Konfirmasi logout"
        description="Anda akan keluar dari halaman admin. Pastikan data yang sedang dikerjakan sudah disimpan."
        confirmLabel="Ya, logout"
        isConfirming={isSigningOut}
        onConfirm={confirmLogout}
        onOpenChange={setIsConfirmOpen}
      />
    </>
  );
}
