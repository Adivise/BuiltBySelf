"use client";

import { useEffect, useState } from "react";
import type { BannerDesign } from "../banner-design";

function loadImageFromDataUrl(url: string | null): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function useRuntimeImages(design: BannerDesign) {
  const [iconImage, setIconImage] = useState<HTMLImageElement | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadImageFromDataUrl(design.iconImageDataUrl).then((img) => {
      if (!cancelled) setIconImage(img);
    });
    return () => {
      cancelled = true;
    };
  }, [design.iconImageDataUrl]);

  useEffect(() => {
    let cancelled = false;
    loadImageFromDataUrl(design.bgImageDataUrl).then((img) => {
      if (!cancelled) setBgImage(img);
    });
    return () => {
      cancelled = true;
    };
  }, [design.bgImageDataUrl]);

  return { iconImage, bgImage };
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
