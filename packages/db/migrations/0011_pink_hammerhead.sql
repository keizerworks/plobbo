ALTER TABLE "blog" DROP CONSTRAINT "blog_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "blog" DROP CONSTRAINT "blog_author_id_organization_member_id_fk";
--> statement-breakpoint
ALTER TABLE "journey" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "journey" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_organization_member_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."organization_member"("id") ON DELETE cascade ON UPDATE no action;