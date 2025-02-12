CREATE TABLE `users` (
	`id` text(34) PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`email` text(255) NOT NULL,
	`name` text(255),
	`verified` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
