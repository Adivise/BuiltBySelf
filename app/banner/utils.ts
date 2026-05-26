export const parseIntInput = (value: string, fallback: number) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

export const parseFloatInput = (value: string, fallback: number) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

/** Coerce to a finite number for canvas math / controlled inputs. */
export const finiteNumber = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export const clampFontSize = (n: number) => Math.max(8, Math.min(200, n));
