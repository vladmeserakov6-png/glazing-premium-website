import { ArrowUp, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "./logo";
import { BriefButton } from "@/components/project/project-provider";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Logo light />
            <p className="footer-description">
              Больше света.
              <br />
              Больше пространства для жизни.
            </p>
          </div>
          <div className="footer-links">
            <p className="footer-label">Исследуйте</p>
            {site.navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <p className="footer-label">Ваша идея — первый шаг</p>
            <p>
              Начните с описания
              <br />
              вашего пространства.
            </p>
            <BriefButton variant="light">
              Подготовить задание <ArrowUpRight size={18} />
            </BriefButton>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ПРОСВЕТ. Дизайн-концепция.</p>
          <p>Изображения — архитектурные референсы.</p>
          <a href="#top">
            Наверх <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
