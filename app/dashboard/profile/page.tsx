import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Mail, ShieldCheck, Award, ChevronRight } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const dbUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .then((res) => res[0]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View your account details and subscription options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 rounded-3xl border border-zinc-200/80 bg-white/40 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-200/40 dark:border-zinc-800/40">
            <div className="size-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center font-bold text-3xl bg-gradient-to-br from-pink-500 to-violet-500 text-white">
                  {session.user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-extrabold">{session.user.name}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-500 text-sm">
                <Mail className="size-4 shrink-0" />
                <span>{session.user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Verified</p>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <ShieldCheck className="size-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
