import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eventsTable, user, attendeeTable } from "@/src/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { BrowseEvents } from "@/components/browse-events";
import { Calendar, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute right-[10%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Discover Events</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Explore Public Events
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Browse open community sessions, workshops, and meetups. Find something that excites you and register instantly.
            </p>
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{publicEvents.length} {publicEvents.length === 1 ? 'event' : 'events'} live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        {publicEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 space-y-6">
            <div className="p-5 rounded-3xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
              <Calendar className="size-10" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold">No public events yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                There are no public events right now. Check back later for upcoming community events and meetups.
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
    </div>
  );
}