import type { BannerDesign } from "./banner-design";
import { computeBgPositions } from "./bg-positions";
import { drawStyledText } from "./draw-text";
import type { BgPosition, LayerId } from "./types";

export type DrawBannerRuntime = {
  canvasFontFamily: string;
  subtitleCanvasFontFamily: string;
  labelCanvasFontFamily: string;
  ctaCanvasFontFamily: string;
  badgeCanvasFontFamily: string;
  iconImage: HTMLImageElement | null;
  bgImage: HTMLImageElement | null;
  lucidePatternImg: HTMLImageElement | null;
  qrCanvas: HTMLCanvasElement | null;
};

export type DrawBannerOptions = {
  exportScale?: number;
  frameIndex?: number;
};

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawBackground(design: BannerDesign, ctx: CanvasRenderingContext2D, w: number, h: number) {
  const inset = design.bannerBorderWidth / 2;
  const iw = w - design.bannerBorderWidth;
  const ih = h - design.bannerBorderWidth;

  if (design.transparentBg) {
    ctx.clearRect(0, 0, w, h);
    return;
  }

  fillRoundedRect(ctx, inset, inset, iw, ih, design.bannerBorderRadius);
  if (design.bgType === "gradient") {
    const degrees = Number.isFinite(design.gradientAngle) ? design.gradientAngle : 135;
    const angle = (degrees * Math.PI) / 180;
    const cx = inset + iw / 2;
    const cy = inset + ih / 2;
    const len = Math.sqrt(iw * iw + ih * ih) / 2;
    const g = ctx.createLinearGradient(
      cx - Math.cos(angle) * len,
      cy - Math.sin(angle) * len,
      cx + Math.cos(angle) * len,
      cy + Math.sin(angle) * len,
    );
    g.addColorStop(0, design.gradientStart);
    g.addColorStop(1, design.gradientEnd);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = design.bgColor;
  }
  ctx.fill();
}

function drawBgImageLayer(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bgImage: HTMLImageElement | null,
) {
  if (!bgImage?.complete) return;
  const inset = design.bannerBorderWidth / 2;
  ctx.save();
  fillRoundedRect(ctx, inset, inset, w - design.bannerBorderWidth, h - design.bannerBorderWidth, design.bannerBorderRadius);
  ctx.clip();
  if (design.bgImageBlur > 0) {
    ctx.filter = `blur(${design.bgImageBlur}px)`;
  }
  ctx.globalAlpha = design.bgImageOpacity;
  const scale = design.bgImageScale || 1;
  const iw = (w - design.bannerBorderWidth) * scale;
  const ih = (h - design.bannerBorderWidth) * scale;
  const ox = (w - design.bannerBorderWidth - iw) / 2 + inset;
  const oy = (h - design.bannerBorderWidth - ih) / 2 + inset;
  ctx.drawImage(bgImage, ox, oy, iw, ih);
  ctx.filter = "none";
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawPattern(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  positions: BgPosition[],
  lucidePatternImg: HTMLImageElement | null,
) {
  const inset = design.bannerBorderWidth / 2;
  ctx.save();
  fillRoundedRect(ctx, inset, inset, w - design.bannerBorderWidth, h - design.bannerBorderWidth, design.bannerBorderRadius);
  ctx.clip();
  ctx.globalAlpha = design.patternOpacity * design.lucidePatternOpacity;

  const drawBgShape = (x: number, y: number, scale: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.strokeStyle = design.starColor;
    ctx.fillStyle = design.starColor;
    const r = design.bgIconSize;
    ctx.lineWidth = design.lucidePatternStrokeWidth;

    if (design.bgPatternSource === "lucide") {
      const img = lucidePatternImg;
      if (img?.complete && img.naturalWidth > 0) {
        const s = r * 2;
        ctx.globalAlpha = design.patternOpacity * design.lucidePatternOpacity;
        ctx.drawImage(img, -s / 2, -s / 2, s, s);
      }
      ctx.restore();
      return;
    }

    ctx.beginPath();
    switch (design.bgIconType) {
      case "sparkle":
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        break;
      case "star":
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2.5), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2.5));
        }
        ctx.closePath();
        break;
      case "circle":
        ctx.arc(0, 0, r / 1.5, 0, Math.PI * 2);
        break;
      case "heart": {
        const hw = r * 1.5;
        const hh = r * 1.5;
        ctx.moveTo(0, hh / 4);
        ctx.bezierCurveTo(0, 0, -hw / 2, 0, -hw / 2, hh / 4);
        ctx.bezierCurveTo(-hw / 2, hh / 2.5, 0, hh / 1.2, 0, hh / 1.2);
        ctx.bezierCurveTo(0, hh / 1.2, hw / 2, hh / 2.5, hw / 2, hh / 4);
        ctx.bezierCurveTo(hw / 2, 0, 0, 0, 0, hh / 4);
        break;
      }
      case "triangle":
        ctx.moveTo(0, -r);
        ctx.lineTo(r, r);
        ctx.lineTo(-r, r);
        ctx.closePath();
        break;
      case "square":
        ctx.rect(-r / 1.2, -r / 1.2, r * 1.6, r * 1.6);
        break;
      case "diamond":
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        break;
      case "plus":
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        break;
      case "hexagon":
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = Math.cos(angle) * r;
          const hy = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        break;
      case "wave":
        ctx.moveTo(-r, 0);
        ctx.quadraticCurveTo(-r / 2, -r / 2, 0, 0);
        ctx.quadraticCurveTo(r / 2, r / 2, r, 0);
        ctx.quadraticCurveTo(r * 1.5, -r / 2, r * 2, 0);
        break;
      case "cross":
        ctx.moveTo(-r, -r);
        ctx.lineTo(r, r);
        ctx.moveTo(r, -r);
        ctx.lineTo(-r, r);
        break;
    }
    if (design.lucidePatternFilled) ctx.fill();
    else ctx.stroke();
    ctx.restore();
  };

  positions.forEach((p) => drawBgShape(p.x, p.y, p.scale, p.rotation));
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCenterIcon(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  iconImage: HTMLImageElement | null,
) {
  if (!design.showCenterIcon) return;
  const size = design.centerIconSize;
  const padding = design.centerIconPadding ?? 0;
  const bgSize = size + padding * 2;
  const isVertical = h >= 300;
  let ix: number, iy: number;

  if (isVertical) {
    ix = (w - bgSize) / 2;
    iy = h / 2 - bgSize / 2 - 40;
  } else {
    ix = w * 0.15 - padding;
    iy = (h - bgSize) / 2;
  }

  fillRoundedRect(ctx, ix, iy, bgSize, bgSize, design.centerIconRadius);
  ctx.fillStyle = design.iconBgColor;
  ctx.fill();
  if (iconImage?.complete) {
    ctx.save();
    ctx.beginPath();
    const imgInset = padding;
    const imgR = Math.max(0, design.centerIconRadius - padding);
    fillRoundedRect(ctx, ix + imgInset, iy + imgInset, size, size, imgR);
    ctx.clip();
    ctx.drawImage(iconImage, ix + imgInset, iy + imgInset, size, size);
    ctx.restore();
  }
}

function textX(w: number, align: BannerDesign["titleAlign"], offsetX: number) {
  const base = align === "left" ? w * 0.12 : align === "right" ? w * 0.88 : w / 2;
  return base + offsetX;
}

function contentY(h: number) {
  return h >= 300 ? h * 0.42 : h / 2;
}

function drawLabelLayer(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  titleFont: string,
) {
  if (!design.showLabel || !design.labelText.trim()) return;
  const maxW = design.titleMaxWidth > 0 ? design.titleMaxWidth : w * 0.85;
  const cy = contentY(h);
  drawStyledText({
    ctx,
    text: design.labelText,
    x: textX(w, "center", design.labelOffset.x),
    y: cy + design.labelOffset.y,
    fontSize: design.labelFontSize,
    fontFamily: titleFont,
    fontWeight: design.labelFontWeight,
    color: design.labelColor,
    align: "center",
    baseline: "middle",
    lineHeight: 1.2,
    letterSpacing: 0,
    textTransform: design.labelTextTransform || "uppercase",
    maxWidth: maxW,
    shadow: false,
    shadowBlur: 0,
    shadowColor: "",
    stroke: false,
    strokeWidth: 0,
    strokeColor: "",
  });
}

function drawTitleLayer(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  titleFont: string,
) {
  const maxW = design.titleMaxWidth > 0 ? design.titleMaxWidth : w * 0.85;
  const cy = contentY(h);
  drawStyledText({
    ctx,
    text: design.title,
    x: textX(w, design.titleAlign, design.titleOffset.x),
    y: cy + design.titleOffset.y,
    fontSize: design.titleFontSize,
    fontFamily: titleFont,
    fontWeight: design.titleFontWeight,
    color: design.titleColor,
    align: design.titleAlign,
    baseline: "middle",
    lineHeight: design.titleLineHeight,
    letterSpacing: design.titleLetterSpacing,
    textTransform: design.titleTextTransform,
    maxWidth: maxW,
    shadow: design.titleShadow,
    shadowBlur: design.titleShadowBlur,
    shadowColor: design.titleShadowColor,
    stroke: design.titleStroke,
    strokeWidth: design.titleStrokeWidth,
    strokeColor: design.titleStrokeColor,
  });
}

function drawSubtitleLayer(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  subtitleFont: string,
) {
  if (!design.subtitle.trim()) return;
  const maxW = design.titleMaxWidth > 0 ? design.titleMaxWidth : w * 0.85;
  const cy = contentY(h);
  drawStyledText({
    ctx,
    text: design.subtitle,
    x: textX(w, design.subtitleAlign, design.subtitleOffset.x),
    y: cy + design.titleFontSize * 0.55 + design.subtitleOffset.y,
    fontSize: design.subtitleFontSize,
    fontFamily: subtitleFont,
    fontWeight: design.subtitleFontWeight,
    color: design.subtitleColor,
    align: design.subtitleAlign,
    baseline: "middle",
    lineHeight: design.subtitleLineHeight,
    letterSpacing: design.subtitleLetterSpacing,
    textTransform: design.subtitleTextTransform,
    maxWidth: maxW,
    shadow: design.subtitleShadow,
    shadowBlur: design.subtitleShadowBlur,
    shadowColor: design.subtitleShadowColor,
    stroke: design.subtitleStroke,
    strokeWidth: design.subtitleStrokeWidth,
    strokeColor: design.subtitleStrokeColor,
  });
}

function drawCta(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fontFamily: string,
) {
  if (!design.showCta || !design.ctaText.trim()) return;
  const px = w / 2 + design.ctaOffset.x;
  const py = h / 2 + design.ctaOffset.y;
  ctx.font = `700 ${design.ctaFontSize}px ${fontFamily}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  const tw = ctx.measureText(design.ctaText).width;
  const padX = 24;
  const padY = 12;
  const bw = tw + padX * 2;
  const bh = design.ctaFontSize + padY * 2;
  fillRoundedRect(ctx, px - bw / 2, py - bh / 2, bw, bh, design.ctaRadius);
  ctx.fillStyle = design.ctaBgColor;
  ctx.fill();
  ctx.fillStyle = design.ctaTextColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(design.ctaText, px, py);
}

function drawQr(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  qrCanvas: HTMLCanvasElement | null,
) {
  if (!design.showQr || !qrCanvas) return;
  const size = design.qrSize;
  const x = w / 2 + design.qrOffset.x - size / 2;
  const y = h / 2 + design.qrOffset.y - size / 2;
  const pad = design.qrPadding;
  ctx.fillStyle = design.qrBgColor;
  fillRoundedRect(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, design.qrRadius);
  ctx.fill();
  ctx.drawImage(qrCanvas, x, y, size, size);
}

function drawBadge(
  design: BannerDesign,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fontFamily: string,
) {
  if (!design.showBadge || !design.badgeText.trim()) return;
  const px = w / 2 + design.badgeOffset.x;
  const py = h / 2 + design.badgeOffset.y;
  ctx.font = `800 ${design.badgeFontSize}px ${fontFamily}, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
  const tw = ctx.measureText(design.badgeText).width;
  const bw = tw + 28;
  const bh = design.badgeFontSize + 12;
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate((design.badgeRotation * Math.PI) / 180);
  fillRoundedRect(ctx, -bw / 2, -bh / 2, bw, bh, design.badgeRadius);
  ctx.fillStyle = design.badgeBgColor;
  ctx.fill();
  ctx.fillStyle = design.badgeTextColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(design.badgeText, 0, 0);
  ctx.restore();
}

function drawBorder(design: BannerDesign, ctx: CanvasRenderingContext2D, w: number, h: number) {
  const inset = design.bannerBorderWidth / 2;
  const iw = w - design.bannerBorderWidth;
  const ih = h - design.bannerBorderWidth;
  fillRoundedRect(ctx, inset, inset, iw, ih, design.bannerBorderRadius);
  ctx.lineWidth = design.bannerBorderWidth;

  if (design.borderStyle === "gradient") {
    const g = ctx.createLinearGradient(inset, inset, inset + iw, inset + ih);
    g.addColorStop(0, design.borderColor);
    g.addColorStop(1, design.borderGradientEnd);
    ctx.strokeStyle = g;
    ctx.stroke();
    return;
  }

  ctx.strokeStyle = design.borderColor;
  if (design.borderStyle === "dashed") {
    ctx.setLineDash([12, 8]);
  } else if (design.borderStyle === "double") {
    ctx.stroke();
    ctx.lineWidth = Math.max(2, design.bannerBorderWidth / 3);
    fillRoundedRect(ctx, inset + 6, inset + 6, iw - 12, ih - 12, Math.max(0, design.bannerBorderRadius - 4));
    ctx.stroke();
    ctx.setLineDash([]);
    return;
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

const layerDrawers: Record<
  LayerId,
  (
    design: BannerDesign,
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    runtime: DrawBannerRuntime,
    positions: BgPosition[],
  ) => void
> = {
  background: (d, ctx, w, h) => drawBackground(d, ctx, w, h),
  bgImage: (d, ctx, w, h, rt) => drawBgImageLayer(d, ctx, w, h, rt.bgImage),
  pattern: (d, ctx, w, h, rt, pos) => drawPattern(d, ctx, w, h, pos, rt.lucidePatternImg),
  centerIcon: (d, ctx, w, h, rt) => drawCenterIcon(d, ctx, w, h, rt.iconImage),
  label: (d, ctx, w, h, rt) => drawLabelLayer(d, ctx, w, h, rt.labelCanvasFontFamily),
  title: (d, ctx, w, h, rt) => drawTitleLayer(d, ctx, w, h, rt.canvasFontFamily),
  subtitle: (d, ctx, w, h, rt) => drawSubtitleLayer(d, ctx, w, h, rt.subtitleCanvasFontFamily),
  cta: (d, ctx, w, h, rt) => drawCta(d, ctx, w, h, rt.ctaCanvasFontFamily),
  qr: (d, ctx, w, h, rt) => drawQr(d, ctx, w, h, rt.qrCanvas),
  badge: (d, ctx, w, h, rt) => drawBadge(d, ctx, w, h, rt.badgeCanvasFontFamily),
  border: (d, ctx, w, h) => drawBorder(d, ctx, w, h),
};

export function drawBanner(
  canvas: HTMLCanvasElement,
  design: BannerDesign,
  runtime: DrawBannerRuntime,
  options: DrawBannerOptions = {},
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = design.dimensions.w;
  const height = design.dimensions.h;
  const renderScale = options.exportScale ?? design.exportScale;
  const frameIndex = options.frameIndex ?? 0;

  canvas.width = width * renderScale;
  canvas.height = height * renderScale;
  ctx.scale(renderScale, renderScale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const positions = computeBgPositions(
    design.bgIconCount,
    design.dimensions,
    design.patternSeed,
    design.patternRotationLock,
    design.animationEnabled ? frameIndex : 0,
  );

  for (const layerId of design.layerOrder) {
    if (!design.layerVisibility[layerId]) continue;
    layerDrawers[layerId](design, ctx, width, height, runtime, positions);
  }
}
