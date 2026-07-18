import { NextResponse } from "next/server";
import {eventsTable} from '@/src/db/schema';
import { db } from "@/src/db";
import { desc, eq } from "drizzle-orm";

export const GET = async (req: Request) => {
    const {searchParams} = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const events = await db.select().from(eventsTable).limit(limit).offset(skip).orderBy(desc(eventsTable.date));
    return NextResponse.json(events);
}
 
