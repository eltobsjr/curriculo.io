"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, ResumeData, ResumeDocument, ResumeSettings } from "./resume-schema";
import { Lang } from "./i18n";
import { SAMPLE_RESUME, EMPTY_RESUME } from "./sample-data";

const STORAGE_KEY = "curriculo-io:document:v1";

type Content = Partial<Record<Lang, ResumeData>>;

function withDefaults(data: Partial<ResumeData>): ResumeData {
  return { ...EMPTY_RESUME, ...data };
}

// Carrega do localStorage, migrando o formato antigo ({ data }) para multi-idioma ({ content }).
function load(): ResumeDocument {
  const fallback: ResumeDocument = {
    content: { pt: SAMPLE_RESUME },
    settings: DEFAULT_SETTINGS,
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const settings: ResumeSettings = { ...DEFAULT_SETTINGS, ...parsed.settings };

    // Formato novo (multi-idioma)
    if (parsed.content && typeof parsed.content === "object") {
      const content: Content = {};
      for (const k of Object.keys(parsed.content) as Lang[]) {
        content[k] = withDefaults(parsed.content[k]);
      }
      if (Object.keys(content).length === 0) content.pt = SAMPLE_RESUME;
      return { content, settings };
    }

    // Formato antigo ({ data }) → migra para o idioma pt (ou o idioma salvo)
    if (parsed.data) {
      return { content: { [settings.language ?? "pt"]: withDefaults(parsed.data) }, settings };
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export function useResume() {
  const [content, setContent] = useState<Content>({ pt: SAMPLE_RESUME });
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const doc = load();
    setContent(doc.content);
    setSettings(doc.settings);
    setHydrated(true);
  }, []);

  // Persiste com debounce.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ content, settings }));
      } catch {
        /* quota cheia / privado */
      }
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, settings, hydrated]);

  const lang = settings.language ?? "pt";

  // Conteúdo do idioma ativo (sempre definido).
  const data = useMemo(() => content[lang] ?? EMPTY_RESUME, [content, lang]);

  // Idiomas que já têm conteúdo.
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

  // Troca o idioma ativo. Se o idioma ainda não existe, semeia com uma cópia do
  // idioma atual (ponto de partida para você traduzir).
  const switchLanguage = useCallback(
    (target: Lang) => {
      setContent((prev) => {
        if (prev[target]) return prev;
        const base = prev[lang] ?? SAMPLE_RESUME;
        return { ...prev, [target]: JSON.parse(JSON.stringify(base)) as ResumeData };
      });
      setSettings((prev) => ({ ...prev, language: target }));
    },
    [lang],
  );

  // Copia o conteúdo de outro idioma para o idioma ativo (sobrescreve).
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

  // Importa um documento (.json). Aceita o formato novo e o antigo.
  const loadDocument = useCallback(
    (doc: { content?: Content; data?: Partial<ResumeData>; settings?: Partial<ResumeSettings> }) => {
      if (doc.settings) setSettings((prev) => ({ ...prev, ...doc.settings }));
      if (doc.content) {
        const c: Content = {};
        for (const k of Object.keys(doc.content) as Lang[]) c[k] = withDefaults(doc.content[k]!);
        setContent(c);
      } else if (doc.data) {
        const target = (doc.settings?.language as Lang) ?? lang;
        setContent((prev) => ({ ...prev, [target]: withDefaults(doc.data!) }));
      }
    },
    [lang],
  );

  return {
    data,
    settings,
    hydrated,
    content,
    availableLangs,
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
