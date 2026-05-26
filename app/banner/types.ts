export type FontFamilyKey =
  | "geist"
  | "geist-mono"
  | "geist-pixel"
  | "prompt"
  | "system"
  | "serif"
  | "mono"
  | "custom-ttf"
  | "google";

export type BgPatternSource = "geometric" | "lucide";

export type Dimensions = { w: number; h: number };

export type Offset = { x: number; y: number };

export type BgPosition = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type TextAlign = "left" | "center" | "right";

export type TextTransform = "none" | "uppercase" | "capitalize";

export type BorderStyle = "solid" | "dashed" | "double" | "gradient";

export type ExportFormat = "png" | "jpeg" | "webp";

export type LayerId =
  | "background"
  | "bgImage"
  | "pattern"
  | "centerIcon"
  | "label"
  | "title"
  | "subtitle"
  | "cta"
  | "qr"
  | "badge"
  | "border";

export type SidebarTab = "design" | "text" | "style" | "export";
