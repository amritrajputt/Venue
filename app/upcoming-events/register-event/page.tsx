"use client";

import RegisterEvent from "@/components/registerEvent";
import { useRouter } from "next/navigation";

export default function RegisterEventPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 flex justify-center items-center min-h-[70vh]">
      <RegisterEvent onSuccess={() => router.push("/upcoming-events")} showCard={true} />
    </div>
  );
}
