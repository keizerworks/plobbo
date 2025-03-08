CREATE TABLE "waitlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	CONSTRAINT "waitlists_email_unique" UNIQUE("email")
);
