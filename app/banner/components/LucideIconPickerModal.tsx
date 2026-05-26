"use client";

import * as Lucide from "lucide-react";
import { renderLucideIcon } from "../lucide-utils";
import { btnClass, fieldClass, mutedStyle, textStyle } from "./ui/field-styles";

type Category = { id: string; label: string };

type Props = {
  selectedIconName: string;
  search: string;
  filteredNames: string[];
  onSearchChange: (value: string) => void;
  onSelect: (name: string) => void;
  onClose: () => void;
  categories?: Category[];
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
};

export function LucideIconPickerModal({
  selectedIconName,
  search,
  filteredNames,
  onSearchChange,
  onSelect,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close icon picker"
      />
      <div
        className="absolute left-1/2 top-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border shadow-2xl transition-colors duration-300"
        style={{
          borderColor: "var(--bb-border)",
          background: "var(--bb-surface)",
          boxShadow: "var(--bb-shadow-lg)",
          color: "var(--bb-text)",
        }}
      >
        <div className="flex items-center gap-2 p-4 border-b" style={{ borderColor: "var(--bb-border)" }}>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl border shrink-0"
            style={{
              borderColor: "var(--bb-border)",
              background: "var(--bb-bg)",
              color: "var(--bb-text)",
            }}
          >
            {renderLucideIcon(selectedIconName, 20)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold" style={textStyle}>
              Pick a Lucide Icon
            </div>
            <div className="text-xs" style={mutedStyle}>
              Search and click to select (emoji-like picker).
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--bb-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bb-surface-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label="Close"
          >
            <Lucide.X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-xl border shrink-0"
              style={{
                borderColor: "var(--bb-border)",
                background: "var(--bb-bg)",
                color: "var(--bb-muted)",
              }}
            >
              <Lucide.Search size={18} />
            </div>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search icons… (e.g. camera, cart, user, arrow)"
              className={fieldClass}
            />
          </div>

          {categories && onCategoryChange && (
            <div className="mt-3 flex flex-wrap gap-1">
              {categories.map((c) => {
                const active = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onCategoryChange(c.id)}
                    className="px-2 py-1 text-[11px] rounded-full border transition-colors"
                    style={
                      active
                        ? {
                            borderColor: "var(--bb-accent)",
                            background: "var(--bb-accent-soft)",
                            color: "var(--bb-accent)",
                          }
                        : {
                            borderColor: "var(--bb-border)",
                            color: "var(--bb-muted)",
                            background: "transparent",
                          }
                    }
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          )}

          <div
            className="mt-3 max-h-[52vh] overflow-auto rounded-2xl border"
            style={{ borderColor: "var(--bb-border)", background: "var(--bb-bg)" }}
          >
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 p-2">
              {filteredNames.map((name) => {
                const selected = name === selectedIconName;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => onSelect(name)}
                    className="h-10 w-10 rounded-xl border flex items-center justify-center transition-colors"
                    style={
                      selected
                        ? {
                            borderColor: "var(--bb-accent)",
                            background: "var(--bb-accent-soft)",
                            color: "var(--bb-accent)",
                          }
                        : {
                            borderColor: "transparent",
                            color: "var(--bb-text)",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (selected) return;
                      e.currentTarget.style.borderColor = "var(--bb-border)";
                      e.currentTarget.style.background = "var(--bb-surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (selected) return;
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {renderLucideIcon(name, 18)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 text-xs flex items-center justify-between" style={mutedStyle}>
            <span>
              Showing{" "}
              <span className="font-semibold" style={textStyle}>
                {filteredNames.length}
              </span>{" "}
              icons
              {search.trim() ? "" : " (type to search for more)"}
            </span>
            <button type="button" onClick={() => onSearchChange("")} className={`${btnClass} text-xs py-1.5 px-3`}>
              Clear search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
