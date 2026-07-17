"use client";

import { useEffect } from "react";

type IconProps = { className?: string };

export function ThemeToggle() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextTheme);
    window.localStorage.setItem("theme", nextTheme ? "dark" : "light");
  }

  return (
    <button
      type="button"
      aria-label="Ubah tema terang gelap"
      onClick={toggleTheme}
      className="focus-ring grid h-10 w-10 place-items-center rounded-full text-[#2e6b35] transition hover:bg-[#edf3eb] dark:text-[#a9d8aa] dark:hover:bg-white/10"
    >
      <SunIcon className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
    </button>
  );
}

function SunIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="4" className="fill-transparent dark:fill-current" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
