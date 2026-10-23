"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { BriefButton } from "@/components/project/project-provider";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/paths";

const parts = [
  {
    title: "Стеклопакет",
    summary: "Свет, обзор и защита от внешней среды",
    label: "Свет и обзор",
    text: "Состав стекла подбирают под размеры, климат, шум и ориентацию фасада. Для солнечной стороны важно обсудить защиту от перегрева.",
    point: "glass",
  },
  {
    title: "Профиль",
    summary: "Геометрия, жесткость и архитектура окна",
    label: "Геометрия и тепло",
    text: "Профиль задает форму и жесткость конструкции. Для отапливаемых помещений рассматривают теплые системы; допустимые размеры требуют расчета.",
    point: "frame",
  },
  {
    title: "Примыкание",
    summary: "Продуманное соединение с конструкцией здания",
    label: "Связь с архитектурой",
    text: "Монтажный узел соединяет окно со зданием. Важны основание, герметизация, теплоизоляция и отвод воды — даже хороший стеклопакет не заменяет правильный монтаж.",
    point: "joint",
  },
];

export function WindowAnatomy() {
  const [active, setActive] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  return (
    <section
      id="details"
      className="section anatomy-section"
      aria-labelledby="anatomy-title"
    >
      <div className="container anatomy-layout">
        <div
          className={`window-stage ${exploded ? "is-exploded" : ""} active-${parts[active].point}`}
        >
          <div className="window-daylight" aria-hidden="true" />
          <div className="window-product-image">
            <Image
              src={assetPath("/images/tahion-system.webp")}
              alt="Схема алюминиевой оконной системы: профиль в разрезе и слои стекла"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="window-construction" aria-hidden="true">
            <div className="window-layer layer-joint" />
            <div className="window-layer layer-frame" />
            <div className="window-layer layer-glass glass-back" />
            <div className="window-layer layer-glass glass-front" />
          </div>
          <span className="anatomy-caption">Схема принципа конструкции</span>
          <button
            className="anatomy-explode"
            type="button"
            aria-pressed={exploded}
            onClick={() => setExploded(!exploded)}
          >
            <Layers3 size={16} />
            {exploded ? "Собрать конструкцию" : "Посмотреть по слоям"}
          </button>
        </div>
        <div className="anatomy-content">
          <p className="eyebrow">ТЕХНОЛОГИИ TAHION</p>
          <h2 id="anatomy-title">
            Комфорт начинается
            <br />с деталей.
          </h2>
          <div
            className="anatomy-controls"
            role="group"
            aria-label="Детали окна"
          >
            {parts.map((part, i) => (
              <button
                type="button"
                key={part.point}
                aria-pressed={showDetails && active === i}
                onClick={() => {
                  setActive(i);
                  setShowDetails(true);
                }}
                aria-controls="anatomy-description"
              >
                <span className="part-number">0{i + 1}</span>
                <span className="part-copy">
                  <span className="part-title">{part.title}</span>
                  <span className="part-summary">{part.summary}</span>
                </span>
                <ArrowUpRight
                  className="part-arrow"
                  size={17}
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          <Button
            variant="light"
            className="anatomy-learn"
            aria-expanded={showDetails}
            aria-controls="anatomy-description"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Скрыть подробности" : "Изучить конструкцию"}
            <ArrowUpRight size={17} strokeWidth={1.2} />
          </Button>
          <div
            className="anatomy-description"
            id="anatomy-description"
            hidden={!showDetails}
            aria-live="polite"
            aria-atomic="true"
          >
            <h3>{parts[active].label}</h3>
            <p>{parts[active].text}</p>
            <BriefButton variant="dark">
              Учесть в моем проекте <ArrowUpRight size={17} />
            </BriefButton>
          </div>
        </div>
      </div>
    </section>
  );
}
