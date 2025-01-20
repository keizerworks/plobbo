export const blog_status = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED"
} as const;
export type blog_status = (typeof blog_status)[keyof typeof blog_status];
export const role = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    EDITOR: "EDITOR",
    VIEWER: "VIEWER"
} as const;
export type role = (typeof role)[keyof typeof role];
