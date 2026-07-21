import { inngest } from "./client";
import { sendRegistrationEmail } from "@/lib/ticket-confirmation-email/send-registration-email";
import { sendReminderEmail } from "@/lib/ticket-confirmation-email/remainder-email";
import { db } from "@/src/db";
import { eventsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

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

export const registrationConfirmationEmail = inngest.createFunction(
  {
    id: "registration-confirmation-mail",
    name: "Registration Confirmation Email",
    retries: 4,
    triggers: [{ event: "app/registration.confirmed" }],
  },
  async ({ event, step }) => {
    return await step.run("send-registration-email", async () => {
      return await sendRegistrationEmail({
        to: event.data.to,
        userName: event.data.userName,
        eventName: event.data.eventName,
        eventDate: event.data.eventDate,
        eventTime: event.data.eventTime,
        eventVenue: event.data.eventVenue,
        registrationId: String(event.data.registrationId),
        organizerName: event.data.organizerName,
        organizerContact: event.data.organizerContact,
      });
    });
  }
);

export const eventReminderEmail = inngest.createFunction(
  {
    id: "event-reminder-mail",
    name: "24hr Event Reminder Email",
    retries: 4,
    triggers: [{ event: "app/registration.confirmed" }],
  },
  async ({ event, step }) => {
    const { eventId } = event.data;

    if (!eventId) {
      return { skipped: true, reason: "No eventId provided in event payload" };
    }

    const currentEvent = await step.run("calculate-reminder-time", async () => {
      const [res] = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, Number(eventId)));
      return res || null;
    });

    if (!currentEvent) {
      return { skipped: true, reason: "Event not found" };
    }

    const now = Date.now();
    const eventStartTimeMs = currentEvent.startTime * 1000;
    const reminderTime = new Date(eventStartTimeMs - 24 * 60 * 60 * 1000);

    if (eventStartTimeMs <= now) {
      return { skipped: true, reason: "Event has already started or passed" };
    }

    if (reminderTime.getTime() > now) {
      await step.sleepUntil("wait-until-24hr-before-event", reminderTime);
    }

    const latestEvent = await step.run("fetch-latest-event-data", async () => {
      const [res] = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, Number(eventId)));
      return res || null;
    });

    if (!latestEvent) {
      return { skipped: true, reason: "Event cancelled or deleted" };
    }

    return await step.run("send-reminder-email", async () => {
      return await sendReminderEmail({
        to: event.data.to,
        userName: event.data.userName,
        eventName: latestEvent.title,
        eventDate: formatDate(latestEvent.date),
        eventTime: formatTime(latestEvent.startTime),
        eventVenue: latestEvent.location,
      });
    });
  }
);