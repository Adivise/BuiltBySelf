"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { PLATFORM_PRESETS } from "../data/platform-presets";
import type { DrawBannerRuntime } from "../draw-banner";
import {
  copyCanvasToClipboard,
  exportAnimatedGif,
  exportBatchDesignsZip,
  exportDesign,
  exportMultiSizeZip,
} from "../export-utils";
import type { ExportFormat } from "../types";
import { SurfaceCard } from "./ui/SurfaceCard";
import {
  btnClass,
  btnPrimaryClass,
  checkRowClass,
  fieldClass,
  headingStyle,
  labelClass,
  labelMutedStyle,
  rangeClass,
  selectClass,
  valueLabelClass,
} from "./ui/field-styles";

type Props = {
  design: BannerDesign;
  runtime: DrawBannerRuntime;
  savedDesigns: { id: string; name: string; design: BannerDesign }[];
  onPatch: (p: Partial<BannerDesign>) => void;
};

export function ExportCard({ design, runtime, savedDesigns, onPatch }: Props) {
  const scale = design.customExportScale || design.exportScale;

  const exportOpts = {
    format: design.exportFormat,
    scale,
    quality: design.exportQuality,
    transparentBg: design.transparentBg,
    filenamePattern: design.filenamePattern,
  };

  return (
    <SurfaceCard className="space-y-4">
      <h2 className="text-base font-bold flex items-center gap-2" style={headingStyle}>
        <Lucide.Download size={18} style={{ color: "var(--bb-accent)" }} /> Export
      </h2>
      <p className="text-xs -mt-2" style={labelMutedStyle}>
        Or use Download in the top bar for a quick PNG
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Format</label>
          <select
            value={design.exportFormat}
            onChange={(e) => onPatch({ exportFormat: e.target.value as ExportFormat })}
            className={`${selectClass} mt-1`}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
        <div>
          <label className={`${valueLabelClass} block`}>Quality: {design.exportQuality}</label>
          <input
            type="range"
            min={0.5}
            max={1}
            step={0.05}
            value={design.exportQuality}
            onChange={(e) => onPatch({ exportQuality: parseFloat(e.target.value) })}
            className={`${rangeClass} mt-2`}
          />
        </div>
      </div>

      <div>
        <label className={`${valueLabelClass} block`}>
          Custom export scale: {design.customExportScale}
        </label>
        <input
          type="number"
          min={0.25}
          max={8}
          step={0.25}
          value={design.customExportScale}
          onChange={(e) =>
            onPatch({ customExportScale: Math.max(0.25, parseFloat(e.target.value) || 1) })
          }
          className={`${fieldClass} mt-1`}
        />
      </div>

      <label className={checkRowClass}>
        <input
          type="checkbox"
          checked={design.transparentBg}
          onChange={(e) => onPatch({ transparentBg: e.target.checked })}
        />
        Transparent background (PNG/WebP)
      </label>

      <div>
        <label className={labelClass}>Filename pattern</label>
        <input
          value={design.filenamePattern}
          onChange={(e) => onPatch({ filenamePattern: e.target.value })}
          placeholder="banner-{width}x{height}"
          className={`${fieldClass} mt-1`}
        />
        <p className="text-[10px] mt-1" style={labelMutedStyle}>
          Tokens: {"{title}"} {"{width}"} {"{height}"} {"{scale}"}
        </p>
      </div>

      <label className={checkRowClass}>
        <input
          type="checkbox"
          checked={design.animationEnabled}
          onChange={(e) => onPatch({ animationEnabled: e.target.checked })}
        />
        Animated pattern (GIF export)
      </label>
      {design.animationEnabled && (
        <div>
          <label className={`${valueLabelClass} block`}>Frames: {design.animationFrames}</label>
          <input
            type="range"
            min={4}
            max={24}
            value={design.animationFrames}
            onChange={(e) => onPatch({ animationFrames: parseInt(e.target.value, 10) })}
            className={rangeClass}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`${btnPrimaryClass} py-2 text-xs col-span-1`}
          onClick={() => exportDesign(design, runtime, exportOpts)}
        >
          Download
        </button>
        <button
          type="button"
          className={`${btnClass} py-2 text-xs`}
          onClick={async () => {
            const ok = await copyCanvasToClipboard(design, runtime, scale);
            window.alert(ok ? "Copied to clipboard." : "Copy failed.");
          }}
        >
          Copy image
        </button>
        <button
          type="button"
          className={`${btnClass} py-2 text-xs col-span-2`}
          onClick={() =>
            exportMultiSizeZip(
              design,
              runtime,
              PLATFORM_PRESETS.slice(0, 4).map((p) => p.dimensions),
              exportOpts,
            )
          }
        >
          Multi-size ZIP (4 presets)
        </button>
        {design.animationEnabled && (
          <button
            type="button"
            className={`${btnClass} py-2 text-xs col-span-2`}
            style={{ borderColor: "var(--bb-accent)", color: "var(--bb-accent)" }}
            onClick={() => exportAnimatedGif(design, runtime, scale)}
          >
            Export animated GIF
          </button>
        )}
        {savedDesigns.length > 0 && (
          <button
            type="button"
            className={`${btnClass} py-2 text-xs col-span-2`}
            onClick={() =>
              exportBatchDesignsZip(
                savedDesigns.map((s) => ({ name: s.name, design: s.design })),
                runtime,
                exportOpts,
              )
            }
          >
            Batch ZIP ({savedDesigns.length} saved)
          </button>
        )}
      </div>
    </SurfaceCard>
  );
}
