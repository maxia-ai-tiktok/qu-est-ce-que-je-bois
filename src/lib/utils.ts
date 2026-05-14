import { FR_TO_EN } from "./translations.ts";

/**
 * Strip-accents minuscule pour comparaisons FR-insensibles. La regex cible
 * explicitement la plage Unicode des combining marks (U+0300..U+036F).
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function frenchToApiName(input: string): string {
  const key = normalize(input);
  if (FR_TO_EN[key]) return FR_TO_EN[key];
  return input.trim();
}

export function formatDose(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim();
}

/**
 * Découpe les instructions en étapes. Coupe sur les sauts de ligne explicites
 * ET sur "fin de phrase + majuscule" (y compris majuscules accentuées : É, À,
 * Î, etc.), pour ne pas fusionner "Mélangez. Étalez." en une seule étape.
 */
export function splitSteps(
  instructions: string | null | undefined,
): string[] {
  if (!instructions) return [];
  return instructions
    .split(/\r?\n|(?<=\.)\s+(?=\p{Lu})/gu)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}
