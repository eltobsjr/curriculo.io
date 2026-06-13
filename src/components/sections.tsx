"use client";

import { ReactNode, useState } from "react";
import { ResumeData, uid } from "@/lib/resume-schema";
import { ACTION_VERBS, BULLET_TEMPLATES } from "@/lib/insights";
import { Field, TextArea, TextInput } from "./ui";
import { ListEditor } from "./ListEditor";

export interface SectionDef {
  id: string;
  title: string;
  icon: string;
  help: string; // dica amigável exibida no topo da seção
  render: (data: ResumeData, update: (patch: Partial<ResumeData>) => void, showPhoto: boolean) => ReactNode;
}

// Assistente de escrita: chips de verbos de ação + frases-modelo que inserem texto.
function WritingHelper({ onInsert }: { onInsert: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-indigo-600 hover:underline"
      >
        ✨ Ajuda para escrever {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-2.5">
          <p className="mb-1 text-[11px] font-medium text-slate-600">Comece com um verbo de ação:</p>
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
          <p className="mb-1 mt-2.5 text-[11px] font-medium text-slate-600">Ou use um modelo de frase:</p>
          <div className="space-y-1">
            {BULLET_TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onInsert(t)}
                className="block w-full rounded border border-slate-200 bg-white px-2 py-1 text-left text-[11px] text-slate-600 hover:border-indigo-300"
              >
                {t}
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
    title: "Dados pessoais",
    icon: "👤",
    help: "Comece pelo essencial: seu nome, o cargo que busca e como te encontrar.",
    render: (data, update, showPhoto) => {
      const onPhoto = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => update({ photoUrl: String(reader.result) });
        reader.readAsDataURL(file);
      };
      return (
        <div className="space-y-3">
          {showPhoto && (
            <Field label="Foto (opcional)">
              <div className="flex items-center gap-3">
                {data.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                    sem foto
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Enviar foto"
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                  className="text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-indigo-600"
                />
                {data.photoUrl && (
                  <button onClick={() => update({ photoUrl: "" })} className="text-xs text-red-500 hover:underline">
                    remover
                  </button>
                )}
              </div>
            </Field>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome completo">
              <TextInput value={data.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder="Ana Martins" />
            </Field>
            <Field label="Título / Cargo-alvo">
              <TextInput value={data.headline} onChange={(e) => update({ headline: e.target.value })} placeholder="Desenvolvedora Front-end" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="E-mail">
              <TextInput type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} placeholder="voce@email.com" />
            </Field>
            <Field label="Telefone">
              <TextInput value={data.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(11) 90000-0000" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Localização">
              <TextInput value={data.location} onChange={(e) => update({ location: e.target.value })} placeholder="São Paulo, SP" />
            </Field>
            <Field label="Site / Portfólio (opcional)">
              <TextInput value={data.website ?? ""} onChange={(e) => update({ website: e.target.value })} placeholder="seusite.com" />
            </Field>
          </div>
          <Field label="Links e redes (opcional)">
            <ListEditor
              items={data.socials}
              onChange={(socials) => update({ socials })}
              create={() => ({ id: uid(), label: "", url: "" })}
              addLabel="Adicionar link"
              itemTitle={(s) => s.label || "Link"}
              render={(s, set) => (
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <TextInput value={s.label} onChange={(e) => set({ label: e.target.value })} placeholder="LinkedIn" />
                  <TextInput value={s.url} onChange={(e) => set({ url: e.target.value })} placeholder="linkedin.com/in/voce" />
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
    title: "Resumo profissional",
    icon: "📝",
    help: "Em 2–3 frases, diga quem você é, sua experiência e o que procura. É a primeira coisa que leem.",
    render: (data, update) => (
      <TextArea
        value={data.summary}
        onChange={(e) => update({ summary: e.target.value })}
        placeholder="Ex.: Desenvolvedora front-end com 7 anos de experiência criando interfaces acessíveis com React. Busco liderar projetos de produto com foco em qualidade."
      />
    ),
  },
  {
    id: "experiencia",
    title: "Experiência profissional",
    icon: "💼",
    help: "Liste seus empregos do mais recente ao mais antigo. Em cada um, descreva conquistas (não só tarefas).",
    render: (data, update) => (
      <ListEditor
        items={data.experiences}
        onChange={(experiences) => update({ experiences })}
        create={() => ({ id: uid(), role: "", company: "", location: "", startDate: "", endDate: "", description: "" })}
        addLabel="Adicionar experiência"
        itemTitle={(e) => e.role || e.company || "Nova experiência"}
        render={(e, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={e.role} onChange={(ev) => set({ role: ev.target.value })} placeholder="Cargo" />
              <TextInput value={e.company} onChange={(ev) => set({ company: ev.target.value })} placeholder="Empresa" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextInput value={e.location ?? ""} onChange={(ev) => set({ location: ev.target.value })} placeholder="Local" />
              <TextInput value={e.startDate} onChange={(ev) => set({ startDate: ev.target.value })} placeholder="Início" />
              <TextInput value={e.endDate} onChange={(ev) => set({ endDate: ev.target.value })} placeholder="Fim / Atual" />
            </div>
            <TextArea
              value={e.description ?? ""}
              onChange={(ev) => set({ description: ev.target.value })}
              placeholder="Uma conquista por linha. Ex.: Aumentou a conversão mobile em 18%."
            />
            <WritingHelper onInsert={(t) => set({ description: (e.description ? e.description + "\n" : "") + t })} />
          </div>
        )}
      />
    ),
  },
  {
    id: "formacao",
    title: "Formação acadêmica",
    icon: "🎓",
    help: "Curso, instituição e período. Pode incluir cursos técnicos e bootcamps.",
    render: (data, update) => (
      <ListEditor
        items={data.education}
        onChange={(education) => update({ education })}
        create={() => ({ id: uid(), degree: "", institution: "", location: "", startDate: "", endDate: "", description: "" })}
        addLabel="Adicionar formação"
        itemTitle={(e) => e.degree || e.institution || "Nova formação"}
        render={(e, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={e.degree} onChange={(ev) => set({ degree: ev.target.value })} placeholder="Curso / Grau" />
              <TextInput value={e.institution} onChange={(ev) => set({ institution: ev.target.value })} placeholder="Instituição" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextInput value={e.location ?? ""} onChange={(ev) => set({ location: ev.target.value })} placeholder="Local" />
              <TextInput value={e.startDate} onChange={(ev) => set({ startDate: ev.target.value })} placeholder="Início" />
              <TextInput value={e.endDate} onChange={(ev) => set({ endDate: ev.target.value })} placeholder="Fim" />
            </div>
          </div>
        )}
      />
    ),
  },
  {
    id: "competencias",
    title: "Competências",
    icon: "⚡",
    help: "Suas principais habilidades. O sistema de triagem (ATS) procura por elas — capriche!",
    render: (data, update) => (
      <ListEditor
        items={data.skills}
        onChange={(skills) => update({ skills })}
        create={() => ({ id: uid(), name: "", level: 3 })}
        addLabel="Adicionar competência"
        itemTitle={(s) => s.name || "Competência"}
        render={(s, set) => (
          <div className="grid grid-cols-[1fr_140px] items-center gap-2">
            <TextInput value={s.name} onChange={(e) => set({ name: e.target.value })} placeholder="React" />
            <label className="flex items-center gap-2 text-xs text-slate-500">
              Nível
              <input
                type="range"
                min={1}
                max={5}
                value={s.level ?? 3}
                onChange={(e) => set({ level: Number(e.target.value) })}
                className="flex-1 accent-indigo-600"
                aria-label="Nível da competência"
              />
            </label>
          </div>
        )}
      />
    ),
  },
  {
    id: "idiomas",
    title: "Idiomas",
    icon: "🌍",
    help: "Idiomas que você fala e o nível (Nativo, Fluente, Intermediário, Básico).",
    render: (data, update) => (
      <ListEditor
        items={data.languages}
        onChange={(languages) => update({ languages })}
        create={() => ({ id: uid(), name: "", level: "Intermediário" })}
        addLabel="Adicionar idioma"
        itemTitle={(l) => l.name || "Idioma"}
        render={(l, set) => (
          <div className="grid grid-cols-2 gap-2">
            <TextInput value={l.name} onChange={(e) => set({ name: e.target.value })} placeholder="Inglês" />
            <TextInput value={l.level} onChange={(e) => set({ level: e.target.value })} placeholder="Fluente" />
          </div>
        )}
      />
    ),
  },
  {
    id: "projetos",
    title: "Projetos (opcional)",
    icon: "🚀",
    help: "Projetos pessoais, freelances ou trabalhos voluntários que mostram seu valor.",
    render: (data, update) => (
      <ListEditor
        items={data.projects}
        onChange={(projects) => update({ projects })}
        create={() => ({ id: uid(), name: "", url: "", description: "" })}
        addLabel="Adicionar projeto"
        itemTitle={(p) => p.name || "Projeto"}
        render={(p, set) => (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="Nome do projeto" />
              <TextInput value={p.url ?? ""} onChange={(e) => set({ url: e.target.value })} placeholder="link" />
            </div>
            <TextArea value={p.description ?? ""} onChange={(e) => set({ description: e.target.value })} placeholder="Breve descrição" />
          </div>
        )}
      />
    ),
  },
  {
    id: "certificacoes",
    title: "Certificações (opcional)",
    icon: "🏅",
    help: "Cursos e certificados relevantes para a vaga.",
    render: (data, update) => (
      <ListEditor
        items={data.certifications}
        onChange={(certifications) => update({ certifications })}
        create={() => ({ id: uid(), name: "", issuer: "", date: "" })}
        addLabel="Adicionar certificação"
        itemTitle={(c) => c.name || "Certificação"}
        render={(c, set) => (
          <div className="grid grid-cols-[1fr_1fr_90px] gap-2">
            <TextInput value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder="Certificação" />
            <TextInput value={c.issuer ?? ""} onChange={(e) => set({ issuer: e.target.value })} placeholder="Emissor" />
            <TextInput value={c.date ?? ""} onChange={(e) => set({ date: e.target.value })} placeholder="Ano" />
          </div>
        )}
      />
    ),
  },
];
