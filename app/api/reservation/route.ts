import { NextResponse } from "next/server";

// Placeholder API route for future reservation backend
// Currently all reservations go directly via WhatsApp from the client
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Future: Save to database, send confirmation SMS, etc.
    // For MVP, this is a no-op — the client handles WhatsApp directly

    return NextResponse.json({
      success: true,
      message: "Reservation request received",
      data,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }
}
