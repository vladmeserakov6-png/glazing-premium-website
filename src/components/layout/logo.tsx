import { homeAnchor } from "@/lib/paths";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`logo${light ? " logo--light" : ""}`}
      href={homeAnchor("#top")}
      aria-label="TAHION — на главную"
    >
      <span className="logo-name">TAHION</span>
    </a>
  );
}
