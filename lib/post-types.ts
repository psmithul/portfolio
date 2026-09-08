export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  body: string;
  readingMinutes: number;
  draft: boolean;
};
