/** Popular Google Fonts for banner text (loaded on demand). */
export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Oswald",
  "Raleway",
  "Nunito",
  "Prompt",
  "Noto Sans Thai",
  "Kanit",
  "Sarabun",
  "Playfair Display",
  "Bebas Neue",
] as const;

export type GoogleFontName = (typeof GOOGLE_FONTS)[number];

export function googleFontCssUrl(family: string, weights = "400;500;700;900"): string {
  const encoded = family.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weights}&display=swap`;
}
