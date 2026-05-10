export default function Card({ cocktail, index }) {
  return (
    <button className="card" onClick={cocktail.onClick}>
      <div className="thumb">
        <img
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          loading="lazy"
        />
      </div>
      <div className="body">
        <div className="num">№ {String(index + 1).padStart(3, "0")}</div>
        <h3>{cocktail.strDrink}</h3>
        <div className="match">
          <span>
            {cocktail.matchCount > 1
              ? `${cocktail.matchCount} ingrédients`
              : "1 ingrédient"}{" "}
            en commun
          </span>
          <span className="arrow">→</span>
        </div>
      </div>
    </button>
  );
}
