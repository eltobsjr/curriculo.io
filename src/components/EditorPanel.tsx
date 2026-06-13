"use client";

import { ResumeData } from "@/lib/resume-schema";
import { SECTIONS } from "./sections";
import { SectionCard } from "./ui";

interface Props {
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  showPhoto: boolean;
}

// Modo Avançado: todas as seções visíveis em cards, edição livre.
export function EditorPanel({ data, update, showPhoto }: Props) {
  return (
    <div className="space-y-4">
      {SECTIONS.map((s) => (
        <SectionCard key={s.id} title={`${s.icon} ${s.title}`}>
          {s.render(data, update, showPhoto)}
        </SectionCard>
      ))}
    </div>
  );
}
