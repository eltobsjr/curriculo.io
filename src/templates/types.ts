import { ComponentType } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";

// Contrato que TODO template deve cumprir.
// Cria um template novo = criar um componente com essa prop e registrá-lo.
export interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export type TemplateComponent = ComponentType<TemplateProps>;

export type TemplateCategory = "Moderno" | "Clássico" | "Minimalista" | "Criativo" | "Profissional";

export interface TemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  // true = formato amigável a sistemas de triagem (ATS): 1 coluna, sem foto/ícones.
  atsFriendly: boolean;
  // permite foto? (templates com sidebar geralmente sim)
  supportsPhoto: boolean;
  Component: TemplateComponent;
}
