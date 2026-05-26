"use client";

import type { BannerDesign } from "../banner-design";
import { BackgroundPatternCard } from "./BackgroundPatternCard";
import { ExtrasLayersCard } from "./ExtrasLayersCard";
import { CollapsibleSection } from "./ui/CollapsibleSection";

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  filteredLucideIconNames: string[];
};

export function StyleTabPanel({ design, onPatch, filteredLucideIconNames }: Props) {
  return (
    <div className="space-y-4">
      <BackgroundPatternCard
        design={design}
        onPatch={onPatch}
        filteredLucideIconNames={filteredLucideIconNames}
      />

      <CollapsibleSection
        title="Extras & layers"
        subtitle="CTA, QR, Badge, Layer order"
        defaultOpen={false}
      >
        <ExtrasLayersCard design={design} onPatch={onPatch} embedded />
      </CollapsibleSection>
    </div>
  );
}
