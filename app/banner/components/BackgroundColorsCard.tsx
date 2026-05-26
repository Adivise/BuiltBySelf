"use client";

import * as Lucide from "lucide-react";
import { BG_GEOMETRIC_SHAPES } from "../constants";
import { renderLucideIcon } from "../lucide-utils";
import { LucideIconPickerModal } from "./LucideIconPickerModal";
import type { BgPatternSource } from "../types";

type Props = {
  bgPatternSource: BgPatternSource;
  bgIconType: string;
  bgLucideIconName: string;
  bgIconCount: number;
  bgIconSize: number;
  titleColor: string;
  subtitleColor: string;
  borderColor: string;
  bgColor: string;
  starColor: string;
  iconBgColor: string;
  showCenterIcon: boolean;
  bgLucidePickerOpen: boolean;
  bgLucideSearch: string;
  filteredLucideIconNames: string[];
  setBgPatternSource: (s: BgPatternSource) => void;
  setBgLucidePickerOpen: (open: boolean) => void;
  setBgLucideSearch: (q: string) => void;
  setBgIconType: (s: string) => void;
  setBgLucideIconName: (s: string) => void;
  setBgIconCount: (n: number) => void;
  setBgIconSize: (n: number) => void;
  setTitleColor: (c: string) => void;
  setSubtitleColor: (c: string) => void;
  setBorderColor: (c: string) => void;
  setBgColor: (c: string) => void;
  setStarColor: (c: string) => void;
  setIconBgColor: (c: string) => void;
};

export function BackgroundColorsCard({
  bgPatternSource,
  bgIconType,
  bgLucideIconName,
  bgIconCount,
  bgIconSize,
  titleColor,
  subtitleColor,
  borderColor,
  bgColor,
  starColor,
  iconBgColor,
  showCenterIcon,
  bgLucidePickerOpen,
  bgLucideSearch,
  filteredLucideIconNames,
  setBgPatternSource,
  setBgLucidePickerOpen,
  setBgLucideSearch,
  setBgIconType,
  setBgLucideIconName,
  setBgIconCount,
  setBgIconSize,
  setTitleColor,
  setSubtitleColor,
  setBorderColor,
  setBgColor,
  setStarColor,
  setIconBgColor,
}: Props) {
  const colorFields = [
    { label: "Title color", val: titleColor, set: setTitleColor },
    { label: "Subtitle color", val: subtitleColor, set: setSubtitleColor },
    { label: "Border color", val: borderColor, set: setBorderColor },
    { label: "Background color", val: bgColor, set: setBgColor },
    { label: "Pattern color", val: starColor, set: setStarColor },
    {
      label: "Center image background",
      val: iconBgColor,
      set: setIconBgColor,
      disabled: !showCenterIcon,
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-3">
        <Lucide.Sparkles size={20} className="text-amber-500" /> 3. Background & Colors
      </h2>

      <div className="mb-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-2">
            Choose background pattern
          </label>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white border border-neutral-200 rounded-lg p-2">
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Source
              </label>
              <select
                value={bgPatternSource}
                onChange={(e) => setBgPatternSource(e.target.value as BgPatternSource)}
                className="w-full px-2 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="geometric">Geometric</option>
                <option value="lucide">Lucide</option>
              </select>
            </div>

            {bgPatternSource === "geometric" ? (
              <div className="bg-white border border-neutral-200 rounded-lg p-2">
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Shape
                </label>
                <select
                  value={bgIconType}
                  onChange={(e) => setBgIconType(e.target.value)}
                  className="w-full px-2 py-2 border border-neutral-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {BG_GEOMETRIC_SHAPES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg p-2">
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Lucide Icon
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-600 shrink-0">
                    {renderLucideIcon(bgLucideIconName, 18)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBgLucidePickerOpen(true)}
                    className="flex-1 px-2 py-2 border border-neutral-300 rounded-md text-sm bg-white hover:bg-neutral-50 text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {bgLucideIconName}
                    <span className="text-neutral-400"> (choose)</span>
                  </button>
                </div>

                {bgLucidePickerOpen && (
                  <LucideIconPickerModal
                    selectedIconName={bgLucideIconName}
                    search={bgLucideSearch}
                    filteredNames={filteredLucideIconNames}
                    onSearchChange={setBgLucideSearch}
                    onSelect={(name) => {
                      setBgLucideIconName(name);
                      setBgLucidePickerOpen(false);
                    }}
                    onClose={() => setBgLucidePickerOpen(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Density (count): {bgIconCount}
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={bgIconCount}
              onChange={(e) => setBgIconCount(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">
              Background pattern size: {bgIconSize}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={bgIconSize}
              onChange={(e) => setBgIconSize(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-neutral-100">
        <label className="block text-xs font-bold text-neutral-600 mb-2">Change colors</label>
        <div className="grid grid-cols-2 gap-3">
          {colorFields.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-1.5 rounded-lg border border-neutral-200 bg-neutral-50 ${c.disabled ? "opacity-50" : "hover:border-neutral-300"}`}
            >
              <input
                type="color"
                value={c.val}
                onChange={(e) => c.set(e.target.value)}
                disabled={c.disabled}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-xs font-medium text-neutral-600 truncate">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
