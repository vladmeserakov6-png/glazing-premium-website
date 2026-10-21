import Image from "next/image";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  BriefButton,
  ServiceButton,
} from "@/components/project/project-provider";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Image
        className="hero-image"
        src="/images/architecture.webp"
        alt="Современный дом с панорамным остеклением и открытым видом на сад — архитектурная визуализация"
        fill
        sizes="100vw"
        preload
        quality={85}
      />
      <div className="hero-shade" />
      <div className="container hero-inner">
        <div className="hero-content">
          <p className="hero-eyebrow">
            <span />
            СВЕТ МЕНЯЕТ ВСЁ
          </p>
          <h1 id="hero-heading">
            Современное
            <br />
            остекление для
            <br />
            вашего комфорта<span>.</span>
          </h1>
          <p className="hero-description">
            Окна, балконы, террасы и загородные дома —
            <br className="desktop-break" /> решения, которые открывают
            пространство.
          </p>
          <div className="hero-actions">
            <BriefButton>
              Подобрать решение <ArrowUpRight size={19} />
            </BriefButton>
            <ButtonLink variant="outline" href="#services">
              Каталог услуг <ArrowDown size={17} />
            </ButtonLink>
          </div>
        </div>
        <div className="hero-bottom">
          <a className="hero-scroll" href="#services">
            <span className="scroll-circle">
              <ArrowDown size={17} />
            </span>
            <span>Откройте новые возможности</span>
          </a>
          <ServiceButton serviceId="panoramic-glazing" className="hero-feature">
            <span>
              <span className="hero-feature-label">В ЦЕНТРЕ ВНИМАНИЯ</span>
              <span className="hero-feature-title">Панорамное остекление</span>
            </span>
            <MoveUpRight size={27} strokeWidth={1.4} />
          </ServiceButton>
        </div>
      </div>
      <div className="hero-coordinate" aria-hidden="true">
        ПРОСТРАНСТВО / СВЕТ / АРХИТЕКТУРА
      </div>
    </section>
  );
}
