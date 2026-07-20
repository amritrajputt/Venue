import { transporter } from "./client";

interface SendRegistrationEmailParams {
  to: string;
  userName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  registrationId: string;
  organizerName: string;
  organizerContact?: string;
}

export async function sendRegistrationEmail({
  to,
  userName,
  eventName,
  eventDate,
  eventTime,
  eventVenue,
  registrationId,
  organizerName,
  organizerContact,
}: SendRegistrationEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"Venue" <${process.env.SMTP_EMAIL}>`,
      to,
      subject: `You're registered for ${eventName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #1a1a1a;">
          <h2 style="color: #2563eb;">Registration Confirmed 🎉</h2>
          <p>Hi ${userName},</p>
          <p>You're successfully registered for <b>${eventName}</b>. Here are the details:</p>

          <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
            <tr><td style="padding: 6px 0;"><b>Date:</b></td><td>${eventDate}</td></tr>
            <tr><td style="padding: 6px 0;"><b>Time:</b></td><td>${eventTime}</td></tr>
            <tr><td style="padding: 6px 0;"><b>Venue:</b></td><td>${eventVenue}</td></tr>
            <tr><td style="padding: 6px 0;"><b>Registration ID:</b></td><td>${registrationId}</td></tr>
          </table>

          <h3 style="color: #2563eb;">Entry Instructions</h3>
          <ul>
            <li>Please arrive at least <b>15 minutes</b> before the event starts.</li>
            <li>Carry a valid college/government ID card for verification at entry.</li>
            <li>Show this email or your Registration ID at the check-in desk.</li>
            <li>Entry may be denied after the scheduled start time, depending on the event.</li>
          </ul>

          <h3 style="color: #2563eb;">Rules to Follow</h3>
          <ul>
            <li>Maintain decorum throughout the event premises.</li>
            <li>Outside food and beverages may not be permitted.</li>
            <li>Follow instructions from the organizing team and volunteers at all times.</li>
            <li>Any misconduct may lead to removal from the event without refund/reversal of registration.</li>
          </ul>

          <h3 style="color: #2563eb;">Need Help?</h3>
          <p>
            Reach out to the organizer, <b>${organizerName}</b>
            ${organizerContact ? `at <a href="mailto:${organizerContact}">${organizerContact}</a>` : ""}
            for any queries.
          </p>

          <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
            This is an automated email regarding your event registration. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send registration email:", err);
    throw err;
  }
}