CREATE TYPE "public"."blog_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');--> statement-breakpoint
CREATE TABLE "blog_metadata" (
	"blog_id" varchar(34) NOT NULL,
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
	"id" varchar(34) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"published_date" timestamp with time zone,
	"organization_id" varchar(34),
	"author_id" varchar(34) NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"image" varchar(255),
	"body" json[],
	"content" text DEFAULT '',
	"tags" text[] DEFAULT '{}',
	"likes" integer DEFAULT 0,
	"status" "blog_status" DEFAULT 'DRAFT'
);
--> statement-breakpoint
CREATE TABLE "organization_member" (
	"id" varchar(34) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" varchar(34) NOT NULL,
	"organization_id" varchar(34) NOT NULL,
	"role" "member_role" NOT NULL,
	"profile_picture" varchar(255),
	"bio" varchar(255),
	"display_name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(34) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" varchar,
	"logo" varchar(255) NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(34) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blog_metadata" ADD CONSTRAINT "blog_metadata_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_organization_member_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."organization_member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;