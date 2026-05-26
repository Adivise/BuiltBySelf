"use client";

import * as Lucide from "lucide-react";
import { parseIntInput } from "../utils";
import type { FontFamilyKey, Offset } from "../types";

type SidebarFieldProps = { onFocus: () => void };

type Props = {
  title: string;
  subtitle: string;
  titleFontSize: number;
  subtitleFontSize: number;
  titleOffset: Offset;
  subtitleOffset: Offset;
  fontFamilyKey: FontFamilyKey;
  uploadedFontFileName: string | null;
  showCenterIcon: boolean;
  centerIconSize: number;
  centerIconRadius: number;
  iconImage: HTMLImageElement | null;
  setTitle: (v: string) => void;
  setSubtitle: (v: string) => void;
  setTitleFontSize: (n: number) => void;
  setSubtitleFontSize: (n: number) => void;
  setTitleOffset: (o: Offset) => void;
  setSubtitleOffset: (o: Offset) => void;
  setFontFamilyKey: (k: FontFamilyKey) => void;
  setShowCenterIcon: (v: boolean) => void;
  setCenterIconSize: (n: number) => void;
  setCenterIconRadius: (n: number) => void;
  setIconImage: (img: HTMLImageElement | null) => void;
  handleFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearUploadedFont: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sidebarFieldProps: SidebarFieldProps;
  rememberSidebarScroll: () => void;
  handleFontSizeWheel: (
    e: React.WheelEvent<HTMLInputElement>,
    kind: "title" | "subtitle",
  ) => void;
};

export function TextImageCard({
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  titleOffset,
  subtitleOffset,
  fontFamilyKey,
  uploadedFontFileName,
  showCenterIcon,
  centerIconSize,
  centerIconRadius,
  iconImage,
  setTitle,
  setSubtitle,
  setTitleFontSize,
  setSubtitleFontSize,
  setTitleOffset,
  setSubtitleOffset,
  setFontFamilyKey,
  setShowCenterIcon,
  setCenterIconSize,
  setCenterIconRadius,
  setIconImage,
  handleFontUpload,
  clearUploadedFont,
  handleImageUpload,
  sidebarFieldProps,
  rememberSidebarScroll,
  handleFontSizeWheel,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4 border-b pb-3">
        <Lucide.Type size={20} className="text-pink-500" /> 2. Main Text & Image
      </h2>
      <div className="space-y-6">
        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
          <label className="block text-xs font-bold text-neutral-600 mb-2">Font family</label>
          <select
            value={fontFamilyKey}
            onChange={(e) => setFontFamilyKey(e.target.value as FontFamilyKey)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="geist">Geist Sans (default)</option>
            <option value="geist-mono">Geist Mono</option>
            <option value="geist-pixel">Geist Pixel Square</option>
            <option value="system">System UI</option>
            <option value="serif">Serif (Georgia)</option>
            <option value="prompt">Prompt (Thai-friendly)</option>
            <option value="mono">Monospace</option>
            <option value="custom-ttf">Upload custom font (.ttf / .otf)</option>
          </select>

          {fontFamilyKey === "custom-ttf" && (
            <div className="mt-3 space-y-2">
              <label className="flex flex-col items-center justify-center gap-1 py-4 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-white hover:bg-neutral-50 transition-colors">
                <Lucide.Upload className="w-5 h-5 text-neutral-400" />
                <span className="text-xs text-neutral-600 font-medium text-center px-2">
                  {uploadedFontFileName ?? "Attach .ttf or .otf file"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".ttf,.otf,font/ttf,font/otf"
                  onChange={handleFontUpload}
                />
              </label>
              {uploadedFontFileName && (
                <button
                  type="button"
                  onClick={clearUploadedFont}
                  className="w-full py-2 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Remove uploaded font
                </button>
              )}
              {!uploadedFontFileName && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                  Select a font file to use on the banner.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
          <div className="flex gap-2 items-end mb-3">
            <div className="flex-grow">
              <label className="block text-xs font-bold text-neutral-600 mb-1">Main title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none font-medium"
              />
            </div>
            <div className="w-16 shrink-0">
              <label className="block text-xs text-neutral-500 mb-1">Size</label>
              <input
                type="number"
                inputMode="numeric"
                data-wheel-size="title"
                value={titleFontSize}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg outline-none text-center tabular-nums"
                {...sidebarFieldProps}
                onChange={(e) => {
                  rememberSidebarScroll();
                  setTitleFontSize(parseIntInput(e.target.value, titleFontSize));
                }}
                onWheel={(e) => handleFontSizeWheel(e, "title")}
              />
            </div>
          </div>
          <div className="space-y-2 mt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <Lucide.MoveHorizontal size={12} /> Position X
                </span>
                <span className="text-xs font-semibold text-pink-600 tabular-nums">
                  {titleOffset.x}px
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                value={titleOffset.x}
                onChange={(e) =>
                  setTitleOffset({ ...titleOffset, x: parseInt(e.target.value, 10) })
                }
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <Lucide.MoveVertical size={12} /> Position Y
                </span>
                <span className="text-xs font-semibold text-pink-600 tabular-nums">
                  {titleOffset.y}px
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={titleOffset.y}
                onChange={(e) =>
                  setTitleOffset({ ...titleOffset, y: parseInt(e.target.value, 10) })
                }
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
          <div className="flex gap-2 items-end mb-3">
            <div className="flex-grow">
              <label className="block text-xs font-bold text-neutral-600 mb-1">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                placeholder="Leave blank to remove"
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>
            <div className="w-16 shrink-0">
              <label className="block text-xs text-neutral-500 mb-1">Size</label>
              <input
                type="number"
                inputMode="numeric"
                data-wheel-size="subtitle"
                value={subtitleFontSize}
                className="w-full px-2 py-2 border border-neutral-300 rounded-lg outline-none text-center tabular-nums"
                {...sidebarFieldProps}
                onChange={(e) => {
                  rememberSidebarScroll();
                  setSubtitleFontSize(parseIntInput(e.target.value, subtitleFontSize));
                }}
                onWheel={(e) => handleFontSizeWheel(e, "subtitle")}
              />
            </div>
          </div>
          <div className="space-y-2 mt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <Lucide.MoveHorizontal size={12} /> Position X
                </span>
                <span className="text-xs font-semibold text-pink-600 tabular-nums">
                  {subtitleOffset.x}px
                </span>
              </div>
              <input
                type="range"
                min="-300"
                max="300"
                value={subtitleOffset.x}
                onChange={(e) =>
                  setSubtitleOffset({ ...subtitleOffset, x: parseInt(e.target.value, 10) })
                }
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <Lucide.MoveVertical size={12} /> Position Y
                </span>
                <span className="text-xs font-semibold text-pink-600 tabular-nums">
                  {subtitleOffset.y}px
                </span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                value={subtitleOffset.y}
                onChange={(e) =>
                  setSubtitleOffset({ ...subtitleOffset, y: parseInt(e.target.value, 10) })
                }
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-pointer border border-neutral-200 hover:bg-neutral-100 mb-3">
            <input
              type="checkbox"
              checked={showCenterIcon}
              onChange={(e) => setShowCenterIcon(e.target.checked)}
              className="w-4 h-4 accent-pink-600 rounded cursor-pointer"
            />
            <span className="font-bold text-sm text-neutral-700">Show center image/icon</span>
          </label>

          {showCenterIcon && (
            <div className="border border-neutral-200 p-3 rounded-xl bg-white">
              <div className="flex items-center gap-3 mb-3">
                <label className="flex-1 flex flex-col items-center justify-center py-4 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <Lucide.Upload className="w-5 h-5 text-neutral-400 mb-1" />
                  <span className="text-xs text-neutral-500 font-medium">Upload your image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {iconImage && (
                  <button
                    type="button"
                    onClick={() => setIconImage(null)}
                    className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    title="Remove image"
                  >
                    <Lucide.X size={20} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">
                    Image size: {centerIconSize}px
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="250"
                    value={centerIconSize}
                    onChange={(e) => setCenterIconSize(parseInt(e.target.value, 10))}
                    className="w-full accent-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">
                    Icon corner radius: {centerIconRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={centerIconRadius}
                    onChange={(e) => setCenterIconRadius(parseInt(e.target.value, 10))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
