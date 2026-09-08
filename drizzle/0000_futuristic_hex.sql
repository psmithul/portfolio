CREATE TABLE `journal_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`draft_json` text NOT NULL,
	`published_json` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`published_at` integer,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_entries_slug_unique` ON `journal_entries` (`slug`);