"use client";

import { useEffect, useRef, useState } from "react";
import { ResumeData, ResumeSettings } from "@/lib/resume-schema";
import { getTemplate } from "@/templates/registry";

const A4_WIDTH = 794; // px

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
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (printMode) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / A4_WIDTH));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [printMode]);

  const page = (
    <div className={`a4-page shadow-xl ${fontClass[settings.fontFamily]}`}>
      <Template data={data} settings={settings} />
    </div>
  );

  if (printMode) {
    return <div className={fontClass[settings.fontFamily]}>{page}</div>;
  }

  return (
    <div ref={wrapRef} className="w-full">
      <div
        style={{
          height: 1123 * scale,
          width: A4_WIDTH * scale,
          margin: "0 auto",
        }}
      >
        <div
          className={`${fontClass[settings.fontFamily]}`}
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4_WIDTH }}
        >
          <div className="a4-page shadow-xl">
            <Template data={data} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
