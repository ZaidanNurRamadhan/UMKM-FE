"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { focusFirstFieldError } from "@/lib/errors/validation-error";
import { signInAdmin } from "@/services/auth.service";
import { getCurrentProfile } from "@/services/profile.service";
import type { LoginFormValues } from "@/validations/auth.schema";
import { loginFormSchema } from "@/validations/auth.schema";

function errorId(name: string): string {
  return `${name}-error`;
}

function inputClass(hasError: boolean): string {
  return `mt-2 h-12 w-full rounded-lg border px-4 text-sm font-semibold outline-none transition focus:border-[#2e6b35] focus:ring-4 focus:ring-[#2e6b35]/10 ${
    hasError ? "border-[#b32323]" : "border-[#d5ddd1]"
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <span id={id} className="mt-2 block text-xs font-bold text-[#b32323]">
      {message}
    </span>
  );
}

export function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const result = await signInAdmin(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    const profileResult = await getCurrentProfile();

    if (!profileResult.success) {
      toast.error(profileResult.message);
      return;
    }

    toast.success(result.message);
    const { profile, village } = profileResult.data;

    router.push(
      profile.role === "admin" && village ? `/admin/${village.slug}` : "/",
    );
    router.refresh();
  }

  function onInvalid(fieldErrors: FieldErrors<LoginFormValues>) {
    focusFirstFieldError(fieldErrors, setFocus);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-black text-[#2e6b35]">Email</span>
          <input
            type="email"
            placeholder="admin@desa.id"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={inputClass(Boolean(errors.email))}
            {...register("email")}
          />
          <FieldError id={errorId("email")} message={errors.email?.message} />
        </label>
        <label className="block">
          <span className="text-sm font-black text-[#2e6b35]">Password</span>
          <input
            type="password"
            placeholder="Masukkan password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? errorId("password") : undefined
            }
            className={inputClass(Boolean(errors.password))}
            {...register("password")}
          />
          <FieldError
            id={errorId("password")}
            message={errors.password?.message}
          />
        </label>
      </div>

      <div className="mt-8 grid gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 items-center justify-center rounded-lg bg-[#2e6b35] px-5 text-sm font-black text-white transition hover:bg-[#25572b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Login..." : "Login"}
        </button>
      </div>
    </form>
  );
}
