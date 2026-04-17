"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  ChefHat,
  CheckCircle,
  Package,
  UtensilsCrossed,
  Star, // Added Star here
} from "lucide-react";
import { getOrderStatus } from "@/lib/orders";
import { useOrderTrack } from "@/store/useOrderTrack";
import ReviewModal from "@/components/ui/ReviewModal"; // Added ReviewModal import

interface OrderItem {
  id: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  customer_name: string;
  table_number: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

const statusSteps = [
  { key: "pending", label: "Order Received", icon: <Clock size={24} /> },
  { key: "preparing", label: "Preparing", icon: <ChefHat size={24} /> },
  { key: "ready", label: "Ready", icon: <CheckCircle size={24} /> },
  { key: "served", label: "Served", icon: <UtensilsCrossed size={24} /> },
];

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const clearSession = useOrderTrack((s) => s.clearSession);

  // Added review modal state
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const data = await getOrderStatus(orderId);
      if (data) {
        setOrder(data as OrderData);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl font-playfair font-bold text-earth-dark mb-2">
            Order not found
          </p>
          <p className="text-muted text-sm mb-6">
            This order may have expired or doesnt exist.
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

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isServed = order.status === "served";

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
        {/* Customer info card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-playfair text-xl font-bold text-earth-dark">
                {order.customer_name}
              </h2>
              <p className="text-sm text-muted">Table {order.table_number}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Ordered at</p>
              <p className="text-sm font-medium text-earth-dark">
                {formatTime(order.created_at)}
              </p>
            </div>
          </div>

          {/* Status progress bar */}
          <div className="flex items-center justify-between mt-6 mb-2">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Icon circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCurrent
                        ? "bg-pink text-white"
                        : isCompleted
                          ? "bg-pink/20 text-pink"
                          : "bg-gray-100 text-gray-300"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {/* Label */}
                  <p
                    className={`text-xs text-center font-medium ${
                      isCurrent
                        ? "text-pink"
                        : isCompleted
                          ? "text-earth-dark"
                          : "text-gray-300"
                    }`}
                  >
                    {step.label}
                  </p>
                  {/* Connecting line */}
                </div>
              );
            })}
          </div>

          {/* Progress line */}
          <div className="relative h-1 bg-gray-100 rounded-full mt-2 mx-6">
            <div
              className="absolute top-0 left-0 h-full bg-pink rounded-full transition-all duration-700"
              style={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-playfair text-lg font-bold text-earth-dark mb-4">
            Your Order
          </h3>
          <div className="space-y-3">
            {order.items.map((item: OrderItem, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-pink/10 text-pink rounded-full flex items-center justify-center text-xs font-bold">
                    {item.quantity}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-earth-dark">
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-xs text-muted">{item.variantLabel}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-earth-dark font-medium">
                  <span className="currency-symbol">Rs</span>{" "}
                  {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
            <span className="font-semibold text-earth-dark">Total</span>
            <span className="font-playfair text-lg font-bold text-earth-dark">
              <span className="currency-symbol">Rs</span> {order.total_price}
            </span>
          </div>
        </div>

        {/* Auto refresh note */}
        {!isServed && (
          <p className="text-center text-xs text-muted mb-6">
            This page updates automatically — no need to refresh
          </p>
        )}

        {/* Served message / New order button with Review block */}
        {isServed ? (
          <div className="text-center">
            <div className="bg-pink/10 rounded-2xl p-6 mb-4">
              <p className="font-playfair text-xl font-bold text-pink mb-1">
                Enjoy your meal!
              </p>
              <p className="text-sm text-muted">Your order has been served.</p>
            </div>

            <button
              onClick={() => setShowReview(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-teal text-white font-semibold rounded-2xl mb-3 hover:opacity-90 transition-opacity text-sm"
            >
              <Star size={16} fill="white" stroke="white" />
              Leave a Review
            </button>

            <a
              href="/"
              onClick={() => clearSession()}
              className="inline-block px-8 py-3 w-full bg-pink text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
            >
              Order More
            </a>

            {showReview && <ReviewModal onClose={() => setShowReview(false)} />}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-muted">
              Order ID: {order.id.slice(0, 8)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
