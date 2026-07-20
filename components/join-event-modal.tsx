"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import RegisterEvent from "./registerEvent";
import { CalendarCheck } from "lucide-react";

export function JoinEventModal() {
  const router = useRouter();

  const closeModal = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/upcoming-events");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="text-center sm:text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">Register for Event</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in your details below to secure your spot.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <RegisterEvent onSuccess={closeModal} showCard={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default JoinEventModal;
