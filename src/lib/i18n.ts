// Sistema de currículo multi-idioma.
// - Os RÓTULOS das seções (Experiência, Formação...) traduzem automaticamente.
// - O CONTEÚDO (textos do usuário) é mantido por idioma (ver use-resume).

export type Lang = "pt" | "en" | "es";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export interface SectionLabels {
  summary: string;
  profile: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  projects: string;
  certifications: string;
  contact: string;
}

const LABELS: Record<Lang, SectionLabels> = {
  pt: {
    summary: "Resumo",
    profile: "Perfil",
    experience: "Experiência",
    education: "Formação",
    skills: "Competências",
    languages: "Idiomas",
    projects: "Projetos",
    certifications: "Certificações",
    contact: "Contato",
  },
  en: {
    summary: "Summary",
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certifications: "Certifications",
    contact: "Contact",
  },
  es: {
    summary: "Resumen",
    profile: "Perfil",
    experience: "Experiencia",
    education: "Formación",
    skills: "Competencias",
    languages: "Idiomas",
    projects: "Proyectos",
    certifications: "Certificaciones",
    contact: "Contacto",
  },
};

export function labels(lang: Lang | undefined): SectionLabels {
  return LABELS[lang ?? "pt"];
}
