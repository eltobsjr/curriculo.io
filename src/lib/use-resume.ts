"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, ResumeData, ResumeDocument, ResumeSettings } from "./resume-schema";
import { SAMPLE_RESUME } from "./sample-data";

const STORAGE_KEY = "curriculo-io:document:v1";

function load(): ResumeDocument {
  if (typeof window === "undefined") {
    return { data: SAMPLE_RESUME, settings: DEFAULT_SETTINGS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ResumeDocument;
      // merge defensivo: garante campos novos do schema
      return {
        data: { ...SAMPLE_RESUME, ...parsed.data },
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      };
    }
  } catch {
    /* ignore */
  }
  return { data: SAMPLE_RESUME, settings: DEFAULT_SETTINGS };
}

export function useResume() {
  // Estado inicial estável (evita mismatch de hidratação): começa com sample,
  // depois sincroniza com localStorage no efeito.
  const [data, setData] = useState<ResumeData>(SAMPLE_RESUME);
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const doc = load();
    setData(doc.data);
    setSettings(doc.settings);
    setHydrated(true);
  }, []);

  // Persiste com debounce.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, settings }));
      } catch {
        /* quota cheia / privado */
      }
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, settings, hydrated]);

  const updateData = useCallback((patch: Partial<ResumeData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<ResumeSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSample = useCallback(() => setData(SAMPLE_RESUME), []);

  const clearAll = useCallback(() => {
    setData({
      fullName: "",
      headline: "",
      photoUrl: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      socials: [],
      summary: "",
      experiences: [],
      education: [],
      projects: [],
      skills: [],
      languages: [],
      certifications: [],
    });
  }, []);

  return {
    data,
    settings,
    hydrated,
    setData,
    updateData,
    updateSettings,
    resetSample,
    clearAll,
  };
}
