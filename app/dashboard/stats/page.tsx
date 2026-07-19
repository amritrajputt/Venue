import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { eventsTable, attendeeTable } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import { FolderKanban, Users, TrendingUp } from "lucide-react";

export default async function StatsPage() {
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
  const totalEvents = userEvents.length;
  const totalRegistrations = userEvents.reduce((acc, curr) => acc + curr.attendeeCount, 0);
  const averageAttendance = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;

  
  const formatDate = (epochSec: number) => {
    return new Date(epochSec * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Analytics & Stats</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Performance metrics for your events and engagement levels.
        </p>
      </div>

      <div className="space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200/80 bg-white/45 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-sm shadow-sm">
            <div className="p-3.5 rounded-2xl bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
              <FolderKanban className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Hosted</p>
              <p className="text-2xl font-bold mt-0.5">{totalEvents}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200/80 bg-white/45 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-sm shadow-sm">
            <div className="p-3.5 rounded-2xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Registrations</p>
              <p className="text-2xl font-bold mt-0.5">{totalRegistrations}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-zinc-200/80 bg-white/45 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-sm shadow-sm">
            <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Avg. Size</p>
              <p className="text-2xl font-bold mt-0.5">{averageAttendance}</p>
            </div>
          </div>
        </div>

        
        <div className="rounded-3xl border border-zinc-200/80 bg-white/30 dark:border-zinc-800/80 dark:bg-zinc-900/10 backdrop-blur-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <h3 className="font-bold text-lg">Event Breakdown</h3>
          </div>
          {totalEvents === 0 ? (
            <p className="p-6 text-zinc-500 text-sm text-center">No active stats to display.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100/50 dark:bg-zinc-800/30 text-zinc-500 font-semibold border-b border-zinc-200/60 dark:border-zinc-800/60">
                    <th className="px-6 py-3.5">Event Name</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5 text-right">Attendees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                  {userEvents.map(({ event, attendeeCount }) => (
                    <tr key={event.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">{event.title}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{formatDate(event.date)}</td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{event.location}</td>
                      <td className="px-6 py-4 text-right font-bold text-pink-600 dark:text-pink-400">{attendeeCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
