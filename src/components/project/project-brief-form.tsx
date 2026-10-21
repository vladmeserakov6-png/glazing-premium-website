"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Download, FileText } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { services } from "@/content/site";
import {
  formatProjectBrief,
  projectBriefSchema,
  type ProjectBrief,
} from "@/lib/project-brief";
import { Button } from "@/components/ui/button";

export function ProjectBriefForm({ serviceId }: { serviceId?: string }) {
  const [downloaded, setDownloaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectBrief>({
    resolver: zodResolver(projectBriefSchema),
    defaultValues: {
      service: serviceId ?? "not-sure",
      object: "Частный дом",
      width: "",
      height: "",
      comment: "",
    },
  });

  function downloadBrief(data: ProjectBrief) {
    const blob = new Blob(["\uFEFF", formatProjectBrief(data)], {
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
    setDownloaded(true);
  }

  return (
    <div className="brief-content">
      <p className="eyebrow">
        <FileText size={17} />
        От идеи к решению
      </p>
      <h2 id="project-modal-title">
        Расскажите о<br />
        вашем пространстве
      </h2>
      <p className="modal-description">
        Подготовьте задание на расчет. Скачайте его и передайте специалисту для
        обсуждения проекта.
      </p>
      <form
        onSubmit={handleSubmit(downloadBrief)}
        noValidate
        onChange={() => setDownloaded(false)}
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
          браузере и никуда не отправляется.
        </p>
        <Button type="submit" className="brief-submit">
          Скачать задание <Download size={18} />
        </Button>
        <p className="download-status" role="status">
          {downloaded && (
            <>
              <Check size={18} />
              Файл подготовлен. Передайте его специалисту. Заявка не отправлена.
            </>
          )}
        </p>
      </form>
    </div>
  );
}
