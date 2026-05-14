// Ingredient stored locally — the label the user typed (in French) and the
// API name we'll query TheCocktailDB with (in English).
export interface Ingredient {
  label: string;
  apiName: string;
}

// Slim cocktail shape returned by filter.php?i=<ingredient>
export interface CocktailSummary {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

// Enriched with our local matching count after fusing multiple ingredient
// queries.
export interface CocktailWithMatch extends CocktailSummary {
  matchCount: number;
}

// Full cocktail returned by lookup.php?i=<id>. The API returns null for
// many optional fields; ingredients/measures come as numbered keys 1..15.
export interface CocktailDetail extends CocktailSummary {
  strCategory?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;
  strInstructionsFR?: string | null;
  // strIngredient1..15, strMeasure1..15 — typed loosely; access via bracket
  // notation and null-check at use site.
  [key: string]: unknown;
}

// API envelope: TheCocktailDB always wraps the result in { drinks: [...] }
// or { drinks: null } when there is no match.
export interface CocktailApiResponse<T> {
  drinks: T[] | null;
}
