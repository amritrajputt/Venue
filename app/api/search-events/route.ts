import { db } from "@/src/db";
import { eq, and, ilike, sql } from "drizzle-orm";
import { eventsTable, user, attendeeTable } from "@/src/db/schema";
import { ApiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");
        const date = searchParams.get("date");

        const conditions = [eq(eventsTable.isPrivate, false)];

        if (city && city.trim() !== "") {
            conditions.push(ilike(eventsTable.location, `%${city.trim()}%`));
        }

        if (date && !isNaN(Number(date))) {
            conditions.push(eq(eventsTable.date, Number(date)));
        }

        const events = await db
            .select({
                event: eventsTable,
                creatorName: user.name,
                attendeeCount: sql<number>`count(${attendeeTable.id})::int`,
            })
            .from(eventsTable)
            .leftJoin(user, eq(eventsTable.userId, user.id))
            .leftJoin(attendeeTable, eq(eventsTable.id, attendeeTable.eventId))
            .where(and(...conditions))
            .groupBy(eventsTable.id, user.name);

        return ApiResponse.success(events, "Events fetched successfully", 200);
    } catch (error: any) {
        console.error("Error fetching events:", error);
        return ApiResponse.error(error.message || "Failed to fetch events", 500);
    }
};
