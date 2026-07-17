import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "./sign-in-form";

export default function AdminSignInPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] px-6 py-10 text-[#141d13]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-lg border border-[#d5ddd1] bg-white shadow-xl shadow-[#2e6b35]/10 md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden min-h-[560px] bg-[#1e321f] md:block">
            <Image
              src="/images/hero.jpg"
              alt="Pemandangan desa"
              fill
              priority
              className="object-cover opacity-65"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102111] via-[#102111]/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Logo />
              <p className="mt-8 text-3xl font-black leading-tight">
                Panel pengelolaan katalog potensi desa.
              </p>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10">
            <div className="md:hidden">
              <Logo dark />
            </div>
            <p className="mt-8 text-sm font-black uppercase text-[#2e6b35] md:mt-0">
              Sign In Admin
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight">
              Masuk ke Dashboard
            </h1>
            <p className="mt-4 text-base font-medium leading-7 text-[#536052]">
              Pilih dashboard sesuai desa untuk mengelola katalog potensi.
            </p>

            <SignInForm />

            <Link
              href="/"
              className="mt-8 inline-flex text-sm font-black text-[#2e6b35] transition hover:underline"
            >
              Kembali ke website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/images/kabupaten.png"
        alt="Logo Kabupaten Magelang"
        width={42}
        height={56}
        className="h-14 w-auto"
      />
      <div className="leading-none">
        <p
          className={`text-2xl font-black ${dark ? "text-[#2e6b35]" : "text-white"}`}
        >
          Mangli
          <br />
          Munggangsari
        </p>
        <p className="mt-1 text-[13px] font-black text-[#ef8b00]">
          Katalog Potensi Desa
        </p>
      </div>
    </Link>
  );
}
