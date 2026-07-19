"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateEventForm } from "@/components/create-event-form";

export function CreateEventModal() {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard/create-events");
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <CreateEventForm />
      </DialogContent>
    </Dialog>
  );
}
