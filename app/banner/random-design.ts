import { createDefaultDesign, mergeDesign, type BannerDesign } from "./banner-design";
import { BG_GEOMETRIC_SHAPES } from "./constants";
import { COLOR_THEMES } from "./data/color-themes";
import { PLATFORM_PRESETS } from "./data/platform-presets";
import { BANNER_TEMPLATES } from "./data/templates";
import type { FontFamilyKey } from "./types";

const TITLES = [
  "Launch Week",
  "Fresh Drops",
  "Build Better",
  "Mega Sale",
  "New Season",
  "Create More",
  "Ready To Grow",
  "Limited Offer",
];

const SUBTITLES = [
  "A cleaner way to stand out",
  "Designed for your next campaign",
  "Make the first impression count",
  "Fast, focused, and ready to share",
  "Turn ideas into polished visuals",
  "Only for a short time",
];

const LABELS = ["NEW", "HOT", "2026", "LIVE", "PRO", "WOW"];
const BADGES = ["-50%", "SALE", "NEW", "VIP", "TOP"];
const CTAS = ["Shop now", "Learn more", "Start today", "Join now", "Get access"];
const LUCIDE_ICONS = ["Sparkles", "Zap", "Star", "Sun", "Rocket", "Crown", "Gem", "BadgeCheck"];
const FONT_KEYS: FontFamilyKey[] = ["prompt", "geist", "geist-mono", "geist-pixel", "system", "serif", "mono"];

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
const int = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const chance = (value: number) => Math.random() < value;

export function createRandomDesign(): BannerDesign {
  const base = createDefaultDesign();
  const template = pick(BANNER_TEMPLATES);
  const theme = pick(COLOR_THEMES);
  const preset = pick(PLATFORM_PRESETS);
  const font = pick(FONT_KEYS);
  const subFont = chance(0.65) ? font : pick(FONT_KEYS);
  const useLucide = chance(0.5);
  const fontScale = preset.fontScale;

  return mergeDesign(base, {
    ...template.design,
    ...theme.patch,
    dimensions: preset.dimensions,
    customWidth: preset.dimensions.w,
    customHeight: preset.dimensions.h,
    title: pick(TITLES),
    subtitle: pick(SUBTITLES),
    bgType: chance(0.7) ? "gradient" : "solid",
    gradientAngle: int(45, 315),
    bannerBorderWidth: int(0, 18),
    bannerBorderRadius: fontScale?.radius ?? int(16, 48),
    bgPatternSource: useLucide ? "lucide" : "geometric",
    bgIconType: pick(BG_GEOMETRIC_SHAPES).id,
    bgLucideIconName: pick(LUCIDE_ICONS),
    bgIconCount: int(3, 16),
    bgIconSize: int(20, 72),
    patternOpacity: Number((0.35 + Math.random() * 0.65).toFixed(2)),
    patternSeed: int(1, 100000),
    patternRotationLock: chance(0.35),
    lucidePatternStrokeWidth: int(2, 8),
    lucidePatternFilled: chance(0.35),
    titleFontSize: fontScale?.title ?? int(42, 86),
    subtitleFontSize: fontScale?.subtitle ?? int(20, 38),
    titleFontWeight: pick([700, 800, 900]),
    subtitleFontWeight: pick([400, 500, 600]),
    titleTextTransform: chance(0.35) ? "uppercase" : "none",
    subtitleTextTransform: "none",
    fontFamilyKey: font,
    subtitleFontFamilyKey: subFont,
    showCenterIcon: chance(0.45),
    centerIconSize: fontScale?.icon ?? int(64, 128),
    centerIconRadius: int(12, 36),
    showLabel: chance(0.35),
    labelText: pick(LABELS),
    labelFontFamilyKey: font,
    labelOffset: { x: int(-80, 80), y: int(-120, -55) },
    showCta: chance(0.45),
    ctaText: pick(CTAS),
    ctaFontFamilyKey: font,
    ctaOffset: { x: int(-120, 120), y: int(70, 150) },
    ctaRadius: int(8, 24),
    showQr: chance(0.22),
    qrOffset: { x: int(150, 330), y: int(-145, 115) },
    qrSize: int(64, 110),
    showBadge: chance(0.35),
    badgeText: pick(BADGES),
    badgeFontFamilyKey: font,
    badgeOffset: { x: int(-280, -120), y: int(-145, -65) },
    badgeFontSize: int(16, 30),
    badgeRadius: int(4, 18),
    badgeRotation: int(-16, 16),
  });
}
