import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { blog_status, role } from "./enums";

export type blog = {
    id: string;
    created_at: Generated<Timestamp | null>;
    updated_at: Generated<Timestamp | null>;
    organization_id: string | null;
    author_id: string;
    title: string;
    slug: string;
    image: string | null;
    body: string;
    tags: Generated<string[]>;
    likes: Generated<number>;
    status: Generated<blog_status>;
};
export type email_verification_request = {
    id: Generated<number>;
    user_id: string;
    email: string;
    otp: string;
    expires_at: Timestamp;
};
export type organization = {
    id: string;
    created_at: Generated<Timestamp | null>;
    updated_at: Generated<Timestamp | null>;
    name: string;
    slug: string;
    description: string | null;
    logo: string;
};
export type organization_member = {
    id: string;
    created_at: Generated<Timestamp | null>;
    updated_at: Generated<Timestamp | null>;
    user_id: string;
    organization_id: string;
    role: role;
    org_metadata: unknown;
};
export type session = {
    id: string;
    created_at: Generated<Timestamp | null>;
    updated_at: Generated<Timestamp | null>;
    user_id: string;
    expires_at: Timestamp;
};
export type user = {
    id: string;
    created_at: Generated<Timestamp | null>;
    updated_at: Generated<Timestamp | null>;
    email: string;
    name: string;
    email_verified: Generated<boolean>;
    recovery_code: string | null;
    password_hash: string | null;
    profile_picture: string | null;
};
export type DB = {
    blog: blog;
    email_verification_request: email_verification_request;
    organization: organization;
    organization_member: organization_member;
    session: session;
    user: user;
};
