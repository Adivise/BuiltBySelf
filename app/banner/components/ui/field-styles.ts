/** Theme-aware class names — use inside `.banner-app` */

export const fieldClass = "bb-input";

export const selectClass = "bb-select";

export const insetClass = "bb-inset";

export const btnClass = "bb-btn";

export const btnPrimaryClass = "bb-btn bb-btn-primary";

export const labelClass = "bb-label block mb-1";

export const labelStrongClass = "bb-label-strong block mb-1";

export const valueLabelClass = "bb-value-label";

export const checkRowClass = "bb-check-row";

export const rangeClass = "bb-range";

/** Inline styles when class isn't enough */
export const chipStyle = (active: boolean) =>
  active
    ? {
        borderColor: "var(--bb-accent)",
        background: "var(--bb-accent-soft)",
        color: "var(--bb-accent)",
      }
    : {
        borderColor: "var(--bb-border)",
        background: "var(--bb-surface)",
        color: "var(--bb-muted)",
      };

export const chipClass = (active: boolean) =>
  `py-2.5 px-4 rounded-xl border-2 font-medium text-xs transition-all active:scale-[0.98] ${
    active ? "" : "hover:border-[var(--bb-border-strong)]"
  }`;

export const surfaceStyle = {
  background: "var(--bb-surface)",
  borderColor: "var(--bb-border)",
  color: "var(--bb-text)",
} as const;

export const mutedStyle = { color: "var(--bb-muted)" } as const;

export const textStyle = { color: "var(--bb-text)" } as const;

export const accentStyle = { color: "var(--bb-accent)" } as const;

/** Inline style for inputs when not using `.bb-input` alone */
export const fieldStyle = {
  borderColor: "var(--bb-border)",
  background: "var(--bb-bg)",
  color: "var(--bb-text)",
} as const;

export const headingStyle = textStyle;
export const labelMutedStyle = mutedStyle;
