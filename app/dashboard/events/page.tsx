import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { eventsTable, attendeeTable } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { UserEventsList } from "@/components/user-events-list";
import { Plus } from "lucide-react";

export default async function MyEventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userEvents = await db
    .select({
      event: eventsTable,
      attendeeCount: sql<number>`count(${attendeeTable.id})::int`,
    })
    .from(eventsTable)
    .leftJoin(attendeeTable, eq(eventsTable.id, attendeeTable.eventId))
    .where(eq(eventsTable.userId, session.user.id))
    .groupBy(eventsTable.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and view statistics of all the events you've organized.
          </p>
        </div>
        <Link href="/dashboard/organise-event">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-pink-500 hover:to-violet-500 transition-all duration-200 cursor-pointer">
            <Plus className="size-4" />
            <span>Organise Event</span>
          </button>
        </Link>
      </div>

      <UserEventsList userEvents={userEvents} userName={session.user.name} />
    </div>
  );
}
