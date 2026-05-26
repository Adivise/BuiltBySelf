"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { AppHeader } from "./components/AppHeader";
import { DesignTabPanel } from "./components/DesignTabPanel";
import { ExportCard } from "./components/ExportCard";
import { HiddenLucidePatternSvg } from "./components/HiddenLucidePatternSvg";
import { PreviewPanel } from "./components/PreviewPanel";
import { SidebarNav } from "./components/SidebarNav";
import { StyleTabPanel } from "./components/StyleTabPanel";
import { TextEffectsCard } from "./components/TextEffectsCard";
import { resolveCanvasFontFamily, useCanvasFontFamilies } from "./canvas-font-family";
import { useLucideIconNames } from "./lucide-utils";
import { exportDesign } from "./export-utils";
import { useBannerCanvas } from "./hooks/use-banner-canvas";
import { useBannerStore } from "./hooks/use-banner-store";
import { useFontLoading } from "./hooks/use-font-loading";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useLucidePatternImage } from "./hooks/use-lucide-pattern-image";
import { useQrCanvas } from "./hooks/use-qr-canvas";
import { useRuntimeImages } from "./hooks/use-runtime-images";
import { useSidebarScroll } from "./hooks/use-sidebar-scroll";
import { useUiTheme } from "./hooks/use-ui-theme";
import { createRandomDesign } from "./random-design";
import { encodeDesignToShareUrl } from "./design-persistence";
import type { SidebarTab } from "./types";
import { clampFontSize } from "./utils";

type TabAccentStyle = CSSProperties & {
  "--bb-accent": string;
  "--bb-accent-fg": string;
  "--bb-accent-soft": string;
  "--bb-preview-ring": string;
};

const TAB_ACCENTS: Record<SidebarTab, TabAccentStyle> = {
  design: {
    "--bb-accent": "#2563eb",
    "--bb-accent-fg": "#ffffff",
    "--bb-accent-soft": "rgba(37, 99, 235, 0.12)",
    "--bb-preview-ring": "rgba(37, 99, 235, 0.18)",
  },
  text: {
    "--bb-accent": "#d97706",
    "--bb-accent-fg": "#ffffff",
    "--bb-accent-soft": "rgba(217, 119, 6, 0.14)",
    "--bb-preview-ring": "rgba(217, 119, 6, 0.2)",
  },
  style: {
    "--bb-accent": "#16a34a",
    "--bb-accent-fg": "#ffffff",
    "--bb-accent-soft": "rgba(22, 163, 74, 0.14)",
    "--bb-preview-ring": "rgba(22, 163, 74, 0.2)",
  },
  export: {
    "--bb-accent": "#dc2626",
    "--bb-accent-fg": "#ffffff",
    "--bb-accent-soft": "rgba(220, 38, 38, 0.12)",
    "--bb-preview-ring": "rgba(220, 38, 38, 0.18)",
  },
};

export default function BannerBuilder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement | null>(null);
  const lucidePatternSvgRef = useRef<SVGSVGElement | null>(null);
  const uploadedFontUrlRef = useRef<string | null>(null);

  const [uploadedFontUrl, setUploadedFontUrl] = useState<string | null>(null);
  const [uploadedFontFileName, setUploadedFontFileName] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("design");
  const { setTheme } = useUiTheme();

  const {
    design,
    patch,
    patchSilent,
    compareDesign,
    savedDesigns,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    resetDesign,
    loadDesign,
    persistLocal,
    addSavedDesign,
  } = useBannerStore();

  const lucideIconNames = useLucideIconNames();

  const { title: canvasFontFamily, subtitle: subtitleCanvasFontFamily } =
    useCanvasFontFamilies(
      design.fontFamilyKey,
      design.subtitleFontFamilyKey,
      uploadedFontUrl,
      design.googleFontFamily,
      design.googleFontSubtitleFamily,
    );

  const extraFontKeys = useMemo(
    () => [design.labelFontFamilyKey, design.ctaFontFamilyKey, design.badgeFontFamilyKey],
    [design.labelFontFamilyKey, design.ctaFontFamilyKey, design.badgeFontFamilyKey],
  );

  const fontsLoaded = useFontLoading(
    design.fontFamilyKey,
    design.subtitleFontFamilyKey,
    uploadedFontUrl,
    design.googleFontFamily,
    design.googleFontSubtitleFamily,
    extraFontKeys,
  );

  const { iconImage, bgImage } = useRuntimeImages(design);
  const qrCanvas = useQrCanvas(design.showQr, design.qrUrl, design.qrSize);
  const { lucidePatternImg, lucideRasterVersion } = useLucidePatternImage(
    design.bgPatternSource,
    design.bgLucideIconName,
    design.starColor,
    lucidePatternSvgRef,
    design.lucidePatternStrokeWidth,
    design.lucidePatternFilled,
  );

  const runtime = {
    canvasFontFamily,
    subtitleCanvasFontFamily,
    labelCanvasFontFamily: resolveCanvasFontFamily(
      design.labelFontFamilyKey,
      uploadedFontUrl,
      design.googleFontFamily,
    ),
    ctaCanvasFontFamily: resolveCanvasFontFamily(
      design.ctaFontFamilyKey,
      uploadedFontUrl,
      design.googleFontFamily,
    ),
    badgeCanvasFontFamily: resolveCanvasFontFamily(
      design.badgeFontFamilyKey,
      uploadedFontUrl,
      design.googleFontFamily,
    ),
    iconImage,
    bgImage,
    lucidePatternImg,
    qrCanvas,
  };

  useBannerCanvas(canvasRef, fontsLoaded, design, runtime, lucideRasterVersion);

  const { rememberSidebarScroll, sidebarFieldProps, handleFontSizeWheel } =
    useSidebarScroll(sidebarScrollRef, patch, design.titleFontSize, design.subtitleFontSize);

  useKeyboardShortcuts({
    onUndo: () => {
      if (canUndo) undo();
    },
    onRedo: () => {
      if (canRedo) redo();
    },
    onSave: persistLocal,
    onTitleSizeUp: () => patch({ titleFontSize: clampFontSize(design.titleFontSize + 2) }),
    onTitleSizeDown: () => patch({ titleFontSize: clampFontSize(design.titleFontSize - 2) }),
  });

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (uploadedFontUrlRef.current) URL.revokeObjectURL(uploadedFontUrlRef.current);
    const url = URL.createObjectURL(file);
    uploadedFontUrlRef.current = url;
    setUploadedFontUrl(url);
    setUploadedFontFileName(file.name);
    patch({ fontFamilyKey: "custom-ttf" });
    e.target.value = "";
  };

  const clearUploadedFont = () => {
    if (uploadedFontUrlRef.current) URL.revokeObjectURL(uploadedFontUrlRef.current);
    uploadedFontUrlRef.current = null;
    setUploadedFontUrl(null);
    setUploadedFontFileName(null);
    patch({ fontFamilyKey: "geist" });
  };

  const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fallback to legacy copy below
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch {
      success = false;
    }
    document.body.removeChild(textarea);
    return success;
  };

  const shareDesign = async () => {
    const url = encodeDesignToShareUrl(design);
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState(null, "", url);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "BuiltBySelf banner",
          text: "Check out this banner design",
          url,
        });
        return;
      } catch {
        // Ignore if the user cancels or if native share is unavailable.
      }
    }

    const copied = await copyText(url);
    if (copied) {
      window.alert("Share link copied to clipboard.");
    } else {
      window.alert(`Share link:\n\n${url}`);
    }
  };

  const downloadImage = () => {
    exportDesign(design, runtime, {
      format: design.exportFormat,
      scale: design.customExportScale || design.exportScale,
      quality: design.exportQuality,
      transparentBg: design.transparentBg,
      filenamePattern: design.filenamePattern,
    });
  };

  const dimensionsLabel = `${design.dimensions.w} × ${design.dimensions.h} px`;

  return (
    <div
      className="banner-app fixed inset-0 overflow-hidden flex flex-col p-4 md:p-6 lg:p-8"
      style={TAB_ACCENTS[sidebarTab]}
    >
      <HiddenLucidePatternSvg
        iconName={design.bgLucideIconName}
        color={design.starColor}
        strokeWidth={design.lucidePatternStrokeWidth}
        filled={design.lucidePatternFilled}
        svgRef={lucidePatternSvgRef}
      />

      <div className="max-w-7xl mx-auto flex-1 min-h-0 w-full flex flex-col">
        <AppHeader
          onSetTheme={setTheme}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          undoCount={undoCount}
          redoCount={redoCount}
          onSave={() => {
            persistLocal();
            addSavedDesign(`Save ${new Date().toLocaleTimeString()}`);
          }}
          onDownload={downloadImage}
          onShare={shareDesign}
          dimensionsLabel={dimensionsLabel}
        />

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          <aside className="lg:col-span-4 flex flex-col min-h-0 max-lg:max-h-[48dvh]">
            <SidebarNav active={sidebarTab} onChange={setSidebarTab} />

            <div
              ref={sidebarScrollRef}
              className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain pr-1 pb-16 lg:pb-6 scroll-pb-16 lg:scroll-pb-6 space-y-1 [overflow-anchor:none]"
            >
              {sidebarTab === "design" && (
                <DesignTabPanel
                  design={design}
                  onPatch={patch}
                  onLoad={loadDesign}
                  onReset={resetDesign}
                  onRandomDesign={() => loadDesign(createRandomDesign())}
                  sidebarFieldProps={sidebarFieldProps}
                />
              )}

              {sidebarTab === "text" && (
                <TextEffectsCard
                  design={design}
                  onPatch={patch}
                  uploadedFontFileName={uploadedFontFileName}
                  onFontUpload={handleFontUpload}
                  onClearFont={clearUploadedFont}
                  sidebarFieldProps={sidebarFieldProps}
                  rememberSidebarScroll={rememberSidebarScroll}
                  onFontSizeWheel={handleFontSizeWheel}
                />
              )}

              {sidebarTab === "style" && (
                <StyleTabPanel
                  design={design}
                  onPatch={patch}
                  filteredLucideIconNames={lucideIconNames}
                />
              )}

              {sidebarTab === "export" && (
                <ExportCard
                  design={design}
                  runtime={runtime}
                  savedDesigns={savedDesigns}
                  onPatch={patch}
                />
              )}
            </div>
          </aside>

          <PreviewPanel
            canvasRef={canvasRef}
            design={design}
            compareDesign={compareDesign}
            runtime={runtime}
            fontsLoaded={fontsLoaded}
          onPatchSilent={patchSilent}
        />
        </div>
      </div>
    </div>
  );
}
