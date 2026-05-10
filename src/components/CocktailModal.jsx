import { useEffect, useMemo } from "react";
import { ALC_FR, CATEGORY_FR, GLASS_FR } from "../lib/translations.js";
import { formatDose, normalize, splitSteps } from "../lib/utils.js";

export default function CocktailModal({
  cocktail,
  onClose,
  userIngredients,
  frInstructions,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = useMemo(() => {
    const out = [];
    for (let i = 1; i <= 15; i++) {
      const name = cocktail[`strIngredient${i}`];
      const dose = cocktail[`strMeasure${i}`];
      if (name && name.trim()) {
        out.push({ name: name.trim(), dose: dose ? dose.trim() : "" });
      }
    }
    return out;
  }, [cocktail]);

  const userSet = useMemo(
    () => new Set(userIngredients.map((i) => normalize(i.apiName))),
    [userIngredients],
  );

  const steps = splitSteps(
    frInstructions || cocktail.strInstructionsFR || cocktail.strInstructions,
  );

  const category = CATEGORY_FR[cocktail.strCategory] || cocktail.strCategory;
  const glass = GLASS_FR[cocktail.strGlass] || cocktail.strGlass;
  const alcoholic = ALC_FR[cocktail.strAlcoholic] || cocktail.strAlcoholic;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-img">
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
          <div className="corner">№ {cocktail.idDrink}</div>
        </div>

        <div className="modal-body">
          <div className="top">
            <div className="category">
              {category} · {alcoholic}
            </div>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <h2>{cocktail.strDrink}</h2>
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
