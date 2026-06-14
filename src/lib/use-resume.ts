"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, ResumeData, ResumeDocument, ResumeSettings } from "./resume-schema";
import { Lang } from "./i18n";
import { SAMPLE_RESUME, EMPTY_RESUME } from "./sample-data";
import { translateResume } from "./translate";

const STORAGE_KEY = "curriculo-io:document:v1";
const ALL_LANGS: Lang[] = ["pt", "en", "es"];

type Content = Partial<Record<Lang, ResumeData>>;

function withDefaults(data: Partial<ResumeData>): ResumeData {
  return { ...EMPTY_RESUME, ...data };
}

function load(): ResumeDocument {
  const fallback: ResumeDocument = { content: { pt: SAMPLE_RESUME }, settings: DEFAULT_SETTINGS };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const settings: ResumeSettings = { ...DEFAULT_SETTINGS, ...parsed.settings };

    if (parsed.content && typeof parsed.content === "object") {
      const content: Content = {};
      for (const k of Object.keys(parsed.content) as Lang[]) content[k] = withDefaults(parsed.content[k]);
      if (Object.keys(content).length === 0) content.pt = SAMPLE_RESUME;
      return { content, settings };
    }

    if (parsed.data) {
      return { content: { [settings.language ?? "pt"]: withDefaults(parsed.data) }, settings };
    }
  } catch { /* ignore */ }
  return fallback;
}

// Dispara tradução para os idiomas-alvo em paralelo, atualizando o estado conforme chegam.
function runTranslations(
  base: ResumeData,
  from: Lang,
  targets: Lang[],
  setContent: React.Dispatch<React.SetStateAction<Content>>,
  setIsTranslating: (v: boolean) => void,
) {
  if (targets.length === 0) return;
  setIsTranslating(true);
  Promise.all(
    targets.map((target) =>
      translateResume(base, from, target)
        .then((translated) => setContent((prev) => ({ ...prev, [target]: translated })))
        .catch(() => {
          // fallback: copia o original se a API falhar
          setContent((prev) => ({ ...prev, [target]: JSON.parse(JSON.stringify(base)) as ResumeData }));
        })
    )
  ).finally(() => setIsTranslating(false));
}

export function useResume() {
  const [content, setContent] = useState<Content>({ pt: SAMPLE_RESUME });
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const doc = load();
    setContent(doc.content);
    setSettings(doc.settings);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ content, settings })); }
      catch { /* quota cheia */ }
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [content, settings, hydrated]);

  const lang = settings.language ?? "pt";
  const data = useMemo(() => content[lang] ?? EMPTY_RESUME, [content, lang]);
  const availableLangs = useMemo(() => Object.keys(content) as Lang[], [content]);

  const setData = useCallback(
    (value: ResumeData | ((prev: ResumeData) => ResumeData)) => {
      setContent((prev) => {
        const current = prev[lang] ?? EMPTY_RESUME;
        const next = typeof value === "function" ? (value as (p: ResumeData) => ResumeData)(current) : value;
        return { ...prev, [lang]: next };
      });
    },
    [lang],
  );

  const updateData = useCallback(
    (patch: Partial<ResumeData>) => {
      setContent((prev) => ({ ...prev, [lang]: { ...(prev[lang] ?? EMPTY_RESUME), ...patch } }));
    },
    [lang],
  );

  const updateSettings = useCallback((patch: Partial<ResumeSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // Troca o idioma. Se o conteúdo ainda não existe, semeia + traduz em background.
  const switchLanguage = useCallback(
    async (target: Lang) => {
      // Troca imediatamente para feedback visual
      setSettings((prev) => ({ ...prev, language: target }));

      if (content[target]) return; // já tem conteúdo, nada a fazer

      const from = lang;
      const base = JSON.parse(JSON.stringify(content[from] ?? SAMPLE_RESUME)) as ResumeData;

      // Seed imediato — usuário já vê algo enquanto traduz
      setContent((prev) => ({ ...prev, [target]: base }));

      runTranslations(base, from, [target], setContent, setIsTranslating);
    },
    [content, lang],
  );

  const copyFromLanguage = useCallback(
    (source: Lang) => {
      setContent((prev) => {
        const src = prev[source];
        if (!src) return prev;
        return { ...prev, [lang]: JSON.parse(JSON.stringify(src)) as ResumeData };
      });
    },
    [lang],
  );

  const resetSample = useCallback(() => setData(SAMPLE_RESUME), [setData]);
  const clearAll = useCallback(() => setData(withDefaults({})), [setData]);

  // Importa JSON. Popula o idioma base e traduz automaticamente para EN e ES em paralelo.
  const loadDocument = useCallback(
    (doc: { content?: Content; data?: Partial<ResumeData>; settings?: Partial<ResumeSettings> }) => {
      if (doc.settings) setSettings((prev) => ({ ...prev, ...doc.settings }));

      let baseLang: Lang = "pt";
      let baseData: ResumeData | undefined;

      if (doc.content && Object.keys(doc.content).length > 0) {
        const c: Content = {};
        for (const k of Object.keys(doc.content) as Lang[]) c[k] = withDefaults(doc.content[k]!);
        setContent(c);

        // Se já tem os 3 idiomas, nada a traduzir
        if (ALL_LANGS.every((l) => !!c[l])) return;

        baseLang = (doc.settings?.language as Lang) ?? (Object.keys(c)[0] as Lang) ?? "pt";
        baseData = c[baseLang];
      } else if (doc.data) {
        baseLang = "pt"; // JSON antigo sempre assume PT como base
        baseData = withDefaults(doc.data);
        setContent({ [baseLang]: baseData });
      }

      if (!baseData) return;

      // Traduz para todos os idiomas que ainda não têm conteúdo
      const targets = ALL_LANGS.filter((l) => l !== baseLang);
      runTranslations(baseData, baseLang, targets, setContent, setIsTranslating);
    },
    [],
  );

  return {
    data,
    settings,
    hydrated,
    content,
    availableLangs,
    isTranslating,
    setData,
    updateData,
    updateSettings,
    switchLanguage,
    copyFromLanguage,
    resetSample,
    clearAll,
    loadDocument,
  };
}
