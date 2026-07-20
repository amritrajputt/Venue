import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/src/db";
import { eventsTable, user, attendeeTable } from "@/src/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { ExploreEventsClient } from "@/components/explore-events-client";
import { BrowseEventItem } from "@/components/browse-events";
import { Sparkles } from "lucide-react";

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

  const formattedEvents: BrowseEventItem[] = publicEvents.map(
    ({ event, creatorName, attendeeCount }) => ({
      eventId: event.id,
      name: creatorName || "Organizer",
      title: event.title,
      description: event.description,
      imageUrl: event.posterUrl,
      date: formatDate(event.date),
      dateTime: `${formatTime(event.startTime)} (${event.duration} mins)`,
      location: event.location,
      attendees: attendeeCount,
      isJoined: userJoinedEventIds.has(event.id),
      rawDate: event.date,
    })
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      
      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute right-[10%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Discover Events</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Explore Public Events
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              Browse open community sessions, workshops, and meetups. Filter by location or date and register instantly.
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{formattedEvents.length} {formattedEvents.length === 1 ? 'event' : 'events'} live</span>
              </div>
              {session && (
                <>
                  <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0">
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="size-full object-cover" />
                      ) : (
                        <div className="size-full flex items-center justify-center font-bold text-xs bg-primary text-primary-foreground">
                          {session.user.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Hi, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{session.user.name?.split(' ')[0]}</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Events filter toolbar and grid container */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:py-12">
        <Suspense fallback={
          <div className="h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center text-sm text-zinc-400">
            Loading search & filters...
          </div>
        }>
          <ExploreEventsClient initialEvents={formattedEvents} />
        </Suspense>
      </div>
    </div>
  );
}