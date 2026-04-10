import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", token)
    .single();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filter = searchParams.get("filter") || "live";

  let query = supabase
    .from("orders")
    .select("*, table_sessions(bill_requested, status)")
    .order("created_at", { ascending: false });

  if (filter === "live") {
    query = query.in("status", ["pending", "preparing", "ready"]);
  } else if (filter === "today") {
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("created_at", today);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
export async function PATCH(request: Request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", token)
    .single();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.closeTable && body.sessionId) {
    const { error } = await supabase
      .from("table_sessions")
      .update({ status: "closed" })
      .eq("id", body.sessionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (body.orderId && body.status) {
    const { error } = await supabase
      .from("orders")
      .update({ status: body.status })
      .eq("id", body.orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
