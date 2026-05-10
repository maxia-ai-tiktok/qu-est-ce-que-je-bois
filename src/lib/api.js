const API = "https://www.thecocktaildb.com/api/json/v1/1";

export async function fetchCocktailsByIngredient(ing) {
  try {
    const res = await fetch(
      `${API}/filter.php?i=${encodeURIComponent(ing)}`,
    );
    const data = await res.json();
    return Array.isArray(data.drinks) ? data.drinks : [];
  } catch {
    return [];
  }
}

export async function fetchCocktailDetails(id) {
  const res = await fetch(`${API}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.drinks?.[0] || null;
}
