// Importador de Currículo Lattes (CNPq).
// O Lattes exporta um .zip contendo um curriculo.xml no padrão LMPL (tags em
// MAIÚSCULAS, atributos em pt-BR, encoding ISO-8859-1). Aqui descompactamos,
// decodificamos e mapeamos para o nosso schema (ResumeData) — 100% no browser.

import { unzipSync } from "fflate";
import { PublicationItem, ResumeData, uid } from "./resume-schema";

// ---- Leitura do arquivo (zip ou xml cru) ----

function extractXmlBytes(buf: ArrayBuffer): Uint8Array {
  const bytes = new Uint8Array(buf);
  // Assinatura "PK" = arquivo ZIP. Caso contrário assumimos que já é o XML.
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (!isZip) return bytes;
  const files = unzipSync(bytes);
  const key = Object.keys(files).find((k) => k.toLowerCase().endsWith(".xml"));
  if (!key) throw new Error("ZIP do Lattes não contém um .xml");
  return files[key];
}

// O XML do Lattes declara encoding ISO-8859-1. Ler como UTF-8 quebra os acentos,
// então respeitamos o encoding declarado.
function decodeXml(bytes: Uint8Array): string {
  const head = new TextDecoder("ascii").decode(bytes.slice(0, 200));
  const enc = (head.match(/encoding=["']([^"']+)["']/i)?.[1] || "iso-8859-1").toLowerCase();
  try {
    return new TextDecoder(enc).decode(bytes);
  } catch {
    return new TextDecoder("iso-8859-1").decode(bytes);
  }
}

// ---- Helpers de DOM ----

function attr(el: Element | null, name: string): string {
  return el?.getAttribute(name)?.trim() ?? "";
}

function first(el: Element | Document, tag: string): Element | null {
  return el.getElementsByTagName(tag)[0] ?? null;
}

function all(el: Element | Document, tag: string): Element[] {
  return Array.from(el.getElementsByTagName(tag));
}

// Primeiro valor não-vazio entre vários atributos possíveis.
function pick(el: Element | null, names: string[]): string {
  if (!el) return "";
  for (const n of names) {
    const v = el.getAttribute(n)?.trim();
    if (v) return v;
  }
  return "";
}

const yr = (s: string) => parseInt(s, 10) || 0;

function prettify(s: string): string {
  // "CIENCIAS_EXATAS_E_DA_TERRA" -> "Ciencias exatas e da terra"
  if (!/_/.test(s)) return s;
  const lower = s.toLowerCase().replace(/_/g, " ").trim();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ---- Mapeamentos por seção ----

const FORMACAO_LABELS: Record<string, string> = {
  "GRADUACAO": "Graduação",
  "ESPECIALIZACAO": "Especialização",
  "MESTRADO": "Mestrado",
  "MESTRADO-PROFISSIONALIZANTE": "Mestrado Profissional",
  "DOUTORADO": "Doutorado",
  "LIVRE-DOCENCIA": "Livre-docência",
  "POS-DOUTORADO": "Pós-doutorado",
  "APERFEICOAMENTO": "Aperfeiçoamento",
  "CURSO-TECNICO-PROFISSIONALIZANTE": "Curso Técnico",
  "ENSINO-MEDIO-SEGUNDO-GRAU": "Ensino Médio",
  "ENSINO-FUNDAMENTAL-PRIMEIRO-GRAU": "Ensino Fundamental",
};

function mapEducation(cv: Element): ResumeData["education"] {
  const formacao = first(cv, "FORMACAO-ACADEMICA-TITULACAO");
  if (!formacao) return [];
  const out: ResumeData["education"] = [];
  for (const node of Array.from(formacao.children)) {
    const label = FORMACAO_LABELS[node.tagName];
    if (!label) continue;
    const course = attr(node, "NOME-CURSO");
    const status = attr(node, "STATUS-DO-CURSO").toUpperCase();
    const end = attr(node, "ANO-DE-CONCLUSAO");
    const titulo = pick(node, [
      "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO",
      "TITULO-DA-DISSERTACAO-TESE",
      "NOME-DO-CURSO",
    ]);
    const orientador = pick(node, ["NOME-DO-ORIENTADOR", "NOME-COMPLETO-DO-ORIENTADOR"]);
    out.push({
      id: uid(),
      degree: course ? `${label} em ${course}` : label,
      institution: attr(node, "NOME-INSTITUICAO"),
      location: "",
      startDate: attr(node, "ANO-DE-INICIO"),
      endDate: end || (status.includes("ANDAMENTO") ? "Atual" : ""),
      description: [titulo, orientador && `Orientador(a): ${orientador}`].filter(Boolean).join(" · "),
    });
  }
  return out.sort((a, b) => yr(b.startDate) - yr(a.startDate));
}

function mapExperiences(cv: Element): ResumeData["experiences"] {
  const out: ResumeData["experiences"] = [];
  for (const at of all(cv, "ATUACAO-PROFISSIONAL")) {
    const company = attr(at, "NOME-INSTITUICAO");
    for (const v of Array.from(at.getElementsByTagName("VINCULOS"))) {
      const end = attr(v, "ANO-FIM");
      const role = pick(v, [
        "OUTRO-ENQUADRAMENTO-FUNCIONAL-INFORMADO",
        "OUTRO-VINCULO-INFORMADO",
        "ENQUADRAMENTO-FUNCIONAL",
        "TIPO-DE-VINCULO",
      ]);
      out.push({
        id: uid(),
        role: prettify(role) || company,
        company,
        location: "",
        startDate: attr(v, "ANO-INICIO"),
        endDate: end || "Atual",
        current: !end,
        description: "",
      });
    }
  }
  return out.sort((a, b) => (b.current ? 9999 : yr(b.startDate)) - (a.current ? 9999 : yr(a.startDate)));
}

function mapSkills(cv: Element): ResumeData["skills"] {
  const seen = new Set<string>();
  const out: ResumeData["skills"] = [];
  for (const a of all(cv, "AREA-DE-ATUACAO")) {
    const raw = pick(a, [
      "NOME-DA-ESPECIALIDADE",
      "NOME-DA-SUB-AREA-DO-CONHECIMENTO",
      "NOME-DA-AREA-DO-CONHECIMENTO",
      "NOME-GRANDE-AREA-DO-CONHECIMENTO",
    ]);
    const name = prettify(raw);
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push({ id: uid(), name });
    }
  }
  return out;
}

function profLevel(v: string): string {
  const s = v.toLowerCase();
  if (s.startsWith("bem")) return "Avançado";
  if (s.startsWith("razoavel")) return "Intermediário";
  if (s.startsWith("pouco")) return "Básico";
  return v;
}

function mapLanguages(cv: Element): ResumeData["languages"] {
  return all(cv, "IDIOMA")
    .map((i) => ({
      id: uid(),
      name: attr(i, "DESCRICAO-DO-IDIOMA") || attr(i, "IDIOMA"),
      level: profLevel(attr(i, "PROFICIENCIA-DE-FALA") || attr(i, "PROFICIENCIA-DE-LEITURA")),
    }))
    .filter((l) => l.name);
}

function mapCertifications(cv: Element): ResumeData["certifications"] {
  const out: ResumeData["certifications"] = [];
  const fc = first(cv, "FORMACAO-COMPLEMENTAR");
  if (fc) {
    for (const node of Array.from(fc.children)) {
      const name = attr(node, "NOME-CURSO");
      if (!name) continue;
      out.push({ id: uid(), name, issuer: attr(node, "NOME-INSTITUICAO"), date: attr(node, "ANO-DE-CONCLUSAO") });
    }
  }
  for (const p of all(cv, "PREMIO-TITULO")) {
    const name = attr(p, "NOME-DO-PREMIO-OU-TITULO");
    if (!name) continue;
    out.push({ id: uid(), name, issuer: attr(p, "NOME-DA-ENTIDADE-PROMOTORA"), date: attr(p, "ANO-DA-PREMIACAO") });
  }
  return out;
}

const PUB_TAGS = [
  "ARTIGO-PUBLICADO",
  "TRABALHO-EM-EVENTOS",
  "LIVRO-PUBLICADO-OU-ORGANIZADO",
  "CAPITULO-DE-LIVRO-PUBLICADO",
];

function childStarting(el: Element, prefix: string): Element | null {
  return Array.from(el.children).find((c) => c.tagName.startsWith(prefix)) ?? null;
}

function readPublication(item: Element): PublicationItem | null {
  const basic = childStarting(item, "DADOS-BASICOS");
  const detail = childStarting(item, "DETALHAMENTO");
  const get = (names: string[]) => pick(basic, names) || pick(detail, names) || pick(item, names);

  const title = get([
    "TITULO-DO-ARTIGO",
    "TITULO-DO-TRABALHO",
    "TITULO-DO-CAPITULO-DO-LIVRO",
    "TITULO-DO-LIVRO",
    "TITULO",
  ]);
  if (!title) return null;

  const doi = get(["DOI"]);
  return {
    id: uid(),
    title,
    venue: get([
      "TITULO-DO-PERIODICO-OU-REVISTA",
      "NOME-DO-EVENTO",
      "NOME-DA-EDITORA",
      "TITULO-DO-LIVRO",
    ]),
    year: get(["ANO-DO-ARTIGO", "ANO-DO-TRABALHO", "ANO", "ANO-DE-PUBLICACAO"]),
    url: doi ? (doi.startsWith("http") ? doi : `https://doi.org/${doi}`) : "",
  };
}

function mapPublications(cv: Element): PublicationItem[] {
  const out: PublicationItem[] = [];
  for (const tag of PUB_TAGS) {
    for (const item of all(cv, tag)) {
      const pub = readPublication(item);
      if (pub) out.push(pub);
    }
  }
  return out.sort((a, b) => (b.year || "").localeCompare(a.year || ""));
}

// ---- Entrada pública ----

export async function importLattes(file: File): Promise<Partial<ResumeData>> {
  const buf = await file.arrayBuffer();
  const xml = decodeXml(extractXmlBytes(buf));
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) throw new Error("XML inválido");

  const cv = first(doc, "CURRICULO-VITAE");
  if (!cv) throw new Error("Arquivo não parece ser um Currículo Lattes");

  const dg = first(cv, "DADOS-GERAIS");
  const endereco = first(cv, "ENDERECO-PROFISSIONAL") || first(cv, "ENDERECO-RESIDENCIAL");

  const experiences = mapExperiences(cv);
  const education = mapEducation(cv);

  const location = [attr(endereco, "CIDADE"), attr(endereco, "UF"), attr(endereco, "PAIS")]
    .filter(Boolean)
    .join(", ");

  return {
    fullName: attr(dg, "NOME-COMPLETO"),
    headline: experiences[0]?.role || education[0]?.degree || "",
    email: pick(endereco, ["E-MAIL"]) || pick(dg, ["E-MAIL"]),
    location,
    summary: pick(first(cv, "RESUMO-CV"), ["TEXTO-RESUMO-CV-RH", "TEXTO-RESUMO-CV-RH-EN"]),
    experiences,
    education,
    skills: mapSkills(cv),
    languages: mapLanguages(cv),
    certifications: mapCertifications(cv),
    publications: mapPublications(cv),
  };
}
