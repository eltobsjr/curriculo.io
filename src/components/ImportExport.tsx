"use client";

import { useRef } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { Lang } from "@/lib/i18n";

interface Props {
  content: Partial<Record<Lang, ResumeData>>;
  settings: ResumeSettings;
  onImport: (doc: {
    content?: Partial<Record<Lang, ResumeData>>;
    data?: Partial<ResumeData>;
    settings?: Partial<ResumeSettings>;
  }) => void;
}

// Exporta o currículo (todos os idiomas) como .json e importa de volta.
export function ImportExport({ content, settings, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ content, settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const active = content[settings.language ?? "pt"];
    const nome = (active?.fullName || "curriculo").trim().toLowerCase().replace(/\s+/g, "-");
    a.href = url;
    a.download = `${nome}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const doc = JSON.parse(String(reader.result));
        // aceita formato novo ({content}), antigo ({data}) ou um ResumeData cru
        onImport({ content: doc.content, data: doc.content ? undefined : doc.data ?? doc, settings: doc.settings });
      } catch {
        alert("Arquivo inválido. Selecione um .json exportado pelo Currículo.io.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <span className="inline-flex items-center gap-1">
      <button onClick={exportJson} className="text-slate-500 hover:underline" title="Salvar uma cópia (.json)">
        exportar
      </button>
      <span className="text-slate-300">·</span>
      <button onClick={() => inputRef.current?.click()} className="text-slate-500 hover:underline" title="Carregar um .json">
        importar
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => importJson(e.target.files?.[0])}
      />
    </span>
  );
}
