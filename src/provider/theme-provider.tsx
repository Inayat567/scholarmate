"use client";

import { ReactNode, useEffect } from "react";
import { useAppStore } from "@/store/store";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
