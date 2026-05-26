import type { BannerDesign } from "../banner-design";

export type ColorTheme = {
  id: string;
  name: string;
  patch: Partial<BannerDesign>;
};

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "blue-corporate",
    name: "Blue corporate",
    patch: {
      bgColor: "#ffffff",
      gradientStart: "#eff6ff",
      gradientEnd: "#dbeafe",
      borderColor: "#2563eb",
      titleColor: "#1e3a8a",
      subtitleColor: "#475569",
      starColor: "#bfdbfe",
      iconBgColor: "#3b82f6",
      ctaBgColor: "#2563eb",
    },
  },
  {
    id: "pink-promo",
    name: "Pink promo",
    patch: {
      bgColor: "#fff1f2",
      gradientStart: "#ffe4e6",
      gradientEnd: "#fecdd3",
      borderColor: "#e11d48",
      titleColor: "#9f1239",
      subtitleColor: "#be123c",
      starColor: "#fda4af",
      iconBgColor: "#f43f5e",
      badgeBgColor: "#e11d48",
      ctaBgColor: "#e11d48",
    },
  },
  {
    id: "dark-neon",
    name: "Dark neon",
    patch: {
      bgType: "gradient",
      bgColor: "#0f172a",
      gradientStart: "#0f172a",
      gradientEnd: "#1e293b",
      borderColor: "#22d3ee",
      titleColor: "#f8fafc",
      subtitleColor: "#94a3b8",
      starColor: "#22d3ee",
      iconBgColor: "#0891b2",
      ctaBgColor: "#06b6d4",
    },
  },
  {
    id: "forest",
    name: "Forest green",
    patch: {
      bgColor: "#f0fdf4",
      gradientStart: "#dcfce7",
      gradientEnd: "#bbf7d0",
      borderColor: "#16a34a",
      titleColor: "#14532d",
      subtitleColor: "#166534",
      starColor: "#86efac",
      iconBgColor: "#22c55e",
      ctaBgColor: "#16a34a",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    patch: {
      bgType: "gradient",
      gradientStart: "#fff7ed",
      gradientEnd: "#fed7aa",
      borderColor: "#ea580c",
      titleColor: "#9a3412",
      subtitleColor: "#c2410c",
      starColor: "#fdba74",
      iconBgColor: "#f97316",
      ctaBgColor: "#ea580c",
    },
  },
];
