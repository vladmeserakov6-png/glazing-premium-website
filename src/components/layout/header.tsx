"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Logo } from "./logo";
import { BriefButton } from "@/components/project/project-provider";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav aria-label="Основная навигация" className="desktop-nav">
          {site.navigation.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <BriefButton className="header-cta">
          Обсудить проект <ArrowUpRight size={17} />
        </BriefButton>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        hidden={!open}
        aria-label="Мобильная навигация"
        className="mobile-nav"
      >
        <div className="container">
          {site.navigation.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <BriefButton onClick={() => setOpen(false)}>
            Обсудить проект <ArrowUpRight size={18} />
          </BriefButton>
        </div>
      </nav>
    </header>
  );
}
