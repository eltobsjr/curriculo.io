"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LANGUAGES, Lang } from "./i18n";

// i18n da INTERFACE do app (separado do idioma do currículo).
export type UiLang = Lang; // "pt" | "en" | "es"

export const UI_LANGUAGES = LANGUAGES;

type Dict = Record<string, string>;

const PT: Dict = {
  // header
  "header.downloadPdf": "Baixar PDF",
  "header.templates": "Modelos",
  "header.support": "Apoiar",
  "header.fontSize": "Tamanho da fonte da interface",
  "header.decreaseFont": "Diminuir fonte",
  "header.increaseFont": "Aumentar fonte",
  "header.resumeFont": "Fonte do currículo",
  "header.resumeLanguage": "Idioma do currículo",
  "header.uiLanguage": "Idioma do app",
  // banner
  "banner.free": "100% grátis",
  "banner.noSignup": "Sem cadastro",
  "banner.noWatermark": "Sem marca d'água",
  "banner.dataLocal": "Seus dados ficam só no seu navegador",
  // tabs
  "tabs.edit": "✏️ Editar",
  "tabs.preview": "👁️ Visualizar",
  // editor toolbar
  "editor.guided": "🧭 Guiado",
  "editor.advanced": "⚡ Avançado",
  "editor.example": "exemplo",
  "editor.export": "exportar",
  "editor.import": "importar",
  "editor.clear": "limpar",
  "editor.autosaved": "💾 Salvo automaticamente no seu navegador.",
  // quality
  "quality.title": "Qualidade",
  "quality.great": "Ótimo!",
  "quality.almost": "Quase lá",
  "quality.improve": "Vamos melhorar",
  "quality.allGood": "Tudo certo! 🎉",
  "quality.suggestions": "{n} sugestão(ões) para melhorar",
  // guided
  "guided.step": "Passo {a} de {b}",
  "guided.percent": "{p}% completo",
  "guided.back": "← Voltar",
  "guided.continue": "Continuar →",
  "guided.finish": "✓ Concluir e ver resultado",
  // onboarding
  "onb.title": "Vamos criar seu currículo 🎉",
  "onb.subtitle": "Grátis, em minutos, e sem cadastro. Como você prefere começar?",
  "onb.guidedTitle": "Modo Guiado",
  "onb.recommended": "recomendado",
  "onb.guidedDesc": "Passo a passo, com dicas. Ideal para a primeira vez.",
  "onb.advancedTitle": "Modo Avançado",
  "onb.advancedDesc": "Tudo em uma tela, edição livre. Para quem já tem prática.",
  "onb.example": "Ou veja um exemplo pronto para se inspirar →",
  // support modal
  "support.title": "Apoie o Currículo.io",
  "support.desc": "Esta ferramenta é grátis, sem cadastro e sem marca d'água. Se ela te ajudou a conquistar uma oportunidade, um Pix de qualquer valor mantém o projeto vivo. 🙏",
  "support.pixKey": "Chave Pix",
  "support.copy": "Copiar",
  "support.copied": "✓ Copiado",
  "support.notConfigured": "⚙️ Configure sua chave Pix em src/lib/monetization.ts para ativar o botão de apoio.",
  "support.close": "Fechar",
  // post-download modal
  "post.title": "Currículo pronto!",
  "post.subtitle": "Agora dê o próximo passo: estas vagas estão esperando o seu currículo.",
  "post.supportCta": "❤️ Gostou? Apoie o projeto com um Pix.",
  "post.support": "Apoiar",
  "post.keepEditing": "Continuar editando",
  "post.sponsored": "Alguns links podem ser patrocinados.",
  // gallery
  "gallery.title": "Escolha um modelo",
  "gallery.count": "{n} modelos · clique para aplicar",
  // seções do editor
  "section.pessoal.title": "Dados pessoais",
  "section.pessoal.help": "Comece pelo essencial: seu nome, o cargo que busca e como te encontrar.",
  "section.resumo.title": "Resumo profissional",
  "section.resumo.help": "Em 2–3 frases, diga quem você é, sua experiência e o que procura. É a primeira coisa que leem.",
  "section.experiencia.title": "Experiência profissional",
  "section.experiencia.help": "Liste seus empregos do mais recente ao mais antigo. Descreva conquistas (não só tarefas).",
  "section.formacao.title": "Formação acadêmica",
  "section.formacao.help": "Curso, instituição e período. Pode incluir cursos técnicos e bootcamps.",
  "section.competencias.title": "Competências",
  "section.competencias.help": "Suas principais habilidades. O sistema de triagem (ATS) procura por elas — capriche!",
  "section.idiomas.title": "Idiomas",
  "section.idiomas.help": "Idiomas que você fala e o nível (Nativo, Fluente, Intermediário, Básico).",
  "section.projetos.title": "Projetos (opcional)",
  "section.projetos.help": "Projetos pessoais, freelances ou trabalhos voluntários que mostram seu valor.",
  "section.certificacoes.title": "Certificações (opcional)",
  "section.certificacoes.help": "Cursos e certificados relevantes para a vaga.",
  // quality checks
  "check.name.label": "Nome e título preenchidos",
  "check.name.hint": "Adicione seu nome completo e o cargo-alvo no topo.",
  "check.contact.label": "Contato completo (e-mail + telefone)",
  "check.contact.hint": "Recrutadores precisam de e-mail e telefone para te chamar.",
  "check.summary.label": "Resumo profissional",
  "check.summary.hint": "Escreva um resumo curto (30–60 palavras) sobre você.",
  "check.experience.label": "Pelo menos uma experiência",
  "check.experience.hint": "Adicione experiências profissionais ou projetos relevantes.",
  "check.verbs.label": "Verbos de ação nas experiências",
  "check.verbs.hint": "Comece os bullets com verbos como 'Liderou', 'Aumentou', 'Criou'.",
  "check.metrics.label": "Resultados com números",
  "check.metrics.hint": "Quantifique: 'aumentou vendas em 30%' impressiona mais.",
  "check.skills.label": "Competências (mín. 4)",
  "check.skills.hint": "Liste suas principais habilidades — o ATS busca por elas.",
  "check.education.label": "Formação acadêmica",
  "check.education.hint": "Inclua sua formação (curso, instituição, período).",
  // preview pagination
  "preview.continues": "continua →",
  "preview.page": "Página {n}",
  // misc
  "common.close": "Fechar",
};

const EN: Dict = {
  "header.downloadPdf": "Download PDF",
  "header.templates": "Templates",
  "header.support": "Support",
  "header.fontSize": "Interface font size",
  "header.decreaseFont": "Decrease font",
  "header.increaseFont": "Increase font",
  "header.resumeFont": "Resume font",
  "header.resumeLanguage": "Resume language",
  "header.uiLanguage": "App language",
  "banner.free": "100% free",
  "banner.noSignup": "No sign-up",
  "banner.noWatermark": "No watermark",
  "banner.dataLocal": "Your data stays only in your browser",
  "tabs.edit": "✏️ Edit",
  "tabs.preview": "👁️ Preview",
  "editor.guided": "🧭 Guided",
  "editor.advanced": "⚡ Advanced",
  "editor.example": "example",
  "editor.export": "export",
  "editor.import": "import",
  "editor.clear": "clear",
  "editor.autosaved": "💾 Saved automatically in your browser.",
  "quality.title": "Quality",
  "quality.great": "Great!",
  "quality.almost": "Almost there",
  "quality.improve": "Let's improve",
  "quality.allGood": "All set! 🎉",
  "quality.suggestions": "{n} suggestion(s) to improve",
  "guided.step": "Step {a} of {b}",
  "guided.percent": "{p}% complete",
  "guided.back": "← Back",
  "guided.continue": "Continue →",
  "guided.finish": "✓ Finish and see result",
  "onb.title": "Let's build your resume 🎉",
  "onb.subtitle": "Free, in minutes, no sign-up. How would you like to start?",
  "onb.guidedTitle": "Guided mode",
  "onb.recommended": "recommended",
  "onb.guidedDesc": "Step by step, with tips. Great for your first time.",
  "onb.advancedTitle": "Advanced mode",
  "onb.advancedDesc": "Everything on one screen, free editing. For experienced users.",
  "onb.example": "Or see a ready example for inspiration →",
  "support.title": "Support Currículo.io",
  "support.desc": "This tool is free, no sign-up and no watermark. If it helped you land an opportunity, a donation of any amount keeps the project alive. 🙏",
  "support.pixKey": "Pix key",
  "support.copy": "Copy",
  "support.copied": "✓ Copied",
  "support.notConfigured": "⚙️ Set your Pix key in src/lib/monetization.ts to enable the support button.",
  "support.close": "Close",
  "post.title": "Resume ready!",
  "post.subtitle": "Now take the next step: these jobs are waiting for your resume.",
  "post.supportCta": "❤️ Liked it? Support the project.",
  "post.support": "Support",
  "post.keepEditing": "Keep editing",
  "post.sponsored": "Some links may be sponsored.",
  "gallery.title": "Choose a template",
  "gallery.count": "{n} templates · click to apply",
  "section.pessoal.title": "Personal details",
  "section.pessoal.help": "Start with the essentials: your name, target role and how to reach you.",
  "section.resumo.title": "Professional summary",
  "section.resumo.help": "In 2–3 sentences, say who you are, your experience and what you're after. It's read first.",
  "section.experiencia.title": "Work experience",
  "section.experiencia.help": "List your jobs from most recent to oldest. Describe achievements (not just tasks).",
  "section.formacao.title": "Education",
  "section.formacao.help": "Course, institution and period. You can include technical courses and bootcamps.",
  "section.competencias.title": "Skills",
  "section.competencias.help": "Your main skills. The applicant tracking system (ATS) looks for them — nail it!",
  "section.idiomas.title": "Languages",
  "section.idiomas.help": "Languages you speak and the level (Native, Fluent, Intermediate, Basic).",
  "section.projetos.title": "Projects (optional)",
  "section.projetos.help": "Personal projects, freelance or volunteer work that shows your value.",
  "section.certificacoes.title": "Certifications (optional)",
  "section.certificacoes.help": "Courses and certificates relevant to the role.",
  "check.name.label": "Name and title filled in",
  "check.name.hint": "Add your full name and target role at the top.",
  "check.contact.label": "Complete contact (email + phone)",
  "check.contact.hint": "Recruiters need email and phone to reach you.",
  "check.summary.label": "Professional summary",
  "check.summary.hint": "Write a short summary (30–60 words) about yourself.",
  "check.experience.label": "At least one experience",
  "check.experience.hint": "Add relevant work experience or projects.",
  "check.verbs.label": "Action verbs in experience",
  "check.verbs.hint": "Start bullets with verbs like 'Led', 'Increased', 'Built'.",
  "check.metrics.label": "Results with numbers",
  "check.metrics.hint": "Quantify: 'increased sales by 30%' stands out more.",
  "check.skills.label": "Skills (min. 4)",
  "check.skills.hint": "List your main skills — the ATS searches for them.",
  "check.education.label": "Education",
  "check.education.hint": "Include your education (course, institution, period).",
  "preview.continues": "continues →",
  "preview.page": "Page {n}",
  "common.close": "Close",
};

const ES: Dict = {
  "header.downloadPdf": "Descargar PDF",
  "header.templates": "Plantillas",
  "header.support": "Apoyar",
  "header.fontSize": "Tamaño de fuente de la interfaz",
  "header.decreaseFont": "Reducir fuente",
  "header.increaseFont": "Aumentar fuente",
  "header.resumeFont": "Fuente del currículum",
  "header.resumeLanguage": "Idioma del currículum",
  "header.uiLanguage": "Idioma de la app",
  "banner.free": "100% gratis",
  "banner.noSignup": "Sin registro",
  "banner.noWatermark": "Sin marca de agua",
  "banner.dataLocal": "Tus datos quedan solo en tu navegador",
  "tabs.edit": "✏️ Editar",
  "tabs.preview": "👁️ Vista previa",
  "editor.guided": "🧭 Guiado",
  "editor.advanced": "⚡ Avanzado",
  "editor.example": "ejemplo",
  "editor.export": "exportar",
  "editor.import": "importar",
  "editor.clear": "limpiar",
  "editor.autosaved": "💾 Guardado automáticamente en tu navegador.",
  "quality.title": "Calidad",
  "quality.great": "¡Excelente!",
  "quality.almost": "Casi listo",
  "quality.improve": "A mejorar",
  "quality.allGood": "¡Todo listo! 🎉",
  "quality.suggestions": "{n} sugerencia(s) para mejorar",
  "guided.step": "Paso {a} de {b}",
  "guided.percent": "{p}% completo",
  "guided.back": "← Volver",
  "guided.continue": "Continuar →",
  "guided.finish": "✓ Finalizar y ver el resultado",
  "onb.title": "Vamos a crear tu currículum 🎉",
  "onb.subtitle": "Gratis, en minutos y sin registro. ¿Cómo prefieres empezar?",
  "onb.guidedTitle": "Modo Guiado",
  "onb.recommended": "recomendado",
  "onb.guidedDesc": "Paso a paso, con consejos. Ideal para la primera vez.",
  "onb.advancedTitle": "Modo Avanzado",
  "onb.advancedDesc": "Todo en una pantalla, edición libre. Para quien ya tiene práctica.",
  "onb.example": "O mira un ejemplo listo para inspirarte →",
  "support.title": "Apoya Currículo.io",
  "support.desc": "Esta herramienta es gratis, sin registro y sin marca de agua. Si te ayudó a conseguir una oportunidad, una donación de cualquier valor mantiene vivo el proyecto. 🙏",
  "support.pixKey": "Clave Pix",
  "support.copy": "Copiar",
  "support.copied": "✓ Copiado",
  "support.notConfigured": "⚙️ Configura tu clave Pix en src/lib/monetization.ts para activar el botón de apoyo.",
  "support.close": "Cerrar",
  "post.title": "¡Currículum listo!",
  "post.subtitle": "Ahora da el siguiente paso: estos empleos esperan tu currículum.",
  "post.supportCta": "❤️ ¿Te gustó? Apoya el proyecto.",
  "post.support": "Apoyar",
  "post.keepEditing": "Seguir editando",
  "post.sponsored": "Algunos enlaces pueden ser patrocinados.",
  "gallery.title": "Elige una plantilla",
  "gallery.count": "{n} plantillas · clic para aplicar",
  "section.pessoal.title": "Datos personales",
  "section.pessoal.help": "Empieza por lo esencial: tu nombre, el puesto que buscas y cómo contactarte.",
  "section.resumo.title": "Resumen profesional",
  "section.resumo.help": "En 2–3 frases, di quién eres, tu experiencia y qué buscas. Es lo primero que leen.",
  "section.experiencia.title": "Experiencia laboral",
  "section.experiencia.help": "Lista tus empleos del más reciente al más antiguo. Describe logros (no solo tareas).",
  "section.formacao.title": "Formación académica",
  "section.formacao.help": "Curso, institución y periodo. Puedes incluir cursos técnicos y bootcamps.",
  "section.competencias.title": "Competencias",
  "section.competencias.help": "Tus principales habilidades. El sistema de selección (ATS) las busca — ¡cuídalas!",
  "section.idiomas.title": "Idiomas",
  "section.idiomas.help": "Idiomas que hablas y el nivel (Nativo, Fluido, Intermedio, Básico).",
  "section.projetos.title": "Proyectos (opcional)",
  "section.projetos.help": "Proyectos personales, freelance o voluntariado que muestran tu valor.",
  "section.certificacoes.title": "Certificaciones (opcional)",
  "section.certificacoes.help": "Cursos y certificados relevantes para el puesto.",
  "check.name.label": "Nombre y título completos",
  "check.name.hint": "Añade tu nombre completo y el puesto objetivo arriba.",
  "check.contact.label": "Contacto completo (correo + teléfono)",
  "check.contact.hint": "Los reclutadores necesitan correo y teléfono para contactarte.",
  "check.summary.label": "Resumen profesional",
  "check.summary.hint": "Escribe un resumen corto (30–60 palabras) sobre ti.",
  "check.experience.label": "Al menos una experiencia",
  "check.experience.hint": "Añade experiencia laboral o proyectos relevantes.",
  "check.verbs.label": "Verbos de acción en la experiencia",
  "check.verbs.hint": "Empieza con verbos como 'Lideró', 'Aumentó', 'Creó'.",
  "check.metrics.label": "Resultados con números",
  "check.metrics.hint": "Cuantifica: 'aumentó ventas un 30%' destaca más.",
  "check.skills.label": "Competencias (mín. 4)",
  "check.skills.hint": "Lista tus principales habilidades — el ATS las busca.",
  "check.education.label": "Formación académica",
  "check.education.hint": "Incluye tu formación (curso, institución, periodo).",
  "preview.continues": "continúa →",
  "preview.page": "Página {n}",
  "common.close": "Cerrar",
};

const DICTS: Record<UiLang, Dict> = { pt: PT, en: EN, es: ES };

const KEY = "curriculo-io:ui-lang:v1";

type Ctx = { lang: UiLang; setLang: (l: UiLang) => void; t: (key: string, vars?: Record<string, string | number>) => string };

const I18nCtx = createContext<Ctx>({ lang: "pt", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UiLang>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as UiLang | null;
      if (saved && DICTS[saved]) setLangState(saved);
      else {
        const nav = navigator.language.slice(0, 2);
        if (nav === "en" || nav === "es") setLangState(nav);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: UiLang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = DICTS[lang][key] ?? DICTS.pt[key] ?? key;
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  };

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useT = () => useContext(I18nCtx);
