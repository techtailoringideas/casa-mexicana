import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function POST(request: Request) {
  try {
    const { email, pin } = await request.json();

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, name, email")
      .eq("email", email)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Return a simple token (the admin id)
    return NextResponse.json({
      success: true,
      admin: { id: data.id, name: data.name, email: data.email },
      token: data.id,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
