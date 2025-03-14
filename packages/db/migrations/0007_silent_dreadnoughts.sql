ALTER TABLE "blog" ADD COLUMN "published_body" json[];--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "published_content" json[];--> statement-breakpoint
ALTER TABLE "organization_subscription" ADD COLUMN "amount" integer DEFAULT 0 NOT NULL;