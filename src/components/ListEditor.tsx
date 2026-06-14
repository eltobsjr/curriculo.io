"use client";

import { ReactNode } from "react";
import { Btn } from "./ui";
import { useT } from "@/lib/i18n-ui";

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  addLabel: string;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  itemTitle?: (item: T, index: number) => string;
}

// Editor genérico de listas com adicionar / remover / mover.
export function ListEditor<T extends { id: string }>({
  items,
  onChange,
  create,
  addLabel,
  render,
  itemTitle,
}: ListEditorProps<T>) {
  const { t } = useT();
  const update = (id: string, patch: Partial<T>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {itemTitle ? itemTitle(item, i) : `Item ${i + 1}`}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                title={t("list.moveUp")}
              >
                ↑
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                title={t("list.moveDown")}
              >
                ↓
              </button>
              <button
                onClick={() => remove(item.id)}
                className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                title={t("list.remove")}
              >
                ✕
              </button>
            </div>
          </div>
          {render(item, (patch) => update(item.id, patch), i)}
        </div>
      ))}
      <Btn variant="outline" onClick={() => onChange([...items, create()])} className="w-full">
        + {addLabel}
      </Btn>
    </div>
  );
}
