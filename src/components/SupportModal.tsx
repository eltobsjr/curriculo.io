"use client";

import { useState } from "react";
import { PIX, isPixConfigured } from "@/lib/monetization";
import { useT } from "@/lib/i18n-ui";
import { Btn } from "./ui";

export function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const { t } = useT();
  if (!open) return null;

  const configured = isPixConfigured();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 no-print" onClick={onClose}>
      <div className="ui-scaled w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="text-4xl">❤️</div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{t("support.title")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("support.desc")}</p>
        </div>

        {configured ? (
          <div className="mt-5">
            <span className="mb-1 block text-xs font-medium text-slate-500">{t("support.pixKey")} ({PIX.name})</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800">
                {PIX.key}
              </code>
              <Btn variant="primary" onClick={copy} className="shrink-0">
                {copied ? t("support.copied") : t("support.copy")}
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {t("support.notConfigured")}
          </div>
        )}

        <button onClick={onClose} className="mt-5 w-full rounded-lg py-2 text-center text-sm text-slate-500 hover:bg-slate-100">
          {t("support.close")}
        </button>
      </div>
    </div>
  );
}
