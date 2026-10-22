"use client";

import { homeAnchor } from "@/lib/paths";

import { ArrowUp, ArrowUpRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useProject } from "@/components/project/project-provider";

export function QuickActions() {
  const [visible, setVisible] = useState(false);
  const { saved, openSelection } = useProject();
  useEffect(() => {
    let frame = 0;
    let wasVisible = false;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = window.scrollY > 600;
        if (next !== wasVisible) {
          wasVisible = next;
          setVisible(next);
        }
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <>
      <nav className="mobile-dock" aria-label="Быстрые действия">
        <a href={homeAnchor("#finder")}>
          Подобрать остекление
          <ArrowUpRight size={18} />
        </a>
        <button
          type="button"
          onClick={openSelection}
          aria-label={`Мое избранное: ${saved.length}`}
        >
          <Heart size={18} />
          {saved.length}
        </button>
      </nav>
      {visible && (
        <a
          className="back-to-top"
          href={homeAnchor("#top")}
          aria-label="Вернуться наверх"
        >
          <ArrowUp size={19} />
        </a>
      )}
    </>
  );
}
