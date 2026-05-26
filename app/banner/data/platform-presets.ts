import type { Dimensions } from "../types";

export type PlatformPreset = {
  id: string;
  name: string;
  dimensions: Dimensions;
  safeMargin: number;
  fontScale?: { title: number; subtitle: number; icon: number; radius: number };
};

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: "web-hero",
    name: "Web hero (1054×312)",
    dimensions: { w: 1054, h: 312 },
    safeMargin: 48,
    fontScale: { title: 68, subtitle: 32, icon: 110, radius: 40 },
  },
  {
    id: "web-strip",
    name: "Web strip (1054×124)",
    dimensions: { w: 1054, h: 124 },
    safeMargin: 32,
    fontScale: { title: 52, subtitle: 24, icon: 80, radius: 25 },
  },
  {
    id: "google-display",
    name: "Google Display (512×124)",
    dimensions: { w: 512, h: 124 },
    safeMargin: 24,
    fontScale: { title: 36, subtitle: 18, icon: 64, radius: 20 },
  },
  {
    id: "facebook-cover",
    name: "Facebook cover (820×312)",
    dimensions: { w: 820, h: 312 },
    safeMargin: 40,
    fontScale: { title: 56, subtitle: 28, icon: 96, radius: 36 },
  },
  {
    id: "discord-banner",
    name: "Discord server (960×540)",
    dimensions: { w: 960, h: 540 },
    safeMargin: 56,
    fontScale: { title: 72, subtitle: 36, icon: 120, radius: 48 },
  },
  {
    id: "line-oa",
    name: "LINE OA rich (1040×585)",
    dimensions: { w: 1040, h: 585 },
    safeMargin: 48,
    fontScale: { title: 64, subtitle: 32, icon: 100, radius: 40 },
  },
  {
    id: "youtube-thumb",
    name: "YouTube thumb (1280×720)",
    dimensions: { w: 1280, h: 720 },
    safeMargin: 64,
    fontScale: { title: 88, subtitle: 40, icon: 140, radius: 48 },
  },
];
