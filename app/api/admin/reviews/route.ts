import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function isAuthed(req: NextRequest) {
  return req.headers.get("authorization") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const { id, action } = await req.json();

  if (action === "toggleFeatured") {
    const { data: review } = await supabase
      .from("reviews")
      .select("featured")
      .eq("id", id)
      .single();

    const { error } = await supabase
      .from("reviews")
      .update({ featured: !review?.featured })
      .eq("id", id);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // existing approve logic
  const { error } = await supabase
    .from("reviews")
    .update({ status: "approved" })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({}, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
