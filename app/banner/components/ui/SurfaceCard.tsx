"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md";
};

export function SurfaceCard({ children, className = "", padding = "md" }: Props) {
  const pad = padding === "sm" ? "p-4" : "p-5";
  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 ${pad} ${className}`}
      style={{
        background: "var(--bb-surface)",
        borderColor: "var(--bb-border)",
        boxShadow: "var(--bb-shadow)",
        color: "var(--bb-text)",
      }}
    >
      {children}
    </div>
  );
}
