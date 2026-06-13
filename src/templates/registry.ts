import { TemplateMeta } from "./types";
import Moderno from "./designs/Moderno";
import ClassicoATS from "./designs/ClassicoATS";
import Sidebar from "./designs/Sidebar";
import Minimalista from "./designs/Minimalista";
import Timeline from "./designs/Timeline";
import Compacto from "./designs/Compacto";
import Elegante from "./designs/Elegante";
import Corporativo from "./designs/Corporativo";

// Registro central dos templates.
// Para adicionar um modelo novo: crie o componente em designs/ e some uma entrada aqui.
export const TEMPLATES: TemplateMeta[] = [
  {
    id: "moderno",
    name: "Moderno",
    category: "Moderno",
    description: "Uma coluna, cabeçalho com faixa de cor. Limpo e versátil.",
    atsFriendly: true,
    supportsPhoto: false,
    Component: Moderno,
  },
  {
    id: "classico-ats",
    name: "Clássico ATS",
    category: "Clássico",
    description: "Serifado e tradicional, otimizado para triagem automática (ATS).",
    atsFriendly: true,
    supportsPhoto: false,
    Component: ClassicoATS,
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "Criativo",
    description: "Barra lateral colorida com foto, contato e competências.",
    atsFriendly: false,
    supportsPhoto: true,
    Component: Sidebar,
  },
  {
    id: "minimalista",
    name: "Minimalista",
    category: "Minimalista",
    description: "Muito espaço em branco e tipografia leve. Elegante.",
    atsFriendly: true,
    supportsPhoto: false,
    Component: Minimalista,
  },
  {
    id: "timeline",
    name: "Timeline",
    category: "Criativo",
    description: "Experiência em linha do tempo com cabeçalho em gradiente.",
    atsFriendly: false,
    supportsPhoto: false,
    Component: Timeline,
  },
  {
    id: "compacto",
    name: "Compacto",
    category: "Profissional",
    description: "Duas colunas densas. Ideal para currículos com muito conteúdo.",
    atsFriendly: false,
    supportsPhoto: false,
    Component: Compacto,
  },
  {
    id: "elegante",
    name: "Elegante",
    category: "Minimalista",
    description: "Títulos serifados centralizados e linhas finas. Sofisticado.",
    atsFriendly: true,
    supportsPhoto: false,
    Component: Elegante,
  },
  {
    id: "corporativo",
    name: "Corporativo",
    category: "Profissional",
    description: "Cabeçalho sólido e sóbrio. Transmite seriedade e confiança.",
    atsFriendly: true,
    supportsPhoto: false,
    Component: Corporativo,
  },
];

export const TEMPLATE_MAP: Record<string, TemplateMeta> = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t]),
);

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATE_MAP[id] ?? TEMPLATES[0];
}
