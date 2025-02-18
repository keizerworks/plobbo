CREATE TABLE `blog_metadata` (
	`blog_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`keywords` text,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`og_url` text,
	FOREIGN KEY (`blog_id`) REFERENCES `blog`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_metadata_blogId_unique` ON `blog_metadata` (`blog_id`);--> statement-breakpoint
CREATE TABLE `blog` (
	`id` text(34) PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`published_date` integer NOT NULL,
	`organization_id` text,
	`author_id` text NOT NULL,
	`slug` text(255) NOT NULL,
	`image` text(255),
	`body` text,
	`content` text DEFAULT '',
	`tags` text DEFAULT '[]',
	`likes` integer DEFAULT 0,
	`status` text DEFAULT 'DRAFT',
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `organization_member`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organization_member` (
	`id` text(34) PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`role` text NOT NULL,
	`profile_picture` text(255),
	`bio` text(255),
	`display_name` text(255),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text(34) PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`logo` text(255) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);