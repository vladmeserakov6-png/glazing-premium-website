import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { assetPath } from "@/lib/paths";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Image
        className="hero-image"
        src={assetPath("/images/tahion-hero.webp")}
        alt="Панорамное остекление светлой прибрежной виллы с видом на море — архитектурная визуализация"
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        quality={85}
      />
      <div className="hero-shade" />
      <div className="container hero-inner">
        <div className="hero-content">
          <h1 id="hero-heading">
            Больше света.
            <br />
            Ближе к миру.
          </h1>
          <p className="hero-description">
            Панорамное остекление
            <br />
            для вашего пространства
          </p>
          <div className="hero-actions">
            <ButtonLink variant="dark" href="#finder">
              Подобрать решение <ArrowUpRight size={18} strokeWidth={1.3} />
            </ButtonLink>
          </div>
        </div>
        <div className="hero-bottom">
          <p className="hero-categories">
            ОКНА <span>/</span> ФАСАДЫ <span>/</span> РАЗДВИЖНЫЕ СИСТЕМЫ
          </p>
          <a
            className="hero-scroll"
            href="#details"
            aria-label="Исследовать технологии TAHION"
          >
            <span>Исследовать</span>
            <span className="scroll-circle">
              <ArrowDown size={20} strokeWidth={1.2} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
