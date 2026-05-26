/** Lucide icon name prefixes / keywords per category (emoji-picker style). */
export const LUCIDE_CATEGORIES: { id: string; label: string; match: (name: string) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  {
    id: "arrows",
    label: "Arrows",
    match: (n) => /arrow|chevron|move|corner|trending/i.test(n),
  },
  {
    id: "media",
    label: "Media",
    match: (n) => /play|pause|video|music|camera|image|film|mic/i.test(n),
  },
  {
    id: "commerce",
    label: "Commerce",
    match: (n) => /cart|shop|bag|credit|dollar|wallet|store|tag/i.test(n),
  },
  {
    id: "social",
    label: "Social",
    match: (n) => /user|users|heart|message|mail|share|bell|chat/i.test(n),
  },
  {
    id: "devices",
    label: "Devices",
    match: (n) => /phone|laptop|monitor|tablet|watch|cpu|wifi|bluetooth/i.test(n),
  },
  {
    id: "weather",
    label: "Weather",
    match: (n) => /sun|moon|cloud|rain|snow|wind|storm|thermometer/i.test(n),
  },
  {
    id: "shapes",
    label: "Shapes",
    match: (n) => /circle|square|triangle|star|sparkle|diamond|hexagon/i.test(n),
  },
];
