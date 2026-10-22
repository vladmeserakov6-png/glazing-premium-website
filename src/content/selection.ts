import { services } from "./site";

export const EMPTY_SAVED: string[] = [];
export function isSaved(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= services.length &&
    new Set(value).size === value.length &&
    value.every(
      (id) => typeof id === "string" && services.some((s) => s.id === id),
    )
  );
}

export const objects = [
  "Квартира",
  "Частный дом",
  "Балкон или лоджия",
  "Терраса или веранда",
] as const;
export const seasons = [
  "Круглый год",
  "В теплое время",
  "Пока не решил",
] as const;
export const priorities = [
  "Больше света",
  "Меньше шума",
  "Выход в сад",
  "Защита от погоды",
] as const;
export type QuizAnswers = { object: string; season: string; priority: string };
export const EMPTY_QUIZ: QuizAnswers = { object: "", season: "", priority: "" };
export function isQuiz(value: unknown): value is QuizAnswers {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return [
    [objects, v.object],
    [seasons, v.season],
    [priorities, v.priority],
  ].every(
    ([choices, answer]) =>
      answer === "" || (choices as readonly unknown[]).includes(answer),
  );
}

export function recommend(answers: QuizAnswers) {
  let ids: string[];
  if (answers.object === "Балкон или лоджия")
    ids = ["balcony-glazing", "loggia-glazing"];
  else if (answers.object === "Терраса или веранда")
    ids = ["terrace-glazing", "veranda-glazing"];
  else if (answers.object === "Квартира")
    ids = ["plastic-windows", "balcony-glazing"];
  else
    ids =
      answers.priority === "Больше света"
        ? ["panoramic-glazing", "aluminum-windows"]
        : ["cottage-glazing", "panoramic-glazing"];
  const note =
    answers.season === "Круглый год"
      ? "Для отапливаемого помещения важно рассмотреть теплую систему, вентиляцию и утепление всего контура."
      : answers.season === "В теплое время"
        ? "Для сезонного использования можно рассмотреть защиту от ветра и осадков. Это не заменяет теплый контур."
        : "Перед выбором определите, будет ли помещение отапливаться: от этого зависит тип системы.";
  const priorityNote =
    {
      "Меньше шума":
        "Обсудите состав стеклопакета, герметичность и вентиляцию с учетом источника шума.",
      "Выход в сад":
        "Проверьте ширину прохода, направление открывания, порог и водоотвод.",
      "Больше света":
        "Учтите ориентацию фасада, затенение и защиту от перегрева.",
      "Защита от погоды":
        "Уделите внимание примыканиям, отводу воды и ветровым нагрузкам.",
    }[answers.priority] ?? "";
  return {
    services: services.filter((s) => ids.includes(s.id)),
    note,
    priorityNote,
  };
}
