import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eq, sql } from "drizzle-orm";
import { attendeeTable, eventsTable } from "@/src/db/schema";

export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, attendeeName, attendeeEmail, age } = await req.json();
    await Promise.all([
        db.insert(attendeeTable).values({
            eventId: Number(eventId),
            name: String(attendeeName),
            email: String(attendeeEmail),
            age: Number(age),
            userId: session.user.id,
           
        }),
        db.update(eventsTable).set({
            attendees: sql`${eventsTable.attendees} + 1`,
        }).where(eq(eventsTable.id, Number(eventId)))
    ]);

    return NextResponse.json({ message: "Event attended successfully" });
}


