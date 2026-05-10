export default function Header() {
  return (
    <header className="header">
      <div className="brand-mark">
        <span className="dot"></span>
        Maison · Bar à Idées · Est. 2026
      </div>

      <a
        className="presented-by"
        href="https://www.tiktok.com/@maxia.ai"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Présenté par maxia.ai sur TikTok"
      >
        <span className="presented-label">
          <span className="live-pulse"></span>
          Présenté par · TikTok
          <span className="presented-arrow">↗</span>
        </span>
        <span className="maxia-wordmark">
          maxia<span className="maxia-tld">.ai</span>
        </span>
      </a>
    </header>
  );
}
