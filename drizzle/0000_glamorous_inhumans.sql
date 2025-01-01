CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`first_name` text NOT NULL,
	`last_name` text,
	`email` text,
	`password_hash` text
);
