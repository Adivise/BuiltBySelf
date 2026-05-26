"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { parseIntInput } from "../utils";
import { SurfaceCard } from "./ui/SurfaceCard";
import {
  chipClass,
  chipStyle,
  fieldClass,
  fieldStyle,
  headingStyle,
  labelMutedStyle,
  rangeClass,
  valueLabelClass,
} from "./ui/field-styles";

type SidebarFieldProps = { onFocus: () => void };

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  sidebarFieldProps: SidebarFieldProps;
};

export function BannerSettingsCard({ design, onPatch, sidebarFieldProps }: Props) {
  const { dimensions, customWidth, customHeight, bannerBorderWidth, bannerBorderRadius } =
    design;

  const applyPreset = (w: number, h: number) => {
    const patch: Partial<BannerDesign> = {
      dimensions: { w, h },
      customWidth: w,
      customHeight: h,
      titleOffset: { x: 0, y: 0 },
      subtitleOffset: { x: 0, y: 0 },
    };
    if (w === 1054 && h === 312) {
      Object.assign(patch, {
        centerIconSize: 110,
        bannerBorderRadius: 40,
        titleFontSize: 68,
        subtitleFontSize: 32,
      });
    } else if (w === 1054 && h === 124) {
      Object.assign(patch, {
        centerIconSize: 80,
        bannerBorderRadius: 25,
        titleFontSize: 52,
        subtitleFontSize: 24,
      });
    } else if (w === 512 && h === 124) {
      Object.assign(patch, {
        centerIconSize: 64,
        bannerBorderRadius: 20,
        titleFontSize: 36,
        subtitleFontSize: 18,
      });
    }
    onPatch(patch);
  };

  const applyCustomSize = () => {
    applyPreset(Math.max(1, Math.round(customWidth)), Math.max(1, Math.round(customHeight)));
  };

  const presets = [
    { w: 1054, h: 312, label: "Portrait", sub: "1054×312" },
    { w: 1054, h: 124, label: "Landscape", sub: "1054×124" },
    { w: 512, h: 124, label: "Compact", sub: "512×124" },
  ];

  return (
    <SurfaceCard>
      <h2 className="text-base font-bold flex items-center gap-2 mb-4" style={headingStyle}>
        <Lucide.Layout size={18} style={{ color: "var(--bb-accent)" }} /> Banner size
      </h2>

      <p className="text-xs mb-3" style={labelMutedStyle}>
        Tap a preset — changes apply instantly
      </p>

      <div className="grid grid-cols-1 gap-2 mb-4">
        {presets.map((p) => {
          const active = dimensions.w === p.w && dimensions.h === p.h;
          return (
            <button
              key={`${p.w}x${p.h}`}
              type="button"
              onClick={() => applyPreset(p.w, p.h)}
              className={`${chipClass(active)} flex items-center justify-between px-4 text-left`}
              style={chipStyle(active)}
            >
              <span className="font-semibold">{p.label}</span>
              <span className="opacity-80 tabular-nums">{p.sub}</span>
            </button>
          );
        })}
      </div>

      <div
        className="p-3 rounded-xl border mb-4 space-y-2"
        style={{ borderColor: "var(--bb-border)", background: "var(--bb-bg)" }}
      >
        <p className="text-xs font-medium" style={labelMutedStyle}>
          Custom size (px)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Width"
            value={customWidth}
            onChange={(e) => onPatch({ customWidth: parseIntInput(e.target.value, customWidth) })}
            className={fieldClass}
            style={fieldStyle}
            {...sidebarFieldProps}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Height"
            value={customHeight}
            onChange={(e) =>
              onPatch({ customHeight: parseIntInput(e.target.value, customHeight) })
            }
            className={fieldClass}
            style={fieldStyle}
            {...sidebarFieldProps}
          />
        </div>
        <button
          type="button"
          onClick={applyCustomSize}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: "var(--bb-accent)", color: "var(--bb-accent-fg)" }}
        >
          Apply custom size
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={valueLabelClass}>
          Border: {bannerBorderWidth}px
          <input
            type="range"
            min={0}
            max={40}
            value={bannerBorderWidth}
            onChange={(e) => onPatch({ bannerBorderWidth: parseInt(e.target.value, 10) })}
            className={`${rangeClass} mt-1`}
          />
        </label>
        <label className={valueLabelClass}>
          Corner: {bannerBorderRadius}px
          <input
            type="range"
            min={0}
            max={150}
            value={bannerBorderRadius}
            onChange={(e) => onPatch({ bannerBorderRadius: parseInt(e.target.value, 10) })}
            className={`${rangeClass} mt-1`}
          />
        </label>
      </div>
    </SurfaceCard>
  );
}
