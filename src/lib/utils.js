import { FR_TO_EN } from "./translations.js";

export function normalize(s) {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function frenchToApiName(input) {
  const key = normalize(input);
  if (FR_TO_EN[key]) return FR_TO_EN[key];
  return input.trim();
}

export function formatDose(raw) {
  if (!raw) return "";
  return raw.trim();
}

export function splitSteps(instructions) {
  if (!instructions) return [];
  return instructions
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}
