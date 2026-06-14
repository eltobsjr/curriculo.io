"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { getTemplate } from "@/templates/registry";
import { useT } from "@/lib/i18n-ui";

const A4_WIDTH = 794; // px
const A4_HEIGHT = 1123; // px (altura de 1 página A4 em 96dpi)

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

// Marcador visual de quebra de página — aparece só no preview, nunca no PDF.
function PageBreakMarker({ top, pageNum, continuesLabel, pageLabel }: {
  top: number;
  pageNum: number;
  continuesLabel: string;
  pageLabel: string;
}) {
  void pageNum; // pageNum usado para key externa, não renderizado aqui
  return (
    <>
      {/* Badge "continua" no canto inferior direito da página anterior */}
      <div
        className="no-print pointer-events-none absolute right-4 z-20 flex items-center"
        style={{ top: top - 26 }}
      >
        <span className="rounded-full bg-slate-700/65 px-2.5 py-[3px] text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
          {continuesLabel}
        </span>
      </div>

      {/* Linha divisória no exato limite da página */}
      <div
        className="no-print pointer-events-none absolute left-0 right-0 z-20"
        style={{ top, height: 2, background: "linear-gradient(to right, #c7d2fe 0%, #818cf8 50%, #c7d2fe 100%)" }}
      />

      {/* Badge "Página N" centralizado logo abaixo da linha */}
      <div
        className="no-print pointer-events-none absolute left-0 right-0 z-20 flex justify-center"
        style={{ top: top + 5 }}
      >
        <span className="rounded-full border border-indigo-200 bg-white px-2.5 py-[3px] text-[10px] font-medium text-indigo-500 shadow-sm">
          {pageLabel}
        </span>
      </div>
    </>
  );
}

export function ResumePreview({ data, settings, printMode = false }: Props) {
  const Template = getTemplate(settings.templateId).Component;
  const { t } = useT();
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

  const numPages = Math.ceil(pageHeight / A4_HEIGHT);

  return (
    <div ref={wrapRef} className="w-full">
      {/* Espaçador com a altura real escalada, para não cortar conteúdo. */}
      <div style={{ height: pageHeight * scale, width: A4_WIDTH * scale, margin: "0 auto" }}>
        <div
          className={fontClass[settings.fontFamily]}
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}
        >
          <div ref={pageRef} className="a4-page shadow-xl" style={{ position: "relative" }}>
            <Template data={data} settings={settings} />

            {/* Marcadores de quebra de página (só no preview) */}
            {numPages > 1 &&
              Array.from({ length: numPages - 1 }, (_, i) => (
                <PageBreakMarker
                  key={i}
                  top={(i + 1) * A4_HEIGHT}
                  pageNum={i + 2}
                  continuesLabel={t("preview.continues")}
                  pageLabel={t("preview.page", { n: i + 2 })}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
