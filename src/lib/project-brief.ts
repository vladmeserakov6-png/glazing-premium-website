import { z } from "zod";
import { services } from "@/content/site";

const dimension = z
  .string()
  .trim()
  .refine(
    (value) =>
      value === "" ||
      (/^\d+$/.test(value) && Number(value) >= 100 && Number(value) <= 50000),
    "Укажите целое число от 100 до 50 000 мм или оставьте поле пустым",
  );

export const projectBriefSchema = z.object({
  service: z
    .string()
    .refine(
      (value) =>
        value === "not-sure" ||
        services.some((service) => service.id === value),
      "Выберите решение из списка",
    ),
  object: z.enum([
    "Квартира",
    "Частный дом",
    "Терраса или веранда",
    "Другой объект",
  ]),
  width: dimension,
  height: dimension,
  comment: z
    .string()
    .trim()
    .max(1000, "Пожалуйста, сократите описание до 1000 символов"),
});

export type ProjectBrief = z.infer<typeof projectBriefSchema>;

export function formatProjectBrief(data: ProjectBrief) {
  const title =
    services.find((service) => service.id === data.service)?.title ??
    "Нужна помощь с выбором";
  return [
    "ЗАДАНИЕ НА РАСЧЕТ ОСТЕКЛЕНИЯ",
    "",
    `Объект: ${data.object}`,
    `Решение: ${title}`,
    `Примерная ширина проема: ${data.width ? `${data.width} мм` : "требует уточнения"}`,
    `Примерная высота проема: ${data.height ? `${data.height} мм` : "требует уточнения"}`,
    `Пожелания: ${data.comment || "требуют уточнения"}`,
    "",
    "Размеры предварительные и не заменяют профессиональный замер.",
    "Стоимость и техническая возможность определяются после проверки объекта.",
    "Этот файл подготовлен локально. Заявка не отправлена и не принята в работу.",
    "Передайте задание выбранному специалисту для обсуждения.",
  ].join("\n");
}
