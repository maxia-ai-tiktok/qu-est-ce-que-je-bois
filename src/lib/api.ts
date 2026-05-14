import type {
  CocktailApiResponse,
  CocktailDetail,
  CocktailSummary,
} from "./types.ts";

const API = "https://www.thecocktaildb.com/api/json/v1/1";
const TIMEOUT_MS = 8000;

/**
 * Garde-fou anti-XSS et anti-malformé : ne retient que les URLs http(s) de
 * TheCocktailDB. Les `javascript:` ne s'exécutent pas sur `<img src>` côté
 * navigateur moderne, mais on filtre par hygiène.
 */
function isSafeImageUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  return /^https?:\/\//i.test(url);
}

function sanitizeSummary<T extends { strDrinkThumb?: string }>(d: T): T {
  if (!isSafeImageUrl(d.strDrinkThumb)) {
    return { ...d, strDrinkThumb: "" };
  }
  return d;
}

export async function fetchCocktailsByIngredient(
  ing: string,
  signal?: AbortSignal,
): Promise<CocktailSummary[]> {
  const res = await fetch(`${API}/filter.php?i=${encodeURIComponent(ing)}`, {
    signal: signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`TheCocktailDB ${res.status}`);
  }
  const data = (await res.json()) as CocktailApiResponse<CocktailSummary>;
  return Array.isArray(data.drinks) ? data.drinks.map(sanitizeSummary) : [];
}

export async function fetchCocktailDetails(
  id: string,
  signal?: AbortSignal,
): Promise<CocktailDetail | null> {
  const res = await fetch(`${API}/lookup.php?i=${encodeURIComponent(id)}`, {
    signal: signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`TheCocktailDB ${res.status}`);
  }
  const data = (await res.json()) as CocktailApiResponse<CocktailDetail>;
  const drink = data.drinks?.[0];
  return drink ? sanitizeSummary(drink) : null;
}
