"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  ChefHat,
  CheckCircle,
  UtensilsCrossed,
  Plus,
  Receipt,
  LogOut,
} from "lucide-react";
import {
  getSessionOrders,
  isSessionActive,
  requestBill,
  closeSession,
} from "@/lib/orders";
import { useOrderTrack } from "@/store/useOrderTrack";

interface OrderItem {
  id: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

interface SessionInfo {
  id: string;
  table_number: string;
  customer_name: string;
  status: string;
  bill_requested: boolean;
  created_at: string;
}

interface SessionData {
  session: SessionInfo;
  orders: Order[];
  totalBill: number;
}

const statusSteps = [
  { key: "pending", label: "Received", icon: <Clock size={18} /> },
  { key: "preparing", label: "Preparing", icon: <ChefHat size={18} /> },
  { key: "ready", label: "Ready", icon: <CheckCircle size={18} /> },
  { key: "served", label: "Served", icon: <UtensilsCrossed size={18} /> },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow/20 text-yellow",
  preparing: "bg-teal/20 text-teal",
  ready: "bg-green-500/20 text-green-600",
  served: "bg-pink/20 text-pink",
};

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const [requestingBill, setRequestingBill] = useState(false);
  const clearSession = useOrderTrack((s) => s.clearSession);

  useEffect(() => {
    if (!sessionId) return;

    const fetchData = async () => {
      const active = await isSessionActive(sessionId);
      if (!active) {
        setSessionClosed(true);
        // Auto-clear localStorage when session is closed
        clearSession();
        setLoading(false);
        return;
      }

      const result = await getSessionOrders(sessionId);
      if (result) {
        setData(result as SessionData);
        setBillRequested(result.session.bill_requested || false);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [sessionId, clearSession]);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  const handleRequestBill = async () => {
    setRequestingBill(true);
    const success = await requestBill(sessionId);
    if (success) {
      setBillRequested(true);
    }
    setRequestingBill(false);
  };

  const handleDone = async () => {
    await closeSession(sessionId);
    clearSession();
    window.location.href = "/";
  };

  const handleNewSession = () => {
    clearSession();
    window.location.href = "/";
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading your order...</p>
        </div>
      </div>
    );
  }

  // ─── Session closed by admin ───
  if (sessionClosed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="bg-pink/10 rounded-2xl p-8 mb-6">
            <p className="font-playfair text-2xl font-bold text-pink mb-2">
              Thank you!
            </p>
            <p className="text-muted text-sm">
              Your table has been closed. We hope you enjoyed your meal at Casa
              Mexicana!
            </p>
          </div>
          <button
            onClick={handleNewSession}
            className="px-8 py-3 bg-pink text-white font-semibold rounded-full hover:bg-pink-dark transition-colors text-sm"
          >
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error || !data) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl font-playfair font-bold text-earth-dark mb-2">
            Session not found
          </p>
          <p className="text-muted text-sm mb-6">
            This session may have expired.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-pink text-white font-semibold rounded-full hover:bg-pink-dark transition-colors text-sm"
          >
            Back to Menu
          </a>
        </div>
      </div>
    );
  }

  const allServed =
    data.orders.length > 0 && data.orders.every((o) => o.status === "served");

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-earth-dark text-white px-4 py-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="font-caveat text-3xl text-pink">Casa</span>
            <span className="font-playfair text-sm uppercase tracking-[0.2em] font-bold">
              Mexicana
            </span>
          </div>
          <p className="text-white/50 text-xs">Order Tracking</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Customer info + total bill */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-xl font-bold text-earth-dark">
                {data.session.customer_name}
              </h2>
              <p className="text-sm text-muted">
                Table {data.session.table_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Total Bill</p>
              <p className="font-playfair text-xl font-bold text-earth-dark">
                <span className="currency-symbol">Rs</span> {data.totalBill}
              </p>
            </div>
          </div>

          {/* Bill requested badge */}
          {billRequested && (
            <div className="mt-3 bg-yellow/10 rounded-xl px-4 py-2 text-center">
              <p className="text-sm font-medium text-yellow">
                Bill has been requested — staff will be with you shortly
              </p>
            </div>
          )}
        </div>

        {/* Each order batch */}
        {data.orders.map((order, batchIndex) => {
          const stepIndex = getStatusIndex(order.status);
          const statusColor =
            statusColors[order.status] || statusColors.pending;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 shadow-sm mb-4"
            >
              {/* Batch header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-playfair text-base font-bold text-earth-dark">
                    Order #{batchIndex + 1}
                  </h3>
                  <p className="text-xs text-muted">
                    {formatTime(order.created_at)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}
                >
                  {statusSteps[stepIndex]?.icon}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-1.5 bg-gray-100 rounded-full mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-pink rounded-full transition-all duration-700"
                  style={{
                    width: `${(stepIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item: OrderItem, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-pink/10 text-pink rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <span className="text-sm text-earth-dark">
                        {item.name}
                        {item.variantLabel && (
                          <span className="text-muted">
                            {" "}
                            ({item.variantLabel})
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-earth-dark font-medium">
                      <span className="currency-symbol">Rs</span>{" "}
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-semibold text-earth-dark text-sm">
                  <span>Subtotal</span>
                  <span>Rs {order.total_price}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Action buttons */}
        <div className="space-y-3 mt-2">
          {/* Add More — only if not all served */}
          {!billRequested && (
            <a
              href="/#menu"
              className="flex items-center justify-center gap-2 w-full py-4 bg-white text-pink font-semibold rounded-2xl shadow-sm hover:bg-pink/5 transition-colors text-sm border-2 border-dashed border-pink/30"
            >
              <Plus size={18} />
              Add More Items
            </a>
          )}

          {/* Request Bill — only if all served and bill not yet requested */}
          {!billRequested && (
            <button
              onClick={handleRequestBill}
              disabled={requestingBill}
              className="flex items-center justify-center gap-2 w-full py-4 bg-yellow text-earth-dark font-semibold rounded-2xl shadow-sm hover:bg-yellow/90 transition-colors text-sm"
            >
              <Receipt size={18} />
              {requestingBill ? "Requesting..." : "Request Bill"}
            </button>
          )}

          {/* Done / Close Table — customer can close themselves */}
          {billRequested && (
            <button
              onClick={handleDone}
              className="flex items-center justify-center gap-2 w-full py-4 bg-earth-dark text-white font-semibold rounded-2xl shadow-sm hover:bg-earth-dark/90 transition-colors text-sm"
            >
              <LogOut size={18} />
              Done — Close Table
            </button>
          )}
        </div>

        {/* Auto refresh note */}
        {!allServed && (
          <p className="text-center text-xs text-muted mt-4 mb-6">
            This page updates automatically
          </p>
        )}
      </div>
    </div>
  );
}
