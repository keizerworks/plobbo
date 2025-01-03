CREATE TABLE `blog` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`organization_id` text,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`image` text NOT NULL,
	`body` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`subdomain` text NOT NULL,
	`custom_domain` text NOT NULL,
	`settings` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `organization_id` text REFERENCES organization(id);