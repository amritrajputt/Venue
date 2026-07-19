"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpcomingEvents } from "@/components/upcoming-events";
import { EventForm } from "@/components/create-event-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FolderKanban } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: number;
  startTime: number;
  duration: number;
  location: string;
  posterUrl: string;
  isPrivate: boolean;
  userId: string;
}

interface UserEventsListProps {
  userEvents: Array<{
    event: EventItem;
    creatorName?: string;
    attendeeCount: number;
  }>;
  userName?: string;
  currentUserId?: string;
}

function epochToDateInput(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function epochToTimeInput(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function UserEventsList({ userEvents, userName, currentUserId }: UserEventsListProps) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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

  const handleDeleteCard = async (eventId: number) => {
    try {
      const response = await axios.delete("/api/events", {
        data: { id: eventId },
      });
      if (response.status === 200) {
        toast.success("Event deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  if (userEvents.length === 0) {
    return (
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
    );
  }

  const initialDataForForm = selectedEvent
    ? {
        id: selectedEvent.id,
        title: selectedEvent.title,
        date: epochToDateInput(selectedEvent.date),
        startTime: epochToTimeInput(selectedEvent.startTime),
        duration: String(selectedEvent.duration),
        location: selectedEvent.location,
        description: selectedEvent.description,
        poster: selectedEvent.posterUrl,
        isPrivate: selectedEvent.isPrivate,
      }
    : undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userEvents.map(({ event, creatorName, attendeeCount }) => {
          const isOwner = !currentUserId || currentUserId === event.userId;
          return (
            <UpcomingEvents
              key={event.id}
              name={creatorName || userName || "Organizer"}
              title={event.title}
              imageUrl={event.posterUrl}
              date={formatDate(event.date)}
              dateTime={`${formatTime(event.startTime)} (${event.duration} mins)`}
              location={event.location}
              attendees={attendeeCount}
              onEdit={isOwner ? () => setSelectedEvent(event) : undefined}
              onDelete={isOwner ? () => handleDeleteCard(event.id) : undefined}
            />
          );
        })}
      </div>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event Details</DialogTitle>
          </DialogHeader>
          {initialDataForForm && (
            <EventForm
              initialData={initialDataForForm}
              onSuccess={() => {
                setSelectedEvent(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
