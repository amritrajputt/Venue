import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { db } from "@/src/db";
import { user } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <Suspense fallback={<div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900" />}>
          <DashboardSidebar
            user={{
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            }}
            plan={dbUser?.plan || "Free"}
          />
        </Suspense>
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-200/40 bg-white/40 px-6 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/40">
            <SidebarTrigger />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-sm font-medium text-zinc-500">Dashboard</span>
          </div>
          {children}
          {modal}
        </main>
      </div>
    </SidebarProvider>
  );
}
