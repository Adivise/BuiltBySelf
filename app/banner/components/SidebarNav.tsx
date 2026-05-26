"use client";

import * as Lucide from "lucide-react";
import type { SidebarTab } from "../types";

const TABS: {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "design", label: "Design", icon: Lucide.Layout },
  { id: "text", label: "Text", icon: Lucide.Type },
  { id: "style", label: "Style", icon: Lucide.Palette },
  { id: "export", label: "Export", icon: Lucide.Download },
];

type Props = {
  active: SidebarTab;
  onChange: (tab: SidebarTab) => void;
};

export function SidebarNav({ active, onChange }: Props) {
  return (
    <nav
      className="shrink-0 grid grid-cols-4 gap-1 p-1 rounded-2xl mb-4"
      style={{ background: "var(--bb-surface)", border: "1px solid var(--bb-border)" }}
      role="tablist"
    >
      {TABS.map((t) => {
        const isActive = active === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[11px] font-semibold transition-all duration-200 active:scale-95"
            style={
              isActive
                ? {
                    background: "var(--bb-accent)",
                    color: "var(--bb-accent-fg)",
                    boxShadow: "0 2px 8px var(--bb-preview-ring)",
                  }
                : { color: "var(--bb-muted)" }
            }
          >
            <Icon size={18} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
