"use client";

import * as Lucide from "lucide-react";
import type { RefObject } from "react";
import { isRenderableReactComponent } from "../lucide-utils";

type LucideSvgProps = {
  ref?: RefObject<SVGSVGElement | null>;
  color: string;
  fill?: string;
  size: number;
  strokeWidth?: number;
  filled?: boolean;
};

type Props = {
  iconName: string;
  color: string;
  strokeWidth: number;
  filled: boolean;
  svgRef: RefObject<SVGSVGElement | null>;
};

export function HiddenLucidePatternSvg({ iconName, color, svgRef, strokeWidth, filled }: Props) {
  const Icon = (Lucide as Record<string, unknown>)[iconName];
  const Fallback = Lucide.Sparkles;
  const Selected = (
    isRenderableReactComponent(Icon) ? Icon : Fallback
  ) as React.ComponentType<LucideSvgProps>;

  return (
    <div className="hidden">
      <Selected
        ref={svgRef}
        color={color}
        fill={filled ? color : "none"}
        size={24}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
