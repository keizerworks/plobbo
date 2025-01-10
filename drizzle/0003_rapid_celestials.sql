DROP TABLE "user_metadata" CASCADE;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "logo" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profile_picture" varchar(255);