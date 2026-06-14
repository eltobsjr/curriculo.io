"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { getTemplate } from "@/templates/registry";
import { useT } from "@/lib/i18n-ui";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface Props {
  data: ResumeData;
  settings: ResumeSettings;
  printMode?: boolean;
}

const fontClass: Record<string, string> = {
  sans: "font-resume-sans",
  serif: "font-resume-serif",
  mono: "font-resume-mono",
};

// Calcula onde a quebra de página realmente cai, evitando cortar seções no meio.
// Para cada limite bruto de A4 (1123px × N), procura seções que cruzariam esse limite
// e recua o ponto de quebra para antes delas — espelhando o break-inside:avoid do print.
function computeBreakPoints(page: HTMLElement, totalHeight: number): number[] {
  const numPages = Math.ceil(totalHeight / A4_HEIGHT);
  if (numPages <= 1) return [];

  const sections = Array.from(page.querySelectorAll("section")).map((el) => {
    const e = el as HTMLElement;
    return { top: e.offsetTop, bottom: e.offsetTop + e.offsetHeight };
  });

  const breaks: number[] = [];
  for (let p = 1; p < numPages; p++) {
    const rawBreak = p * A4_HEIGHT;
    const straddling = sections.filter((s) => s.top < rawBreak && s.bottom > rawBreak);
    if (straddling.length === 0) {
      breaks.push(rawBreak);
    } else {
      // Usa o topo da seção mais próxima do limite como novo ponto de quebra
      const toMove = straddling.reduce((a, b) => (a.top > b.top ? a : b));
      breaks.push(toMove.top);
    }
  }
  return breaks;
}

function PageBreakMarker({
  top,
  pageNum,
  continuesLabel,
  pageLabel,
}: {
  top: number;
  pageNum: number;
  continuesLabel: string;
  pageLabel: string;
}) {
  void pageNum;
  return (
    <>
      {/* Badge "continua" no canto inferior direito, antes do limite */}
      <div
        className="no-print pointer-events-none absolute right-4 z-20 flex items-center"
        style={{ top: top - 26 }}
      >
        <span className="rounded-full bg-slate-700/65 px-2.5 py-[3px] text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
          {continuesLabel}
        </span>
      </div>

      {/* Linha divisória no limite ajustado */}
      <div
        className="no-print pointer-events-none absolute left-0 right-0 z-20"
        style={{
          top,
          height: 2,
          background: "linear-gradient(to right, #c7d2fe 0%, #818cf8 50%, #c7d2fe 100%)",
        }}
      />

      {/* Badge "Página N" logo abaixo da linha */}
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
  const [breakPoints, setBreakPoints] = useState<number[]>([]);

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

  // Altura real + pontos de quebra ajustados para não cortar seções.
  useLayoutEffect(() => {
    if (printMode) return;
    const el = pageRef.current;
    if (!el) return;
    const update = () => {
      const h = Math.max(A4_HEIGHT, el.offsetHeight);
      setPageHeight(h);
      setBreakPoints(computeBreakPoints(el, h));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
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
      <div style={{ height: pageHeight * scale, width: A4_WIDTH * scale, margin: "0 auto" }}>
        <div
          className={fontClass[settings.fontFamily]}
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}
        >
          <div ref={pageRef} className="a4-page shadow-xl" style={{ position: "relative" }}>
            <Template data={data} settings={settings} />

            {breakPoints.map((bp, i) => (
              <PageBreakMarker
                key={i}
                top={bp}
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
