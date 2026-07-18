import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eq , desc} from "drizzle-orm";
import { eventsTable } from "@/src/db/schema";

export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, date, startTime, duration, posterUrl, location, isPrivate } = body;

    await db.insert(eventsTable).values({
        title,
        description,
        date: Number(date),
        startTime: Number(startTime),
        duration: Number(duration),
        posterUrl: posterUrl,
        location,
        isPrivate: Boolean(isPrivate),
        userId: session.user.id,
    });

    return NextResponse.json({ message: "Event created successfully" });
}

export const GET = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await db.select().from(eventsTable).where(eq(eventsTable.userId, session.user.id)).orderBy(desc(eventsTable.date));
    return NextResponse.json(events);
}

export const DELETE = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
    return NextResponse.json({ message: "Event deleted successfully" });
}

export const PATCH = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, date, startTime, duration, posterUrl, location, isPrivate } = await req.json();
    await db.update(eventsTable).set({
        title,
        description,
        date: Number(date),
        startTime: Number(startTime),
        duration: Number(duration),
        posterUrl: posterUrl,
        location,
        isPrivate: Boolean(isPrivate),
    }).where(eq(eventsTable.id, id));
    return NextResponse.json({ message: "Event updated successfully" });
}