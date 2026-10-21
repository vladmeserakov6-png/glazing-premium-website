import { AudioLines, ScanLine, Sun } from "lucide-react";

const benefits = [
  {
    Icon: Sun,
    title: "Больше естественного света",
    text: "Продуманное остекление раскрывает пространство и наполняет его светом.",
  },
  {
    Icon: AudioLines,
    title: "Комфорт в каждом сезоне",
    text: "Тепло- и звукоизоляцию подбирают под условия и задачи вашего объекта.",
  },
  {
    Icon: ScanLine,
    title: "Эстетика в каждой детали",
    text: "Профиль, пропорции и цвет становятся частью единой архитектуры.",
  },
];

export function Benefits() {
  return (
    <section className="benefits" aria-label="Возможности современных решений">
      <div className="container benefits-grid">
        {benefits.map(({ Icon, title, text }) => (
          <div key={title} className="benefit">
            <Icon size={29} strokeWidth={1.3} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
