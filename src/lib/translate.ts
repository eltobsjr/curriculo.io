import { Lang } from "./i18n";
import { ResumeData } from "./resume-schema";

const LANG_CODES: Record<Lang, string> = {
  pt: "pt-BR",
  en: "en-GB",
  es: "es",
};

// Traduz um trecho de texto via MyMemory (gratuito, sem auth, direto do browser).
// Divide por "\n" para respeitar o limite de ~500 chars por requisição.
async function tr(text: string, from: Lang, to: Lang): Promise<string> {
  if (!text?.trim()) return text ?? "";
  const pair = `${LANG_CODES[from]}|${LANG_CODES[to]}`;
  const lines = text.split("\n");
  const results = await Promise.all(
    lines.map(async (line) => {
      if (!line.trim()) return line;
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(line.slice(0, 499))}&langpair=${pair}`
        );
        const json = await res.json();
        return (json.responseData?.translatedText as string) ?? line;
      } catch {
        return line;
      }
    })
  );
  return results.join("\n");
}

// Traduz os campos de texto do currículo mantendo estrutura, datas e dados de contato intactos.
export async function translateResume(data: ResumeData, from: Lang, to: Lang): Promise<ResumeData> {
  const [headline, summary] = await Promise.all([
    tr(data.headline, from, to),
    tr(data.summary, from, to),
  ]);

  const experiences = await Promise.all(
    data.experiences.map(async (exp) => ({
      ...exp,
      description: await tr(exp.description ?? "", from, to),
    }))
  );

  const projects = await Promise.all(
    data.projects.map(async (proj) => ({
      ...proj,
      description: await tr(proj.description ?? "", from, to),
    }))
  );

  const education = await Promise.all(
    data.education.map(async (edu) => ({
      ...edu,
      description: edu.description ? await tr(edu.description, from, to) : "",
    }))
  );

  const certifications = await Promise.all(
    data.certifications.map(async (cert) => ({
      ...cert,
      issuer: cert.issuer ? await tr(cert.issuer, from, to) : "",
    }))
  );

  return { ...data, headline, summary, experiences, projects, education, certifications };
}
