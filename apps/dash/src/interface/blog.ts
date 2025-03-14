import type { BlogStatusEnum } from "@plobbo/validator/blog/list";

export interface Blog {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  title: string;
  slug: string;
  image: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[] | null;
  content: string;
  tags: string[];
  likes: number;
  status: BlogStatusEnum;
  organizationId: string | null;
  authorId: string;
  publishedDate: Date;
  publishedBody: any[] | null;
  publishedContent: string;
}

export interface BlogMetadata {
  description: string;
  blogId: string;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
}
