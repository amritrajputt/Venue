import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eq, and, desc } from "drizzle-orm";
import { eventsTable } from "@/src/db/schema";
import { ApiResponse } from "@/lib/api-response";

export const POST = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
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

        return ApiResponse.success(null, "Event created successfully", 200);
    } catch (error: any) {
        console.error("Error creating event:", error);
        return ApiResponse.error(error.message || "Failed to create event", 500);
    }
}

export const GET = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const events = await db
            .select()
            .from(eventsTable)
            .where(eq(eventsTable.userId, session.user.id))
            .orderBy(desc(eventsTable.date));

        return ApiResponse.success(events, "Events fetched successfully", 200);
    } catch (error: any) {
        console.error("Error fetching events:", error);
        return ApiResponse.error(error.message || "Failed to fetch events", 500);
    }
}

export const DELETE = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const { id } = await req.json();

        if (!id) {
            return ApiResponse.error("Event ID is required", 400);
        }

        await db.delete(eventsTable).where(
            and(
                eq(eventsTable.id, Number(id)),
                eq(eventsTable.userId, session.user.id)
            )
        );
        return ApiResponse.success(null, "Event deleted successfully", 200);
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return ApiResponse.error(error.message || "Failed to delete event", 500);
    }
}

export const PATCH = async (req: Request) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return ApiResponse.error("Unauthorized", 401);
        }

        const { id, title, description, date, startTime, duration, posterUrl, location, isPrivate } = await req.json();

        if (!id) {
            return ApiResponse.error("Event ID is required", 400);
        }

        await db.update(eventsTable).set({
            title,
            description,
            date: Number(date),
            startTime: Number(startTime),
            duration: Number(duration),
            posterUrl: posterUrl,
            location,
            isPrivate: Boolean(isPrivate),
        }).where(
            and(
                eq(eventsTable.id, Number(id)),
                eq(eventsTable.userId, session.user.id)
            )
        );

        return ApiResponse.success(null, "Event updated successfully", 200);
    } catch (error: any) {
        console.error("Error updating event:", error);
        return ApiResponse.error(error.message || "Failed to update event", 500);
    }
}