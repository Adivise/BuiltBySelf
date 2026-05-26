import { useMemo } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { UPLOADED_FONT_FAMILY } from "./constants";
import type { FontFamilyKey } from "./types";

export function resolveCanvasFontFamily(
  key: FontFamilyKey,
  uploadedFontUrl: string | null,
  googleFont: string | null,
): string {
  switch (key) {
    case "geist-mono":
      return `${GeistMono.style.fontFamily}, ui-monospace, monospace`;
    case "geist-pixel":
      return `${GeistPixelSquare.style.fontFamily}, ${GeistSans.style.fontFamily}, system-ui, sans-serif`;
    case "system":
      return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    case "serif":
      return "Georgia, 'Times New Roman', serif";
    case "mono":
      return "'SF Mono', Menlo, Monaco, Consolas, monospace";
    case "prompt":
      return "'Prompt', system-ui, sans-serif";
    case "google":
      return googleFont
        ? `"${googleFont}", ${GeistSans.style.fontFamily}, system-ui, sans-serif`
        : `${GeistSans.style.fontFamily}, system-ui, sans-serif`;
    case "custom-ttf":
      return uploadedFontUrl
        ? `'${UPLOADED_FONT_FAMILY}', system-ui, sans-serif`
        : `${GeistSans.style.fontFamily}, system-ui, sans-serif`;
    case "geist":
    default:
      return `${GeistSans.style.fontFamily}, system-ui, sans-serif`;
  }
}

export function useCanvasFontFamilies(
  titleKey: FontFamilyKey,
  subtitleKey: FontFamilyKey,
  uploadedFontUrl: string | null,
  googleTitle: string | null,
  googleSubtitle: string | null,
) {
  const title = useMemo(
    () => resolveCanvasFontFamily(titleKey, uploadedFontUrl, googleTitle),
    [titleKey, uploadedFontUrl, googleTitle],
  );
  const subtitle = useMemo(
    () => resolveCanvasFontFamily(subtitleKey, uploadedFontUrl, googleSubtitle),
    [subtitleKey, uploadedFontUrl, googleSubtitle],
  );
  return { title, subtitle };
}
