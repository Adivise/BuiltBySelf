import type {
  BgPatternSource,
  BorderStyle,
  Dimensions,
  ExportFormat,
  LayerId,
  Offset,
  TextAlign,
  TextTransform,
  FontFamilyKey,
} from "./types";

export const DESIGN_VERSION = 1;

/** Serializable design (images as data URLs). */
export type BannerDesign = {
  version: typeof DESIGN_VERSION;
  dimensions: Dimensions;
  customWidth: number;
  customHeight: number;
  exportScale: number;
  customExportScale: number;
  exportFormat: ExportFormat;
  exportQuality: number;
  transparentBg: boolean;
  filenamePattern: string;

  bannerBorderWidth: number;
  bannerBorderRadius: number;
  borderStyle: BorderStyle;
  borderColor: string;
  borderGradientEnd: string;

  bgType: "solid" | "gradient";
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  bgImageDataUrl: string | null;
  bgImageScale: number;
  bgImageOpacity: number;
  bgImageBlur: number;

  bgPatternSource: BgPatternSource;
  bgIconType: string;
  bgLucideIconName: string;
  bgIconCount: number;
  bgIconSize: number;
  patternOpacity: number;
  patternSeed: number;
  patternRotationLock: boolean;
  lucidePatternStrokeWidth: number;
  lucidePatternFilled: boolean;
  lucidePatternOpacity: number;
  starColor: string;

  title: string;
  subtitle: string;
  labelText: string;
  showLabel: boolean;
  titleFontSize: number;
  subtitleFontSize: number;
  labelFontSize: number;
  titleOffset: Offset;
  subtitleOffset: Offset;
  labelOffset: Offset;
  titleAlign: TextAlign;
  subtitleAlign: TextAlign;
  titleFontWeight: number;
  subtitleFontWeight: number;
  labelFontWeight: number;
  titleLineHeight: number;
  subtitleLineHeight: number;
  titleLetterSpacing: number;
  subtitleLetterSpacing: number;
  titleTextTransform: TextTransform;
  subtitleTextTransform: TextTransform;
  labelTextTransform: TextTransform;
  titleMaxWidth: number;
  titleColor: string;
  subtitleColor: string;
  labelColor: string;
  titleShadow: boolean;
  titleShadowBlur: number;
  titleShadowColor: string;
  subtitleShadow: boolean;
  subtitleShadowBlur: number;
  subtitleShadowColor: string;
  titleStroke: boolean;
  titleStrokeWidth: number;
  titleStrokeColor: string;
  subtitleStroke: boolean;
  subtitleStrokeWidth: number;
  subtitleStrokeColor: string;

  fontFamilyKey: FontFamilyKey;
  subtitleFontFamilyKey: FontFamilyKey;
  labelFontFamilyKey: FontFamilyKey;
  ctaFontFamilyKey: FontFamilyKey;
  badgeFontFamilyKey: FontFamilyKey;
  googleFontFamily: string | null;
  googleFontSubtitleFamily: string | null;

  showCenterIcon: boolean;
  centerIconSize: number;
  centerIconPadding: number;
  centerIconRadius: number;
  iconBgColor: string;
  iconImageDataUrl: string | null;

  showCta: boolean;
  ctaText: string;
  ctaBgColor: string;
  ctaTextColor: string;
  ctaOffset: Offset;
  ctaRadius: number;
  ctaFontSize: number;

  showQr: boolean;
  qrUrl: string;
  qrOffset: Offset;
  qrSize: number;
  qrBgColor: string;
  qrPadding: number;
  qrRadius: number;

  showBadge: boolean;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  badgeOffset: Offset;
  badgeFontSize: number;
  badgeRadius: number;
  badgeRotation: number;

  layerVisibility: Record<LayerId, boolean>;
  layerOrder: LayerId[];

  showSafeArea: boolean;
  previewZoom: number;
  darkUi: boolean;
  animationEnabled: boolean;
  animationFrames: number;

  brandPrimary: string;
  brandSecondary: string;
  brandFontTitle: FontFamilyKey;
  brandFontSubtitle: FontFamilyKey;
};

export const DEFAULT_LAYER_ORDER: LayerId[] = [
  "background",
  "bgImage",
  "pattern",
  "centerIcon",
  "label",
  "title",
  "subtitle",
  "cta",
  "qr",
  "badge",
  "border",
];

export function createDefaultDesign(): BannerDesign {
  const layerVisibility = Object.fromEntries(
    DEFAULT_LAYER_ORDER.map((id) => [id, true]),
  ) as Record<LayerId, boolean>;

  return {
    version: DESIGN_VERSION,
    dimensions: { w: 1054, h: 312 },
    customWidth: 1054,
    customHeight: 312,
    exportScale: 2,
    customExportScale: 2,
    exportFormat: "png",
    exportQuality: 1,
    transparentBg: false,
    filenamePattern: "banner-{width}x{height}",

    bannerBorderWidth: 15,
    bannerBorderRadius: 30,
    borderStyle: "solid",
    borderColor: "#e6e6e6",
    borderGradientEnd: "#7c3aed",

    bgType: "gradient",
    bgColor: "#ffffff",
    gradientStart: "#ffffff",
    gradientEnd: "#e5f7ff",
    gradientAngle: 135,
    bgImageDataUrl: null,
    bgImageScale: 1,
    bgImageOpacity: 0.35,
    bgImageBlur: 0,

    bgPatternSource: "lucide",
    bgIconType: "sparkle",
    bgLucideIconName: "Sparkles",
    bgIconCount: 6,
    bgIconSize: 72,
    patternOpacity: 1,
    patternSeed: 79273,
    patternRotationLock: false,
    lucidePatternStrokeWidth: 2,
    lucidePatternFilled: false,
    lucidePatternOpacity: 1,
    starColor: "#d7f2fe",

    title: "BuiltBySelf",
    subtitle: "The free tool for making banners.",

    labelText: "NEW",
    showLabel: false,
    titleFontSize: 68,
    subtitleFontSize: 32,
    labelFontSize: 18,
    titleOffset: { x: -1, y: -12 },
    subtitleOffset: { x: 0, y: 0 },
    labelOffset: { x: 0, y: -80 },
    titleAlign: "center",
    subtitleAlign: "center",
    titleFontWeight: 900,
    subtitleFontWeight: 500,
    labelFontWeight: 700,
    titleLineHeight: 1.2,
    subtitleLineHeight: 1.7,
    titleLetterSpacing: 10,
    subtitleLetterSpacing: 5,
    titleTextTransform: "none",
    subtitleTextTransform: "none",
    labelTextTransform: "none",
    titleMaxWidth: 0,
    titleColor: "#ffffff",
    subtitleColor: "#475569",
    labelColor: "#ffffff",
    titleShadow: true,
    titleShadowBlur: 8,
    titleShadowColor: "rgba(0,0,0,0.35)",
    subtitleShadow: true,
    subtitleShadowBlur: 6,
    subtitleShadowColor: "rgba(0,0,0,0.3)",
    titleStroke: false,
    titleStrokeWidth: 2,
    titleStrokeColor: "#ffffff",
    subtitleStroke: true,
    subtitleStrokeWidth: 1,
    subtitleStrokeColor: "#ffffff",

    fontFamilyKey: "geist-pixel",
    subtitleFontFamilyKey: "geist-pixel",
    labelFontFamilyKey: "prompt",
    ctaFontFamilyKey: "prompt",
    badgeFontFamilyKey: "prompt",
    googleFontFamily: null,
    googleFontSubtitleFamily: null,

    showCenterIcon: true,
    centerIconSize: 134,
    centerIconPadding: 12,
    centerIconRadius: 20,
    iconBgColor: "#3b82f6",
    iconImageDataUrl: null,

    showCta: true,
    ctaText: "Shop now",
    ctaBgColor: "#475569",
    ctaTextColor: "#ffffff",
    ctaOffset: { x: 0, y: 90 },
    ctaRadius: 12,
    ctaFontSize: 22,

    showQr: false,
    qrUrl: "https://example.com",
    qrOffset: { x: 120, y: -100 },
    qrSize: 72,
    qrBgColor: "#ffffff",
    qrPadding: 4,
    qrRadius: 8,

    showBadge: true,
    badgeText: "-50%",
    badgeBgColor: "#475569",
    badgeTextColor: "#ffffff",
    badgeOffset: { x: -200, y: -110 },
    badgeFontSize: 20,
    badgeRadius: 6,
    badgeRotation: -7,

    layerVisibility,
    layerOrder: [...DEFAULT_LAYER_ORDER],

    showSafeArea: false,
    previewZoom: 100,
    darkUi: false,
    animationEnabled: false,
    animationFrames: 10,

    brandPrimary: "#2563eb",
    brandSecondary: "#1e3a8a",
    brandFontTitle: "geist",
    brandFontSubtitle: "geist",
  };
}

export function cloneDesign(d: BannerDesign): BannerDesign {
  return JSON.parse(JSON.stringify(d)) as BannerDesign;
}

const NUMERIC_KEYS: (keyof BannerDesign)[] = [
  "customWidth",
  "customHeight",
  "exportScale",
  "customExportScale",
  "exportQuality",
  "bannerBorderWidth",
  "bannerBorderRadius",
  "gradientAngle",
  "bgImageScale",
  "bgImageOpacity",
  "bgImageBlur",
  "bgIconCount",
  "bgIconSize",
  "patternOpacity",
  "patternSeed",
  "lucidePatternStrokeWidth",
  "lucidePatternOpacity",
  "titleFontSize",
  "subtitleFontSize",
  "labelFontSize",
  "titleFontWeight",
  "subtitleFontWeight",
  "labelFontWeight",
  "titleLineHeight",
  "subtitleLineHeight",
  "titleLetterSpacing",
  "subtitleLetterSpacing",
  "titleMaxWidth",
  "titleShadowBlur",
  "subtitleShadowBlur",
  "titleStrokeWidth",
  "subtitleStrokeWidth",
  "centerIconSize",
  "centerIconPadding",
  "centerIconRadius",
  "ctaRadius",
  "ctaFontSize",
  "qrSize",
  "qrPadding",
  "qrRadius",
  "badgeFontSize",
  "badgeRadius",
  "badgeRotation",
  "previewZoom",
  "animationFrames",
];

const OFFSET_KEYS = [
  "titleOffset",
  "subtitleOffset",
  "labelOffset",
  "ctaOffset",
  "qrOffset",
  "badgeOffset",
] as const;

/** Replace NaN / non-finite numbers (e.g. cleared number inputs) with defaults. */
export function sanitizeDesign(d: BannerDesign): BannerDesign {
  const defaults = createDefaultDesign();
  const n = (value: number, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

  const out: BannerDesign = { ...d };

  for (const key of NUMERIC_KEYS) {
    const value = out[key];
    if (typeof value === "number") {
      (out as Record<keyof BannerDesign, unknown>)[key] = n(
        value,
        defaults[key] as number,
      );
    }
  }

  out.dimensions = {
    w: n(out.dimensions?.w, defaults.dimensions.w),
    h: n(out.dimensions?.h, defaults.dimensions.h),
  };

  for (const key of OFFSET_KEYS) {
    const o = out[key];
    out[key] = {
      x: n(o?.x, 0),
      y: n(o?.y, 0),
    };
  }

  return out;
}

export function mergeDesign(
  base: BannerDesign,
  partial: Partial<BannerDesign>,
): BannerDesign {
  return sanitizeDesign({ ...base, ...partial });
}
