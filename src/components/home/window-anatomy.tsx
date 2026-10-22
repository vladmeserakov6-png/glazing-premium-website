"use client";

import { useState } from "react";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { BriefButton } from "@/components/project/project-provider";

const parts = [
  {
    title: "Стеклопакет",
    label: "Свет и обзор",
    text: "Состав стекла подбирают под размеры, климат, шум и ориентацию фасада. Для солнечной стороны важно обсудить защиту от перегрева.",
    point: "glass",
  },
  {
    title: "Профиль",
    label: "Геометрия и тепло",
    text: "Профиль задает форму и жесткость конструкции. Для отапливаемых помещений рассматривают теплые системы; допустимые размеры требуют расчета.",
    point: "frame",
  },
  {
    title: "Примыкание",
    label: "Связь с архитектурой",
    text: "Монтажный узел соединяет окно со зданием. Важны основание, герметизация, теплоизоляция и отвод воды — даже хороший стеклопакет не заменяет правильный монтаж.",
    point: "joint",
  },
];

export function WindowAnatomy() {
  const [active, setActive] = useState(0);
  const [exploded, setExploded] = useState(false);
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
            <Layers3 size={17} />
            {exploded ? "Собрать конструкцию" : "Посмотреть по слоям"}
          </button>
        </div>
        <div className="anatomy-content">
          <p className="eyebrow">За красивым видом — детали</p>
          <h2 id="anatomy-title">
            Комфорт начинается
            <br />
            изнутри.
          </h2>
          <p className="anatomy-intro">
            Исследуйте три части оконной системы. Нажмите на деталь, чтобы
            понять ее роль.
          </p>
          <div
            className="anatomy-controls"
            role="group"
            aria-label="Детали окна"
          >
            {parts.map((part, i) => (
              <button
                type="button"
                key={part.point}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
                aria-controls="anatomy-description"
              >
                <span>0{i + 1}</span>
                {part.title}
              </button>
            ))}
          </div>
          <div
            className="anatomy-description"
            id="anatomy-description"
            aria-live="polite"
            aria-atomic="true"
          >
            <h3>{parts[active].label}</h3>
            <p>{parts[active].text}</p>
          </div>
          <BriefButton variant="dark">
            Учесть в моем проекте <ArrowUpRight size={17} />
          </BriefButton>
        </div>
      </div>
    </section>
  );
}
