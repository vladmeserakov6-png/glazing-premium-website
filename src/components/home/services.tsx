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
  const featured = [
    "panoramic-glazing",
    "cottage-glazing",
    "balcony-glazing",
    "terrace-glazing",
  ];
  const catalog = [...services].sort((a, b) => {
    const rank = (id: string) =>
      featured.includes(id) ? featured.indexOf(id) : featured.length;
    return rank(a.id) - rank(b.id);
  });
  const filtered = catalog.filter(
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
            eyebrow="УСЛУГИ"
            title="Решения для вашего пространства."
            description="От окна в квартире до панорамного фасада"
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
                    sizes="(max-width: 767px) 50vw, 25vw"
                    style={{
                      objectFit: "cover",
                      objectPosition: service.imagePosition,
                    }}
                  />
                </div>
                <div className="service-card-content">
                  <h3>{service.shortTitle}</h3>
                  <span className="service-arrow" aria-hidden="true">
                    <ArrowUpRight size={19} strokeWidth={1.3} />
                  </span>
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
              {expanded ? "Свернуть каталог" : "Все услуги"}
              <span>{expanded ? "−" : "+4"}</span>
              <ArrowDown size={17} className={expanded ? "rotate-180" : ""} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
