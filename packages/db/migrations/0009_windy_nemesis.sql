CREATE TABLE "journey" (
	"id" varchar(34) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" varchar(255),
	"organizaiton_id" varchar(34) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "blog" ADD COLUMN "journey_id" varchar(34);--> statement-breakpoint
ALTER TABLE "journey" ADD CONSTRAINT "journey_organizaiton_id_organization_id_fk" FOREIGN KEY ("organizaiton_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_journey_id_journey_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journey"("id") ON DELETE no action ON UPDATE no action;