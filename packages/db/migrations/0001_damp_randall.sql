CREATE TABLE "organization_domain" (
	"organization_id" varchar(34) PRIMARY KEY NOT NULL,
	"domain" varchar(255) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"token" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_metadata" DROP CONSTRAINT "blog_metadata_blogId_unique";--> statement-breakpoint
ALTER TABLE "blog_metadata" ADD PRIMARY KEY ("blog_id");--> statement-breakpoint
ALTER TABLE "organization_domain" ADD CONSTRAINT "organization_domain_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;