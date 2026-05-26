import { useEffect, useRef, useState, type RefObject } from "react";
import type { BgPatternSource } from "../types";

export function useLucidePatternImage(
  bgPatternSource: BgPatternSource,
  bgLucideIconName: string,
  starColor: string,
  lucidePatternSvgRef: RefObject<SVGSVGElement | null>,
  lucidePatternStrokeWidth?: number,
  lucidePatternFilled?: boolean,
) {
  const lucideSvgImageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [lucidePatternImg, setLucidePatternImg] = useState<HTMLImageElement | null>(null);
  const [lucideRasterVersion, setLucideRasterVersion] = useState(0);

  useEffect(() => {
    if (bgPatternSource !== "lucide") return;
    const svg = lucidePatternSvgRef.current;
    if (!svg) return;

    const key = `${bgLucideIconName}@@${starColor}@@sw${lucidePatternStrokeWidth}@@f${lucidePatternFilled}`;
    const cache = lucideSvgImageCacheRef.current;
    const existing = cache.get(key);
    if (existing) {
      setLucidePatternImg(existing);
      return;
    }

    const svgMarkup = svg.outerHTML;
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
    const img = new Image();
    img.onload = () => {
      setLucidePatternImg(img);
      setLucideRasterVersion((v) => v + 1);
    };
    img.src = url;
    cache.set(key, img);
  }, [bgLucideIconName, bgPatternSource, starColor, lucidePatternStrokeWidth, lucidePatternFilled, lucidePatternSvgRef]);

  return { lucidePatternImg, lucideRasterVersion };
}
