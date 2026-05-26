import { useMemo } from "react";
import type { BgPosition, Dimensions } from "../types";

export function useBgPositions(
  bgIconCount: number,
  dimensions: Dimensions,
  title: string,
  subtitle: string,
) {
  return useMemo(() => {
    const pos: BgPosition[] = [];
    const cols = bgIconCount;
    if (cols > 0) {
      const segmentWidth = dimensions.w / cols;
      for (let i = 0; i < cols; i++) {
        const minX = i * segmentWidth;
        const x = minX + 30 + Math.random() * (segmentWidth - 60);
        const y = 40 + Math.random() * (dimensions.h - 80);
        pos.push({
          x,
          y,
          scale: 0.6 + Math.random() * 0.6,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }
    return pos;
  }, [bgIconCount, dimensions, title, subtitle]);
}
