"use client";

import { useState } from "react";
import { ResumeData } from "@/lib/resume-schema";
import { SECTIONS } from "./sections";
import { useT } from "@/lib/i18n-ui";
import { Btn } from "./ui";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  showPhoto: boolean;
  onFinish: () => void;
}

// Modo Guiado: uma seção por vez, com progresso e textos encorajadores.
// Pensado para quem não tem familiaridade com tecnologia.
export function GuidedEditor({ data, update, showPhoto, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const { t } = useT();
  const total = SECTIONS.length;
  const section = SECTIONS[step];
  const pct = Math.round(((step + 1) / total) * 100);
  const isLast = step === total - 1;

  return (
    <div className="flex h-full flex-col">
      {/* Progresso */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>{t("guided.step", { a: step + 1, b: total })}</span>
          <span>{t("guided.percent", { p: pct })}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Seção atual */}
      <div className="flex-1">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span className="text-2xl">{section.icon}</span>
          {t(`section.${section.id}.title`)}
        </h2>
        <p className="mb-4 mt-1 rounded-lg bg-indigo-50 p-3 text-sm leading-relaxed text-indigo-900">
          💡 {t(`section.${section.id}.help`)}
        </p>
        <div>{section.render(data, update, showPhoto, t)}</div>
      </div>

      {/* Navegação */}
      <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
        <Btn variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="px-5 py-2.5 text-base">
          {t("guided.back")}
        </Btn>
        {isLast ? (
          <Btn variant="primary" onClick={onFinish} className="px-5 py-2.5 text-base">
            {t("guided.finish")}
          </Btn>
        ) : (
          <Btn variant="primary" onClick={() => setStep((s) => Math.min(total - 1, s + 1))} className="px-5 py-2.5 text-base">
            {t("guided.continue")}
          </Btn>
        )}
      </div>

      {/* Atalho para pular para qualquer passo */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            aria-label={t(`section.${s.id}.title`)}
            title={t(`section.${s.id}.title`)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === step ? "bg-indigo-600" : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
