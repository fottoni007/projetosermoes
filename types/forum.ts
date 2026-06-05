export type ForumTopic = {
  id: string;
  title: string;
  body: string;
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
