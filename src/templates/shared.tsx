import { ResumeData } from "@/lib/resume-schema";

// Quebra uma descrição multi-linha em bullets. Linhas vazias são ignoradas.
export function Bullets({ text, className = "" }: { text?: string; className?: string }) {
  if (!text?.trim()) return null;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 1) {
    return <p className={className}>{lines[0]}</p>;
  }
  return (
    <ul className={`list-disc pl-4 space-y-0.5 ${className}`}>
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

// Monta lista de itens de contato presentes (ignora vazios).
export function contactItems(data: ResumeData): { key: string; value: string }[] {
  const items: { key: string; value: string }[] = [];
  if (data.email) items.push({ key: "email", value: data.email });
  if (data.phone) items.push({ key: "phone", value: data.phone });
  if (data.location) items.push({ key: "location", value: data.location });
  if (data.website) items.push({ key: "website", value: data.website });
  return items;
}

export function hasItems<T>(arr: T[] | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

// Barra de nível 1..5 reutilizável.
export function LevelBar({ level, color }: { level?: number; color: string }) {
  const pct = Math.max(0, Math.min(5, level ?? 0)) * 20;
  return (
    <div className="h-1.5 w-full rounded-full bg-black/10">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

// Dots de nível (alternativa visual à barra).
export function LevelDots({ level, color }: { level?: number; color: string }) {
  const n = Math.max(0, Math.min(5, level ?? 0));
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: i <= n ? color : "rgba(0,0,0,0.12)" }}
        />
      ))}
    </div>
  );
}
