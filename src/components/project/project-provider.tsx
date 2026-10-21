"use client";

import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
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
import { ProjectBriefForm } from "./project-brief-form";

type ProjectActions = {
  openBrief: (serviceId?: string) => void;
  openService: (serviceId: string) => void;
};
const ProjectContext = createContext<ProjectActions | null>(null);

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("ProjectProvider is required");
  return context;
}

type ModalState =
  | { kind: "brief"; serviceId?: string }
  | { kind: "service"; serviceId: string }
  | null;

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  const service = services.find((item) => item.id === modal?.serviceId);

  return (
    <ProjectContext.Provider
      value={{
        openBrief: (serviceId) => setModal({ kind: "brief", serviceId }),
        openService: (serviceId) => setModal({ kind: "service", serviceId }),
      }}
    >
      {children}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        titleId="project-modal-title"
      >
        {modal?.kind === "brief" && (
          <ProjectBriefForm
            key={modal.serviceId ?? "general"}
            serviceId={modal.serviceId}
          />
        )}
        {modal?.kind === "service" && service && (
          <div className="service-detail">
            <div className="service-detail-image">
              <Image
                src={service.image}
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
