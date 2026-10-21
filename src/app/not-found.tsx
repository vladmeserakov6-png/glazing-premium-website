import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="not-found container">
      <p className="eyebrow">404 / СТРАНИЦА НЕ НАЙДЕНА</p>
      <h1>
        Здесь пока
        <br />
        нет пространства.
      </h1>
      <p>Вернитесь на главную, чтобы выбрать решение для вашего проекта.</p>
      <Link href="/" className={buttonClass()}>
        <ArrowLeft size={18} />
        На главную
      </Link>
    </main>
  );
}
