"use client";

import { useRef } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";

interface Props {
  data: ResumeData;
  settings: ResumeSettings;
  onImport: (doc: { data?: Partial<ResumeData>; settings?: Partial<ResumeSettings> }) => void;
}

// Exporta o currículo como arquivo .json (backup) e importa de volta.
// Permite o usuário salvar/restaurar ou levar os dados para outro navegador.
export function ImportExport({ data, settings, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ data, settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const nome = (data.fullName || "curriculo").trim().toLowerCase().replace(/\s+/g, "-");
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
        onImport({ data: doc.data ?? doc, settings: doc.settings });
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
