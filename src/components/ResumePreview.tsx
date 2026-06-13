"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { getTemplate } from "@/templates/registry";

const A4_WIDTH = 794; // px
const A4_HEIGHT = 1123; // px (altura mínima de 1 página)

interface Props {
  data: ResumeData;
  settings: ResumeSettings;
  // quando true, renderiza em tamanho real para impressão (sem escala).
  printMode?: boolean;
}

const fontClass: Record<string, string> = {
  sans: "font-resume-sans",
  serif: "font-resume-serif",
  mono: "font-resume-mono",
};

export function ResumePreview({ data, settings, printMode = false }: Props) {
  const Template = getTemplate(settings.templateId).Component;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(A4_HEIGHT);

  // Largura disponível → fator de escala.
  useEffect(() => {
    if (printMode) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / A4_WIDTH));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [printMode]);

  // Altura real da folha (cresce quando o conteúdo passa de uma página).
  useLayoutEffect(() => {
    if (printMode) return;
    const el = pageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPageHeight(Math.max(A4_HEIGHT, el.offsetHeight));
    });
    ro.observe(el);
    setPageHeight(Math.max(A4_HEIGHT, el.offsetHeight));
    return () => ro.disconnect();
  }, [printMode, data, settings]);

  if (printMode) {
    return (
      <div className={fontClass[settings.fontFamily]}>
        <div className="a4-page shadow-xl">
          <Template data={data} settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="w-full">
      {/* Espaçador com a altura real escalada, para não cortar conteúdo. */}
      <div style={{ height: pageHeight * scale, width: A4_WIDTH * scale, margin: "0 auto" }}>
        <div
          className={fontClass[settings.fontFamily]}
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}
        >
          <div ref={pageRef} className="a4-page shadow-xl">
            <Template data={data} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
