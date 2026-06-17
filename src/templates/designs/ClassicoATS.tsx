import { TemplateProps } from "../types";
import { labels } from "@/lib/i18n";
import { Bullets, contactItems, hasItems, PublicationsList } from "../shared";

// Clássico/ATS: serifado, uma coluna, sem cores fortes nem ícones.
// Otimizado para leitura por sistemas de triagem (ATS).
export default function ClassicoATS({ data, settings }: TemplateProps) {
  const L = labels(settings.language);
  return (
    <div className="h-full w-full bg-white px-12 py-10 font-serif text-[11px] leading-relaxed text-black">
      <header className="text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{data.fullName || "Seu Nome"}</h1>
        {data.headline && <p className="mt-1 text-[12px] italic">{data.headline}</p>}
        <div className="mt-2 text-[10px]">
          {contactItems(data).map((it) => it.value).join("  •  ")}
        </div>
        {hasItems(data.socials) && (
          <div className="text-[10px]">{data.socials.map((s) => s.url).join("  •  ")}</div>
        )}
      </header>

      <Rule />

      {data.summary && (
        <Section title={L.summary}>
          <p className="text-justify">{data.summary}</p>
        </Section>
      )}

      {hasItems(data.experiences) && (
        <Section title={L.experience}>
          <div className="space-y-2.5">
            {data.experiences.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{e.role}</span>
                  <span>
                    {e.startDate} – {e.endDate}
                  </span>
                </div>
                <div className="italic">
                  {e.company}
                  {e.location ? `, ${e.location}` : ""}
                </div>
                <Bullets text={e.description} className="mt-1" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasItems(data.education) && (
        <Section title={L.education}>
          <div className="space-y-1.5">
            {data.education.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{e.degree}</span>
                  <span>
                    {e.startDate} – {e.endDate}
                  </span>
                </div>
                <div className="italic">{e.institution}{e.location ? `, ${e.location}` : ""}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasItems(data.skills) && (
        <Section title={L.skills}>
          <p>{data.skills.map((s) => s.name).join(" • ")}</p>
        </Section>
      )}

      {hasItems(data.languages) && (
        <Section title={L.languages}>
          <p>{data.languages.map((l) => `${l.name} (${l.level})`).join(" • ")}</p>
        </Section>
      )}

      {hasItems(data.certifications) && (
        <Section title={L.certifications}>
          <ul className="list-disc pl-5">
            {data.certifications.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.issuer ? `, ${c.issuer}` : ""}
                {c.date ? ` (${c.date})` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {hasItems(data.projects) && (
        <Section title={L.projects}>
          <div className="space-y-1.5">
            {data.projects.map((p) => (
              <div key={p.id}>
                <span className="font-bold">{p.name}</span>
                {p.url ? ` — ${p.url}` : ""}
                {p.description ? <div>{p.description}</div> : null}
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasItems(data.publications) && (
        <Section title={L.publications}>
          <PublicationsList items={data.publications} />
        </Section>
      )}
    </div>
  );
}

function Rule() {
  return <div className="my-3 border-t border-black" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-3">
      <h2 className="mb-1 border-b border-black pb-0.5 text-[12px] font-bold uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}
