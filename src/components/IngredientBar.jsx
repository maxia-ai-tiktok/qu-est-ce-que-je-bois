import { useCallback, useRef, useState } from "react";
import { SUGGESTIONS } from "../lib/translations.js";
import { frenchToApiName, normalize } from "../lib/utils.js";

export default function IngredientBar({
  ingredients,
  addIngredient,
  removeIngredient,
  clearAll,
  onSearch,
  isSearching,
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  const tryAdd = useCallback(
    (value) => {
      const v = value.trim();
      if (!v) return;
      const exists = ingredients.some(
        (i) => normalize(i.label) === normalize(v),
      );
      if (exists) return;
      addIngredient({ label: v, apiName: frenchToApiName(v) });
      setDraft("");
    },
    [ingredients, addIngredient],
  );

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      tryAdd(draft);
    } else if (e.key === "Backspace" && !draft && ingredients.length) {
      removeIngredient(ingredients.length - 1);
    }
  }

  return (
    <div className="bar">
      <div className="bar-label">
        <span>① Mes ingrédients</span>
        <span className="num">
          {String(ingredients.length).padStart(2, "0")} ajoutés
        </span>
      </div>

      <div className="input-row" onClick={() => inputRef.current?.focus()}>
        {ingredients.map((ing, i) => (
          <span className="tag" key={ing.label + i}>
            {ing.label}
            <button
              className="x"
              onClick={(e) => {
                e.stopPropagation();
                removeIngredient(i);
              }}
              aria-label={`Retirer ${ing.label}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="tag-input"
          type="text"
          value={draft}
          placeholder={
            ingredients.length ? "Ajouter…" : "Ex. gin, citron vert, menthe…"
          }
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => tryAdd(draft)}
        />
      </div>

      <div className="suggestions">
        <span className="label-mini">Suggestions</span>
        {SUGGESTIONS.map((s) => {
          const already = ingredients.some(
            (i) => normalize(i.label) === normalize(s),
          );
          return (
            <button
              key={s}
              className="chip"
              onClick={() => tryAdd(s)}
              disabled={already}
            >
              + {s}
            </button>
          );
        })}
      </div>

      <div className="actions">
        <button
          className="clear-btn"
          onClick={clearAll}
          disabled={!ingredients.length}
        >
          Tout effacer
        </button>

        <button
          className="search-btn"
          onClick={onSearch}
          disabled={!ingredients.length || isSearching}
        >
          {isSearching ? "Recherche…" : "Trouver des cocktails"}
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
