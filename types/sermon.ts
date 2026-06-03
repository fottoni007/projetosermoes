export type SermonStatus = "pending" | "published" | "rejected";

export type Sermon = {
  id: string;
  title: string;
  preacher_name: string;
  date: string;
  biblical_text: string;
  series_theme: string;
  is_series: boolean;
  notes: string;
  pdf_path: string | null;
  status: SermonStatus;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type SermonFormState = {
  message: string;
  errors?: Record<string, string[]>;
};
