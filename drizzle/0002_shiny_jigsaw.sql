PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blog` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`organization_id` text,
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`image` text NOT NULL,
	`body` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_blog`("id", "created_at", "updated_at", "organization_id", "author_id", "title", "slug", "image", "body", "tags", "likes", "status") SELECT "id", "created_at", "updated_at", "organization_id", "author_id", "title", "slug", "image", "body", "tags", "likes", "status" FROM `blog`;--> statement-breakpoint
DROP TABLE `blog`;--> statement-breakpoint
ALTER TABLE `__new_blog` RENAME TO `blog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;