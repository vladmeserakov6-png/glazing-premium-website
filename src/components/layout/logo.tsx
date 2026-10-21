export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`logo${light ? " logo--light" : ""}`}
      href="#top"
      aria-label="ПРОСВЕТ — на главную"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 42 42"
        fill="none"
        className="logo-symbol"
      >
        <path d="M3 3h36v36H3z" stroke="currentColor" strokeWidth="2" />
        <path
          d="M16 3v36M16 16h23M27 16v23"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M3 3l13 13" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span>
        <span className="logo-name">
          ПРОСВЕТ<span className="logo-dot">.</span>
        </span>
        <span className="logo-caption">АРХИТЕКТУРА ОСТЕКЛЕНИЯ</span>
      </span>
    </a>
  );
}
