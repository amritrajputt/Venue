ALTER TABLE "attendee" ADD COLUMN "passQrUrl" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "attendee" ADD CONSTRAINT "attendee_passQrUrl_key" UNIQUE("passQrUrl");