import { Plus } from "lucide-react";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <section
      id="faq"
      className="section faq-section"
      aria-labelledby="faq-heading"
    >
      <div className="container faq-grid">
        <div>
          <p className="eyebrow">
            <span>04</span>ОТВЕЧАЕМ НА ВОПРОСЫ
          </p>
          <h2 id="faq-heading">
            Важное
            <br />
            об остеклении
          </h2>
          <p className="faq-description">
            Несколько ориентиров, которые помогут сделать осознанный выбор.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details className="faq-item" key={faq.question} name="glazing-faq">
              <summary>
                <span className="faq-number">0{index + 1}</span>
                <span>{faq.question}</span>
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
