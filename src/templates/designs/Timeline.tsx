import { TemplateProps } from "../types";
import { labels } from "@/lib/i18n";
import { Bullets, contactItems, hasItems } from "../shared";

// Timeline: experiências e formação dispostas em linha do tempo vertical.
export default function Timeline({ data, settings }: TemplateProps) {
  const c = settings.accentColor;
  const L = labels(settings.language);
  return (
    <div className="h-full w-full bg-white px-10 py-9 text-[11px] leading-relaxed text-slate-700">
      <header
        className="-mx-10 -mt-9 mb-6 px-10 py-7 text-white"
        style={{ background: `linear-gradient(135deg, ${c}, ${shade(c, -22)})` }}
      >
        <h1 className="text-3xl font-bold tracking-tight">{data.fullName || "Seu Nome"}</h1>
        <p className="mt-1 text-base text-white/90">{data.headline || "Cargo / Título profissional"}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/80">
          {contactItems(data).map((it) => (
            <span key={it.key}>{it.value}</span>
          ))}
          {data.socials.map((s) => (
            <span key={s.id}>{s.url}</span>
          ))}
        </div>
      </header>

      {data.summary && (
        <section className="mb-5">
          <SectionTitle color={c}>{L.summary}</SectionTitle>
          <p>{data.summary}</p>
        </section>
      )}

      {hasItems(data.experiences) && (
        <section className="mb-5">
          <SectionTitle color={c}>{L.experience}</SectionTitle>
          <ol className="relative ml-2 border-l-2" style={{ borderColor: c }}>
            {data.experiences.map((e) => (
              <li key={e.id} className="mb-4 pl-5">
                <span
                  className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: c }}
                />
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
              </li>
            ))}
          </ol>
        </section>
      )}

      {hasItems(data.education) && (
        <section className="mb-5">
          <SectionTitle color={c}>{L.education}</SectionTitle>
          <ol className="relative ml-2 border-l-2" style={{ borderColor: c }}>
            {data.education.map((e) => (
              <li key={e.id} className="mb-3 pl-5">
                <span
                  className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: c }}
                />
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-slate-900">{e.degree}</h3>
                  <span className="text-[10px] text-slate-500">
                    {e.startDate} — {e.endDate}
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-600">{e.institution}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {hasItems(data.skills) && (
          <div>
            <SectionTitle color={c}>{L.skills}</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full px-2.5 py-0.5 text-[10px]"
                  style={{ backgroundColor: tint(c), color: shade(c, -30) }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {hasItems(data.languages) && (
          <div>
            <SectionTitle color={c}>{L.languages}</SectionTitle>
            <ul className="space-y-1">
              {data.languages.map((l) => (
                <li key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-slate-500">{l.level}</span>
                </li>
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
    <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color }}>
      {children}
    </h2>
  );
}

// Escurece/clareia um hex. amount negativo escurece.
function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amount / 100) * 255)));
  return rgbToHex(f(r), f(g), f(b));
}
function tint(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v: number) => Math.round(v + (245 - v) * 0.82);
  return rgbToHex(f(r), f(g), f(b));
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
