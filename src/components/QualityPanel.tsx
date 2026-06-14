"use client";

import { useState } from "react";
import { ResumeData } from "@/lib/resume-schema";
import { evaluateResume, scoreColor } from "@/lib/insights";
import { useT } from "@/lib/i18n-ui";

export function QualityPanel({ data }: { data: ResumeData }) {
  const { score, checks } = evaluateResume(data);
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const color = scoreColor(score);
  const pending = checks.filter((c) => !c.ok);

  const scoreWord = score >= 80 ? t("quality.great") : score >= 50 ? t("quality.almost") : t("quality.improve");

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 p-3 text-left" aria-expanded={open}>
        {/* Anel de pontuação */}
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 97.4} 97.4`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
            {score}
          </span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-800">
            {t("quality.title")}: <span style={{ color }}>{scoreWord}</span>
          </div>
          <div className="text-xs text-slate-500">
            {pending.length === 0 ? t("quality.allGood") : t("quality.suggestions", { n: pending.length })}
          </div>
        </div>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <ul className="space-y-1.5 border-t border-slate-100 p-3">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-xs">
              <span className={c.ok ? "text-emerald-600" : "text-slate-300"}>{c.ok ? "✓" : "○"}</span>
              <div>
                <span className={c.ok ? "text-slate-500 line-through" : "font-medium text-slate-700"}>
                  {t(`check.${c.id}.label`)}
                </span>
                {!c.ok && <p className="text-slate-500">{t(`check.${c.id}.hint`)}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
