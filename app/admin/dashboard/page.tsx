"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ChefHat,
  CheckCircle,
  Package,
  LogOut,
  RefreshCw,
  XCircle,
  ImagePlus,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  session_id: string;
  customer_name: string;
  table_number: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
  table_sessions?: {
    bill_requested: boolean;
    status: string;
  };
}

const statusFlow = ["pending", "preparing", "ready", "served"];

const statusStyles: {
  [key: string]: { bg: string; text: string; icon: React.ReactNode };
} = {
  pending: {
    bg: "bg-yellow/10",
    text: "text-yellow",
    icon: <Clock size={14} />,
  },
  preparing: {
    bg: "bg-teal/10",
    text: "text-teal",
    icon: <ChefHat size={14} />,
  },
  ready: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    icon: <CheckCircle size={14} />,
  },
  served: {
    bg: "bg-pink/10",
    text: "text-pink",
    icon: <Package size={14} />,
  },
};

const nextStatusLabel: Record<string, string> = {
  pending: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Served",
};

interface SessionGroup {
  sessionId: string;
  customerName: string;
  tableNumber: string;
  orders: Order[];
  totalBill: number;
  billRequested: boolean;
}

function groupBySession(orders: Order[]) {
  const groups: { [key: string]: SessionGroup } = {};

  orders.forEach((order) => {
    const key = order.session_id || order.id;
    if (!groups[key]) {
      groups[key] = {
        sessionId: key,
        customerName: order.customer_name,
        tableNumber: order.table_number,
        orders: [],
        totalBill: 0,
        billRequested: false,
      };
    }
    groups[key].orders.push(order);
    groups[key].totalBill += order.total_price;
    if (order.table_sessions?.bill_requested) {
      groups[key].billRequested = true;
    }
  });

  return Object.values(groups);
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"live" | "today" | "all">("live");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const router = useRouter();

  const [view, setView] = useState<"orders" | "gallery">("orders");
  const [galleryImages, setGalleryImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchOrders = useCallback(async () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders?filter=${filter}`, {
        headers: { authorization: token },
      });

      if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        router.push("/admin");
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      console.error("Failed to fetch orders");
    }

    setLoading(false);
  }, [filter, router]);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    const name = sessionStorage.getItem("admin_name");
    if (!token) {
      router.push("/admin");
      return;
    }
    setAdminName(name || "Admin");
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders, router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    fetchOrders();
  };

  const [closedTables, setClosedTables] = useState<string[]>([]);
  const closeTable = async (sessionId: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    setClosedTables((prev) => [...prev, sessionId]);

    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ sessionId, closeTable: true }),
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_name");
    router.push("/admin");
  };
  const fetchGallery = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    setGalleryLoading(true);

    try {
      const res = await fetch("/api/admin/gallery", {
        headers: { authorization: token },
      });
      const data = await res.json();
      setGalleryImages(data.images || []);
    } catch {
      console.error("Failed to fetch gallery");
    }
    setGalleryLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token || !e.target.files?.length) return;
    setUploading(true);

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { authorization: token },
        body: formData,
      });
      fetchGallery();
    } catch {
      alert("Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDeleteImage = async (fileName: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    if (!confirm("Delete this photo?")) return;

    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ fileName }),
    });

    fetchGallery();
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sessionGroups = groupBySession(orders);
  const liveCount = orders.filter((o) =>
    ["pending", "preparing", "ready"].includes(o.status),
  ).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-earth-dark text-white px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.webp"
              alt="Casa Mexicana"
              className="w-20 h-15 rounded-full object-cover"
            />

            <span
              className="text-2xl text-pink"
              style={{ fontFamily: "var(--font-breathing)" }}
            >
              Casa
            </span>
            <span
              className="text-lg text-white uppercase tracking-[0.15em] ml-1"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Mexicana
            </span>
            <span className="font-playfair text-sm uppercase tracking-[0.2em] font-bold">
              Kitchen
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden sm:block">
              Hi, {adminName}
            </span>
            <button
              onClick={() => {
                if (view === "gallery") {
                  setView("orders");
                } else {
                  setView("gallery");
                  fetchGallery();
                }
              }}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                view === "gallery"
                  ? "text-pink"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ImagePlus size={16} />
              <span className="hidden sm:inline">Gallery</span>
            </button>
            <button
              onClick={fetchOrders}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ===== GALLERY VIEW ===== */}
        {view === "gallery" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("orders")}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <h2 className="font-playfair text-xl font-bold text-earth-dark">
                  Gallery Photos ({galleryImages.length})
                </h2>
              </div>
              <label className="flex items-center gap-2 px-5 py-2.5 bg-pink text-white text-sm font-semibold rounded-full hover:bg-pink-dark transition-colors cursor-pointer">
                <ImagePlus size={16} />
                {uploading ? "Uploading..." : "Upload Photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {galleryLoading ? (
              <div className="text-center py-20 text-muted">
                Loading photos...
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted">No photos yet</p>
                <p className="text-sm text-muted/60 mt-1">
                  Upload photos to show in the gallery
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div
                    key={img.name}
                    className="relative group rounded-2xl overflow-hidden aspect-square"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(img.name)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex items-center gap-3 mb-6">
              {(["live", "today", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setLoading(true);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-pink text-white"
                      : "bg-white text-body hover:bg-pink/10"
                  }`}
                >
                  {f === "live"
                    ? `Live Orders (${liveCount})`
                    : f === "today"
                      ? "Today"
                      : "All History"}
                </button>
              ))}
            </div>

            {/* Orders grouped by session */}
            {loading ? (
              <div className="text-center py-20 text-muted">
                Loading orders...
              </div>
            ) : sessionGroups.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-muted">No orders found</p>
                <p className="text-sm text-muted/60 mt-1">
                  {filter === "live"
                    ? "All caught up! No active orders."
                    : "No orders in this time range."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionGroups.map((group) => {
                  const allServed = group.orders.every(
                    (o) => o.status === "served",
                  );
                  const isClosed =
                    group.orders.some(
                      (o) => o.table_sessions?.status === "closed",
                    ) || closedTables.includes(group.sessionId);

                  return (
                    <div
                      key={group.sessionId}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* Table header */}
                      <div className="bg-earth-dark/5 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-playfair font-bold text-earth-dark text-lg">
                              Table {group.tableNumber}
                            </h3>
                            <p className="text-xs text-muted">
                              {group.customerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted">Total Bill</p>
                            <p className="font-playfair font-bold text-earth-dark">
                              Rs {group.totalBill}
                            </p>
                          </div>
                        </div>
                        {group.orders.length > 0 && filter === "live" && (
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted">
                              Last order:{" "}
                              {formatTime(
                                group.orders[group.orders.length - 1]
                                  .created_at,
                              )}
                            </p>
                            {(() => {
                              const lastOrder = new Date(
                                group.orders[group.orders.length - 1]
                                  .created_at,
                              );
                              const minutesAgo = Math.floor(
                                (Date.now() - lastOrder.getTime()) / 60000,
                              );
                              if (minutesAgo > 30) {
                                return (
                                  <span className="text-xs text-red-500 font-medium">
                                    {minutesAgo}m ago — possibly idle
                                  </span>
                                );
                              }
                              return (
                                <span className="text-xs text-muted">
                                  {minutesAgo}m ago
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Each order batch */}
                      {group.orders.map((order, i) => {
                        const style =
                          statusStyles[order.status] || statusStyles.pending;
                        const currentIndex = statusFlow.indexOf(order.status);
                        const nextStatus = statusFlow[currentIndex + 1];
                        const nextLabel = nextStatusLabel[order.status];

                        return (
                          <div
                            key={order.id}
                            className="px-5 py-3 border-t border-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted">
                                  Order #{i + 1}
                                </span>
                                <span className="text-xs text-muted">
                                  {formatTime(order.created_at)}
                                </span>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                              >
                                {style.icon}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>

                            <div className="text-sm space-y-1 mb-2">
                              {order.items.map((item: OrderItem, j: number) => (
                                <div
                                  key={j}
                                  className="flex justify-between text-body"
                                >
                                  <span>
                                    {item.quantity}× {item.name}
                                    {item.variantLabel &&
                                      ` (${item.variantLabel})`}
                                  </span>
                                  <span className="text-earth-dark font-medium">
                                    Rs {item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {nextStatus && nextLabel && (
                              <button
                                onClick={() =>
                                  updateStatus(order.id, nextStatus)
                                }
                                className={`w-full py-2.5 rounded-full font-semibold text-xs text-white transition-colors ${
                                  order.status === "pending"
                                    ? "bg-teal hover:bg-teal/90"
                                    : order.status === "preparing"
                                      ? "bg-green-500 hover:bg-green-600"
                                      : "bg-pink hover:bg-pink-dark"
                                }`}
                              >
                                {nextLabel}
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Bill requested alert */}
                      {group.billRequested && !allServed && (
                        <div className="px-5 py-3 bg-yellow/10 border-t border-yellow/20">
                          <p className="text-sm font-semibold text-yellow text-center">
                            Bill Requested — Customer is waiting
                          </p>
                        </div>
                      )}

                      {/* Close Table button — shows when all orders are served */}
                      {/* Close Table button — shows when all orders are served */}
                      {allServed && (
                        <div className="px-5 py-3 border-t border-gray-100">
                          {group.billRequested && !isClosed && (
                            <p className="text-xs text-yellow font-medium text-center mb-2">
                              Bill was requested
                            </p>
                          )}
                          {isClosed ? (
                            <div className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm text-white bg-green-500">
                              <CheckCircle size={16} />
                              Table Closed
                            </div>
                          ) : (
                            <button
                              onClick={() => closeTable(group.sessionId)}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
                            >
                              <XCircle size={16} />
                              Close Table
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
