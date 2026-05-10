import { useState } from "react";
import Card from "./components/Card.jsx";
import CocktailModal from "./components/CocktailModal.jsx";
import Credits from "./components/Credits.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import IngredientBar from "./components/IngredientBar.jsx";
import {
  fetchCocktailDetails,
  fetchCocktailsByIngredient,
} from "./lib/api.js";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [cocktails, setCocktails] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  function addIngredient(ing) {
    setIngredients((prev) => [...prev, ing]);
  }
  function removeIngredient(index) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }
  function clearAll() {
    setIngredients([]);
    setCocktails(null);
    setError(null);
  }

  async function search() {
    if (!ingredients.length) return;
    setIsSearching(true);
    setError(null);
    setCocktails(null);

    try {
      const results = await Promise.all(
        ingredients.map((i) => fetchCocktailsByIngredient(i.apiName)),
      );

      const tally = new Map();
      results.forEach((list, idx) => {
        list.forEach((d) => {
          if (!tally.has(d.idDrink)) {
            tally.set(d.idDrink, { ...d, matchCount: 0, matched: new Set() });
          }
          const entry = tally.get(d.idDrink);
          if (!entry.matched.has(idx)) {
            entry.matched.add(idx);
            entry.matchCount += 1;
          }
        });
      });

      const all = [...tally.values()].sort(
        (a, b) =>
          b.matchCount - a.matchCount ||
          a.strDrink.localeCompare(b.strDrink),
      );

      setCocktails(all);
    } catch (e) {
      console.error(e);
      setError(
        "La recherche a échoué. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function openCocktail(id) {
    setSelectedId(id);
    setLoadingDetails(true);
    setSelectedDetails(null);
    try {
      const d = await fetchCocktailDetails(id);
      setSelectedDetails(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  }
  function closeCocktail() {
    setSelectedId(null);
    setSelectedDetails(null);
  }

  return (
    <div className="app">
      <Header />
      <Hero />
      <IngredientBar
        ingredients={ingredients}
        addIngredient={addIngredient}
        removeIngredient={removeIngredient}
        clearAll={clearAll}
        onSearch={search}
        isSearching={isSearching}
      />

      <section className="results">
        {isSearching && (
          <div className="state">
            <div className="spinner"></div>
            <h3>Le barman réfléchit…</h3>
            <p>On parcourt l'index pour vous trouver de quoi boire.</p>
          </div>
        )}

        {!isSearching && error && (
          <div className="state">
            <h3>Quelque chose a glissé du shaker.</h3>
            <p>{error}</p>
          </div>
        )}

        {!isSearching && !error && cocktails === null && (
          <div className="state">
            <h3>Le bar est ouvert.</h3>
            <p>
              Ajoutez au moins un ingrédient — un alcool, un agrume, une herbe
              — et lancez la recherche pour découvrir ce que vous pouvez
              préparer.
            </p>
          </div>
        )}

        {!isSearching && !error && cocktails && cocktails.length === 0 && (
          <div className="state">
            <h3>Aucun cocktail trouvé.</h3>
            <p>
              Essayez un autre ingrédient, plus classique. Astuce&nbsp;: l'API
              connaît surtout les ingrédients standards d'un bar.
            </p>
          </div>
        )}

        {!isSearching && !error && cocktails && cocktails.length > 0 && (
          <>
            <div className="results-header">
              <h2>
                <em>Pour vous</em>, ce soir
              </h2>
              <div className="count">
                <strong>{cocktails.length}</strong> cocktail
                {cocktails.length > 1 ? "s" : ""} possible
                {cocktails.length > 1 ? "s" : ""}
              </div>
            </div>
            <div className="grid">
              {cocktails.map((c, i) => (
                <Card
                  key={c.idDrink}
                  index={i}
                  cocktail={{
                    ...c,
                    onClick: () => openCocktail(c.idDrink),
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <Credits />

      <footer className="footer">
        <div>Recettes via TheCocktailDB</div>
        <div>
          Conçu par{" "}
          <a
            className="footer-link"
            href="https://www.tiktok.com/@maxia.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            @maxia.ai
          </a>
        </div>
        <div>À consommer avec modération</div>
      </footer>

      {selectedId && loadingDetails && (
        <div className="modal-backdrop" onClick={closeCocktail}>
          <div className="state" style={{ color: "var(--ink-2)" }}>
            <div className="spinner"></div>
            <h3>On verse la recette…</h3>
          </div>
        </div>
      )}

      {selectedId && selectedDetails && (
        <CocktailModal
          cocktail={selectedDetails}
          onClose={closeCocktail}
          userIngredients={ingredients}
        />
      )}
    </div>
  );
}
