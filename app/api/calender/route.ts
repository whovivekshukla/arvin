import { google } from "googleapis";
import { NextResponse } from "next/server";

export const GET = async () => {
  const title = "Meeting with John";
  const description = "Discuss project updates and next steps.";
  const startDateTime = "2024-06-10T10:00:00-07:00";
  const endDateTime = "2024-06-10T11:00:00-07:00";

  try {
    // Set up OAuth 2.0 client

    const { OAuth2 } = google.auth;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Create a new calendar event
    const event = {
      summary: title,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Los_Angeles", // Adjust to your timezone
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Los_Angeles", // Adjust to your timezone
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
};
