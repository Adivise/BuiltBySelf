"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { COLOR_THEMES } from "../data/color-themes";
import { PLATFORM_PRESETS } from "../data/platform-presets";
import { BANNER_TEMPLATES, applyTemplate } from "../data/templates";
import { loadBrandKit, saveBrandKit } from "../design-persistence";
import type { FontFamilyKey } from "../types";

import { fieldClass, fieldStyle, labelMutedStyle } from "./ui/field-styles";

type Props = {
  design: BannerDesign;
  onApply: (d: BannerDesign) => void;
  onPatch: (p: Partial<BannerDesign>) => void;
  embedded?: boolean;
};

export function TemplatesPlatformsCard({ design, onApply, onPatch, embedded }: Props) {
  const inner = (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-2" style={labelMutedStyle}>
          Template gallery
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BANNER_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onApply(applyTemplate(t.id))}
              className="text-left p-3 rounded-xl border transition-all active:scale-[0.99] hover:opacity-90"
              style={{ borderColor: "var(--bb-border)", background: "var(--bb-bg)" }}
            >
              <div className="text-sm font-semibold" style={{ color: "var(--bb-text)" }}>
                {t.name}
              </div>
              <div className="text-[11px]" style={labelMutedStyle}>
                {t.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold mb-2" style={labelMutedStyle}>
          Platform sizes
        </label>
        <select
          className={fieldClass}
          style={fieldStyle}
          defaultValue=""
          onChange={(e) => {
            const p = PLATFORM_PRESETS.find((x) => x.id === e.target.value);
            if (!p) return;
            onPatch({
              dimensions: p.dimensions,
              customWidth: p.dimensions.w,
              customHeight: p.dimensions.h,
              ...(p.fontScale
                ? {
                    titleFontSize: p.fontScale.title,
                    subtitleFontSize: p.fontScale.subtitle,
                    centerIconSize: p.fontScale.icon,
                    bannerBorderRadius: p.fontScale.radius,
                  }
                : {}),
            });
            e.target.value = "";
          }}
        >
          <option value="">Choose platform preset…</option>
          {PLATFORM_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold mb-2" style={labelMutedStyle}>
          Color themes
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPatch(t.patch)}
              className="px-3 py-1.5 text-xs rounded-full border transition-all active:scale-95 hover:opacity-90"
              style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)" }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--bb-border)" }}>
        <label className="block text-xs font-bold" style={labelMutedStyle}>
          Brand kit
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="color"
            value={design.brandPrimary}
            onChange={(e) => onPatch({ brandPrimary: e.target.value })}
            className="h-9 w-full rounded cursor-pointer"
          />
          <input
            type="color"
            value={design.brandSecondary}
            onChange={(e) => onPatch({ brandSecondary: e.target.value })}
            className="h-9 w-full rounded cursor-pointer"
          />
        </div>
        <button
          type="button"
          className="w-full py-2 text-xs rounded-lg font-medium transition-all active:scale-[0.98]"
          style={{ background: "var(--bb-accent)", color: "var(--bb-accent-fg)" }}
          onClick={() => {
            saveBrandKit({
              brandPrimary: design.brandPrimary,
              brandSecondary: design.brandSecondary,
              brandFontTitle: design.brandFontTitle,
              brandFontSubtitle: design.brandFontSubtitle,
            });
            onPatch({
              borderColor: design.brandPrimary,
              titleColor: design.brandSecondary,
              ctaBgColor: design.brandPrimary,
              fontFamilyKey: design.brandFontTitle,
              subtitleFontFamilyKey: design.brandFontSubtitle,
            });
          }}
        >
          Apply brand to banner
        </button>
        <button
          type="button"
          className="w-full py-2 text-xs rounded-lg border transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)" }}
          onClick={() => {
            const kit = loadBrandKit();
            if (kit) {
              onPatch({
                brandPrimary: kit.brandPrimary,
                brandSecondary: kit.brandSecondary,
                brandFontTitle: kit.brandFontTitle,
                brandFontSubtitle: kit.brandFontSubtitle,
              });
            }
          }}
        >
          Load saved brand kit
        </button>
        <select
          value={design.brandFontTitle}
          onChange={(e) =>
            onPatch({ brandFontTitle: e.target.value as FontFamilyKey })
          }
          className={`${fieldClass} text-xs`}
          style={fieldStyle}
        >
          <option value="geist">Title font: Geist</option>
          <option value="prompt">Title font: Prompt</option>
          <option value="google">Title font: Google</option>
        </select>
      </div>
    </div>
  );

  if (embedded) return inner;
  return (
    <div
      className="p-5 rounded-2xl shadow-sm border space-y-4"
      style={{ background: "var(--bb-surface)", borderColor: "var(--bb-border)" }}
    >
      <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)" }}>
        <Lucide.LayoutTemplate size={20} style={{ color: "var(--bb-accent)" }} /> Templates & presets
      </h2>
      {inner}
    </div>
  );
}
