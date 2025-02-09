CREATE TYPE "public"."blog_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TABLE "blog_metadata" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"blog_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"keywords" text,
	"og_title" text,
	"og_description" text,
	"og_image" text,
	"og_url" text,
	CONSTRAINT "blog_metadata_blogId_unique" UNIQUE("blog_id")
);
--> statement-breakpoint
CREATE TABLE "blog" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_date" timestamp with time zone,
	"organization_id" uuid,
	"author_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"image" varchar(255),
	"body" json[],
	"content" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"likes" integer DEFAULT 0,
	"status" "blog_status" DEFAULT 'DRAFT'
);
--> statement-breakpoint
CREATE TABLE "email_verification_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"email" varchar NOT NULL,
	"otp" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_member" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "member_role" NOT NULL,
	"profile_picture" varchar(255),
	"bio" varchar(255),
	"display_name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" varchar,
	"logo" varchar(255) NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email_verified" boolean DEFAULT false,
	"recovery_code" varchar,
	"password_hash" varchar,
	"profile_picture" varchar(255),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blog_metadata" ADD CONSTRAINT "blog_metadata_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_organization_member_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."organization_member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_request" ADD CONSTRAINT "email_verification_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;