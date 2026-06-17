"use client";

import { useState } from "react";
import { PublicationItem } from "@/lib/resume-schema";
import { useT } from "@/lib/i18n-ui";
import { Btn } from "./ui";

interface Props {
  publications: PublicationItem[];
  onConfirm: (selected: PublicationItem[]) => void;
  onCancel: () => void;
}

// Aparece após o parse do Lattes quando há publicações: deixa o usuário escolher
// quais entram no currículo (importações acadêmicas podem ter dezenas de itens).
export function LattesImportModal({ publications, onConfirm, onCancel }: Props) {
  const { t } = useT();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(publications.map((p) => p.id)));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const all = () => setSelected(new Set(publications.map((p) => p.id)));
  const none = () => setSelected(new Set());

  const confirm = () => onConfirm(publications.filter((p) => selected.has(p.id)));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 no-print" onClick={onCancel}>
      <div
        className="ui-scaled flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">📚 {t("lattes.pubTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("lattes.pubDesc", { n: publications.length })}</p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <button onClick={all} className="font-medium text-indigo-600 hover:underline">
              {t("lattes.pubAll")}
            </button>
            <button onClick={none} className="font-medium text-slate-500 hover:underline">
              {t("lattes.pubNone")}
            </button>
            <span className="ml-auto text-slate-400">{selected.size}/{publications.length}</span>
          </div>
        </div>

        <ul className="thin-scroll flex-1 divide-y divide-slate-100 overflow-y-auto p-2">
          {publications.map((p) => (
            <li key={p.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2.5 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggle(p.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
                />
                <span className="text-sm leading-snug">
                  <span className="font-medium text-slate-800">{p.title}</span>
                  {p.venue ? <span className="text-slate-500">. {p.venue}</span> : null}
                  {p.year ? <span className="text-slate-400"> ({p.year})</span> : null}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
          <Btn variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Btn>
          <Btn variant="primary" onClick={confirm}>
            {t("lattes.pubConfirm")} ({selected.size})
          </Btn>
        </div>
      </div>
    </div>
  );
}
