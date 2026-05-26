import { useEffect, type RefObject } from "react";
import type { BannerDesign } from "../banner-design";
import { drawBanner, type DrawBannerRuntime } from "../draw-banner";

export function useBannerCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  fontsLoaded: boolean,
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  lucideRasterVersion: number,
) {
  useEffect(() => {
    if (!fontsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBanner(canvas, design, runtime, { exportScale: 1, frameIndex: 0 });
  }, [fontsLoaded, canvasRef, design, runtime, lucideRasterVersion]);
}
