import type { SermonType } from "@/lib/sermon-types";

export type SermonStatus = "pending" | "published" | "rejected";

export type Sermon = {
  id: string;
  title: string;
  preacher_name: string;
  date: string;
  biblical_text: string;
  is_series: boolean;
  series_theme: string;
  sermon_type: SermonType | null;
  notes: string;
  pdf_path: string | null;
  status: SermonStatus;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
};

// Subconjunto leve usado na listagem — evita carregar `notes` (texto longo)
// de todos os sermões só para renderizar os cartões.
export type SermonListItem = Pick<
  Sermon,
  | "id"
  | "title"
  | "preacher_name"
  | "date"
  | "biblical_text"
  | "series_theme"
  | "sermon_type"
  | "status"
  | "ai_summary"
  | "pdf_path"
>;

export type SermonFormState = {
  message: string;
  errors?: Record<string, string[]>;
};
