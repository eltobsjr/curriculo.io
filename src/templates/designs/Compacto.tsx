import { TemplateProps } from "../types";
import { labels } from "@/lib/i18n";
import { Bullets, contactItems, hasItems, PublicationsList } from "../shared";

// Compacto: duas colunas densas, ótimo para currículos com muito conteúdo.
export default function Compacto({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  const L = labels(settings.language);
  return (
    <div className="h-full w-full bg-white px-9 py-8 text-[10.5px] leading-snug text-slate-700">
      <header className="mb-4 flex items-end justify-between border-b-2 pb-3" style={{ borderColor: c }}>
        <div>
          <h1 className="text-[24px] font-bold leading-none text-slate-900">{data.fullName || "Seu Nome"}</h1>
          <p className="mt-1 text-[12px] font-medium" style={{ color: c }}>
            {data.headline || "Cargo / Título profissional"}
          </p>
        </div>
        <div className="text-right text-[9.5px] text-slate-600">
          {contactItems(data).map((it) => (
            <div key={it.key}>{it.value}</div>
          ))}
          {data.socials.map((s) => (
            <div key={s.id}>{s.url}</div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_180px] gap-6">
        {/* Coluna principal */}
        <div>
          {data.summary && (
            <Block title={L.summary} color={c}>
              <p>{data.summary}</p>
            </Block>
          )}

          {hasItems(data.experiences) && (
            <Block title={L.experience} color={c}>
              <div className="space-y-2.5">
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-slate-900">{e.role}</h3>
                      <span className="text-[9px] text-slate-500">
                        {e.startDate} — {e.endDate}
                      </span>
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: c }}>
                      {e.company}
                      {e.location ? ` · ${e.location}` : ""}
                    </div>
                    <Bullets text={e.description} className="mt-0.5 text-slate-600" />
                  </div>
                ))}
              </div>
            </Block>
          )}

          {hasItems(data.projects) && (
            <Block title={L.projects} color={c}>
              <div className="space-y-1.5">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <span className="font-semibold text-slate-900">{p.name}</span>
                    {p.url ? <span className="text-[9px]" style={{ color: c }}> · {p.url}</span> : null}
                    {p.description ? <p className="text-slate-600">{p.description}</p> : null}
                  </div>
                ))}
              </div>
            </Block>
          )}

          {hasItems(data.publications) && (
            <Block title={L.publications} color={c}>
              <PublicationsList items={data.publications} className="text-slate-600" />
            </Block>
          )}
        </div>

        {/* Coluna lateral */}
        <div>
          {hasItems(data.education) && (
            <Block title={L.education} color={c}>
              <div className="space-y-2">
                {data.education.map((e) => (
                  <div key={e.id}>
                    <h3 className="font-semibold text-slate-900">{e.degree}</h3>
                    <div className="text-[9.5px] text-slate-600">{e.institution}</div>
                    <div className="text-[9px] text-slate-400">
                      {e.startDate} — {e.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {hasItems(data.skills) && (
            <Block title={L.skills} color={c}>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((s) => (
                  <span key={s.id} className="rounded border px-1.5 py-0.5 text-[9px]" style={{ borderColor: c, color: c }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </Block>
          )}

          {hasItems(data.languages) && (
            <Block title={L.languages} color={c}>
              <ul className="space-y-0.5">
                {data.languages.map((l) => (
                  <li key={l.id}>
                    <span className="font-medium">{l.name}</span>
                    <span className="text-slate-500"> · {l.level}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {hasItems(data.certifications) && (
            <Block title={L.certifications} color={c}>
              <ul className="space-y-1">
                {data.certifications.map((cert) => (
                  <li key={cert.id}>
                    <span className="font-medium text-slate-800">{cert.name}</span>
                    {cert.date ? <span className="text-slate-400"> ({cert.date})</span> : null}
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>
      </div>
    </div>
  );
}

function Block({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-3.5 first:mt-0">
      <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
