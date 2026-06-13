"use client";

import { JOB_BOARDS, isPixConfigured } from "@/lib/monetization";

interface Props {
  open: boolean;
  onClose: () => void;
  onSupport: () => void;
}

// Aparece logo após o usuário baixar o PDF — o melhor momento de conversão.
// Mostra vagas (links de afiliado) e um convite discreto para apoiar.
export function PostDownloadModal({ open, onClose, onSupport }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 no-print" onClick={onClose}>
      <div className="ui-scaled w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Currículo pronto!</h2>
          <p className="mt-1 text-sm text-slate-600">
            Agora dê o próximo passo: estas vagas estão esperando o seu currículo.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {JOB_BOARDS.map((b) => (
            <a
              key={b.name}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 p-3 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
            >
              <span className="text-2xl">{b.emoji}</span>
              <span className="text-sm font-semibold text-slate-800">{b.name}</span>
              {b.note && <span className="text-[10px] leading-tight text-slate-400">{b.note}</span>}
            </a>
          ))}
        </div>

        {isPixConfigured() && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-rose-50 p-3">
            <span className="text-sm text-rose-900">❤️ Gostou? Apoie o projeto com um Pix.</span>
            <button
              onClick={onSupport}
              className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Apoiar
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full rounded-lg py-2 text-center text-sm text-slate-500 hover:bg-slate-100">
          Continuar editando
        </button>

        <p className="mt-2 text-center text-[10px] text-slate-300">Alguns links podem ser patrocinados.</p>
      </div>
    </div>
  );
}
