"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { services } from "@/content/site";
import {
  formatProjectBrief,
  projectBriefSchema,
  type ProjectBrief,
  EMPTY_BRIEF,
  isProjectDraft,
} from "@/lib/project-brief";
import { Button } from "@/components/ui/button";
import { useBrowserStorage } from "@/lib/browser-storage";

export function ProjectBriefForm({
  serviceId,
  seed,
  savedTitles = [],
}: {
  serviceId?: string;
  seed?: Partial<ProjectBrief>;
  savedTitles?: string[];
}) {
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useBrowserStorage(
    "prosvet:brief:v1",
    EMPTY_BRIEF,
    isProjectDraft,
  );
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectBrief>({
    resolver: zodResolver(projectBriefSchema),
    defaultValues: { ...draft, ...seed, service: serviceId ?? draft.service },
  });
  const values: ProjectBrief = { ...EMPTY_BRIEF, ...useWatch({ control }) };
  const text = formatProjectBrief(values, savedTitles);

  function downloadBrief(data: ProjectBrief) {
    const blob = new Blob(["\uFEFF", formatProjectBrief(data, savedTitles)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Задание-на-остекление.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDraft(data);
    setStatus(
      "Файл подготовлен. Передайте его специалисту. Заявка не отправлена.",
    );
  }

  async function copyBrief(data: ProjectBrief) {
    try {
      await navigator.clipboard.writeText(
        formatProjectBrief(data, savedTitles),
      );
      setStatus(
        "Задание скопировано. Передайте его специалисту. Заявка не отправлена.",
      );
    } catch {
      setStatus(
        "Копирование недоступно. Откройте «Текст задания» и скопируйте его вручную или скачайте файл.",
      );
    }
  }

  return (
    <>
      <p className="modal-description">
        Подготовьте задание на расчет. Скачайте его и передайте специалисту для
        обсуждения проекта.
      </p>
      <form
        onSubmit={handleSubmit(downloadBrief)}
        noValidate
        onChange={() => {
          setStatus("");
          setDraft(getValues());
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="brief-object">Ваш объект</label>
            <select
              id="brief-object"
              {...register("object")}
              aria-invalid={!!errors.object}
              aria-describedby={errors.object ? "object-error" : undefined}
            >
              {[
                "Квартира",
                "Частный дом",
                "Терраса или веранда",
                "Другой объект",
              ].map((object) => (
                <option key={object}>{object}</option>
              ))}
            </select>
            {errors.object && (
              <p className="field-error" id="object-error">
                {errors.object.message}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="brief-service">Интересующее решение</label>
            <select
              id="brief-service"
              {...register("service")}
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? "service-error" : undefined}
            >
              <option value="not-sure">Нужна помощь с выбором</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="field-error" id="service-error">
                {errors.service.message}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="brief-width">
              Ширина проема, мм <span>необязательно</span>
            </label>
            <input
              id="brief-width"
              type="number"
              inputMode="numeric"
              min="100"
              max="50000"
              step="1"
              placeholder="Например, 2400"
              {...register("width")}
              aria-invalid={!!errors.width}
              aria-describedby={
                errors.width ? "width-error" : "dimensions-note"
              }
            />
            {errors.width && (
              <p className="field-error" id="width-error">
                {errors.width.message}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="brief-height">
              Высота проема, мм <span>необязательно</span>
            </label>
            <input
              id="brief-height"
              type="number"
              inputMode="numeric"
              min="100"
              max="50000"
              step="1"
              placeholder="Например, 2700"
              {...register("height")}
              aria-invalid={!!errors.height}
              aria-describedby={
                errors.height ? "height-error" : "dimensions-note"
              }
            />
            {errors.height && (
              <p className="field-error" id="height-error">
                {errors.height.message}
              </p>
            )}
          </div>
        </div>
        <p className="field-hint" id="dimensions-note">
          Примерные размеры помогут в обсуждении, но не заменяют замер.
        </p>
        <div className="field">
          <label htmlFor="brief-comment">
            Что для вас важно? <span>необязательно</span>
          </label>
          <textarea
            id="brief-comment"
            rows={3}
            placeholder="Например: сохранить вид на сад и предусмотреть выход на террасу"
            {...register("comment")}
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? "comment-error" : "privacy-note"}
          />
          {errors.comment && (
            <p className="field-error" id="comment-error">
              {errors.comment.message}
            </p>
          )}
        </div>
        <p className="field-hint" id="privacy-note">
          Не указывайте персональные данные. Задание формируется в вашем
          браузере и никуда не отправляется. Черновик сохраняется в этой
          вкладке.
        </p>
        {savedTitles.length > 0 && (
          <p className="brief-saved-note">
            В задание включено избранное: {savedTitles.join(" · ")}
          </p>
        )}
        <div className="brief-actions">
          <Button
            type="submit"
            className="brief-submit"
            disabled={isSubmitting}
          >
            Скачать задание <Download size={18} />
          </Button>
          <Button
            variant="dark"
            disabled={isSubmitting}
            onClick={handleSubmit(copyBrief)}
          >
            {isSubmitting ? "Подготовка…" : "Копировать текст"}
            <Copy size={17} />
          </Button>
        </div>
        <p className="download-status" role="status">
          {status && (
            <>
              <Check size={18} />
              {status}
            </>
          )}
        </p>
        <details className="brief-preview">
          <summary>Текст задания</summary>
          <label className="sr-only" htmlFor="brief-text">
            Текст задания для ручного копирования
          </label>
          <textarea id="brief-text" readOnly value={text} rows={10} />
        </details>
        <button
          type="button"
          className="text-link draft-reset"
          onClick={() => {
            reset(EMPTY_BRIEF);
            setDraft(EMPTY_BRIEF);
            setStatus("Черновик очищен.");
          }}
        >
          <RotateCcw size={15} />
          Очистить черновик
        </button>
      </form>
    </>
  );
}
