import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceButton } from "@/components/project/project-provider";
import { Reveal } from "@/components/ui/reveal";

const references = [
  {
    image: "/images/architecture.webp",
    title: "Дом, открытый природе",
    tag: "ЗАГОРОДНАЯ АРХИТЕКТУРА",
    serviceId: "cottage-glazing",
    alt: "Стеклянный фасад современного загородного дома в окружении зелени",
  },
  {
    image: "/images/terrace.webp",
    title: "Граница становится невидимой",
    tag: "ТЕРРАСЫ И ВЕРАНДЫ",
    serviceId: "terrace-glazing",
    alt: "Светлая стеклянная терраса с обеденным столом и садом за окнами",
  },
];

export function Inspiration() {
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
          {references.map((item) => (
            <article className="inspiration-card" key={item.title}>
              <ServiceButton
                serviceId={item.serviceId}
                className="inspiration-button"
                aria-label={`Изучить решение: ${item.title}`}
              >
                <div className="inspiration-image">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="reference-tag">Визуальный референс</span>
                </div>
                <div className="inspiration-caption">
                  <div>
                    <p>{item.tag}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="round-arrow">
                    <ArrowUpRight size={23} strokeWidth={1.5} />
                  </span>
                </div>
              </ServiceButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
