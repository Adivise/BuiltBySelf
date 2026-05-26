import { useEffect, useState } from "react";
import { googleFontCssUrl } from "../data/google-fonts";
import { PROMPT_FONT_LINK_ID, UPLOADED_FONT_FAMILY } from "../constants";
import type { FontFamilyKey } from "../types";

const loadedGoogle = new Set<string>();

async function ensureGoogleFont(family: string | null) {
  if (!family) return;
  const id = `google-font-${family.replace(/\s/g, "-")}`;
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleFontCssUrl(family);
    document.head.appendChild(link);
  }
  if (!loadedGoogle.has(family)) {
    await document.fonts.load(`700 32px "${family}"`);
    await document.fonts.load(`400 32px "${family}"`);
    loadedGoogle.add(family);
  }
}

export function useFontLoading(
  titleKey: FontFamilyKey,
  subtitleKey: FontFamilyKey,
  uploadedFontUrl: string | null,
  googleTitle: string | null,
  googleSubtitle: string | null,
  extraKeys: FontFamilyKey[] = [],
) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFonts = async () => {
      setFontsLoaded(false);
      try {
        if ([titleKey, subtitleKey, ...extraKeys].includes("prompt")) {
          if (!document.getElementById(PROMPT_FONT_LINK_ID)) {
            const link = document.createElement("link");
            link.id = PROMPT_FONT_LINK_ID;
            link.rel = "stylesheet";
            link.href =
              "https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700;900&display=swap";
            document.head.appendChild(link);
          }
          await document.fonts.load('900 48px "Prompt"');
        }
        if (titleKey === "google") await ensureGoogleFont(googleTitle);
        if (subtitleKey === "google") await ensureGoogleFont(googleSubtitle);
        if ([titleKey, subtitleKey, ...extraKeys].includes("custom-ttf") && uploadedFontUrl) {
          const face = new FontFace(UPLOADED_FONT_FAMILY, `url(${uploadedFontUrl})`);
          const loaded = await face.load();
          document.fonts.add(loaded);
        }
        await document.fonts.ready;
      } catch (err) {
        console.error("Failed to load font:", err);
      }
      if (!cancelled) setFontsLoaded(true);
    };

    loadFonts();
    return () => {
      cancelled = true;
    };
  }, [titleKey, subtitleKey, uploadedFontUrl, googleTitle, googleSubtitle, extraKeys]);

  return fontsLoaded;
}
