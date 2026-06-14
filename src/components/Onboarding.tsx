"use client";

import Image from "next/image";
import { EditMode } from "@/lib/use-ui-prefs";
import { useT } from "@/lib/i18n-ui";

interface Props {
  onChoose: (opts: { mode: EditMode; start: "exemplo" | "zero" }) => void;
}

// Tela de boas-vindas (primeiro acesso): escolhe modo e ponto de partida.
export function Onboarding({ onChoose }: Props) {
  const { t } = useT();
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="ui-scaled w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-1 flex items-center gap-2">
          <Image src="/logo.png" alt="Currículo.io" width={36} height={36} className="h-9 w-9" />
          <span className="text-xl font-bold text-slate-800">
            Currículo<span className="text-indigo-600">.io</span>
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{t("onb.title")}</h1>
        <p className="mt-1 text-slate-600">{t("onb.subtitle")}</p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => onChoose({ mode: "guiado", start: "zero" })}
            className="group flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-50/40"
          >
            <span className="text-3xl">🧭</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">
                {t("onb.guidedTitle")}{" "}
                <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">{t("onb.recommended")}</span>
              </div>
              <div className="text-sm text-slate-500">{t("onb.guidedDesc")}</div>
            </div>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">→</span>
          </button>

          <button
            onClick={() => onChoose({ mode: "avancado", start: "zero" })}
            className="group flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-50/40"
          >
            <span className="text-3xl">⚡</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">{t("onb.advancedTitle")}</div>
              <div className="text-sm text-slate-500">{t("onb.advancedDesc")}</div>
            </div>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">→</span>
          </button>

          <button
            onClick={() => onChoose({ mode: "guiado", start: "exemplo" })}
            className="w-full rounded-xl py-2 text-center text-sm text-slate-500 hover:text-indigo-600 hover:underline"
          >
            {t("onb.example")}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span>✓ {t("banner.free")}</span>
          <span>✓ {t("banner.noSignup")}</span>
          <span>✓ {t("banner.noWatermark")}</span>
          <span>✓ {t("banner.dataLocal")}</span>
        </div>
      </div>
    </div>
  );
}
