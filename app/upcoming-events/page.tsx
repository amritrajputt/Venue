import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eventsTable, user, attendeeTable } from "@/src/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { BrowseEvents } from "@/components/browse-events";
import { Calendar } from "lucide-react";

export default async function ExploreEventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userJoinedEventIds = session
    ? new Set(
        (
          await db
            .select({ eventId: attendeeTable.eventId })
            .from(attendeeTable)
            .where(eq(attendeeTable.userId, session.user.id))
        ).map((r) => r.eventId)
      )
    : new Set<number>();

  const publicEvents = await db
    .select({
      event: eventsTable,
      creatorName: user.name,
      attendeeCount: sql<number>`count(${attendeeTable.id})::int`,
    })
    .from(eventsTable)
    .leftJoin(user, eq(eventsTable.userId, user.id))
    .leftJoin(attendeeTable, eq(eventsTable.id, attendeeTable.eventId))
    .where(eq(eventsTable.isPrivate, false))
    .groupBy(eventsTable.id, user.name)
    .orderBy(desc(eventsTable.date));

  const formatDate = (epochSec: number) => {
    return new Date(epochSec * 1000).toLocaleDateString("en-US", {
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Explore Public Events</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Discover open community sessions, workshops, and meetups happening near you.
        </p>
      </div>

      {publicEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 text-muted-foreground">
            <Calendar className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">No public events found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Check back later for new public community events.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicEvents.map(({ event, creatorName, attendeeCount }) => (
            <BrowseEvents
              key={event.id}
              eventId={event.id}
              name={creatorName || "Organizer"}
              title={event.title}
              imageUrl={event.posterUrl}
              date={formatDate(event.date)}
              dateTime={`${formatTime(event.startTime)} (${event.duration} mins)`}
              location={event.location}
              attendees={attendeeCount}
              isJoined={userJoinedEventIds.has(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}