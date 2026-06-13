"use client";

import { useCallback, useEffect, useState } from "react";

export type EditMode = "guiado" | "avancado";

export interface UiPrefs {
  fontScale: number; // 1 = 100%, acessibilidade (0.9 .. 1.4)
  mode: EditMode;
  onboardingDone: boolean;
}

const KEY = "curriculo-io:ui-prefs:v1";

const DEFAULTS: UiPrefs = { fontScale: 1, mode: "guiado", onboardingDone: false };

export function useUiPrefs() {
  const [prefs, setPrefs] = useState<UiPrefs>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    // Aplica a escala de fonte na raiz (acessibilidade global).
    document.documentElement.style.setProperty("--ui-scale", String(prefs.fontScale));
  }, [prefs, hydrated]);

  const set = useCallback((patch: Partial<UiPrefs>) => setPrefs((p) => ({ ...p, ...patch })), []);

  const incFont = useCallback(
    () => setPrefs((p) => ({ ...p, fontScale: Math.min(1.4, +(p.fontScale + 0.1).toFixed(2)) })),
    [],
  );
  const decFont = useCallback(
    () => setPrefs((p) => ({ ...p, fontScale: Math.max(0.9, +(p.fontScale - 0.1).toFixed(2)) })),
    [],
  );

  return { prefs, hydrated, set, incFont, decFont };
}
