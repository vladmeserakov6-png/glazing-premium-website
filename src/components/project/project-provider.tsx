"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, FileText, Heart } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { services } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { ProjectBrief } from "@/lib/project-brief";
import { useBrowserStorage } from "@/lib/browser-storage";
import { EMPTY_SAVED, isSaved } from "@/content/selection";
import { SelectionPanel } from "./selection-panel";
import { assetPath } from "@/lib/paths";

const ProjectBriefForm = dynamic(
  () =>
    import("./project-brief-form").then((module) => module.ProjectBriefForm),
  {
    loading: () => (
      <p className="modal-description" role="status">
        Готовим поля задания…
      </p>
    ),
  },
);

type ProjectActions = {
  openBrief: (serviceId?: string, seed?: Partial<ProjectBrief>) => void;
  openService: (serviceId: string) => void;
  openSelection: () => void;
  saved: string[];
  toggleSaved: (serviceId: string) => void;
};
const ProjectContext = createContext<ProjectActions | null>(null);

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("ProjectProvider is required");
  return context;
}

type ModalState =
  | { kind: "brief"; serviceId?: string; seed?: Partial<ProjectBrief> }
  | { kind: "service"; serviceId: string }
  | { kind: "selection"; serviceId?: undefined }
  | null;

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  const [saved, setSaved] = useBrowserStorage(
    "prosvet:saved:v1",
    EMPTY_SAVED,
    isSaved,
    "localStorage",
  );
  const service = services.find((item) => item.id === modal?.serviceId);

  return (
    <ProjectContext.Provider
      value={{
        openBrief: (serviceId, seed) =>
          setModal({ kind: "brief", serviceId, seed }),
        openService: (serviceId) => setModal({ kind: "service", serviceId }),
        openSelection: () => setModal({ kind: "selection" }),
        saved,
        toggleSaved: (serviceId) => {
          if (services.some((s) => s.id === serviceId)) {
            setSaved((previous) =>
              previous.includes(serviceId)
                ? previous.filter((id) => id !== serviceId)
                : [...previous, serviceId],
            );
          }
        },
      }}
    >
      {children}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        titleId="project-modal-title"
        focusKey={`${modal?.kind}-${modal?.serviceId}`}
      >
        {modal?.kind === "selection" && <SelectionPanel />}
        {modal?.kind === "brief" && (
          <div className="brief-content">
            <p className="eyebrow">
              <FileText size={17} />
              От идеи к решению
            </p>
            <h2 id="project-modal-title">
              Расскажите о<br />
              вашем пространстве
            </h2>
            <ProjectBriefForm
              key={modal.serviceId ?? "general"}
              serviceId={modal.serviceId}
              seed={modal.seed}
              savedTitles={services
                .filter((s) => saved.includes(s.id))
                .map((s) => s.title)}
            />
          </div>
        )}
        {modal?.kind === "service" && service && (
          <div className="service-detail">
            <div className="service-detail-image">
              <Image
                src={assetPath(service.image)}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 700px) 100vw, 640px"
                style={{
                  objectFit: "cover",
                  objectPosition: service.imagePosition,
                }}
              />
              <span className="image-caption">Визуальный референс</span>
            </div>
            <div className="service-detail-body">
              <p className="eyebrow">{service.tag}</p>
              <h2 id="project-modal-title">{service.title}</h2>
              <p className="modal-description">{service.detail}</p>
              <SaveButton serviceId={service.id} />
              <ul className="service-features">
                {service.features.map((feature) => (
                  <li key={feature}>
                    <Check size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  setModal({ kind: "brief", serviceId: service.id })
                }
              >
                Подготовить задание <ArrowUpRight size={18} />
              </Button>
              <p className="field-hint">
                Конфигурация и стоимость требуют уточнения по вашему объекту.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </ProjectContext.Provider>
  );
}

export function SaveButton({ serviceId }: { serviceId: string }) {
  const { saved, toggleSaved } = useProject();
  const selected = saved.includes(serviceId);
  const title = services.find((s) => s.id === serviceId)?.shortTitle;
  return (
    <button
      className="save-button"
      type="button"
      aria-pressed={selected}
      aria-label={`${selected ? "Сохранено. Убрать из избранного" : "Сохранить"}: ${title}`}
      onClick={() => toggleSaved(serviceId)}
    >
      <Heart
        size={16}
        fill={selected ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {selected ? "Сохранено" : "Сохранить"}
    </button>
  );
}

export function SelectionButton({ className = "" }: { className?: string }) {
  const { saved, openSelection } = useProject();
  return (
    <button
      type="button"
      className={`selection-button ${className}`}
      onClick={openSelection}
      aria-label={`Избранное и сравнение: ${saved.length}`}
    >
      <Heart size={19} aria-hidden="true" />
      <span>{saved.length}</span>
    </button>
  );
}

type BriefButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "light" | "outline" | "dark";
  serviceId?: string;
};

export function BriefButton({
  serviceId,
  onClick,
  ...props
}: BriefButtonProps) {
  const { openBrief } = useProject();
  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) openBrief(serviceId);
      }}
    />
  );
}

export function ServiceButton({
  serviceId,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { serviceId: string }) {
  const { openService } = useProject();
  return (
    <button type="button" {...props} onClick={() => openService(serviceId)} />
  );
}
