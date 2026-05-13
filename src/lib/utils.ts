import { FR_TO_EN } from "./translations.ts";

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

export function splitSteps(
  instructions: string | null | undefined,
): string[] {
  if (!instructions) return [];
  return instructions
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}
