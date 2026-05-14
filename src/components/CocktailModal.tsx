import { useEffect, useMemo, useRef } from "react";
import { ALC_FR, CATEGORY_FR, GLASS_FR } from "../lib/translations.ts";
import type { CocktailDetail, Ingredient } from "../lib/types.ts";
import { formatDose, normalize, splitSteps } from "../lib/utils.ts";

interface CocktailModalProps {
  cocktail: CocktailDetail;
  onClose: () => void;
  userIngredients: Ingredient[];
}

interface CocktailItem {
  name: string;
  dose: string;
}

export default function CocktailModal({
  cocktail,
  onClose,
  userIngredients,
}: CocktailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Bloque le scroll body pendant que le modal est ouvert
    document.body.style.overflow = "hidden";
    // Stocke l'élément focusé avant l'ouverture, restaure à la fermeture
    previouslyFocused.current =
      typeof document !== "undefined"
        ? (document.activeElement as HTMLElement | null)
        : null;
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items: CocktailItem[] = useMemo(() => {
    const out: CocktailItem[] = [];
    for (let i = 1; i <= 15; i++) {
      const name = cocktail[`strIngredient${i}`];
      const dose = cocktail[`strMeasure${i}`];
      if (typeof name === "string" && name.trim()) {
        out.push({
          name: name.trim(),
          dose: typeof dose === "string" ? dose.trim() : "",
        });
      }
    }
    return out;
  }, [cocktail]);

  const userSet = useMemo(
    () => new Set(userIngredients.map((i) => normalize(i.apiName))),
    [userIngredients],
  );

  const steps = splitSteps(
    (cocktail.strInstructionsFR as string | null | undefined) ??
      (cocktail.strInstructions as string | null | undefined),
  );

  const category =
    (cocktail.strCategory && CATEGORY_FR[cocktail.strCategory]) ||
    cocktail.strCategory ||
    "";
  const glass =
    (cocktail.strGlass && GLASS_FR[cocktail.strGlass]) ||
    cocktail.strGlass ||
    "";
  const alcoholic =
    (cocktail.strAlcoholic && ALC_FR[cocktail.strAlcoholic]) ||
    cocktail.strAlcoholic ||
    "";

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cocktail-modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-img">
          {cocktail.strDrinkThumb ? (
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
          ) : null}
          <div className="corner">№ {cocktail.idDrink}</div>
        </div>

        <div className="modal-body">
          <div className="top">
            <div className="category">
              {category} · {alcoholic}
            </div>
            <button
              ref={closeBtnRef}
              className="modal-close"
              onClick={onClose}
              aria-label="Fermer la recette"
            >
              ×
            </button>
          </div>

          <h2 id="cocktail-modal-title">{cocktail.strDrink}</h2>
          <div className="sub">Servi en {glass?.toLowerCase()}</div>

          <div className="section-h">
            <span>Ingrédients</span>
            <span className="num">
              {String(items.length).padStart(2, "0")}
            </span>
          </div>
          <ul className="ingredients-list">
            {items.map((it, i) => {
              const have = userSet.has(normalize(it.name));
              return (
                <li key={i}>
                  <span className={`name ${have ? "have" : ""}`}>
                    {it.name}
                  </span>
                  <span className="dose">{formatDose(it.dose) || "—"}</span>
                </li>
              );
            })}
          </ul>

          <div className="section-h">
            <span>Préparation</span>
            <span className="num">
              {String(steps.length).padStart(2, "0")} étapes
            </span>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>

          <div className="modal-meta">
            <div>
              Verre
              <div className="v">{glass || "—"}</div>
            </div>
            <div>
              Catégorie
              <div className="v">{category || "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
