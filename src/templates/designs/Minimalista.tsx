import { TemplateProps } from "../types";
import { Bullets, contactItems, hasItems } from "../shared";

// Minimalista: muito espaço em branco, tipografia fina, linhas sutis.
export default function Minimalista({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  return (
    <div className="h-full w-full bg-white px-14 py-12 text-[11px] font-light leading-relaxed text-slate-600">
      <header>
        <h1 className="text-[28px] font-light tracking-tight text-slate-900">{data.fullName || "Seu Nome"}</h1>
        <p className="mt-1 text-[13px] tracking-wide text-slate-500">{data.headline || "Título profissional"}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-slate-400">
          {contactItems(data).map((it) => (
            <span key={it.key}>{it.value}</span>
          ))}
          {data.socials.map((s) => (
            <span key={s.id}>{s.url}</span>
          ))}
        </div>
      </header>

      {data.summary && <p className="mt-8 max-w-none leading-7 text-slate-600">{data.summary}</p>}

      {hasItems(data.experiences) && (
        <Section title="Experiência" color={c}>
          <div className="space-y-5">
            {data.experiences.map((e) => (
              <div key={e.id} className="grid grid-cols-[88px_1fr] gap-4">
                <div className="text-[10px] text-slate-400">
                  {e.startDate}
                  <br />— {e.endDate}
                </div>
                <div>
                  <h3 className="text-[12px] font-normal text-slate-900">{e.role}</h3>
                  <div className="text-[10.5px] text-slate-500">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  <Bullets text={e.description} className="mt-1.5 text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasItems(data.education) && (
        <Section title="Formação" color={c}>
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="grid grid-cols-[88px_1fr] gap-4">
                <div className="text-[10px] text-slate-400">
                  {e.startDate}–{e.endDate}
                </div>
                <div>
                  <h3 className="text-[12px] font-normal text-slate-900">{e.degree}</h3>
                  <div className="text-[10.5px] text-slate-500">{e.institution}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="mt-8 grid grid-cols-3 gap-6">
        {hasItems(data.skills) && (
          <div>
            <SectionTitle color={c}>Competências</SectionTitle>
            <ul className="space-y-0.5 text-slate-600">
              {data.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </div>
        )}
        {hasItems(data.languages) && (
          <div>
            <SectionTitle color={c}>Idiomas</SectionTitle>
            <ul className="space-y-0.5 text-slate-600">
              {data.languages.map((l) => (
                <li key={l.id}>
                  {l.name} <span className="text-slate-400">· {l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasItems(data.certifications) && (
          <div>
            <SectionTitle color={c}>Certificações</SectionTitle>
            <ul className="space-y-0.5 text-slate-600">
              {data.certifications.map((cert) => (
                <li key={cert.id}>{cert.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-[10px] uppercase tracking-[0.2em]" style={{ color }}>
      {children}
    </h2>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <SectionTitle color={color}>{title}</SectionTitle>
      {children}
    </section>
  );
}
