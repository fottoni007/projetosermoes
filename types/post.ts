export type PostCategory = "pastoral" | "noticias" | "teologia";

export type Post = {
  id: string;
  title: string;
  author: string;
  categories: PostCategory[];
  content: string;
  cover_image_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
};

export type PostFormState = { message: string };
