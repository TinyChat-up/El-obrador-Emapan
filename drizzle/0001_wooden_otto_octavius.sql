CREATE TABLE `machine_offers` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'Nueva' NOT NULL,
	`notification` text DEFAULT 'pending' NOT NULL,
	`created` text NOT NULL,
	`ip_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_machine_offers_created` ON `machine_offers` (`created`);--> statement-breakpoint
CREATE INDEX `idx_machine_offers_ip_created` ON `machine_offers` (`ip_hash`,`created`);