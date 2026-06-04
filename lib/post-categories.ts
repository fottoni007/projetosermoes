import type { PostCategory } from "@/types/post";

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "pastoral", label: "Pastoral" },
  { value: "noticias", label: "Notícias" },
  { value: "teologia", label: "Teologia" },
];

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  pastoral: "Pastoral",
  noticias: "Notícias",
  teologia: "Teologia",
};

export function postCategoryLabel(value: string): string {
  return POST_CATEGORY_LABELS[value as PostCategory] ?? value;
}
