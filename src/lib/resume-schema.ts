// Schema de dados único do currículo.
// Todos os templates ("skins") consomem EXATAMENTE este formato.
// Adicionar um campo aqui = disponível para todos os templates de uma vez.

import { Lang } from "./i18n";

export interface SocialLink {
  id: string;
  label: string; // ex: "LinkedIn", "GitHub", "Portfólio"
  url: string;
}

export interface ExperienceItem {
  id: string;
  role: string; // cargo
  company: string;
  location?: string;
  startDate: string; // texto livre: "Jan 2022"
  endDate: string; // "Atual" / "Dez 2023"
  current?: boolean;
  description?: string; // resumo / bullets (markdown leve por linha)
}

export interface EducationItem {
  id: string;
  degree: string; // ex: "Bacharelado em Ciência da Computação"
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  url?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: number; // 1..5 (opcional, alguns templates mostram barra)
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // "Nativo", "Fluente", "Intermediário"...
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeData {
  // Identidade
  fullName: string;
  headline: string; // cargo-alvo / título profissional
  photoUrl?: string; // dataURL (base64) — alguns templates usam foto
  // Contato
  email: string;
  phone: string;
  location: string;
  website?: string;
  socials: SocialLink[];
  // Conteúdo
  summary: string; // resumo / objetivo profissional
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
}

// Configurações visuais aplicáveis por cima de qualquer template.
export interface ResumeSettings {
  templateId: string;
  accentColor: string; // hex
  fontFamily: FontKey;
  language: Lang; // idioma ativo do currículo (rótulos das seções)
}

export type FontKey = "sans" | "serif" | "mono";

// Documento multi-idioma: o conteúdo é mantido por idioma.
export interface ResumeDocument {
  content: Partial<Record<Lang, ResumeData>>;
  settings: ResumeSettings;
}

// ---- Helpers ----

export const uid = () => Math.random().toString(36).slice(2, 10);

export const ACCENT_PRESETS = [
  "#4F46E5", // indigo (padrão da marca)
  "#0EA5E9", // sky
  "#059669", // emerald
  "#DC2626", // red
  "#EA580C", // orange
  "#7C3AED", // violet
  "#DB2777", // pink
  "#0F172A", // slate (sóbrio / ATS)
];

export const FONT_OPTIONS: { key: FontKey; label: string; stack: string }[] = [
  { key: "sans", label: "Sans (moderno)", stack: "var(--font-sans)" },
  { key: "serif", label: "Serif (clássico)", stack: "var(--font-serif)" },
  { key: "mono", label: "Mono (técnico)", stack: "var(--font-mono)" },
];

export const DEFAULT_SETTINGS: ResumeSettings = {
  templateId: "moderno",
  accentColor: "#4F46E5",
  fontFamily: "sans",
  language: "pt",
};
