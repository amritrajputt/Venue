"use client";

import { Suspense } from "react";
import RegisterEvent from "@/components/registerEvent";
import { useRouter } from "next/navigation";

function RegisterEventForm() {
  const router = useRouter();
  return <RegisterEvent onSuccess={() => router.push("/upcoming-events")} showCard={true} />;
}

export default function RegisterEventPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 flex justify-center items-center min-h-[70vh]">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md animate-pulse flex items-center justify-center text-sm text-zinc-400">
            Loading registration form...
          </div>
        }
      >
        <RegisterEventForm />
      </Suspense>
    </div>
  );
}
