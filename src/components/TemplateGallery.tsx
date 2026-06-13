"use client";

import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { TEMPLATES } from "@/templates/registry";

const A4_WIDTH = 794;
const THUMB_WIDTH = 220;

interface Props {
  open: boolean;
  onClose: () => void;
  data: ResumeData;
  settings: ResumeSettings;
  onSelect: (templateId: string) => void;
}

const fontClass: Record<string, string> = {
  sans: "font-resume-sans",
  serif: "font-resume-serif",
  mono: "font-resume-mono",
};

export function TemplateGallery({ open, onClose, data, settings, onSelect }: Props) {
  if (!open) return null;
  const scale = THUMB_WIDTH / A4_WIDTH;

  return (
    <div className="fixed inset-0 z-50 flex no-print">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-full max-w-3xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Escolha um modelo</h2>
            <p className="text-xs text-slate-500">{TEMPLATES.length} modelos · clique para aplicar</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar">
            ✕
          </button>
        </header>

        <div className="thin-scroll grid grid-cols-2 gap-4 overflow-y-auto p-5 sm:grid-cols-3">
          {TEMPLATES.map((t) => {
            const selected = t.id === settings.templateId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelect(t.id);
                  onClose();
                }}
                className={`group overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                  selected ? "border-indigo-600 ring-2 ring-indigo-600/20" : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-[280px] overflow-hidden bg-white" style={{ width: THUMB_WIDTH }}>
                  <div
                    className={fontClass[settings.fontFamily]}
                    style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}
                  >
                    <div className="a4-page">
                      <t.Component data={data} settings={{ ...settings, templateId: t.id }} />
                    </div>
                  </div>
                </div>
                {/* Legenda */}
                <div className="border-t border-slate-100 p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-800">{t.name}</span>
                    {t.atsFriendly && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                        ATS
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{t.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
