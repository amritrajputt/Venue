import  {getTransporter}  from "@/lib/ticket-confirmation-email/client";

interface SendReminderEmailParams {
  to: string;
  userName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
}

export async function sendReminderEmail({
  to,
  userName,
  eventName,
  eventDate,
  eventTime,
  eventVenue,
}: SendReminderEmailParams) {
  try {
    const info = await getTransporter().sendMail({
      from: `"Your App Name" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `⏰ ${eventName} starts in 24 hours!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #1a1a1a;">
          <h2 style="color: #2563eb;">Your event is tomorrow! 🎉</h2>
          <p>Hi ${userName},</p>
          <p><b>${eventName}</b> starts in less than 24 hours. Here's a quick recap:</p>

          <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
            <tr><td style="padding: 6px 0;"><b>Date:</b></td><td>${eventDate}</td></tr>
            <tr><td style="padding: 6px 0;"><b>Time:</b></td><td>${eventTime}</td></tr>
            <tr><td style="padding: 6px 0;"><b>Venue:</b></td><td>${eventVenue}</td></tr>
          </table>

          <p>Don't forget to carry a valid ID and arrive at least 15 minutes early. See you there!</p>

          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
            This is an automated reminder for your event registration.
          </p>
        </div>
      `,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send reminder email:", err);
    throw err;
  }
}