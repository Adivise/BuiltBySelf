import type { BannerDesign } from "../banner-design";
import { createDefaultDesign } from "../banner-design";

export type BannerTemplate = {
  id: string;
  name: string;
  description: string;
  design: Partial<BannerDesign>;
};

export const BANNER_TEMPLATES: BannerTemplate[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean white with subtle pattern",
    design: {
      title: "Your headline",
      subtitle: "Short supporting line",
      bgIconCount: 4,
      bgIconSize: 28,
      patternOpacity: 0.5,
      showCenterIcon: false,
      bannerBorderWidth: 8,
      borderColor: "#e2e8f0",
      titleColor: "#0f172a",
      subtitleColor: "#64748b",
      starColor: "#cbd5e1",
    },
  },
  {
    id: "sale",
    name: "Flash sale",
    description: "Bold promo with badge",
    design: {
      title: "MEGA SALE",
      subtitle: "Limited time only",
      showBadge: true,
      badgeText: "-50%",
      showCta: true,
      ctaText: "Shop now",
      bgType: "gradient",
      gradientStart: "#fef2f2",
      gradientEnd: "#fecaca",
      borderColor: "#dc2626",
      titleColor: "#991b1b",
      badgeBgColor: "#dc2626",
      ctaBgColor: "#dc2626",
      bgIconCount: 10,
      starColor: "#fca5a5",
    },
  },
  {
    id: "event",
    name: "Event",
    description: "Centered icon + label",
    design: {
      title: "Summer Festival",
      subtitle: "June 15–17 · Bangkok",
      showLabel: true,
      labelText: "2026",
      showCenterIcon: true,
      bgPatternSource: "lucide",
      bgLucideIconName: "Sun",
      bgIconCount: 8,
      gradientStart: "#fffbeb",
      gradientEnd: "#fde68a",
      borderColor: "#d97706",
      titleColor: "#92400e",
    },
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Dark neon style",
    design: {
      title: "NEW SEASON",
      subtitle: "Play now",
      bgType: "gradient",
      bgColor: "#0f172a",
      gradientStart: "#0f172a",
      gradientEnd: "#312e81",
      borderColor: "#22d3ee",
      titleColor: "#e0f2fe",
      subtitleColor: "#67e8f9",
      starColor: "#22d3ee",
      iconBgColor: "#6366f1",
      bgPatternSource: "lucide",
      bgLucideIconName: "Zap",
      bgIconCount: 12,
      titleShadow: true,
      titleShadowColor: "rgba(34,211,238,0.6)",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional blue",
    design: {
      title: "Enterprise Solutions",
      subtitle: "Trusted by 10,000+ teams",
      showCenterIcon: true,
      centerIconSize: 90,
      borderColor: "#1d4ed8",
      titleColor: "#1e3a8a",
      bgIconCount: 5,
      bgIconType: "circle",
      showCta: true,
      ctaText: "Contact us",
    },
  },
];

export function applyTemplate(templateId: string): BannerDesign {
  const base = createDefaultDesign();
  const t = BANNER_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return base;
  return { ...base, ...t.design, version: 1 };
}
