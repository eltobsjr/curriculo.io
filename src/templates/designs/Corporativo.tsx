import { TemplateProps } from "../types";
import { labels } from "@/lib/i18n";
import { Bullets, contactItems, hasItems } from "../shared";

// Corporativo: bloco de cabeçalho sólido, sóbrio e profissional.
export default function Corporativo({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  const L = labels(settings.language);
  return (
    <div className="h-full w-full bg-white text-[11px] leading-relaxed text-slate-700">
      {/* Cabeçalho sólido */}
      <header className="px-10 py-8 text-white" style={{ backgroundColor: c }}>
        <h1 className="text-[28px] font-bold tracking-tight">{data.fullName || "Seu Nome"}</h1>
        <p className="mt-0.5 text-[14px] text-white/85">{data.headline || "Cargo / Título profissional"}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/80">
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

      <div className="px-10 py-7">
        {data.summary && (
          <Section title={L.summary} color={c}>
            <p>{data.summary}</p>
          </Section>
        )}

        {hasItems(data.experiences) && (
          <Section title={L.experience} color={c}>
            <div className="space-y-3">
              {data.experiences.map((e) => (
                <div key={e.id} className="border-l-2 pl-3" style={{ borderColor: c }}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-slate-900">{e.role}</h3>
                    <span className="text-[10px] font-medium text-slate-500">
                      {e.startDate} — {e.endDate}
                    </span>
                  </div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
                    {e.company}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  <Bullets text={e.description} className="mt-1 text-slate-600" />
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {hasItems(data.education) && (
            <Section title={L.education} color={c}>
              <div className="space-y-2">
                {data.education.map((e) => (
                  <div key={e.id}>
                    <h3 className="font-bold text-slate-900">{e.degree}</h3>
                    <div className="text-[10.5px] text-slate-600">{e.institution}</div>
                    <div className="text-[10px] text-slate-400">
                      {e.startDate} — {e.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
          <Section title={L.skills} color={c}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s.id} className="rounded px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: c }}>
                  {s.name}
                </span>
              ))}
            </div>
            {hasItems(data.languages) && (
              <div className="mt-3">
                <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{L.languages}</h4>
                <ul className="space-y-0.5">
                  {data.languages.map((l) => (
                    <li key={l.id} className="flex justify-between">
                      <span>{l.name}</span>
                      <span className="text-slate-500">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        </div>

        {hasItems(data.certifications) && (
          <Section title={L.certifications} color={c}>
            <ul className="space-y-1">
              {data.certifications.map((cert) => (
                <li key={cert.id}>
                  <span className="font-semibold text-slate-800">{cert.name}</span>
                  {cert.issuer ? <span className="text-slate-500"> · {cert.issuer}</span> : null}
                  {cert.date ? <span className="text-slate-400"> ({cert.date})</span> : null}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <h2 className="mb-2 border-b-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-800" style={{ borderColor: color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
