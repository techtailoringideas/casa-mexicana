import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/store/useCart";

// ─── Check if a table already has an active session ───
export async function getActiveSessionForTable(
  tableNumber: string,
): Promise<{ id: string; customer_name: string } | null> {
  const { data, error } = await supabase
    .from("table_sessions")
    .select("id, customer_name")
    .eq("table_number", tableNumber)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

// ─── Create a new table session ───
export async function createSession(
  customerName: string,
  tableNumber: string,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from("table_sessions")
    .insert({
      customer_name: customerName,
      table_number: tableNumber,
      status: "active",
      bill_requested: false,
      last_order_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create session:", error);
    return null;
  }
  return data;
}

// ─── Submit an order (linked to a session) ───
export async function submitOrder(payload: {
  session_id: string;
  customer_name: string;
  table_number: string;
  items: CartItem[];
  total_price: number;
}): Promise<{ id: string } | null> {
  // First check if session is still active
  const active = await isSessionActive(payload.session_id);
  if (!active) {
    console.error("Session is no longer active");
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      session_id: payload.session_id,
      customer_name: payload.customer_name,
      table_number: payload.table_number,
      items: payload.items,
      total_price: payload.total_price,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Order submission failed:", error);
    return null;
  }

  // Update last_order_at on the session
  await supabase
    .from("table_sessions")
    .update({ last_order_at: new Date().toISOString() })
    .eq("id", payload.session_id);

  return data;
}

// ─── Get a single order status ───
export async function getOrderStatus(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, session_id, customer_name, table_number, items, total_price, status, created_at",
    )
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
  return data;
}

// ─── Get all orders for a session ───
export async function getSessionOrders(sessionId: string) {
  const { data: session, error: sessionError } = await supabase
    .from("table_sessions")
    .select(
      "id, table_number, customer_name, status, bill_requested, created_at",
    )
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    console.error("Failed to fetch session:", sessionError);
    return null;
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, items, total_price, status, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (ordersError) {
    console.error("Failed to fetch session orders:", ordersError);
    return null;
  }

  const totalBill = (orders || []).reduce((sum, o) => sum + o.total_price, 0);

  return {
    session,
    orders: orders || [],
    totalBill,
  };
}

// ─── Check if a session is still active ───
export async function isSessionActive(sessionId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("table_sessions")
    .select("status")
    .eq("id", sessionId)
    .single();

  if (error || !data) return false;
  return data.status === "active";
}

// ─── Request bill for a session ───
export async function requestBill(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("table_sessions")
    .update({ bill_requested: true })
    .eq("id", sessionId);

  if (error) {
    console.error("Failed to request bill:", error);
    return false;
  }
  return true;
}

// ─── Close session (customer-side) ───
export async function closeSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("table_sessions")
    .update({ status: "closed" })
    .eq("id", sessionId);

  if (error) {
    console.error("Failed to close session:", error);
    return false;
  }
  return true;
}
