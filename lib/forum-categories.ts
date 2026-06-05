export type ForumCategory =
  | "homiletica"
  | "exposicao"
  | "preparacao"
  | "comunicacao"
  | "vida"
  | "geral";

export const FORUM_CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: "homiletica", label: "Homilética" },
  { value: "exposicao", label: "Exposição Bíblica" },
  { value: "preparacao", label: "Preparação do Sermão" },
  { value: "comunicacao", label: "Comunicação e Oratória" },
  { value: "vida", label: "Vida do Pregador" },
  { value: "geral", label: "Geral" },
];

export const FORUM_CATEGORY_LABELS: Record<ForumCategory, string> = {
  homiletica: "Homilética",
  exposicao: "Exposição Bíblica",
  preparacao: "Preparação do Sermão",
  comunicacao: "Comunicação e Oratória",
  vida: "Vida do Pregador",
  geral: "Geral",
};

export const FORUM_CATEGORY_VALUES = FORUM_CATEGORIES.map((c) => c.value) as string[];

export function forumCategoryLabel(v: string): string {
  return FORUM_CATEGORY_LABELS[v as ForumCategory] ?? v;
}
