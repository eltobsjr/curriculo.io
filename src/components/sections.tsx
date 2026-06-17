"use client";

import { ReactNode, useState } from "react";
import { ResumeData, uid } from "@/lib/resume-schema";
import { ACTION_VERBS, BULLET_TEMPLATES } from "@/lib/insights";
import { Field, TextArea, TextInput } from "./ui";
import { ListEditor } from "./ListEditor";
import { useT } from "@/lib/i18n-ui";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

export interface SectionDef {
  id: string;
  icon: string;
  render: (data: ResumeData, update: (patch: Partial<ResumeData>) => void, showPhoto: boolean, t: TFn) => ReactNode;
}

function WritingHelper({ onInsert }: { onInsert: (text: string) => void }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs font-medium text-indigo-600 hover:underline">
        {t("helper.toggle")} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-2.5">
          <p className="mb-1 text-[11px] font-medium text-slate-600">{t("helper.verbs")}</p>
          <div className="flex flex-wrap gap-1">
            {ACTION_VERBS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onInsert(v + " ")}
                className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-[11px] text-indigo-700 hover:bg-indigo-100"
              >
                {v}
              </button>
            ))}
          </div>
          <p className="mb-1 mt-2.5 text-[11px] font-medium text-slate-600">{t("helper.templates")}</p>
          <div className="space-y-1">
            {BULLET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl}
                type="button"
                onClick={() => onInsert(tmpl)}
                className="block w-full rounded border border-slate-200 bg-white px-2 py-1 text-left text-[11px] text-slate-600 hover:border-indigo-300"
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const SECTIONS: SectionDef[] = [
  {
    id: "pessoal",
    icon: "👤",
    render: (data, update, showPhoto, t) => {
      const onPhoto = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => update({ photoUrl: String(reader.result) });
        reader.readAsDataURL(file);
      };
      return (
        <div className="space-y-3">
          {showPhoto && (
            <Field label={t("field.photo")}>
              <div className="flex items-center gap-3">
                {data.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                    {t("field.noPhoto")}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  aria-label={t("field.uploadPhoto")}
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                  className="text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-indigo-600"
                />
                {data.photoUrl && (
                  <button onClick={() => update({ photoUrl: "" })} className="text-xs text-red-500 hover:underline">
                    {t("field.removePhoto")}
                  </button>
                )}
              </div>
            </Field>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("field.fullName")}>
              <TextInput value={data.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder={t("ph.fullName")} />
            </Field>
            <Field label={t("field.headline")}>
              <TextInput value={data.headline} onChange={(e) => update({ headline: e.target.value })} placeholder={t("ph.headline")} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("field.email")}>
              <TextInput type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} placeholder={t("ph.email")} />
            </Field>
            <Field label={t("field.phone")}>
              <TextInput value={data.phone} onChange={(e) => update({ phone: e.target.value })} placeholder={t("ph.phone")} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("field.location")}>
              <TextInput value={data.location} onChange={(e) => update({ location: e.target.value })} placeholder={t("ph.location")} />
            </Field>
            <Field label={t("field.website")}>
              <TextInput value={data.website ?? ""} onChange={(e) => update({ website: e.target.value })} placeholder={t("ph.website")} />
            </Field>
          </div>
          <Field label={t("field.socialLinks")}>
            <ListEditor
              items={data.socials}
              onChange={(socials) => update({ socials })}
              create={() => ({ id: uid(), label: "", url: "" })}
              addLabel={t("list.addLink")}
              itemTitle={(s) => s.label || t("list.link")}
              render={(s, set) => (
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <TextInput value={s.label} onChange={(e) => set({ label: e.target.value })} placeholder={t("ph.socialLabel")} />
                  <TextInput value={s.url} onChange={(e) => set({ url: e.target.value })} placeholder={t("ph.socialUrl")} />
                </div>
              )}
            />
          </Field>
        </div>
      );
    },
  },
  {
    id: "resumo",
    icon: "📝",
    render: (data, update, _showPhoto, t) => (
      <TextArea value={data.summary} onChange={(e) => update({ summary: e.target.value })} placeholder={t("ph.summary")} />
    ),
  },
  {
    id: "experiencia",
    icon: "💼",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.experiences}
        onChange={(experiences) => update({ experiences })}
        create={() => ({ id: uid(), role: "", company: "", location: "", startDate: "", endDate: "", description: "" })}
        addLabel={t("list.addExp")}
        itemTitle={(e) => e.role || e.company || t("list.newExp")}
        render={(e, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={e.role} onChange={(ev) => set({ role: ev.target.value })} placeholder={t("ph.role")} />
              <TextInput value={e.company} onChange={(ev) => set({ company: ev.target.value })} placeholder={t("ph.company")} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextInput value={e.location ?? ""} onChange={(ev) => set({ location: ev.target.value })} placeholder={t("ph.city")} />
              <TextInput value={e.startDate} onChange={(ev) => set({ startDate: ev.target.value })} placeholder={t("ph.startDate")} />
              <TextInput value={e.endDate} onChange={(ev) => set({ endDate: ev.target.value })} placeholder={t("ph.endDate")} />
            </div>
            <TextArea
              value={e.description ?? ""}
              onChange={(ev) => set({ description: ev.target.value })}
              placeholder={t("ph.expDesc")}
            />
            <WritingHelper onInsert={(text) => set({ description: (e.description ? e.description + "\n" : "") + text })} />
          </div>
        )}
      />
    ),
  },
  {
    id: "formacao",
    icon: "🎓",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.education}
        onChange={(education) => update({ education })}
        create={() => ({ id: uid(), degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" })}
        addLabel={t("list.addEdu")}
        itemTitle={(e) => e.degree || e.institution || t("list.newEdu")}
        render={(e, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={e.degree} onChange={(ev) => set({ degree: ev.target.value })} placeholder={t("ph.degree")} />
              <TextInput value={e.institution} onChange={(ev) => set({ institution: ev.target.value })} placeholder={t("ph.institution")} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextInput value={e.location ?? ""} onChange={(ev) => set({ location: ev.target.value })} placeholder={t("ph.city")} />
              <TextInput value={e.startDate} onChange={(ev) => set({ startDate: ev.target.value })} placeholder={t("ph.startDate")} />
              <TextInput value={e.endDate} onChange={(ev) => set({ endDate: ev.target.value })} placeholder={t("ph.endDateEdu")} />
            </div>
          </div>
        )}
      />
    ),
  },
  {
    id: "competencias",
    icon: "⚡",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.skills}
        onChange={(skills) => update({ skills })}
        create={() => ({ id: uid(), name: "", level: 3 })}
        addLabel={t("list.addSkill")}
        itemTitle={(s) => s.name || t("list.skill")}
        render={(s, set) => (
          <div className="grid grid-cols-[1fr_140px] items-center gap-2">
            <TextInput value={s.name} onChange={(e) => set({ name: e.target.value })} placeholder={t("ph.skillName")} />
            <label className="flex items-center gap-2 text-xs text-slate-500">
              {t("field.skillLevel")}
              <input
                type="range"
                min={1}
                max={5}
                value={s.level ?? 3}
                onChange={(e) => set({ level: Number(e.target.value) })}
                className="flex-1 accent-indigo-600"
                aria-label={t("field.skillLevel")}
              />
            </label>
          </div>
        )}
      />
    ),
  },
  {
    id: "idiomas",
    icon: "🌍",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.languages}
        onChange={(languages) => update({ languages })}
        create={() => ({ id: uid(), name: "", level: t("ph.langLevel") })}
        addLabel={t("list.addLang")}
        itemTitle={(l) => l.name || t("list.lang")}
        render={(l, set) => (
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={l.name} onChange={(e) => set({ name: e.target.value })} placeholder={t("ph.langName")} />
            <TextInput value={l.level} onChange={(e) => set({ level: e.target.value })} placeholder={t("ph.langLevel")} />
          </div>
        )}
      />
    ),
  },
  {
    id: "projetos",
    icon: "🚀",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.projects}
        onChange={(projects) => update({ projects })}
        create={() => ({ id: uid(), name: "", url: "", description: "" })}
        addLabel={t("list.addProject")}
        itemTitle={(p) => p.name || t("list.project")}
        render={(p, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder={t("ph.projectName")} />
              <TextInput value={p.url ?? ""} onChange={(e) => set({ url: e.target.value })} placeholder={t("ph.projectUrl")} />
            </div>
            <TextArea value={p.description ?? ""} onChange={(e) => set({ description: e.target.value })} placeholder={t("ph.projectDesc")} />
          </div>
        )}
      />
    ),
  },
  {
    id: "certificacoes",
    icon: "🏅",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.certifications}
        onChange={(certifications) => update({ certifications })}
        create={() => ({ id: uid(), name: "", issuer: "", date: "" })}
        addLabel={t("list.addCert")}
        itemTitle={(c) => c.name || t("list.cert")}
        render={(c, set) => (
          <div className="grid grid-cols-[1fr_1fr_90px] gap-2">
            <TextInput value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder={t("ph.certName")} />
            <TextInput value={c.issuer ?? ""} onChange={(e) => set({ issuer: e.target.value })} placeholder={t("ph.certIssuer")} />
            <TextInput value={c.date ?? ""} onChange={(e) => set({ date: e.target.value })} placeholder={t("ph.certYear")} />
          </div>
        )}
      />
    ),
  },
  {
    id: "publicacoes",
    icon: "📚",
    render: (data, update, _showPhoto, t) => (
      <ListEditor
        items={data.publications}
        onChange={(publications) => update({ publications })}
        create={() => ({ id: uid(), title: "", venue: "", year: "", url: "" })}
        addLabel={t("list.addPub")}
        itemTitle={(p) => p.title || t("list.pub")}
        render={(p, set) => (
          <div className="space-y-2">
            <TextInput value={p.title} onChange={(e) => set({ title: e.target.value })} placeholder={t("ph.pubTitle")} />
            <div className="grid grid-cols-[1fr_90px] gap-2">
              <TextInput value={p.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} placeholder={t("ph.pubVenue")} />
              <TextInput value={p.year ?? ""} onChange={(e) => set({ year: e.target.value })} placeholder={t("ph.pubYear")} />
            </div>
            <TextInput value={p.url ?? ""} onChange={(e) => set({ url: e.target.value })} placeholder={t("ph.pubUrl")} />
          </div>
        )}
      />
    ),
  },
];
