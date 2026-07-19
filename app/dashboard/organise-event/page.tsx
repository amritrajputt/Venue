import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { eventsTable, attendeeTable } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";
import { UpcomingEvents } from "@/components/upcoming-events";
import { Plus, FolderKanban } from "lucide-react";
import { CreateEventModal } from "@/components/create-event-modal";

export default async function OrganiseEventPage() {
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

  // Format date helper
  const formatDate = (epochSec: number) => {
    return new Date(epochSec * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time helper
  const formatTime = (epochSec: number) => {
    return new Date(epochSec * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      {userEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 text-muted-foreground">
            <FolderKanban className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">No events created yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get started by creating your very first event. Share the link and track registrants in real-time.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userEvents.map(({ event, attendeeCount }) => (
            <UpcomingEvents
              key={event.id}
              name={session.user.name}
              title={event.title}
              imageUrl={event.posterUrl}
              date={formatDate(event.date)}
              dateTime={`${formatTime(event.startTime)} (${event.duration} mins)`}
              location={event.location}
              attendees={attendeeCount}
            />
          ))}
        </div>
      )}

      {/* Render the modal overlay on top of the list */}
      <CreateEventModal />
    </div>
  );
}
