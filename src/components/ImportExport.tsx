"use client";

import { useRef, useState } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n-ui";
import { importLattes } from "@/lib/lattes-import";

interface Props {
  content: Partial<Record<Lang, ResumeData>>;
  settings: ResumeSettings;
  onImport: (doc: {
    content?: Partial<Record<Lang, ResumeData>>;
    data?: Partial<ResumeData>;
    settings?: Partial<ResumeSettings>;
  }) => void;
  onExample: () => void;
  onClear: () => void;
}

// Menu "Arquivo": exemplo, exportar/importar JSON, importar do Lattes e limpar.
export function ImportExport({ content, settings, onImport, onExample, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lattesRef = useRef<HTMLInputElement>(null);
  const [lattesLoading, setLattesLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useT();

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

  const importLattesFile = async (file?: File) => {
    if (!file) return;
    setLattesLoading(true);
    try {
      const data = await importLattes(file);
      if (!data.fullName && !data.experiences?.length && !data.education?.length) {
        alert(t("lattes.empty"));
        return;
      }
      onImport({ data, settings: { language: "pt" } });
      alert(t("lattes.success"));
    } catch {
      alert(t("lattes.error"));
    } finally {
      setLattesLoading(false);
    }
  };

  const close = () => setOpen(false);
  const run = (fn: () => void) => () => {
    fn();
    close();
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
      >
        {lattesLoading ? "…" : t("editor.file")}
        <span className="text-[9px] leading-none">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} aria-hidden />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-left shadow-lg"
          >
            <MenuItem icon="📄" label={t("editor.example")} onClick={run(onExample)} />
            <MenuItem icon="⬆" label={t("editor.export")} onClick={run(exportJson)} />
            <MenuItem icon="⬇" label={t("editor.import")} onClick={run(() => inputRef.current?.click())} />
            <MenuItem icon="🎓" label={t("editor.importLattes")} onClick={run(() => lattesRef.current?.click())} />
            <div className="my-1 border-t border-slate-100" />
            <MenuItem icon="🗑" label={t("editor.clear")} danger onClick={run(onClear)} />
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => importJson(e.target.files?.[0])}
      />
      <input
        ref={lattesRef}
        type="file"
        accept=".zip,.xml,application/zip,text/xml,application/xml"
        className="hidden"
        onChange={(e) => importLattesFile(e.target.files?.[0])}
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 ${
        danger ? "text-red-600" : "text-slate-700"
      }`}
    >
      <span className="w-4 text-center text-[13px]">{icon}</span>
      <span className="first-letter:uppercase">{label}</span>
    </button>
  );
}
