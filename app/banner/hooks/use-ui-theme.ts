"use client";

import { useCallback, useEffect, useState } from "react";

export type UiTheme = "light" | "dark";

const STORAGE_KEY = "banner-builders-ui-theme";

function readStoredTheme(): UiTheme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function readThemeFromDocument(): UiTheme {
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (fromDom === "dark" || fromDom === "light") return fromDom;
  return readStoredTheme();
}

function applyThemeToDocument(theme: UiTheme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useUiTheme() {
  /** Always "light" on server + first client render to match SSR (see layout blocking script). */
  const [theme, setThemeState] = useState<UiTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readThemeFromDocument();
    setThemeState(initial);
    applyThemeToDocument(initial);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: UiTheme) => {
    setThemeState(next);
    applyThemeToDocument(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyThemeToDocument(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    ready,
    setTheme,
    toggleTheme,
  };
}
