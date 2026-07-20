import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eq, and, sql } from "drizzle-orm";
import { attendeeTable, eventsTable, user } from "@/src/db/schema";
import { ApiResponse } from "@/lib/api-response";
import { inngest } from "@/inngest/client";

export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const body = await req.json();
        const eventId = body.eventId;
        const attendeeName = body.attendeeName || body.name;
        const attendeeEmail = body.attendeeEmail || body.email;
        const age = body.age;

        if (!eventId) {
            return ApiResponse.error("Event ID is required", 400);
        }

        const targetEventData = await db
            .select({
                event: eventsTable,
                organizerName: user.name,
                organizerEmail: user.email,
            })
            .from(eventsTable)
            .leftJoin(user, eq(eventsTable.userId, user.id))
            .where(eq(eventsTable.id, Number(eventId)))
            .then((res) => res[0]);

        if (!targetEventData) {
            return ApiResponse.error("Event not found", 404);
        }

        const existingAttendee = await db
            .select()
            .from(attendeeTable)
            .where(
                and(
                    eq(attendeeTable.eventId, Number(eventId)),
                    eq(attendeeTable.userId, session.user.id)
                )
            )
            .then((res) => res[0]);

        if (existingAttendee) {
            return ApiResponse.error("You have already registered for this event", 400);
        }

        const [newAttendee] = await db.insert(attendeeTable).values({
            eventId: Number(eventId),
            name: String(attendeeName || session.user.name),
            email: String(attendeeEmail || session.user.email),
            age: Number(age || 20),
            userId: session.user.id,
        }).returning();

        await db.update(eventsTable).set({
            attendees: sql`${eventsTable.attendees} + 1`,
        }).where(eq(eventsTable.id, Number(eventId)));

        const formatDate = (epochSec: number) => {
            return new Date(epochSec * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        };

        const formatTime = (epochSec: number) => {
            return new Date(epochSec * 1000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        // Dispatch Inngest event for background email sending
        await inngest.send({
            name: "app/registration.confirmed",
            data: {
                to: newAttendee.email,
                userName: newAttendee.name,
                eventName: targetEventData.event.title,
                eventDate: formatDate(targetEventData.event.date),
                eventTime: formatTime(targetEventData.event.startTime),
                eventVenue: targetEventData.event.location,
                registrationId: crypto.randomUUID(),
                organizerName: targetEventData.organizerName || "Event Organizer",
                organizerContact: targetEventData.organizerEmail || process.env.SMTP_EMAIL || "",
            },
        });

        return ApiResponse.success(newAttendee, "Event registered successfully", 200);
    } catch (error: any) {
        console.error("Error in attend-event API:", error);
        return ApiResponse.error(error.message || "Failed to attend event", 500);
    }
};
