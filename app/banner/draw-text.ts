import type { TextTransform } from "./types";

export type DrawTextOptions = {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  lineHeight: number;
  letterSpacing: number;
  textTransform: TextTransform;
  maxWidth: number;
  shadow: boolean;
  shadowBlur: number;
  shadowColor: string;
  stroke: boolean;
  strokeWidth: number;
  strokeColor: string;
};

function transformText(text: string, mode: TextTransform): string {
  if (mode === "uppercase") return text.toUpperCase();
  if (mode === "capitalize") {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return text;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  if (!maxWidth || maxWidth <= 0) return [text];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [text];
}

export function drawStyledText(opts: DrawTextOptions): number {
  const {
    ctx,
    fontSize,
    fontFamily,
    fontWeight,
    color,
    align,
    baseline,
    lineHeight,
    letterSpacing,
    textTransform,
    maxWidth,
    shadow,
    shadowBlur,
    shadowColor,
    stroke,
    strokeWidth,
    strokeColor,
  } = opts;

  const text = transformText(opts.text, textTransform);
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillStyle = color;

  const lines = wrapLines(ctx, text, maxWidth);
  const lineAdvance = fontSize * lineHeight;
  let totalHeight = 0;

  lines.forEach((line, i) => {
    const ly = opts.y + i * lineAdvance;
    let x = opts.x;
    if (letterSpacing !== 0) {
      const chars = [...line];
      const totalW =
        chars.reduce((sum, ch) => sum + ctx.measureText(ch).width + letterSpacing, 0) -
        letterSpacing;
      if (align === "center") x -= totalW / 2;
      if (align === "right") x -= totalW;
      let cx = x;
      for (const ch of chars) {
        if (shadow) {
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
        }
        if (stroke) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.strokeText(ch, cx, ly);
        }
        ctx.fillText(ch, cx, ly);
        ctx.shadowBlur = 0;
        cx += ctx.measureText(ch).width + letterSpacing;
      }
    } else {
      if (shadow) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
      }
      if (stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, x, ly);
      }
      ctx.fillText(line, x, ly);
      ctx.shadowBlur = 0;
    }
    totalHeight = (i + 1) * lineAdvance;
  });

  return totalHeight;
}
