"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { BannerDesign } from "../banner-design";
import styles from "../../main.module.css";
import type { DrawBannerRuntime } from "../draw-banner";
import { drawBanner } from "../draw-banner";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  design: BannerDesign;
  compareDesign: BannerDesign | null;
  runtime: DrawBannerRuntime;
  fontsLoaded: boolean;
  onPatchSilent: (p: Partial<BannerDesign>) => void;
};

export function PreviewPanel({
  canvasRef,
  design,
  compareDesign,
  runtime,
  fontsLoaded,
  onPatchSilent,
}: Props) {
  const compareRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<"title" | "subtitle" | null>(null);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const [localZoom, setLocalZoom] = useState(design.previewZoom);

  const snap = (n: number) => {
    if (Math.abs(n) < 8) return 0;
    return n;
  };

  const handlePointerDown = (e: React.PointerEvent, target: "title" | "subtitle") => {
    dragRef.current = target;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: target === "title" ? design.titleOffset.x : design.subtitleOffset.x,
      oy: target === "title" ? design.titleOffset.y : design.subtitleOffset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragStart.current.x) / (localZoom / 100);
      const dy = (e.clientY - dragStart.current.y) / (localZoom / 100);
      const nx = snap(dragStart.current.ox + dx);
      const ny = snap(dragStart.current.oy + dy);
      if (dragRef.current === "title") {
        onPatchSilent({ titleOffset: { x: nx, y: ny } });
      } else {
        onPatchSilent({ subtitleOffset: { x: nx, y: ny } });
      }
    },
    [localZoom, onPatchSilent],
  );

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    if (!fontsLoaded || !compareDesign || !compareRef.current) return;
    drawBanner(compareRef.current, compareDesign, runtime, { exportScale: 1 });
  }, [fontsLoaded, compareDesign, runtime]);

  const safeMargin = 48;
  const zoomStyle = { transform: `scale(${localZoom / 100})`, transformOrigin: "center center" };

  return (
    <div className="lg:col-span-8 flex flex-col min-h-0 h-full overflow-y-auto overscroll-y-contain">
      <div
        className="p-4 md:p-6 rounded-3xl shadow-lg flex-grow flex flex-col relative overflow-hidden min-h-[320px] transition-colors"
        style={{
          background: "var(--bb-surface)",
          border: "1px solid var(--bb-border)",
          boxShadow: "0 8px 32px var(--bb-preview-ring)",
        }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            style={{ background: "var(--bb-preview-ring)", color: "var(--bb-accent)" }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--bb-accent)" }}
            />
            Live preview
          </span>
          <button
            type="button"
            onClick={() => onPatchSilent({ showSafeArea: !design.showSafeArea })}
            className="ml-auto text-xs px-3 py-1.5 rounded-full border transition-all active:scale-95"
            style={
              design.showSafeArea
                ? { borderColor: "var(--bb-accent)", color: "var(--bb-accent)", background: "var(--bb-preview-ring)" }
                : { borderColor: "var(--bb-border)", color: "var(--bb-muted)" }
            }
          >
            Safe area
          </button>
          <select
            value={localZoom}
            onChange={(e) => {
              const z = parseInt(e.target.value, 10);
              setLocalZoom(z);
              onPatchSilent({ previewZoom: z });
            }}
            className="text-xs border rounded-lg px-2 py-1.5 transition-colors"
            style={{ borderColor: "var(--bb-border)", background: "var(--bb-bg)", color: "var(--bb-text)" }}
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
          </select>
        </div>

        <div
          className={`flex-1 flex ${compareDesign ? "flex-row gap-4" : "flex-col"} items-center justify-center`}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="relative" style={zoomStyle}>
            {!fontsLoaded ? (
              <div className="text-sm" style={{ color: "var(--bb-muted)" }}>
                Loading fonts…
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className={`${styles.previewCanvas} drop-shadow-xl w-full max-w-full`}
                  style={
                    {
                      "--banner-radius": `${design.bannerBorderRadius}px`,
                      "--banner-max-width": `${design.dimensions.w}px`,
                    } as React.CSSProperties
                  }
                />
                {design.showSafeArea && (
                  <div
                    className="absolute border-2 border-dashed pointer-events-none rounded"
                    style={{
                      borderColor: "var(--bb-accent)",
                      left: safeMargin,
                      top: safeMargin,
                      right: safeMargin,
                      bottom: safeMargin,
                    }}
                  />
                )}
                <div
                  className="absolute inset-0 group"
                  style={{ width: `var(--banner-max-width, ${design.dimensions.w}px)`, height: `calc(var(--banner-max-width, ${design.dimensions.w}px) * ${design.dimensions.h} / ${design.dimensions.w})` }}
                >
                  <div
                    className="absolute w-6 h-6 rounded-full border-2 cursor-grab active:cursor-grabbing shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "var(--bb-accent-soft)",
                      borderColor: "var(--bb-accent)",
                      left: `${0.5 * 100}%`,
                      top: `${0.33 * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title="Drag title"
                    onPointerDown={(e) => handlePointerDown(e, "title")}
                  />
                  <div
                    className="absolute w-6 h-6 rounded-full border-2 cursor-grab active:cursor-grabbing shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "var(--bb-accent-soft)",
                      borderColor: "var(--bb-accent)",
                      left: `${0.5 * 100}%`,
                      top: `${0.5 * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title="Drag subtitle"
                    onPointerDown={(e) => handlePointerDown(e, "subtitle")}
                  />
                </div>
              </>
            )}
          </div>

        </div>

        <p className="mt-4 text-xs text-center" style={{ color: "var(--bb-muted)" }}>
          Drag <strong style={{ color: "var(--bb-text)" }}>Title</strong> /{" "}
          <strong style={{ color: "var(--bb-text)" }}>Sub</strong> handles on the banner to reposition
        </p>
      </div>
    </div>
  );
}
