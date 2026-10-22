"use client";

import { useState } from "react";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { services, categories } from "@/content/site";
import { useProject } from "./project-provider";
import { Button } from "@/components/ui/button";

export function SelectionPanel() {
  const { saved, toggleSaved, openService, openBrief } = useProject();
  const [compared, setCompared] = useState<string[]>(saved.slice(0, 3));
  const selected = services.filter((s) => saved.includes(s.id));
  const comparison = selected.filter((s) => compared.includes(s.id));
  return (
    <div className="brief-content selection-panel">
      <p className="eyebrow">Ваш короткий список</p>
      <h2 id="project-modal-title" tabIndex={-1}>
        Избранное и сравнение
      </h2>
      <p className="modal-description">
        Сохраните интересные решения и сравните до трех вариантов. Избранное
        остается в этом браузере. Его можно удалить в любой момент.
      </p>
      {selected.length === 0 ? (
        <div className="empty-selection">
          <p>Пока здесь пусто. Нажмите «Сохранить» у решения в каталоге.</p>
          <Button onClick={() => openService("panoramic-glazing")}>
            Посмотреть панорамное остекление <ArrowUpRight size={16} />
          </Button>
        </div>
      ) : (
        <>
          <div className="saved-list">
            {selected.map((s) => (
              <div className="saved-row" key={s.id}>
                <label className="compare-check">
                  <input
                    type="checkbox"
                    checked={compared.includes(s.id)}
                    disabled={
                      !compared.includes(s.id) && comparison.length >= 3
                    }
                    onChange={(e) =>
                      setCompared(
                        e.target.checked
                          ? [...comparison.map((v) => v.id), s.id]
                          : compared.filter((id) => id !== s.id),
                      )
                    }
                  />
                  <span>{s.shortTitle}</span>
                </label>
                <button
                  type="button"
                  className="icon-action"
                  onClick={() => toggleSaved(s.id)}
                  aria-label={`Удалить: ${s.shortTitle}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <p className="field-hint" id="compare-help">
            Отметьте до трех решений. Сравниваются сценарии применения;
            характеристики конкретной системы уточняются по объекту.
          </p>
          {comparison.length > 0 && (
            <div
              className="comparison-scroll"
              role="region"
              aria-label="Таблица сравнения решений"
              tabIndex={0}
            >
              <table className="comparison-table">
                <caption className="sr-only">
                  Сравнение выбранных решений
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Что сравниваем</th>
                    {comparison.map((s) => (
                      <th scope="col" key={s.id}>
                        {s.shortTitle}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Где рассмотреть</th>
                    {comparison.map((s) => (
                      <td key={s.id}>
                        {categories.find((c) => c.id === s.category)?.label}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Основная идея</th>
                    {comparison.map((s) => (
                      <td key={s.id}>{s.description}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Что обсудить</th>
                    {comparison.map((s) => (
                      <td key={s.id}>
                        <ul>
                          {s.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Подробнее</th>
                    {comparison.map((s) => (
                      <td key={s.id}>
                        <button
                          className="text-link"
                          onClick={() => openService(s.id)}
                          type="button"
                          aria-label={`Изучить: ${s.title}`}
                        >
                          Изучить <ArrowUpRight size={16} />
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <Button className="selection-brief" onClick={() => openBrief()}>
            Включить избранное в задание <ArrowUpRight size={17} />
          </Button>
        </>
      )}
    </div>
  );
}
