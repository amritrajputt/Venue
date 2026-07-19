import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eq, and, sql } from "drizzle-orm";
import { attendeeTable, eventsTable } from "@/src/db/schema";
import { ApiResponse } from "@/lib/api-response";

/**
 * TODO (TOMORROW):
 * 1. Process RSVP Form Submission (Name, Email, Age, Phone).
 * 2. Save Attendee entry to Database.
 * 3. Dispatch Inngest Event:
 *    await inngest.send({
 *        name: "event/rsvp.created",
 *        data: {
 *            attendeeName,
 *            attendeeEmail,
 *            eventId,
 *            ticketId,
 *        }
 *    });
 * 4. Inngest background function will generate a QR Code & dispatch confirmation email.
 */

export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const { eventId, attendeeName, attendeeEmail, age } = await req.json();
        
        if (!eventId) {
            return ApiResponse.error("Event ID is required", 400);
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

        // TODO (TOMORROW): Send event to Inngest client here:
        // await inngest.send({ name: "event/rsvp.created", data: { attendeeId: newAttendee.id, email: newAttendee.email } });

        return ApiResponse.success(newAttendee, "Event registered successfully", 200);
    } catch (error: any) {
        console.error("Error in attend-event API:", error);
        return ApiResponse.error(error.message || "Failed to attend event", 500);
    }
}
