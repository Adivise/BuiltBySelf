"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { GOOGLE_FONTS } from "../data/google-fonts";
import { parseIntInput } from "../utils";
import type { FontFamilyKey, TextAlign, TextTransform } from "../types";
import { fileToDataUrl } from "../hooks/use-runtime-images";
import { SurfaceCard } from "./ui/SurfaceCard";
import {
  btnClass,
  checkRowClass,
  fieldClass,
  headingStyle,
  insetClass,
  labelClass,
  labelMutedStyle,
  labelStrongClass,
  rangeClass,
  selectClass,
  valueLabelClass,
} from "./ui/field-styles";

type SidebarFieldProps = { onFocus: () => void };

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  uploadedFontFileName: string | null;
  onFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFont: () => void;
  sidebarFieldProps: SidebarFieldProps;
  rememberSidebarScroll: () => void;
  onFontSizeWheel: (e: React.WheelEvent<HTMLInputElement>, kind: "title" | "subtitle") => void;
};

export function TextEffectsCard({
  design,
  onPatch,
  uploadedFontFileName,
  onFontUpload,
  onClearFont,
  sidebarFieldProps,
  rememberSidebarScroll,
  onFontSizeWheel,
}: Props) {
  const alignOpts: TextAlign[] = ["left", "center", "right"];
  const transformOpts: TextTransform[] = ["none", "uppercase", "capitalize"];

  return (
    <SurfaceCard className="space-y-4">
      <h2 className="text-base font-bold flex items-center gap-2" style={headingStyle}>
        <Lucide.Type size={18} style={{ color: "var(--bb-accent)" }} /> Text & fonts
      </h2>
      <p className="text-xs -mt-2" style={labelMutedStyle}>
        Edit on the right preview — drag pink handles to move text
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelStrongClass}>Title font</label>
          <select
            value={design.fontFamilyKey}
            onChange={(e) => onPatch({ fontFamilyKey: e.target.value as FontFamilyKey })}
            className={`${selectClass} mt-1`}
          >
            <option value="geist">Geist Sans</option>
            <option value="geist-mono">Geist Mono</option>
            <option value="geist-pixel">Geist Pixel</option>
            <option value="prompt">Prompt</option>
            <option value="google">Google Font</option>
            <option value="custom-ttf">Custom TTF</option>
            <option value="system">System</option>
            <option value="serif">Serif</option>
            <option value="mono">Mono</option>
          </select>
        </div>
        <div>
          <label className={labelStrongClass}>Subtitle font</label>
          <select
            value={design.subtitleFontFamilyKey}
            onChange={(e) =>
              onPatch({ subtitleFontFamilyKey: e.target.value as FontFamilyKey })
            }
            className={`${selectClass} mt-1`}
          >
            <option value="geist">Geist Sans</option>
            <option value="geist-mono">Geist Mono</option>
            <option value="geist-pixel">Geist Pixel</option>
            <option value="prompt">Prompt</option>
            <option value="google">Google Font</option>
            <option value="custom-ttf">Custom TTF</option>
            <option value="system">System</option>
            <option value="serif">Serif</option>
            <option value="mono">Mono</option>
          </select>
        </div>
      </div>

      {(design.fontFamilyKey === "google" || design.subtitleFontFamilyKey === "google") && (
        <div className="grid grid-cols-2 gap-2">
          {design.fontFamilyKey === "google" && (
            <select
              value={design.googleFontFamily ?? ""}
              onChange={(e) => onPatch({ googleFontFamily: e.target.value || null })}
              className={selectClass}
            >
              <option value="">Title Google font…</option>
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
          {design.subtitleFontFamilyKey === "google" && (
            <select
              value={design.googleFontSubtitleFamily ?? ""}
              onChange={(e) =>
                onPatch({ googleFontSubtitleFamily: e.target.value || null })
              }
              className={selectClass}
            >
              <option value="">Subtitle Google font…</option>
              {GOOGLE_FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {design.fontFamilyKey === "custom-ttf" && (
        <div className="space-y-2">
          <label
            className={`flex flex-col items-center py-3 border-2 border-dashed rounded-xl cursor-pointer ${insetClass}`}
            style={{ borderColor: "var(--bb-border)" }}
          >
            <Lucide.Upload size={18} style={{ color: "var(--bb-muted)" }} />
            <span className="text-xs mt-1" style={labelMutedStyle}>
              {uploadedFontFileName ?? "Upload .ttf/.otf"}
            </span>
            <input type="file" className="hidden" accept=".ttf,.otf" onChange={onFontUpload} />
          </label>
          {uploadedFontFileName && (
            <button type="button" onClick={onClearFont} className={`${btnClass} w-full py-2 text-xs`}>
              Remove font
            </button>
          )}
        </div>
      )}

      <input
        type="text"
        value={design.title}
        onChange={(e) => onPatch({ title: e.target.value })}
        placeholder="Main title"
        className={`${fieldClass} font-medium`}
      />
      <input
        type="text"
        value={design.subtitle}
        onChange={(e) => onPatch({ subtitle: e.target.value })}
        placeholder="Subtitle"
        className={fieldClass}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          inputMode="numeric"
          data-wheel-size="title"
          value={design.titleFontSize}
          {...sidebarFieldProps}
          onChange={(e) => {
            rememberSidebarScroll();
            onPatch({ titleFontSize: parseIntInput(e.target.value, design.titleFontSize) });
          }}
          onWheel={(e) => onFontSizeWheel(e, "title")}
          className={`${fieldClass} text-center text-sm`}
        />
        <input
          type="number"
          inputMode="numeric"
          data-wheel-size="subtitle"
          value={design.subtitleFontSize}
          {...sidebarFieldProps}
          onChange={(e) => {
            rememberSidebarScroll();
            onPatch({
              subtitleFontSize: parseIntInput(e.target.value, design.subtitleFontSize),
            });
          }}
          onWheel={(e) => onFontSizeWheel(e, "subtitle")}
          className={`${fieldClass} text-center text-sm`}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className={labelClass}>Title align</span>
          <select
            value={design.titleAlign}
            onChange={(e) => onPatch({ titleAlign: e.target.value as TextAlign })}
            className={`${selectClass} mt-1 text-xs py-1`}
          >
            {alignOpts.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={labelClass}>Weight</span>
          <input
            type="number"
            min={100}
            max={900}
            step={100}
            value={design.titleFontWeight}
            onChange={(e) => onPatch({ titleFontWeight: parseInt(e.target.value, 10) })}
            className={`${fieldClass} mt-1 text-xs py-1`}
          />
        </div>
        <div>
          <span className={labelClass}>Transform</span>
          <select
            value={design.titleTextTransform}
            onChange={(e) =>
              onPatch({ titleTextTransform: e.target.value as TextTransform })
            }
            className={`${selectClass} mt-1 text-xs py-1`}
          >
            {transformOpts.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className={labelClass}>Sub align</span>
          <select
            value={design.subtitleAlign}
            onChange={(e) => onPatch({ subtitleAlign: e.target.value as TextAlign })}
            className={`${selectClass} mt-1 text-xs py-1`}
          >
            {alignOpts.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className={labelClass}>Sub weight</span>
          <input
            type="number"
            min={100}
            max={900}
            step={100}
            value={design.subtitleFontWeight}
            onChange={(e) => onPatch({ subtitleFontWeight: parseInt(e.target.value, 10) })}
            className={`${fieldClass} mt-1 text-xs py-1`}
          />
        </div>
        <div>
          <span className={labelClass}>Sub transform</span>
          <select
            value={design.subtitleTextTransform}
            onChange={(e) =>
              onPatch({ subtitleTextTransform: e.target.value as TextTransform })
            }
            className={`${selectClass} mt-1 text-xs py-1`}
          >
            {transformOpts.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs" style={labelMutedStyle}>
        <label className={valueLabelClass}>
          Title line height: {design.titleLineHeight}
          <input
            type="range"
            min={0.8}
            max={2}
            step={0.05}
            value={design.titleLineHeight}
            onChange={(e) => onPatch({ titleLineHeight: parseFloat(e.target.value) })}
            className={rangeClass}
          />
        </label>
        <label className={valueLabelClass}>
          Title letter spacing: {design.titleLetterSpacing}
          <input
            type="range"
            min={-2}
            max={20}
            value={design.titleLetterSpacing}
            onChange={(e) => onPatch({ titleLetterSpacing: parseInt(e.target.value, 10) })}
            className={rangeClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs" style={labelMutedStyle}>
        <label className={valueLabelClass}>
          Sub line height: {design.subtitleLineHeight}
          <input
            type="range"
            min={0.8}
            max={2}
            step={0.05}
            value={design.subtitleLineHeight}
            onChange={(e) => onPatch({ subtitleLineHeight: parseFloat(e.target.value) })}
            className={rangeClass}
          />
        </label>
        <label className={valueLabelClass}>
          Sub letter spacing: {design.subtitleLetterSpacing}
          <input
            type="range"
            min={-2}
            max={20}
            value={design.subtitleLetterSpacing}
            onChange={(e) => onPatch({ subtitleLetterSpacing: parseInt(e.target.value, 10) })}
            className={rangeClass}
          />
        </label>
      </div>

      <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--bb-border)" }}>
        <label className={checkRowClass}>
          <input
            type="checkbox"
            checked={design.titleShadow}
            onChange={(e) => onPatch({ titleShadow: e.target.checked })}
          />
          Title shadow
        </label>
        <label className={checkRowClass}>
          <input
            type="checkbox"
            checked={design.titleStroke}
            onChange={(e) => onPatch({ titleStroke: e.target.checked })}
          />
          Title stroke
        </label>
        <label className={checkRowClass}>
          <input
            type="checkbox"
            checked={design.subtitleShadow}
            onChange={(e) => onPatch({ subtitleShadow: e.target.checked })}
          />
          Subtitle shadow
        </label>
        <label className={checkRowClass}>
          <input
            type="checkbox"
            checked={design.subtitleStroke}
            onChange={(e) => onPatch({ subtitleStroke: e.target.checked })}
          />
          Subtitle stroke
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className={`${valueLabelClass} block`}>
          Title X: {design.titleOffset.x}px
          <input
            type="range"
            min={-300}
            max={300}
            value={design.titleOffset.x}
            onChange={(e) =>
              onPatch({ titleOffset: { ...design.titleOffset, x: parseInt(e.target.value, 10) } })
            }
            className={rangeClass}
          />
        </label>
        <label className={`${valueLabelClass} block`}>
          Title Y: {design.titleOffset.y}px
          <input
            type="range"
            min={-150}
            max={150}
            value={design.titleOffset.y}
            onChange={(e) =>
              onPatch({ titleOffset: { ...design.titleOffset, y: parseInt(e.target.value, 10) } })
            }
            className={rangeClass}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className={`${valueLabelClass} block`}>
          Sub X: {design.subtitleOffset.x}px
          <input
            type="range"
            min={-300}
            max={300}
            value={design.subtitleOffset.x}
            onChange={(e) =>
              onPatch({ subtitleOffset: { ...design.subtitleOffset, x: parseInt(e.target.value, 10) } })
            }
            className={rangeClass}
          />
        </label>
        <label className={`${valueLabelClass} block`}>
          Sub Y: {design.subtitleOffset.y}px
          <input
            type="range"
            min={-150}
            max={150}
            value={design.subtitleOffset.y}
            onChange={(e) =>
              onPatch({ subtitleOffset: { ...design.subtitleOffset, y: parseInt(e.target.value, 10) } })
            }
            className={rangeClass}
          />
        </label>
      </div>

      <label className={`${checkRowClass} font-medium`}>
        <input
          type="checkbox"
          checked={design.showCenterIcon}
          onChange={(e) => onPatch({ showCenterIcon: e.target.checked })}
        />
        Center image
      </label>
      {design.showCenterIcon && (
        <div className="space-y-2">
          <label
            className={`flex flex-col items-center py-3 border-2 border-dashed rounded-xl cursor-pointer text-xs ${insetClass}`}
            style={{ borderColor: "var(--bb-border)" }}
          >
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) onPatch({ iconImageDataUrl: await fileToDataUrl(f) });
              }}
            />
          </label>
          {design.iconImageDataUrl && (
            <button
              type="button"
              className={`${btnClass} text-xs w-full`}
              style={{ color: "var(--bb-danger)", borderColor: "var(--bb-danger)" }}
              onClick={() => onPatch({ iconImageDataUrl: null })}
          >
              Remove image
            </button>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Size: {design.centerIconSize}px
              <input
                type="range"
                min={40}
                max={250}
                value={design.centerIconSize}
                onChange={(e) => onPatch({ centerIconSize: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <label className={valueLabelClass}>
              Rounded: {design.centerIconRadius}px
              <input
                type="range"
                min={0}
                max={60}
                value={design.centerIconRadius}
                onChange={(e) => onPatch({ centerIconRadius: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className={valueLabelClass}>
              Padding: {design.centerIconPadding}px
              <input
                type="range"
                min={0}
                max={40}
                value={design.centerIconPadding}
                onChange={(e) => onPatch({ centerIconPadding: parseInt(e.target.value, 10) })}
                className={rangeClass}
              />
            </label>
            <div className="flex items-center gap-1 pt-2">
              <input
                type="color"
                value={design.iconBgColor}
                onChange={(e) => onPatch({ iconBgColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span style={labelMutedStyle}>Background color</span>
            </div>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
