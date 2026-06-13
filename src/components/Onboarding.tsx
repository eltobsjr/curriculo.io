"use client";

import { EditMode } from "@/lib/use-ui-prefs";

interface Props {
  onChoose: (opts: { mode: EditMode; start: "exemplo" | "zero" }) => void;
}

// Tela de boas-vindas (primeiro acesso): escolhe modo e ponto de partida.
export function Onboarding({ onChoose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="ui-scaled w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            C
          </span>
          <span className="text-xl font-bold text-slate-800">
            Currículo<span className="text-indigo-600">.io</span>
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Vamos criar seu currículo 🎉</h1>
        <p className="mt-1 text-slate-600">
          Grátis, em minutos, e sem cadastro. Como você prefere começar?
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => onChoose({ mode: "guiado", start: "zero" })}
            className="group flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-50/40"
          >
            <span className="text-3xl">🧭</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">Modo Guiado <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">recomendado</span></div>
              <div className="text-sm text-slate-500">Passo a passo, com dicas. Ideal para a primeira vez.</div>
            </div>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">→</span>
          </button>

          <button
            onClick={() => onChoose({ mode: "avancado", start: "zero" })}
            className="group flex w-full items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition hover:border-indigo-500 hover:bg-indigo-50/40"
          >
            <span className="text-3xl">⚡</span>
            <div className="flex-1">
              <div className="font-semibold text-slate-800">Modo Avançado</div>
              <div className="text-sm text-slate-500">Tudo em uma tela, edição livre. Para quem já tem prática.</div>
            </div>
            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">→</span>
          </button>

          <button
            onClick={() => onChoose({ mode: "guiado", start: "exemplo" })}
            className="w-full rounded-xl py-2 text-center text-sm text-slate-500 hover:text-indigo-600 hover:underline"
          >
            Ou veja um exemplo pronto para se inspirar →
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <span>✓ 100% grátis</span>
          <span>✓ Sem cadastro</span>
          <span>✓ Sem marca d&apos;água</span>
          <span>✓ Dados só no seu navegador</span>
        </div>
      </div>
    </div>
  );
}
