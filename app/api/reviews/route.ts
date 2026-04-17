import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ reviews: data });
}

export async function POST(req: Request) {
  const { name, location, rating, quote } = await req.json();

  if (!name || !location || !rating || !quote) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("reviews")
    .insert([{ name, location, rating, quote, status: "pending" }]);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
