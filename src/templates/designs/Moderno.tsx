import { TemplateProps } from "../types";
import { Bullets, contactItems, hasItems, LevelBar } from "../shared";

// Moderno: cabeçalho com faixa de cor, uma coluna, limpo e atual.
export default function Moderno({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  return (
    <div className="h-full w-full bg-white px-10 py-9 text-[11px] leading-relaxed text-slate-700">
      {/* Cabeçalho */}
      <header className="border-b-2 pb-4" style={{ borderColor: c }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{data.fullName || "Seu Nome"}</h1>
        <p className="mt-1 text-base font-medium" style={{ color: c }}>
          {data.headline || "Cargo / Título profissional"}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-600">
          {contactItems(data).map((it) => (
            <span key={it.key}>{it.value}</span>
          ))}
          {data.socials.map((s) => (
            <span key={s.id}>
              {s.label}: {s.url}
            </span>
          ))}
        </div>
      </header>

      {data.summary && (
        <Section title="Resumo" color={c}>
          <p>{data.summary}</p>
        </Section>
      )}

      {hasItems(data.experiences) && (
        <Section title="Experiência" color={c}>
          <div className="space-y-3">
            {data.experiences.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-slate-900">{e.role}</h3>
                  <span className="text-[10px] text-slate-500">
                    {e.startDate} — {e.endDate}
                  </span>
                </div>
                <div className="text-[10.5px] font-medium" style={{ color: c }}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <Bullets text={e.description} className="mt-1 text-slate-600" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasItems(data.education) && (
        <Section title="Formação" color={c}>
          <div className="space-y-2">
            {data.education.map((e) => (
              <div key={e.id} className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{e.degree}</h3>
                  <div className="text-[10.5px] text-slate-600">{e.institution}</div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {e.startDate} — {e.endDate}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {hasItems(data.skills) && (
          <Section title="Competências" color={c}>
            <div className="space-y-1.5">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <div className="mb-0.5 flex justify-between">
                    <span>{s.name}</span>
                  </div>
                  {s.level ? <LevelBar level={s.level} color={c} /> : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        <div>
          {hasItems(data.languages) && (
            <Section title="Idiomas" color={c}>
              <ul className="space-y-1">
                {data.languages.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {hasItems(data.certifications) && (
            <Section title="Certificações" color={c}>
              <ul className="space-y-1">
                {data.certifications.map((cert) => (
                  <li key={cert.id}>
                    <span className="font-medium text-slate-800">{cert.name}</span>
                    {cert.issuer ? <span className="text-slate-500"> · {cert.issuer}</span> : null}
                    {cert.date ? <span className="text-slate-400"> ({cert.date})</span> : null}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>

      {hasItems(data.projects) && (
        <Section title="Projetos" color={c}>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id}>
                <h3 className="font-semibold text-slate-900">
                  {p.name}
                  {p.url ? <span className="ml-2 text-[10px] font-normal" style={{ color: c }}>{p.url}</span> : null}
                </h3>
                {p.description ? <p className="text-slate-600">{p.description}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
