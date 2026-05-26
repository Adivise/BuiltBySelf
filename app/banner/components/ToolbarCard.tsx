"use client";

import * as Lucide from "lucide-react";
import type { BannerDesign } from "../banner-design";
import {
  designFromJson,
  designToJson,
  loadVersionHistory,
  saveVersionSnapshot,
  type VersionSnapshot,
} from "../design-persistence";
import { useEffect, useState } from "react";

type Props = {
  design: BannerDesign;
  onReset: () => void;
  onRandomDesign: () => void;
  onLoad: (d: BannerDesign) => void;
  embedded?: boolean;
};

export function ToolbarCard({
  design,
  onReset,
  onRandomDesign,
  onLoad,
  embedded,
}: Props) {
  const [history, setHistory] = useState<VersionSnapshot[]>([]);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    queueMicrotask(() => {
      setHistoryCount(loadVersionHistory().length);
    });
  }, []);

  const handleExportJson = () => {
    const blob = new Blob([designToJson(design)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "banner-design.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const d = designFromJson(text);
      if (d) onLoad(d);
      else window.alert("Invalid design file.");
    };
    input.click();
  };


  const handleSnapshot = () => {
    const list = saveVersionSnapshot(design);
    setHistory(list);
    setHistoryCount(list.length);
  };

  const inner = (
    <div className="space-y-3">
      {!embedded && (
        <p className="text-xs" style={{ color: "var(--bb-muted)" }}>
          Undo/redo & save are in the top bar
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleExportJson}
          className="py-2.5 text-xs rounded-xl border font-medium transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)" }}
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={handleImportJson}
          className="py-2.5 text-xs rounded-xl border font-medium transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)" }}
        >
          Load JSON
        </button>
        <button
          type="button"
          onClick={onRandomDesign}
          className="py-2.5 text-xs rounded-xl border font-medium transition-all active:scale-[0.98]"
          style={{
            borderColor: "var(--bb-accent)",
            color: "var(--bb-accent)",
            background: "var(--bb-accent-soft)",
          }}
        >
          Random design
        </button>
        <button
          type="button"
          onClick={onReset}
          className="col-span-2 py-2.5 text-xs rounded-xl border font-medium transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--bb-danger)", color: "var(--bb-danger)", background: "var(--bb-danger-soft)" }}
        >
          Reset all settings
        </button>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSnapshot}
          className="flex-1 py-2 text-xs rounded-lg border font-medium transition-all active:scale-[0.98]"
          style={{
            borderColor: "var(--bb-accent)",
            color: "var(--bb-accent)",
            background: "var(--bb-accent-soft)",
          }}
        >
          Save version
        </button>
        <button
          type="button"
          onClick={() => {
            const list = loadVersionHistory();
            setHistory(list);
            setHistoryCount(list.length);
          }}
          className="flex-1 py-2 text-xs rounded-lg border font-medium transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--bb-border)", color: "var(--bb-text)", background: "var(--bb-surface)" }}
        >
          History ({history.length > 0 ? history.length : historyCount})
        </button>
      </div>
      {history.length > 0 && (
        <ul
          className="max-h-32 overflow-auto text-xs space-y-1 rounded-lg p-2 border"
          style={{ borderColor: "var(--bb-border)" }}
        >
          {history.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className="w-full text-left py-1.5 px-1 rounded hover:opacity-80"
                style={{ color: "var(--bb-accent)" }}
                onClick={() => onLoad(h.design)}
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (embedded) return inner;
  return (
    <div
      className="p-4 rounded-2xl shadow-sm border space-y-3"
      style={{ background: "var(--bb-surface)", borderColor: "var(--bb-border)" }}
    >
      <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--bb-text)" }}>
        <Lucide.Wrench size={16} /> Tools
      </h2>
      {inner}
    </div>
  );
}
