"use client";

import { homeAnchor } from "@/lib/paths";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Logo } from "./logo";
import {
  BriefButton,
  SelectionButton,
} from "@/components/project/project-provider";

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    site.navigation.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

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
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Logo />
        <nav aria-label="Основная навигация" className="desktop-nav">
          {site.navigation.map((link) => (
            <a
              key={link.href}
              href={homeAnchor(link.href)}
              aria-current={active === link.href ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <SelectionButton className="header-saved" />
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
            <a
              key={link.href}
              href={homeAnchor(link.href)}
              onClick={() => setOpen(false)}
            >
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
