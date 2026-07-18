CREATE TYPE "plan" AS ENUM('Free', 'paid');--> statement-breakpoint
CREATE TABLE "attendee" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "attendee_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"eventId" integer NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"posterUrl" varchar(255) NOT NULL,
	"date" integer NOT NULL,
	"startTime" integer NOT NULL,
	"duration" integer NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"plan" "plan" DEFAULT 'Free'::"plan",
	"eventsCreated" integer DEFAULT 0,
	"eventsAttended" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "attendee" ADD CONSTRAINT "attendee_eventId_events_id_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id");--> statement-breakpoint
ALTER TABLE "attendee" ADD CONSTRAINT "attendee_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");