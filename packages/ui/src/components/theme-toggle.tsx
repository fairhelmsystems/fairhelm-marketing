"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@fairhelm/ui/lib/utils";

const storageKey = "fairhelm-marketing-theme";

type Theme = "light" | "dark";

/**
 * Icon-only theme toggle. By default it floats at the bottom-right of every
 * page (mounted once in the root layout). `inline` renders it in flow, for
 * the mobile menu, so phones do not carry a floating button over the copy.
 */
export function ThemeToggle({
  className,
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(nextTheme);
    setMounted(true);
  }, []);

  const updateTheme = (nextTheme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={
        mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Toggle theme"
      }
      onClick={() => updateTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border transition-[background-color,transform] duration-150",
        inline ? "relative" : "fixed bottom-5 right-5 z-50 shadow-(--shadow-2)",
        "border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]",
        "hover:bg-[color:var(--surface)] active:scale-95",
        className
      )}
    >
      <span className="relative flex size-4.5 items-center justify-center">
        <SunMedium
          className={cn(
            "absolute size-4.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            mounted && theme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <MoonStar
          className={cn(
            "absolute size-4.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            mounted && theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </span>
    </button>
  );
}
