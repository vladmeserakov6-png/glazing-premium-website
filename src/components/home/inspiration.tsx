"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand } from "lucide-react";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useProject } from "@/components/project/project-provider";
import { Reveal } from "@/components/ui/reveal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/paths";

const references = [
  {
    image: "/images/tahion-house.webp",
    title: "Дом, открытый природе",
    tag: "ЗАГОРОДНАЯ АРХИТЕКТУРА",
    serviceId: "cottage-glazing",
    alt: "Стеклянный фасад загородного дома в окружении зелени",
  },
  {
    image: "/images/tahion-terrace.webp",
    title: "Граница становится невидимой",
    tag: "ТЕРРАСЫ И ВЕРАНДЫ",
    serviceId: "terrace-glazing",
    alt: "Стеклянная терраса с обеденным столом и садом за окнами",
  },
  {
    image: "/images/tahion-panoramic.webp",
    title: "Пейзаж как часть интерьера",
    tag: "ПАНОРАМНОЕ ОСТЕКЛЕНИЕ",
    serviceId: "panoramic-glazing",
    alt: "Гостиная с панорамными окнами и видом на природу",
  },
  {
    image: "/images/tahion-balcony.webp",
    title: "Свое место у окна",
    tag: "БАЛКОНЫ И ЛОДЖИИ",
    serviceId: "balcony-glazing",
    alt: "Светлый остекленный балкон с креслами для отдыха",
  },
];

export function Inspiration() {
  const [index, setIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { openService } = useProject();
  const touch = useRef({ x: 0, y: 0 });
  const current = references[index ?? 0];
  function change(delta: number) {
    setIndex((v) => ((v ?? 0) + delta + references.length) % references.length);
  }
  return (
    <section
      id="inspiration"
      className="section inspiration-section"
      aria-labelledby="inspiration-heading"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            number="03"
            eyebrow="ВДОХНОВЕНИЕ В ДЕТАЛЯХ"
            title="Представьте, как это может быть"
            description="Архитектурные идеи для вашего будущего пространства. Визуальные референсы, а не портфолио компании."
            id="inspiration-heading"
          />
        </Reveal>
        <div className="inspiration-grid">
          {references.slice(0, expanded ? 4 : 2).map((item, i) => (
            <article className="inspiration-card" key={item.title}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="inspiration-button"
              >
                <div className="inspiration-image">
                  <Image
                    src={assetPath(item.image)}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="reference-tag">Архитектурная идея</span>
                  <span className="gallery-expand" aria-hidden="true">
                    <Expand size={20} />
                  </span>
                </div>
                <div className="inspiration-caption">
                  <div>
                    <p>{item.tag}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="round-arrow" aria-hidden="true">
                    <ArrowUpRight size={23} />
                  </span>
                </div>
                <span className="sr-only">Открыть изображение</span>
              </button>
            </article>
          ))}
        </div>
        <div className="services-more">
          <button
            className="text-link"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Свернуть галерею" : "Больше архитектурных идей"}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <Modal
        open={index !== null}
        onClose={() => setIndex(null)}
        titleId="gallery-title"
      >
        <div
          className="gallery-viewer"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              change(e.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          <div
            className="gallery-full-image"
            onTouchStart={(e) => {
              touch.current = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
              };
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touch.current.x;
              const dy = e.changedTouches[0].clientY - touch.current.y;
              if (Math.abs(dx) > 50 && Math.abs(dy) < 40)
                change(dx < 0 ? 1 : -1);
            }}
          >
            <Image
              src={assetPath(current.image)}
              alt={current.alt}
              fill
              sizes="(max-width: 700px) 100vw, 850px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="gallery-body">
            <div className="gallery-navigation">
              <button
                type="button"
                className="icon-action"
                onClick={() => change(-1)}
                aria-label="Предыдущее изображение"
              >
                <ArrowLeft size={20} />
              </button>
              <p role="status">
                {(index ?? 0) + 1} / {references.length}
              </p>
              <button
                type="button"
                className="icon-action"
                onClick={() => change(1)}
                aria-label="Следующее изображение"
              >
                <ArrowRight size={20} />
              </button>
            </div>
            <h2 id="gallery-title">{current.title}</h2>
            <p className="field-hint">
              Архитектурный референс. Листайте стрелками или свайпом.
            </p>
            <Button
              onClick={() => {
                setIndex(null);
                requestAnimationFrame(() => openService(current.serviceId));
              }}
            >
              Изучить похожее решение <ArrowUpRight size={16} />
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
