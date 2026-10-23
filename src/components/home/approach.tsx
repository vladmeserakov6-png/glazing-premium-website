import Image from "next/image";
import { ArrowUpRight, Ruler, SlidersHorizontal, Layers3 } from "lucide-react";
import { BriefButton } from "@/components/project/project-provider";
import { Reveal } from "@/components/ui/reveal";
import { assetPath } from "@/lib/paths";

const details = [
  {
    Icon: Ruler,
    title: "Начинаем с вашего пространства",
    text: "Назначение помещения, размеры проемов и архитектура задают основу решения.",
  },
  {
    Icon: SlidersHorizontal,
    title: "Сочетаем эстетику и технологию",
    text: "Тип профиля, стеклопакет и открывание рассматриваем как единую систему.",
  },
  {
    Icon: Layers3,
    title: "Учитываем каждую деталь",
    text: "Примыкания, вентиляция и монтаж так же важны, как внешний вид окна.",
  },
];

export function Approach() {
  return (
    <section
      className="section approach-section"
      id="approach"
      aria-labelledby="approach-heading"
    >
      <div className="container approach-grid">
        <div className="approach-image">
          <Image
            src={assetPath("/images/tahion-panoramic.webp")}
            alt="Гостиная, объединенная с садом панорамными окнами — визуальный референс"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover", objectPosition: "65% center" }}
          />
          <div className="approach-image-note">
            <span className="note-line" />
            Вдохновляемся архитектурой.
            <br />
            Думаем о вашей жизни.
          </div>
          <span className="image-reference">Архитектурный референс</span>
        </div>
        <Reveal className="approach-content">
          <p className="eyebrow">
            <span>02</span>ПРОДУМАННЫЙ ПОДХОД
          </p>
          <h2 id="approach-heading">
            Красота снаружи.
            <br />
            <span>Комфорт внутри.</span>
          </h2>
          <p className="approach-intro">
            Хорошее остекление незаметно в повседневной жизни. Вы просто
            наслаждаетесь светом, тишиной и видом из окна.
          </p>
          <div className="approach-details">
            {details.map(({ Icon, title, text }) => (
              <div className="approach-detail" key={title}>
                <Icon size={23} strokeWidth={1.4} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <BriefButton variant="dark">
            Начать с вашей идеи <ArrowUpRight size={18} />
          </BriefButton>
        </Reveal>
      </div>
    </section>
  );
}
