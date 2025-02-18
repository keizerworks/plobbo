PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blog` (
	`id` text(34) PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`published_date` integer,
	`organization_id` text,
	`author_id` text NOT NULL,
	`slug` text(255) NOT NULL,
	`title` text(255) NOT NULL,
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
INSERT INTO `__new_blog`("id", "created_at", "updated_at", "published_date", "organization_id", "author_id", "slug", "title", "image", "body", "content", "tags", "likes", "status") SELECT "id", "created_at", "updated_at", "published_date", "organization_id", "author_id", "slug", "title", "image", "body", "content", "tags", "likes", "status" FROM `blog`;--> statement-breakpoint
DROP TABLE `blog`;--> statement-breakpoint
ALTER TABLE `__new_blog` RENAME TO `blog`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `blog_metadata` DROP COLUMN `title`;