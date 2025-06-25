ALTER TABLE `availability` RENAME COLUMN `slot_time_in_minutes` TO `time_in_minutes`;--> statement-breakpoint
ALTER TABLE `booking` RENAME COLUMN `slot_id` TO `availability_id`;