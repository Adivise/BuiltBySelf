import type { BannerDesign } from "./banner-design";
import { DESIGN_VERSION, cloneDesign, createDefaultDesign, mergeDesign } from "./banner-design";

const STORAGE_KEY = "banner-builders-design-v2";
const HISTORY_KEY = "banner-builders-version-history";
const BRAND_KEY = "banner-builders-brand-kit";
const SHARED_KEY = "banner-builders-shared-designs";
const MAX_HISTORY = 30;

function generateShareToken(): string {
  return `${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`.slice(0, 14);
}

function loadSharedDesignMap(): Record<string, BannerDesign> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SHARED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, BannerDesign>) : {};
  } catch {
    return {};
  }
}

function saveSharedDesignMap(map: Record<string, BannerDesign>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHARED_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function saveSharedDesign(design: BannerDesign): string {
  if (typeof window === "undefined") return "";
  const map = loadSharedDesignMap();
  let token = generateShareToken();
  while (token in map) {
    token = generateShareToken();
  }
  map[token] = design;
  saveSharedDesignMap(map);
  return token;
}

function loadSharedDesign(token: string): BannerDesign | null {
  if (typeof window === "undefined") return null;
  const map = loadSharedDesignMap();
  const stored = map[token];
  return stored ? mergeDesign(createDefaultDesign(), stored) : null;
}

export type VersionSnapshot = {
  id: string;
  label: string;
  savedAt: number;
  design: BannerDesign;
};

export type BrandKit = {
  brandPrimary: string;
  brandSecondary: string;
  brandFontTitle: BannerDesign["fontFamilyKey"];
  brandFontSubtitle: BannerDesign["fontFamilyKey"];
};

export function designToJson(design: BannerDesign): string {
  return JSON.stringify(design, null, 2);
}

export function designFromJson(json: string): BannerDesign | null {
  try {
    const parsed = JSON.parse(json) as Partial<BannerDesign>;
    return mergeDesign(createDefaultDesign(), parsed);
  } catch {
    return null;
  }
}

export function saveDesignLocal(design: BannerDesign): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, designToJson(design));
}

export function loadDesignLocal(): BannerDesign | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return designFromJson(raw);
}

export function saveVersionSnapshot(design: BannerDesign, label?: string): VersionSnapshot[] {
  const list = loadVersionHistory();
  const snap: VersionSnapshot = {
    id: `${Date.now()}`,
    label: label ?? new Date().toLocaleString(),
    savedAt: Date.now(),
    design: cloneDesign(design),
  };
  const next = [snap, ...list].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function loadVersionHistory(): VersionSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VersionSnapshot[];
  } catch {
    return [];
  }
}

export function saveBrandKit(kit: BrandKit): void {
  localStorage.setItem(BRAND_KEY, JSON.stringify(kit));
}

export function loadBrandKit(): BrandKit | null {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BrandKit;
  } catch {
    return null;
  }
}

/** Compress design into URL hash for sharing (#48 lite + #42). */
function encodeBase64(value: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(encodeURIComponent(value));
  }
  return Buffer.from(value, "utf-8").toString("base64");
}

export function encodeDesignToShareUrl(design: BannerDesign): string {
  const token = saveSharedDesign(design);
  if (token) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${window.location.pathname}${window.location.search}#s=${token}`;
    }
    return `#s=${token}`;
  }

  const payload = { v: DESIGN_VERSION, d: design };
  const json = JSON.stringify(payload);
  const b64 = encodeBase64(json);
  return `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}#d=${b64}`;
}

export function decodeDesignFromHash(hash: string): BannerDesign | null {
  const short = hash.match(/#s=([A-Za-z0-9_-]{1,15})/);
  if (short?.[1]) {
    const loaded = loadSharedDesign(short[1]);
    if (loaded) return loaded;
  }

  const m = hash.match(/#d=([^&]+)/);
  if (!m) return null;
  try {
    const json = decodeURIComponent(atob(m[1]));
    const payload = JSON.parse(json) as { v: number; d: Partial<BannerDesign> };
    return mergeDesign(createDefaultDesign(), payload.d);
  } catch {
    return null;
  }
}

export function resolveFilename(pattern: string, design: BannerDesign, scale: number): string {
  const w = design.dimensions.w * scale;
  const h = design.dimensions.h * scale;
  const slug = design.title
    .slice(0, 32)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "banner";
  return pattern
    .replace(/\{title\}/gi, slug)
    .replace(/\{width\}/gi, String(w))
    .replace(/\{height\}/gi, String(h))
    .replace(/\{scale\}/gi, String(scale));
}
