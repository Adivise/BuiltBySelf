"use client";

import * as Lucide from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors duration-300"
      style={{
        borderColor: "var(--bb-border)",
        background: "var(--bb-surface)",
        boxShadow: "var(--bb-shadow)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200"
        style={{ background: open ? "var(--bb-surface-hover)" : "transparent" }}
      >
        <Lucide.ChevronRight
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          style={{ color: "var(--bb-muted)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: "var(--bb-text)" }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-xs mt-0.5 truncate" style={{ color: "var(--bb-muted)" }}>
              {subtitle}
            </div>
          )}
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: "var(--bb-border)" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
