import { ResumeData } from "./resume-schema";

// ---- Verbos de ação (PT-BR) para o assistente de escrita ----
export const ACTION_VERBS = [
  "Liderou", "Desenvolveu", "Criou", "Implementou", "Aumentou", "Reduziu",
  "Otimizou", "Coordenou", "Gerenciou", "Lançou", "Projetou", "Automatizou",
  "Negociou", "Treinou", "Conquistou", "Melhorou", "Estruturou", "Entregou",
  "Planejou", "Analisou", "Construiu", "Acelerou", "Simplificou", "Escalou",
];

// Frases-modelo (método STAR) para inspirar bullets de impacto.
export const BULLET_TEMPLATES = [
  "Aumentou [métrica] em [X]% ao [ação realizada].",
  "Reduziu [custo/tempo] em [X]% através de [iniciativa].",
  "Liderou equipe de [N] pessoas na entrega de [projeto].",
  "Implementou [solução] que resultou em [resultado mensurável].",
  "Otimizou [processo], economizando [tempo/recurso] por [período].",
];

export interface QualityCheck {
  id: string;
  label: string;
  ok: boolean;
  hint: string;
  weight: number;
}

// Avalia o currículo e devolve uma lista de checagens + pontuação 0..100.
export function evaluateResume(data: ResumeData): { score: number; checks: QualityCheck[] } {
  const expText = data.experiences.map((e) => e.description ?? "").join(" ").toLowerCase();
  const hasMetrics = /\d/.test(data.experiences.map((e) => e.description ?? "").join(" "));
  const hasActionVerb = ACTION_VERBS.some((v) => expText.includes(v.toLowerCase()));
  const summaryWords = data.summary.trim().split(/\s+/).filter(Boolean).length;

  const checks: QualityCheck[] = [
    {
      id: "name",
      label: "Nome e título preenchidos",
      ok: !!data.fullName.trim() && !!data.headline.trim(),
      hint: "Adicione seu nome completo e o cargo-alvo no topo.",
      weight: 15,
    },
    {
      id: "contact",
      label: "Contato completo (e-mail + telefone)",
      ok: !!data.email.trim() && !!data.phone.trim(),
      hint: "Recrutadores precisam de e-mail e telefone para te chamar.",
      weight: 15,
    },
    {
      id: "summary",
      label: "Resumo profissional (30–60 palavras)",
      ok: summaryWords >= 25 && summaryWords <= 90,
      hint: summaryWords < 25 ? "Escreva um resumo curto sobre você." : "Resumo muito longo — seja conciso.",
      weight: 12,
    },
    {
      id: "experience",
      label: "Pelo menos uma experiência",
      ok: data.experiences.length >= 1,
      hint: "Adicione experiências profissionais ou projetos relevantes.",
      weight: 18,
    },
    {
      id: "verbs",
      label: "Verbos de ação nas experiências",
      ok: hasActionVerb,
      hint: "Comece os bullets com verbos como 'Liderou', 'Aumentou', 'Criou'.",
      weight: 12,
    },
    {
      id: "metrics",
      label: "Resultados com números",
      ok: hasMetrics,
      hint: "Quantifique: 'aumentou vendas em 30%' impressiona mais que 'aumentou vendas'.",
      weight: 13,
    },
    {
      id: "skills",
      label: "Competências (mín. 4)",
      ok: data.skills.length >= 4,
      hint: "Liste suas principais habilidades — o ATS busca por elas.",
      weight: 10,
    },
    {
      id: "education",
      label: "Formação acadêmica",
      ok: data.education.length >= 1,
      hint: "Inclua sua formação (curso, instituição, período).",
      weight: 5,
    },
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.filter((c) => c.ok).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((got / total) * 100);
  return { score, checks };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "#059669"; // emerald
  if (score >= 50) return "#EA580C"; // orange
  return "#DC2626"; // red
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Ótimo!";
  if (score >= 50) return "Quase lá";
  return "Vamos melhorar";
}
