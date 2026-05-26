"use client";

import * as Lucide from "lucide-react";
import type { UiTheme } from "../hooks/use-ui-theme";

type Props = {
  onSetTheme: (theme: UiTheme) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  onSave: () => void;
  onDownload: () => void;
  onShare: () => void;
  dimensionsLabel: string;
};

export function AppHeader({
  onSetTheme,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  onSave,
  onDownload,
  onShare,
  dimensionsLabel,
}: Props) {
  const iconBtn =
    "p-2.5 rounded-xl border transition-all duration-200 active:scale-95";

  return (
    <header
      className="shrink-0 flex items-center gap-3 px-1 pb-4 border-b mb-4"
      style={{ borderColor: "var(--bb-border)" }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: "var(--bb-accent)", color: "var(--bb-accent-fg)" }}
        >
          <Lucide.Layers size={18} />
        </div>
        <div className="min-w-0 hidden sm:block">
          <h1 className="text-base font-bold leading-tight truncate" style={{ color: "var(--bb-text)" }}>
            BuiltBySelf By Adivise
          </h1>
          <p className="text-xs truncate" style={{ color: "var(--bb-muted)" }}>
            {dimensionsLabel}
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          title={canUndo ? `Undo (${undoCount})` : "Nothing to undo"}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label={`Undo${canUndo ? `, ${undoCount} available` : ""}`}
          className={`${iconBtn} disabled:cursor-not-allowed disabled:opacity-40`}
          style={{
            borderColor: "var(--bb-border)",
            background: "var(--bb-surface)",
            color: canUndo ? "var(--bb-text)" : "var(--bb-muted)",
          }}
        >
          <Lucide.Undo2 size={18} />
        </button>
        <button
          type="button"
          title={canRedo ? `Redo (${redoCount})` : "Nothing to redo"}
          onClick={onRedo}
          disabled={!canRedo}
          aria-label={`Redo${canRedo ? `, ${redoCount} available` : ""}`}
          className={`${iconBtn} disabled:cursor-not-allowed disabled:opacity-40`}
          style={{
            borderColor: "var(--bb-border)",
            background: "var(--bb-surface)",
            color: canRedo ? "var(--bb-text)" : "var(--bb-muted)",
          }}
        >
          <Lucide.Redo2 size={18} />
        </button>
        <button
          type="button"
          title="Save to browser"
          onClick={onSave}
          className={iconBtn}
          style={{ borderColor: "var(--bb-border)", background: "var(--bb-surface)", color: "var(--bb-text)" }}
        >
          <Lucide.Save size={18} />
        </button>
        <button
          type="button"
          title="Share design"
          onClick={onShare}
          className={iconBtn}
          style={{ borderColor: "var(--bb-border)", background: "var(--bb-surface)", color: "var(--bb-text)" }}
        >
          <Lucide.Share2 size={18} />
        </button>

        <div
          className="flex p-1 rounded-xl border gap-0.5"
          style={{ borderColor: "var(--bb-border)", background: "var(--bb-bg-elevated)" }}
          role="group"
          aria-label="Theme"
          suppressHydrationWarning
        >
            <button
              type="button"
              title="Light mode"
              aria-pressed="false"
              onClick={() => onSetTheme("light")}
              className="theme-switch-btn"
              data-theme-btn="light"
            >
              <Lucide.Sun size={17} />
            </button>
            <button
              type="button"
              title="Dark mode"
              aria-pressed="false"
              onClick={() => onSetTheme("dark")}
              className="theme-switch-btn"
              data-theme-btn="dark"
            >
              <Lucide.Moon size={17} />
            </button>
          </div>
      </div>

      <button type="button" onClick={onDownload} className="bb-btn bb-btn-primary px-4 py-2.5 text-sm shadow-md">
        <Lucide.Download size={18} />
        <span className="hidden sm:inline">Download</span>
      </button>
    </header>
  );
}
