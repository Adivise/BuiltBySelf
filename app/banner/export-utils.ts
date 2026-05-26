import JSZip from "jszip";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type { BannerDesign } from "./banner-design";
import { drawBanner, type DrawBannerRuntime } from "./draw-banner";
import { resolveFilename } from "./design-persistence";
import type { Dimensions } from "./types";

export type ExportOptions = {
  format: BannerDesign["exportFormat"];
  scale: number;
  quality: number;
  transparentBg: boolean;
  filenamePattern: string;
};

function renderToCanvas(
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  scale: number,
  frameIndex?: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  drawBanner(canvas, design, runtime, { exportScale: scale, frameIndex });
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportOptions["format"],
  quality: number,
): Promise<Blob | null> {
  const mime =
    format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, quality);
  });
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: ExportOptions["format"],
  quality: number,
): Promise<void> {
  const blob = await canvasToBlob(canvas, format, quality);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${filename}.${format === "jpeg" ? "jpg" : format}`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportDesign(
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  options: ExportOptions,
): Promise<void> {
  const canvas = renderToCanvas(design, runtime, options.scale);
  const name = resolveFilename(options.filenamePattern, design, options.scale);
  await downloadCanvas(canvas, name, options.format, options.quality);
}

export async function copyCanvasToClipboard(
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  scale: number,
): Promise<boolean> {
  const canvas = renderToCanvas(design, runtime, scale);
  const blob = await canvasToBlob(canvas, "png", 1);
  if (!blob || !navigator.clipboard?.write) return false;
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function exportMultiSizeZip(
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  sizes: Dimensions[],
  options: ExportOptions,
): Promise<void> {
  const zip = new JSZip();
  for (const dim of sizes) {
    const d = { ...design, dimensions: dim };
    const canvas = renderToCanvas(d, runtime, options.scale);
    const blob = await canvasToBlob(canvas, options.format, options.quality);
    if (!blob) continue;
    const name = resolveFilename(
      options.filenamePattern,
      d,
      options.scale,
    );
    zip.file(`${name}.${options.format === "jpeg" ? "jpg" : options.format}`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.download = "banners.zip";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportAnimatedGif(
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  scale: number,
): Promise<void> {
  const frames = Math.max(4, Math.min(24, design.animationFrames));
  const gif = GIFEncoder();
  const w = design.dimensions.w * scale;
  const h = design.dimensions.h * scale;

  for (let i = 0; i < frames; i++) {
    const canvas = renderToCanvas(design, runtime, scale, i);
    const ctx = canvas.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, w, h);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, w, h, {
      palette,
      delay: 100,
      dispose: 2,
    });
  }
  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = resolveFilename(design.filenamePattern, design, scale) + ".gif";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportBatchDesignsZip(
  designs: { name: string; design: BannerDesign }[],
  runtime: DrawBannerRuntime,
  options: ExportOptions,
): Promise<void> {
  const zip = new JSZip();
  for (const { name, design } of designs) {
    const canvas = renderToCanvas(design, runtime, options.scale);
    const blob = await canvasToBlob(canvas, options.format, options.quality);
    if (blob) zip.file(`${name}.${options.format === "jpeg" ? "jpg" : options.format}`, blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.download = "banner-batch.zip";
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
