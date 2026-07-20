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
            return ApiResponse.error("Unauthorized: Please sign in to register for events", 401);
        }

        const body = await req.json();
        const eventId = Number(body.eventId);
        const attendeeName = body.attendeeName || body.name;
        const attendeeEmail = body.attendeeEmail || body.email;
        const age = body.age;

        // fix #1: validate eventId is a real number, not NaN
        if (!body.eventId || Number.isNaN(eventId)) {
            return ApiResponse.error("Valid Event ID is required", 400);
        }

        const targetEventData = await db
            .select({
                event: eventsTable,
                organizerName: user.name,
                organizerEmail: user.email,
            })
            .from(eventsTable)
            .leftJoin(user, eq(eventsTable.userId, user.id))
            .where(eq(eventsTable.id, eventId))
            .then((res) => res[0]);

        if (!targetEventData) {
            return ApiResponse.error("Event not found", 404);
        }

        const existingAttendee = await db
            .select()
            .from(attendeeTable)
            .where(
                and(
                    eq(attendeeTable.eventId, eventId),
                    eq(attendeeTable.userId, session.user.id)
                )
            )
            .then((res) => res[0]);

        if (existingAttendee) {
            return ApiResponse.error("You have already registered for this event", 400);
        }

        // fix #3: wrap insert + count update in a transaction
        const newAttendee = await db.transaction(async (tx) => {
            const [attendee] = await tx.insert(attendeeTable).values({
                eventId,
                name: String(attendeeName || session.user.name),
                email: String(attendeeEmail || session.user.email),
                // fix #2: use ?? instead of || so age=0 isn't overwritten
                age: Number(age ?? 20),
                userId: session.user.id,
            }).returning();

            await tx.update(eventsTable).set({
                attendees: sql`${eventsTable.attendees} + 1`,
            }).where(eq(eventsTable.id, eventId));

            return attendee;
        });

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

        try {
            await inngest.send({
                name: "app/registration.confirmed",
                data: {
                    to: newAttendee.email,
                    userName: newAttendee.name,
                    eventName: targetEventData.event.title,
                    eventDate: formatDate(targetEventData.event.date),
                    eventTime: formatTime(targetEventData.event.startTime),
                    eventVenue: targetEventData.event.location,
                    registrationId: String(newAttendee.id),
                    organizerName: targetEventData.organizerName || "Event Organizer",
                    organizerContact: targetEventData.organizerEmail || process.env.SMTP_EMAIL || "",
                    eventId: targetEventData.event.id,
                    attendeeId: newAttendee.id,
                },
            });
        } catch (dispatchErr) {
            console.error("Failed to dispatch confirmation email event:", dispatchErr);
        }

        return ApiResponse.success(newAttendee, "Event registered successfully", 200);
    } catch (error: any) {
        console.error("Error in attend-event API:", error);
        return ApiResponse.error(error.message || "Failed to attend event", 500);
    }
};