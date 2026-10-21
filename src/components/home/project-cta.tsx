import { ArrowUpRight } from "lucide-react";
import { BriefButton } from "@/components/project/project-provider";

export function ProjectCta() {
  return (
    <section
      className="project-cta"
      id="project"
      aria-labelledby="project-heading"
    >
      <div className="container project-cta-grid">
        <div>
          <p className="eyebrow">ВАШЕ ПРОСТРАНСТВО. ВАШ СЦЕНАРИЙ.</p>
          <h2 id="project-heading">
            Впустите больше света
            <br />в вашу жизнь<span>.</span>
          </h2>
          <p>
            Начните с идеи. Подготовьте краткое задание
            <br className="desktop-break" /> для обсуждения остекления вашего
            объекта.
          </p>
          <BriefButton variant="light">
            Подготовить задание на расчет <ArrowUpRight size={19} />
          </BriefButton>
          <p className="cta-note">Без предварительных цен и обязательств.</p>
        </div>
        <svg
          viewBox="0 0 390 360"
          fill="none"
          className="cta-window"
          aria-hidden="true"
        >
          <path d="M55 50h280v280H55z" stroke="currentColor" strokeWidth="1" />
          <path
            d="M55 50l95-35h215v280l-30 35M150 15v280M150 295h215M150 295l-95 35M245 25v280M55 165h280M150 120h215"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M55 50l95-35M245 50l30-35M335 165l30-45"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M55 330L5 350M335 330l50 20"
            stroke="currentColor"
            strokeWidth="1"
            opacity=".4"
          />
          <path
            d="M226 190v25M234 190v25"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
