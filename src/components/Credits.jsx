export default function Credits() {
  return (
    <aside className="credits">
      <div className="credits-eyebrow">
        <span className="dot"></span>
        Coulisses · Conçu en direct
      </div>
      <h3 className="credits-title">
        Cette page a été <em>imaginée</em>,<br />
        codée et déployée pour une vidéo TikTok.
      </h3>
      <p className="credits-lede">
        Un site, un design, un déploiement — du début à la fin, en une seule
        prise. Rejoignez la communauté pour voir comment Claude Code et
        maxia.ai construisent ce genre de choses, en direct.
      </p>
      <a
        className="credits-cta"
        href="https://www.tiktok.com/@maxia.ai"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Suivre @maxia.ai sur TikTok</span>
        <span className="arrow">→</span>
      </a>
    </aside>
  );
}
