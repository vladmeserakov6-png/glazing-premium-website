"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  objects,
  seasons,
  priorities,
  recommend,
  EMPTY_QUIZ,
  isQuiz,
} from "@/content/selection";
import { useBrowserStorage } from "@/lib/browser-storage";
import { useProject, SaveButton } from "@/components/project/project-provider";
import { Button } from "@/components/ui/button";

const steps = [
  {
    key: "object",
    title: "Какое пространство меняем?",
    options: objects,
    label: "Объект",
  },
  {
    key: "season",
    title: "Когда вы будете им пользоваться?",
    options: seasons,
    label: "Сезонность",
  },
  {
    key: "priority",
    title: "Что для вас на первом месте?",
    options: priorities,
    label: "Приоритет",
  },
] as const;

export function SolutionFinder() {
  const [answers, setAnswers] = useBrowserStorage(
    "prosvet:quiz:v1",
    EMPTY_QUIZ,
    isQuiz,
  );
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { openBrief, openService } = useProject();
  const current = steps[step];
  const result = recommend(answers);
  function move(next: number) {
    setStep(next);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  function prepare(serviceId: string) {
    openBrief(serviceId, {
      object:
        answers.object === "Балкон или лоджия"
          ? "Квартира"
          : (answers.object as
              "Квартира" | "Частный дом" | "Терраса или веранда"),
      comment: `Объект: ${answers.object}. Использование: ${answers.season}. Приоритет: ${answers.priority}.`,
    });
  }
  return (
    <section
      id="finder"
      className="section finder-section"
      aria-labelledby="finder-title"
    >
      <div className="container finder-layout">
        <div className="finder-intro">
          <p className="eyebrow">
            <Sparkles size={16} /> От задачи к решению
          </p>
          <h2 id="finder-title">
            Ваше пространство.
            <br />
            <span>Ваш сценарий.</span>
          </h2>
          <p>
            Три вопроса, чтобы наметить подходящее направление. Без телефона и
            предварительных цен.
          </p>
          <ol className="finder-steps" aria-label="Этапы подбора">
            {steps.map((s, i) => (
              <li
                key={s.key}
                aria-current={!complete && step === i ? "step" : undefined}
                className={complete || step > i ? "is-done" : ""}
              >
                <span>
                  {complete || step > i ? <Check size={13} /> : `0${i + 1}`}
                </span>
                {s.label}
              </li>
            ))}
          </ol>
        </div>
        <div className="finder-card">
          {!complete ? (
            <>
              <div className="finder-card-top">
                <span>ШАГ 0{step + 1} / 03</span>
                <span>Ответы сохраняются в этой вкладке</span>
              </div>
              <h3 ref={heading} tabIndex={-1}>
                {current.title}
              </h3>
              <fieldset className="finder-options">
                <legend className="sr-only">{current.title}</legend>
                {current.options.map((option, i) => (
                  <label className="finder-option" key={option}>
                    <input
                      type="radio"
                      aria-label={option}
                      name={current.key}
                      checked={answers[current.key] === option}
                      onChange={() =>
                        setAnswers({ ...answers, [current.key]: option })
                      }
                    />
                    <span className="finder-option-index" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span>{option}</span>
                    <span className="finder-radio" aria-hidden="true" />
                  </label>
                ))}
              </fieldset>
              <div className="finder-actions">
                {step > 0 ? (
                  <button
                    className="text-link"
                    onClick={() => move(step - 1)}
                    type="button"
                  >
                    <ArrowLeft size={16} />
                    Назад
                  </button>
                ) : (
                  <span />
                )}
                <Button
                  disabled={!answers[current.key]}
                  onClick={() => {
                    if (step < 2) move(step + 1);
                    else {
                      setComplete(true);
                      requestAnimationFrame(() =>
                        heading.current?.focus({ preventScroll: true }),
                      );
                    }
                  }}
                >
                  {step === 2 ? "Показать решения" : "Продолжить"}
                  <ArrowRight size={17} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">Направление найдено</p>
              <h3 ref={heading} tabIndex={-1}>
                С чего можно начать
              </h3>
              <p className="finder-result-note">
                {result.note} {result.priorityNote}
              </p>
              <div className="finder-results">
                {result.services.map((s) => (
                  <article key={s.id}>
                    <button
                      type="button"
                      className="finder-result-title"
                      onClick={() => openService(s.id)}
                    >
                      {s.shortTitle}
                      <ArrowUpRight size={18} />
                    </button>
                    <p>{s.description}</p>
                    <SaveButton serviceId={s.id} />
                  </article>
                ))}
              </div>
              <p className="field-hint">
                Это ориентир для обсуждения. Техническая возможность и
                конфигурация зависят от проверки объекта.
              </p>
              <div className="finder-actions">
                <button
                  className="text-link"
                  type="button"
                  onClick={() => {
                    setComplete(false);
                    move(0);
                  }}
                >
                  <RotateCcw size={15} />
                  Изменить ответы
                </button>
                <Button onClick={() => prepare(result.services[0].id)}>
                  В задание <ArrowUpRight size={17} />
                </Button>
              </div>
              <button
                className="finder-reset"
                type="button"
                onClick={() => {
                  setAnswers(EMPTY_QUIZ);
                  setComplete(false);
                  move(0);
                }}
              >
                Удалить ответы и начать заново
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
