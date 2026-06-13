import { TemplateProps } from "../types";
import { Bullets, contactItems, hasItems } from "../shared";

// Elegante: títulos serifados, finas linhas de destaque, sofisticado.
export default function Elegante({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  return (
    <div className="h-full w-full bg-white px-12 py-11 text-[11px] leading-relaxed text-slate-700">
      <header className="text-center">
        <h1 className="font-serif text-[30px] font-medium tracking-tight text-slate-900">
          {data.fullName || "Seu Nome"}
        </h1>
        <div className="mx-auto my-2 h-px w-16" style={{ backgroundColor: c }} />
        <p className="text-[13px] uppercase tracking-[0.25em] text-slate-500">
          {data.headline || "Título profissional"}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
          {contactItems(data).map((it) => (
            <span key={it.key}>{it.value}</span>
          ))}
          {data.socials.map((s) => (
            <span key={s.id}>{s.url}</span>
          ))}
        </div>
      </header>

      {data.summary && (
        <Section title="Perfil" color={c}>
          <p className="text-center italic text-slate-600">{data.summary}</p>
        </Section>
      )}

      {hasItems(data.experiences) && (
        <Section title="Experiência" color={c}>
          <div className="space-y-3">
            {data.experiences.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-[13px] font-medium text-slate-900">{e.role}</h3>
                  <span className="text-[10px] text-slate-400">
                    {e.startDate} — {e.endDate}
                  </span>
                </div>
                <div className="text-[10.5px] italic text-slate-500">
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
                  <h3 className="font-serif text-[12px] font-medium text-slate-900">{e.degree}</h3>
                  <div className="text-[10.5px] italic text-slate-500">{e.institution}</div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {e.startDate} — {e.endDate}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {hasItems(data.skills) && (
          <Section title="Competências" color={c}>
            <p className="text-slate-600">{data.skills.map((s) => s.name).join(" · ")}</p>
          </Section>
        )}
        {hasItems(data.languages) && (
          <Section title="Idiomas" color={c}>
            <ul className="space-y-0.5">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="italic text-slate-400">{l.level}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      {hasItems(data.certifications) && (
        <Section title="Certificações" color={c}>
          <p className="text-slate-600">
            {data.certifications.map((cert) => cert.name + (cert.date ? ` (${cert.date})` : "")).join(" · ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-center font-serif text-[12px] uppercase tracking-[0.2em]" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
