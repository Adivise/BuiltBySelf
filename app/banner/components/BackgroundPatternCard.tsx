"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import { BG_GEOMETRIC_SHAPES } from "../constants";
import { LUCIDE_CATEGORIES } from "../data/lucide-categories";
import { renderLucideIcon } from "../lucide-utils";
import { LucideIconPickerModal } from "./LucideIconPickerModal";
import { fileToDataUrl } from "../hooks/use-runtime-images";
import type { BgPatternSource, BorderStyle } from "../types";
import { parseFloatInput, parseIntInput } from "../utils";
import { useMemo, useState } from "react";
import { SurfaceCard } from "./ui/SurfaceCard";
import {
  fieldClass,
  headingStyle,
  labelMutedStyle,
  rangeClass,
  selectClass,
  valueLabelClass,
} from "./ui/field-styles";

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  filteredLucideIconNames: string[];
  embedded?: boolean;
};

export function BackgroundPatternCard({
  design,
  onPatch,
  filteredLucideIconNames,
  embedded,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const icons = useMemo(() => {
    const cat = LUCIDE_CATEGORIES.find((c) => c.id === category);
    const base = cat ? filteredLucideIconNames.filter(cat.match) : filteredLucideIconNames;
    const q = search.trim().toLowerCase();
    if (!q) return base.slice(0, 420);
    return base.filter((n) => n.toLowerCase().includes(q)).slice(0, 700);
  }, [category, filteredLucideIconNames, search]);

  const body = (
    <div className="space-y-4">
      {!embedded && (
        <h2 className="text-base font-bold flex items-center gap-2" style={headingStyle}>
          <Lucide.Sparkles size={18} style={{ color: "var(--bb-accent)" }} /> Background & pattern
        </h2>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs" style={labelMutedStyle}>
          Background
          <select
            value={design.bgType}
            onChange={(e) => onPatch({ bgType: e.target.value as "solid" | "gradient" })}
            className={selectClass}
          >
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>
        </label>
        <label className="text-xs" style={labelMutedStyle}>
          Border style
          <select
            value={design.borderStyle}
            onChange={(e) => onPatch({ borderStyle: e.target.value as BorderStyle })}
            className={selectClass}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="double">Double</option>
            <option value="gradient">Gradient</option>
          </select>
        </label>
      </div>

      {design.bgType === "solid" ? (
        <input
          type="color"
          value={design.bgColor}
          onChange={(e) => onPatch({ bgColor: e.target.value })}
          className="w-full h-10 rounded cursor-pointer"
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs" style={labelMutedStyle}>
            <input
              type="color"
              value={design.gradientStart}
              onChange={(e) => onPatch({ gradientStart: e.target.value })}
              className="h-9 rounded cursor-pointer"
            />
            <span>Gradient start</span>
            <input
              type="color"
              value={design.gradientEnd}
              onChange={(e) => onPatch({ gradientEnd: e.target.value })}
              className="h-9 rounded cursor-pointer"
            />
            <span>Gradient end</span>
        </div>
          <input
            type="number"
            min={0}
            max={360}
            value={Number.isFinite(design.gradientAngle) ? design.gradientAngle : 135}
            onChange={(e) =>
              onPatch({
                gradientAngle: parseIntInput(e.target.value, design.gradientAngle || 135),
              })
            }
            className={fieldClass}
            title="Angle"
          />
          </div>
      )}

      <div>
        <label className="bb-label-strong block">Background image</label>
        <label
          className="mt-1 flex py-3 border-2 border-dashed rounded-xl cursor-pointer justify-center text-xs bb-inset"
          style={{ borderColor: "var(--bb-border)" }}
        >
          Upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) onPatch({ bgImageDataUrl: await fileToDataUrl(f) });
            }}
          />
        </label>
        {design.bgImageDataUrl && (
          <button
            type="button"
            className="bb-btn mt-2 w-full"
            style={{ color: "var(--bb-danger)", borderColor: "var(--bb-danger)" }}
            onClick={() => onPatch({ bgImageDataUrl: null })}
          >
            Remove image
          </button>
        )}
        <label className={`${valueLabelClass} block mt-2`}>
          Opacity: {design.bgImageOpacity}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={design.bgImageOpacity}
            onChange={(e) =>
              onPatch({ bgImageOpacity: parseFloatInput(e.target.value, design.bgImageOpacity) })
            }
            className={rangeClass}
          />
        </label>
        <label className={`${valueLabelClass} block`}>
          Blur: {design.bgImageBlur}px
          <input
            type="range"
            min={0}
            max={20}
            value={design.bgImageBlur}
            onChange={(e) =>
              onPatch({ bgImageBlur: parseIntInput(e.target.value, design.bgImageBlur) })
            }
            className={rangeClass}
          />
        </label>
        <label className={`${valueLabelClass} block`}>
          Scale: {design.bgImageScale}x
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={design.bgImageScale}
            onChange={(e) =>
              onPatch({ bgImageScale: parseFloatInput(e.target.value, design.bgImageScale) })
            }
            className={rangeClass}
          />
        </label>
      </div>

      <select
        value={design.bgPatternSource}
        onChange={(e) => onPatch({ bgPatternSource: e.target.value as BgPatternSource })}
        className={selectClass}
      >
        <option value="geometric">Geometric pattern</option>
        <option value="lucide">Lucide pattern</option>
      </select>

      {design.bgPatternSource === "geometric" ? (
        <select
          value={design.bgIconType}
          onChange={(e) => onPatch({ bgIconType: e.target.value })}
          className={selectClass}
        >
          {BG_GEOMETRIC_SHAPES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bb-btn"
          >
            {renderLucideIcon(design.bgLucideIconName, 18)}
            {design.bgLucideIconName}
          </button>
          {pickerOpen && (
            <LucideIconPickerModal
              selectedIconName={design.bgLucideIconName}
              search={search}
              filteredNames={icons}
              categories={LUCIDE_CATEGORIES}
              activeCategory={category}
              onCategoryChange={setCategory}
              onSearchChange={setSearch}
              onSelect={(name) => {
                onPatch({ bgLucideIconName: name });
                setPickerOpen(false);
              }}
              onClose={() => setPickerOpen(false)}
            />
          )}
          <label className={`${valueLabelClass} block`}>
            Stroke: {design.lucidePatternStrokeWidth}
            <input
              type="range"
              min={1}
              max={12}
              value={design.lucidePatternStrokeWidth}
              onChange={(e) =>
                onPatch({
                  lucidePatternStrokeWidth: parseIntInput(
                    e.target.value,
                    design.lucidePatternStrokeWidth,
                  ),
                })
              }
              className={rangeClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={design.lucidePatternFilled}
              onChange={(e) => onPatch({ lucidePatternFilled: e.target.checked })}
            />
            Filled icons
          </label>
        </>
      )}

      <div className="grid grid-cols-2 gap-2">
        <label className={valueLabelClass}>
          Count: {design.bgIconCount}
          <input
            type="range"
            min={0}
            max={30}
            value={design.bgIconCount}
            onChange={(e) =>
              onPatch({ bgIconCount: parseIntInput(e.target.value, design.bgIconCount) })
            }
            className={rangeClass}
          />
        </label>
        <label className={valueLabelClass}>
          Size: {design.bgIconSize}
          <input
            type="range"
            min={10}
            max={100}
            value={design.bgIconSize}
            onChange={(e) =>
              onPatch({ bgIconSize: parseIntInput(e.target.value, design.bgIconSize) })
            }
            className={rangeClass}
          />
        </label>
      </div>

      <label className={`${valueLabelClass} block`}>
        Pattern opacity: {design.patternOpacity}
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={design.patternOpacity}
          onChange={(e) =>
            onPatch({ patternOpacity: parseFloatInput(e.target.value, design.patternOpacity) })
          }
          className={rangeClass}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 py-2 text-xs border rounded-lg"
          onClick={() => onPatch({ patternSeed: Math.floor(Math.random() * 100000) })}
        >
          Reseed pattern
        </button>
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={design.patternRotationLock}
            onChange={(e) => onPatch({ patternRotationLock: e.target.checked })}
          />
          Lock rotation
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
        {[
          { label: "Title", val: design.titleColor, key: "titleColor" as const },
          { label: "Subtitle", val: design.subtitleColor, key: "subtitleColor" as const },
          { label: "Border", val: design.borderColor, key: "borderColor" as const },
          { label: "Pattern", val: design.starColor, key: "starColor" as const },
        ].map((c) => (
          <div key={c.key} className="flex items-center gap-2 text-xs" style={labelMutedStyle}>
            <input
              type="color"
              value={c.val}
              onChange={(e) => onPatch({ [c.key]: e.target.value })}
              className="w-8 h-8 rounded border-0"
            />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) return body;
  return <SurfaceCard>{body}</SurfaceCard>;
}
