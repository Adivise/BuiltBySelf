import type { BgPosition, Dimensions } from "./types";

/** Seeded PRNG for reproducible pattern layouts (#18). */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function computeBgPositions(
  bgIconCount: number,
  dimensions: Dimensions,
  patternSeed: number,
  patternRotationLock: boolean,
  frameIndex = 0,
): BgPosition[] {
  const pos: BgPosition[] = [];
  const cols = bgIconCount;
  if (cols <= 0) return pos;

  const rand = mulberry32(patternSeed + frameIndex * 997);
  const segmentWidth = dimensions.w / cols;

  for (let i = 0; i < cols; i++) {
    const minX = i * segmentWidth;
    const x = minX + 30 + rand() * (segmentWidth - 60);
    const y = 40 + rand() * (dimensions.h - 80);
    const baseRot = patternRotationLock ? 0 : rand() * Math.PI * 2;
    const rot = patternRotationLock
      ? (frameIndex / 12) * Math.PI * 2 * (i % 3 === 0 ? 1 : 0.3)
      : baseRot + (frameIndex / 12) * Math.PI * 0.25;
    pos.push({
      x,
      y,
      scale: 0.6 + rand() * 0.6,
      rotation: rot,
    });
  }
  return pos;
}
