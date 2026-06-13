import { TemplateProps } from "../types";
import { labels } from "@/lib/i18n";
import { Bullets, hasItems, LevelDots } from "../shared";

// Sidebar: coluna lateral colorida com foto, contato, skills e idiomas.
export default function Sidebar({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  const L = labels(settings.language);
  return (
    <div className="flex h-full w-full bg-white text-[11px] leading-relaxed text-slate-700">
      {/* Coluna lateral */}
      <aside className="w-[34%] shrink-0 px-6 py-8 text-white" style={{ backgroundColor: c }}>
        {data.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.photoUrl}
            alt={data.fullName}
            className="mx-auto mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-white/30"
          />
        ) : (
          <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
            {initials(data.fullName)}
          </div>
        )}

        <SideSection title={L.contact}>
          <ul className="space-y-1 break-words text-[10px] text-white/90">
            {data.email && <li>{data.email}</li>}
            {data.phone && <li>{data.phone}</li>}
            {data.location && <li>{data.location}</li>}
            {data.website && <li>{data.website}</li>}
            {data.socials.map((s) => (
              <li key={s.id}>
                {s.label}: {s.url}
              </li>
            ))}
          </ul>
        </SideSection>

        {hasItems(data.skills) && (
          <SideSection title={L.skills}>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <div className="mb-1 text-[10px]">{s.name}</div>
                  <LevelDots level={s.level} color="#ffffff" />
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {hasItems(data.languages) && (
          <SideSection title={L.languages}>
            <ul className="space-y-1 text-[10px] text-white/90">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-white/70">{l.level}</span>
                </li>
              ))}
            </ul>
          </SideSection>
        )}
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 px-7 py-8">
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">{data.fullName || "Seu Nome"}</h1>
        <p className="text-[13px] font-medium" style={{ color: c }}>
          {data.headline || "Cargo / Título profissional"}
        </p>

        {data.summary && (
          <MainSection title={L.profile} color={c}>
            <p>{data.summary}</p>
          </MainSection>
        )}

        {hasItems(data.experiences) && (
          <MainSection title={L.experience} color={c}>
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
          </MainSection>
        )}

        {hasItems(data.education) && (
          <MainSection title={L.education} color={c}>
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
          </MainSection>
        )}

        {hasItems(data.projects) && (
          <MainSection title={L.projects} color={c}>
            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  {p.description ? <p className="text-slate-600">{p.description}</p> : null}
                </div>
              ))}
            </div>
          </MainSection>
        )}
      </main>
    </div>
  );
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-2 border-b border-white/30 pb-1 text-[11px] font-bold uppercase tracking-wider">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wider" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
