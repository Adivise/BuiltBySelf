"use client";

import type { BannerDesign } from "../banner-design";
import { BannerSettingsCard } from "./BannerSettingsCard";
import { CollapsibleSection } from "./ui/CollapsibleSection";
import { ToolbarCard } from "./ToolbarCard";

type SidebarFieldProps = { onFocus: () => void };

type Props = {
  design: BannerDesign;
  onPatch: (p: Partial<BannerDesign>) => void;
  onLoad: (d: BannerDesign) => void;
  onReset: () => void;
  onRandomDesign: () => void;
  sidebarFieldProps: SidebarFieldProps;
};

export function DesignTabPanel({
  design,
  onPatch,
  onLoad,
  onReset,
  onRandomDesign,
  sidebarFieldProps,
}: Props) {
  return (
    <div className="space-y-4">
      <BannerSettingsCard
        design={design}
        onPatch={onPatch}
        sidebarFieldProps={sidebarFieldProps}
      />

      <CollapsibleSection title="Advanced tools" subtitle="JSON, history, compare" defaultOpen={false}>
        <ToolbarCard
          design={design}
          onReset={onReset}
          onRandomDesign={onRandomDesign}
          onLoad={onLoad}
          embedded
        />
      </CollapsibleSection>
    </div>
  );
}
