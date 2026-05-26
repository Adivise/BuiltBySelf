import React, { useMemo } from "react";
import * as Lucide from "lucide-react";

export const isRenderableReactComponent = (
  value: unknown,
): value is React.ElementType => {
  return (
    typeof value === "function" ||
    (typeof value === "object" &&
      value !== null &&
      "$$typeof" in (value as object) &&
      typeof (value as { render?: unknown }).render === "function")
  );
};

export const renderLucideIcon = (name: string, size: number) => {
  const Icon = (Lucide as Record<string, unknown>)[name];
  const Fallback = (Lucide as Record<string, unknown>).Sparkles;
  const Component = isRenderableReactComponent(Icon) ? Icon : Fallback;
  return React.createElement(Component as React.ElementType, { size });
};

export function useLucideIconNames() {
  return useMemo(() => {
    const names = Object.keys(Lucide).filter((key) => {
      if (key.endsWith("Icon")) return false;
      const value = (Lucide as Record<string, unknown>)[key];
      return (
        value &&
        typeof value === "object" &&
        typeof (value as { render?: unknown }).render === "function" &&
        String((value as { $$typeof?: unknown }).$$typeof || "").includes(
          "react.forward_ref",
        )
      );
    });
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, []);
}

export function useFilteredLucideIconNames(
  lucideIconNames: string[],
  search: string,
) {
  return useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lucideIconNames.slice(0, 420);
    return lucideIconNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 700);
  }, [search, lucideIconNames]);
}
