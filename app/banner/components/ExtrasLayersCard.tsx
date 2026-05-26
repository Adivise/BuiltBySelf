"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { DEFAULT_LAYER_ORDER } from "../banner-design";
import type { FontFamilyKey, LayerId, TextTransform } from "../types";
import {
  rangeClass,
  fieldClass,
  selectClass,
  valueLabelClass,
} from "./ui/field-styles";

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  embedded?: boolean;
};

const LAYER_LABELS: Record<LayerId, string> = {
  background: "Background",
  bgImage: "Background image",
  pattern: "Pattern",
  centerIcon: "Center icon",
  label: "Label text",
  title: "Title",
  subtitle: "Subtitle",
  cta: "CTA button",
  qr: "QR code",
  badge: "Badge",
  border: "Border",
};

export function ExtrasLayersCard({ design, onPatch, embedded }: Props) {
  const transformOpts: TextTransform[] = ["none", "uppercase", "capitalize"];
  const fontOpts: { value: FontFamilyKey; label: string }[] = [
    { value: "prompt", label: "Prompt" },
    { value: "geist", label: "Geist" },
    { value: "geist-mono", label: "Geist Mono" },
    { value: "geist-pixel", label: "Geist Pixel" },
    { value: "system", label: "System" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Mono" },
  ];

  const moveLayer = (id: LayerId, dir: -1 | 1) => {
    const order = [...design.layerOrder];
    const i = order.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    onPatch({ layerOrder: order });
  };

  return (
    <div
      className={embedded ? "space-y-4" : "p-5 rounded-2xl shadow-sm border space-y-4"}
      style={
        embedded ? undefined : { background: "var(--bb-surface)", borderColor: "var(--bb-border)" }
      }
    >
      {!embedded && (
        <h2 className="text-base font-bold flex items-center gap-2" style={{ color: "var(--bb-text)" }}>
          <Lucide.Layers size={18} style={{ color: "var(--bb-accent)" }} /> Extras & layers
        </h2>
      )}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={design.showLabel}
          onChange={(e) => onPatch({ showLabel: e.target.checked })}
        />
        Label Text
      </label>
      {design.showLabel && (
        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--bb-accent-soft)" }}>
          <input
            value={design.labelText}
            onChange={(e) => onPatch({ labelText: e.target.value })}
            className={fieldClass}
          />
          <label className={valueLabelClass}>
            Font
            <select
              value={design.labelFontFamilyKey}
              onChange={(e) => onPatch({ labelFontFamilyKey: e.target.value as FontFamilyKey })}
              className={`${selectClass} mt-1 text-xs py-1`}
            >
              {fontOpts.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Font size: {design.labelFontSize}
              <input
                type="range"
                min={10}
                max={60}
                value={design.labelFontSize}
                onChange={(e) => onPatch({ labelFontSize: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <div className="flex items-center gap-2 pt-1.5" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.labelColor}
                onChange={(e) => onPatch({ labelColor: e.target.value })}
                className="w-8 h-8 rounded border-0 cursor-pointer"
              />
              <span>Text</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              X: {design.labelOffset.x}px
              <input
                type="range"
                min={-300}
                max={300}
                value={design.labelOffset.x}
                onChange={(e) =>
                  onPatch({
                    labelOffset: { ...design.labelOffset, x: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Y: {design.labelOffset.y}px
              <input
                type="range"
                min={-200}
                max={200}
                value={design.labelOffset.y}
                onChange={(e) =>
                  onPatch({
                    labelOffset: { ...design.labelOffset, y: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Weight
              <input
                type="number"
                min={100}
                max={900}
                step={100}
                value={design.labelFontWeight}
                onChange={(e) => onPatch({ labelFontWeight: parseInt(e.target.value, 10) })}
                className={`${fieldClass} mt-1 text-xs py-1`}
              />
            </label>
            <label className={valueLabelClass}>
              Transform
              <select
                value={design.labelTextTransform}
                onChange={(e) =>
                  onPatch({ labelTextTransform: e.target.value as TextTransform })
                }
                className={`${selectClass} mt-1 text-xs py-1`}
              >
                {transformOpts.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={design.showCta}
          onChange={(e) => onPatch({ showCta: e.target.checked })}
        />
        CTA Button
      </label>
      {design.showCta && (
        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--bb-accent-soft)" }}>
          <input
            value={design.ctaText}
            onChange={(e) => onPatch({ ctaText: e.target.value })}
            className={fieldClass}
          />
          <label className={valueLabelClass}>
            Font
            <select
              value={design.ctaFontFamilyKey}
              onChange={(e) => onPatch({ ctaFontFamilyKey: e.target.value as FontFamilyKey })}
              className={`${selectClass} mt-1 text-xs py-1`}
            >
              {fontOpts.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.ctaBgColor}
                onChange={(e) => onPatch({ ctaBgColor: e.target.value })}
                className="w-8 h-8 rounded"
              />
              <span>Background</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.ctaTextColor}
                onChange={(e) => onPatch({ ctaTextColor: e.target.value })}
                className="w-8 h-8 rounded"
              />
              <span>Text</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Font size: {design.ctaFontSize}
              <input
                type="range"
                min={12}
                max={40}
                value={design.ctaFontSize}
                onChange={(e) => onPatch({ ctaFontSize: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Radius: {design.ctaRadius}
              <input
                type="range"
                min={0}
                max={30}
                value={design.ctaRadius}
                onChange={(e) => onPatch({ ctaRadius: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              X: {design.ctaOffset.x}px
              <input
                type="range"
                min={-300}
                max={300}
                value={design.ctaOffset.x}
                onChange={(e) =>
                  onPatch({
                    ctaOffset: { ...design.ctaOffset, x: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Y: {design.ctaOffset.y}px
              <input
                type="range"
                min={-200}
                max={200}
                value={design.ctaOffset.y}
                onChange={(e) =>
                  onPatch({
                    ctaOffset: { ...design.ctaOffset, y: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={design.showQr}
          onChange={(e) => onPatch({ showQr: e.target.checked })}
        />
        QR Code
      </label>
      {design.showQr && (
        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--bb-accent-soft)" }}>
          <input
            value={design.qrUrl}
            onChange={(e) => onPatch({ qrUrl: e.target.value })}
            placeholder="https://"
            className={fieldClass}
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Size: {design.qrSize}px
              <input
                type="range"
                min={40}
                max={200}
                value={design.qrSize}
                onChange={(e) => onPatch({ qrSize: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <div className="flex items-center gap-2 pt-1.5" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.qrBgColor}
                onChange={(e) => onPatch({ qrBgColor: e.target.value })}
                className="w-8 h-8 rounded border-0 cursor-pointer"
              />
              <span>Background</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Padding: {design.qrPadding}px
              <input
                type="range"
                min={0}
                max={24}
                value={design.qrPadding}
                onChange={(e) => onPatch({ qrPadding: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Radius: {design.qrRadius}px
              <input
                type="range"
                min={0}
                max={30}
                value={design.qrRadius}
                onChange={(e) => onPatch({ qrRadius: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              X: {design.qrOffset.x}px
              <input
                type="range"
                min={-300}
                max={300}
                value={design.qrOffset.x}
                onChange={(e) =>
                  onPatch({
                    qrOffset: { ...design.qrOffset, x: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Y: {design.qrOffset.y}px
              <input
                type="range"
                min={-200}
                max={200}
                value={design.qrOffset.y}
                onChange={(e) =>
                  onPatch({
                    qrOffset: { ...design.qrOffset, y: parseInt(e.target.value, 10) },
                  })
                }
                className={rangeClass}
              />
            </label>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={design.showBadge}
          onChange={(e) => onPatch({ showBadge: e.target.checked })}
        />
        Badge / Ribbon
      </label>
      {design.showBadge && (
        <div className="space-y-2 pl-2 border-l-2" style={{ borderColor: "var(--bb-accent-soft)" }}>
          <input
            value={design.badgeText}
            onChange={(e) => onPatch({ badgeText: e.target.value })}
            className={fieldClass}
          />
          <label className={valueLabelClass}>
            Font
            <select
              value={design.badgeFontFamilyKey}
              onChange={(e) => onPatch({ badgeFontFamilyKey: e.target.value as FontFamilyKey })}
              className={`${selectClass} mt-1 text-xs py-1`}
            >
              {fontOpts.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.badgeBgColor}
                onChange={(e) => onPatch({ badgeBgColor: e.target.value })}
                className="w-8 h-8 rounded"
              />
              <span>Background</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: "var(--bb-muted)" }}>
              <input
                type="color"
                value={design.badgeTextColor}
                onChange={(e) => onPatch({ badgeTextColor: e.target.value })}
                className="w-8 h-8 rounded"
              />
              <span>Text</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Font size: {design.badgeFontSize}px
              <input
                type="range"
                min={10}
                max={48}
                value={design.badgeFontSize}
                onChange={(e) => onPatch({ badgeFontSize: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Radius: {design.badgeRadius}px
              <input
                type="range"
                min={0}
                max={30}
                value={design.badgeRadius}
                onChange={(e) => onPatch({ badgeRadius: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Rotation: {design.badgeRotation}deg
              <input
                type="range"
                min={-45}
                max={45}
                value={design.badgeRotation}
                onChange={(e) => onPatch({ badgeRotation: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <div />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              X: {design.badgeOffset.x}px
              <input
                type="range"
                min={-300}
                max={300}
                value={design.badgeOffset.x}
                onChange={(e) => onPatch({ badgeOffset: { ...design.badgeOffset, x: parseInt(e.target.value, 10) } })}
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Y: {design.badgeOffset.y}px
              <input
                type="range"
                min={-200}
                max={200}
                value={design.badgeOffset.y}
                onChange={(e) => onPatch({ badgeOffset: { ...design.badgeOffset, y: parseInt(e.target.value, 10) } })}
                className={rangeClass}
              />
            </label>
          </div>
        </div>
      )}

      <div className="pt-3 border-t" style={{ borderColor: "var(--bb-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold" style={{ color: "var(--bb-text)" }}>
            Layers
          </span>
          <button
            type="button"
            className="text-[10px]"
            style={{ color: "var(--bb-accent)" }}
            onClick={() => onPatch({ layerOrder: [...DEFAULT_LAYER_ORDER] })}
          >
            Reset order
          </button>
        </div>
        <ul className="space-y-1 max-h-48 overflow-auto">
          {design.layerOrder.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 text-xs py-1 px-2 rounded"
              style={{ background: "var(--bb-bg)", color: "var(--bb-text)" }}
            >
              <input
                type="checkbox"
                checked={design.layerVisibility[id]}
                onChange={(e) =>
                  onPatch({
                    layerVisibility: {
                      ...design.layerVisibility,
                      [id]: e.target.checked,
                    },
                  })
                }
              />
              <span className="flex-1">{LAYER_LABELS[id]}</span>
              <button type="button" onClick={() => moveLayer(id, -1)} className="px-1">
                ↑
              </button>
              <button type="button" onClick={() => moveLayer(id, 1)} className="px-1">
                ↓
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
