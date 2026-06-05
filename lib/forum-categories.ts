export type ForumCategory =
  | "homiletica"
  | "exposicao"
  | "preparacao"
  | "comunicacao"
  | "vida"
  | "ia"
  | "geral";

export const FORUM_CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: "homiletica", label: "Homilética" },
  { value: "exposicao", label: "Exposição Bíblica" },
  { value: "preparacao", label: "Preparação do Sermão" },
  { value: "comunicacao", label: "Comunicação e Oratória" },
  { value: "vida", label: "Vida do Pregador" },
  { value: "ia", label: "IA e Pregação" },
  { value: "geral", label: "Geral" },
];

export const FORUM_CATEGORY_LABELS: Record<ForumCategory, string> = {
  homiletica: "Homilética",
  exposicao: "Exposição Bíblica",
  preparacao: "Preparação do Sermão",
  comunicacao: "Comunicação e Oratória",
  vida: "Vida do Pregador",
  ia: "IA e Pregação",
  geral: "Geral",
};

// Cores distintas por categoria (classes completas para o Tailwind detectar)
export const FORUM_CATEGORY_STYLES: Record<ForumCategory, string> = {
  homiletica: "bg-amber-100 text-amber-800",
  exposicao: "bg-sky-100 text-sky-800",
  preparacao: "bg-violet-100 text-violet-800",
  comunicacao: "bg-rose-100 text-rose-800",
  vida: "bg-teal-100 text-teal-800",
  ia: "bg-indigo-100 text-indigo-800",
  geral: "bg-ink/10 text-ink/60",
};

export const FORUM_CATEGORY_VALUES = FORUM_CATEGORIES.map((c) => c.value) as string[];

export function forumCategoryLabel(v: string): string {
  return FORUM_CATEGORY_LABELS[v as ForumCategory] ?? v;
}

export function forumCategoryStyle(v: string): string {
  return FORUM_CATEGORY_STYLES[v as ForumCategory] ?? "bg-ink/10 text-ink/60";
}
