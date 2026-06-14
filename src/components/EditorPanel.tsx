"use client";

import { ResumeData } from "@/lib/resume-schema";
import { SECTIONS } from "./sections";
import { useT } from "@/lib/i18n-ui";
import { SectionCard } from "./ui";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  showPhoto: boolean;
}

// Modo Avançado: todas as seções visíveis em cards, edição livre.
export function EditorPanel({ data, update, showPhoto }: Props) {
  const { t } = useT();
  return (
    <div className="space-y-4">
      {SECTIONS.map((s) => (
        <SectionCard key={s.id} title={`${s.icon} ${t(`section.${s.id}.title`)}`}>
          {s.render(data, update, showPhoto, t)}
        </SectionCard>
      ))}
    </div>
  );
}
