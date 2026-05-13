import type {
  CocktailApiResponse,
  CocktailDetail,
  CocktailSummary,
} from "./types.ts";

const API = "https://www.thecocktaildb.com/api/json/v1/1";

export async function fetchCocktailsByIngredient(
  ing: string,
): Promise<CocktailSummary[]> {
  try {
    const res = await fetch(
      `${API}/filter.php?i=${encodeURIComponent(ing)}`,
    );
    const data = (await res.json()) as CocktailApiResponse<CocktailSummary>;
    return Array.isArray(data.drinks) ? data.drinks : [];
  } catch {
    return [];
  }
}

export async function fetchCocktailDetails(
  id: string,
): Promise<CocktailDetail | null> {
  const res = await fetch(`${API}/lookup.php?i=${id}`);
  const data = (await res.json()) as CocktailApiResponse<CocktailDetail>;
  return data.drinks?.[0] ?? null;
}
