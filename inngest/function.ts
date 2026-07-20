import { inngest } from "./client";
import { sendRegistrationEmail } from "@/lib/ticket-confirmation-email/send-registration-email";

export const registrationConfirmationEmail = inngest.createFunction(
  {
    id: "registration-confirmation-mail",
    name: "Registration Confirmation Email",
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