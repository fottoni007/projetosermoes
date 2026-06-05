import type { ForumCategory } from "@/lib/forum-categories";

export type ForumTopic = {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type ForumReply = {
  id: string;
  topic_id: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
};

export type ForumState = { message: string; success?: boolean };

export type Notification = {
  id: string;
  topic_id: string | null;
  topic_title: string;
  actor_name: string;
  read: boolean;
  created_at: string;
};
