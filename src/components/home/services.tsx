"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { categories, services, type ServiceCategory } from "@/content/site";
import {
  ServiceButton,
  SaveButton,
  useProject,
} from "@/components/project/project-provider";
import { assetPath } from "@/lib/paths";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Services() {
  const [category, setCategory] = useState<"all" | ServiceCategory>("all");
  const [expanded, setExpanded] = useState(false);
  const { saved, openSelection } = useProject();
  const filtered = services.filter(
    (service) => category === "all" || category === service.category,
  );
  const visible =
    category === "all" && !expanded ? filtered.slice(0, 4) : filtered;

  return (
    <section
      id="services"
      className="section services-section"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            number="01"
            eyebrow="РЕШЕНИЯ ДЛЯ ВАШЕГО ПРОСТРАНСТВА"
            title="У каждого пространства — свой характер"
            description="От уютного балкона до панорамного фасада. Найдите остекление, которое подходит именно вам."
            id="services-heading"
          />
        </Reveal>
        <div className="catalog-tools">
          <div
            className="service-filters"
            role="group"
            aria-label="Тип объекта"
          >
            {categories.map((item) => (
              <button
                type="button"
                aria-pressed={category === item.id}
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={
                  category === item.id
                    ? "filter-button is-active"
                    : "filter-button"
                }
              >
                {item.label}
                {item.id === "all" && (
                  <span>{services.length.toString().padStart(2, "0")}</span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="catalog-compare"
            onClick={openSelection}
          >
            Избранное и сравнение <span>{saved.length}</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
        <p className="sr-only" role="status">
          Показано решений: {visible.length} из {filtered.length}
        </p>
        <div className="services-grid">
          {visible.map((service) => (
            <article className="service-card" key={service.id}>
              <ServiceButton
                serviceId={service.id}
                className="service-card-button"
                aria-label={`Подробнее: ${service.shortTitle}`}
              >
                <div className="service-image">
                  <Image
                    src={assetPath(service.image)}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 599px) 100vw, (max-width: 1099px) 50vw, 25vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: service.imagePosition,
                    }}
                  />
                  <span className="service-arrow">
                    <ArrowUpRight size={22} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="service-card-content">
                  <h3>{service.shortTitle}</h3>
                </div>
              </ServiceButton>
              <p>{service.description}</p>
              <SaveButton serviceId={service.id} />
            </article>
          ))}
        </div>
        {category === "all" && (
          <div className="services-more">
            <button
              className="text-link"
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Свернуть каталог" : "Все решения по остеклению"}
              <span>{expanded ? "−" : "+4"}</span>
              <ArrowDown size={17} className={expanded ? "rotate-180" : ""} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
