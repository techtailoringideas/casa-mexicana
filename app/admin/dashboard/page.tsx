"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  Star,
  ThumbsUp,
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
interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  status: "pending" | "approved";
  created_at: string;
  featured: boolean;
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

  const [view, setView] = useState<"orders" | "gallery" | "reviews">("orders");
  const [galleryImages, setGalleryImages] = useState<
    { name: string; url: string }[]
  >([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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
  const fetchReviews = async () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { authorization: token },
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      console.error("Failed to fetch reviews");
    }
    setReviewsLoading(false);
  };

  const approveReview = async (id: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ id }),
    });
    fetchReviews();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)),
    );
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ id, action: "toggleFeatured" }),
    });
  };

  const deleteReview = async (id: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    if (!confirm("Delete this review?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", authorization: token },
      body: JSON.stringify({ id }),
    });
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
    setGalleryImages((prev) => prev.filter((img) => img.name !== fileName));
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
      timeZone: "Asia/Kathmandu",
    });
  };

  const sessionGroups = groupBySession(orders);
  const liveCount = orders.filter((o) =>
    ["pending", "preparing", "ready"].includes(o.status),
  ).length;

  return (
    <div className="min-h-screen bg-[#0A3A38]">
      {/* Top bar - Optimized for Visual Smoothness */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A3A38]/80 backdrop-blur-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between h-16">
            {/* Brand Identity */}
            <div
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => setView("orders")}
            >
              <div className="relative">
                <Image
                  src="/images/logo.avif"
                  alt="Casa Mexicana"
                  width={200}
                  height={150}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-pink/20 group-hover:ring-pink/50 transition-all"
                />
                <div className="absolute inset-0 rounded-full bg-pink/5 animate-pulse"></div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                <span
                  className="text-2xl text-pink leading-none"
                  style={{ fontFamily: "var(--font-breathing)" }}
                >
                  Casa
                </span>
                <span
                  className="text-sm sm:text-lg text-white uppercase tracking-[0.2em] font-medium opacity-90"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Mexicana{" "}
                  <span className="text-teal font-bold text-xs sm:text-sm ml-0.5">
                    Kitchen
                  </span>
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2 sm:gap-6">
              {/* Reviews Toggle */}
              <button
                onClick={() => {
                  if (view === "reviews") {
                    setView("orders");
                  } else {
                    setView("reviews");
                    fetchReviews();
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  view === "reviews"
                    ? "bg-teal text-white shadow-lg shadow-teal/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Star size={18} />
                <span className="hidden md:inline">
                  Reviews
                  {reviews.filter((r) => r.status === "pending").length > 0 && (
                    <span className="ml-1.5 bg-pink text-white text-xs px-1.5 py-0.5 rounded-full">
                      {reviews.filter((r) => r.status === "pending").length}
                    </span>
                  )}
                </span>
              </button>
              {/* Gallery Toggle */}

              <button
                onClick={() => {
                  if (view === "gallery") {
                    setView("orders");
                  } else {
                    setView("gallery");
                    fetchGallery();
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  view === "gallery"
                    ? "bg-pink text-white shadow-lg shadow-pink/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <ImagePlus
                  size={18}
                  className={view === "gallery" ? "animate-bounce" : ""}
                />
                <span className="hidden md:inline">Manage Gallery</span>
              </button>

              {/* Status Info & Actions */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-6">
                <button
                  onClick={fetchOrders}
                  className="p-2 text-white/60 hover:text-teal hover:bg-teal/10 rounded-full transition-all active:rotate-180 duration-500"
                  title="Refresh Orders"
                >
                  <RefreshCw size={20} />
                </button>

                <div className="h-8 w-px bg-white/10 hidden sm:block mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-semibold"
                >
                  <LogOut
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {view === "reviews" ? (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-earth-dark/5">
            {/* Header */}
            <div className="bg-earth-dark/5 px-6 sm:px-8 py-5 border-b border-earth-dark/10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView("orders")}
                  className="w-10 h-10 rounded-full bg-white border border-earth-dark/10 flex items-center justify-center text-earth-dark hover:bg-earth-dark hover:text-white transition-all duration-300"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="font-playfair text-2xl font-bold text-earth-dark">
                    Reviews
                  </h2>
                  <p className="text-sm text-muted">
                    {reviews.filter((r) => r.status === "pending").length}{" "}
                    pending ·{" "}
                    {reviews.filter((r) => r.status === "approved").length}{" "}
                    approved
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 py-8">
              {reviewsLoading ? (
                <div className="text-center py-20 text-muted">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal mb-4" />
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-earth-dark/2 rounded-2xl border-2 border-dashed border-earth-dark/10">
                  <Star className="w-12 h-12 text-teal/40 mx-auto mb-4" />
                  <p className="text-lg text-earth-dark font-medium">
                    No reviews yet
                  </p>
                  <p className="text-sm text-muted mt-1">
                    Reviews submitted by customers will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pending first */}
                  {["pending", "approved"].map((statusGroup) => {
                    const filtered = reviews.filter(
                      (r) => r.status === statusGroup,
                    );
                    if (filtered.length === 0) return null;
                    return (
                      <div key={statusGroup}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                          {statusGroup === "pending"
                            ? "⏳ Pending Approval"
                            : "✅ Approved"}
                        </p>
                        <div className="space-y-3">
                          {filtered.map((review) => (
                            <div
                              key={review.id}
                              className={`rounded-2xl p-5 border transition-all ${
                                review.status === "pending"
                                  ? "bg-yellow/5 border-yellow/20"
                                  : "bg-teal/5 border-teal/20"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  {/* Stars */}
                                  <div className="flex gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        fill={
                                          i < review.rating ? "#F59E0B" : "none"
                                        }
                                        stroke={
                                          i < review.rating
                                            ? "#F59E0B"
                                            : "#D1D5DB"
                                        }
                                      />
                                    ))}
                                  </div>
                                  {/* Quote */}
                                  <p className="text-sm text-earth-dark italic mb-3">
                                    &ldquo;{review.quote}&rdquo;
                                  </p>
                                  {/* Author */}
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                                      {review.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-earth-dark">
                                        {review.name}
                                      </p>
                                      <p className="text-xs text-muted">
                                        {review.location} ·{" "}
                                        {new Date(
                                          new Date(
                                            review.created_at,
                                          ).getTime() +
                                            (5 * 60 + 45) * 60000,
                                        ).toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                  {review.status === "pending" && (
                                    <button
                                      onClick={() => approveReview(review.id)}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                      <ThumbsUp size={13} />
                                      Approve
                                    </button>
                                  )}
                                  {review.status === "approved" && (
                                    <button
                                      onClick={() =>
                                        toggleFeatured(
                                          review.id,
                                          review.featured,
                                        )
                                      }
                                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                                        review.featured
                                          ? "bg-yellow text-earth-dark hover:opacity-80"
                                          : "bg-yellow/10 text-yellow hover:bg-yellow/20"
                                      }`}
                                    >
                                      <Star
                                        size={13}
                                        fill={
                                          review.featured
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                      {review.featured ? "Featured" : "Feature"}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteReview(review.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-500 text-xs font-semibold rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                  >
                                    <Trash2 size={13} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : view === "gallery" ? (
          <div className="bg-white rounded-3xl shadow-lg shadow-earth-dark/5 overflow-hidden border border-earth-dark/5">
            {/* 1. Balanced Header & Toolbar Section */}
            <div className="bg-earth-dark/5 px-6 sm:px-8 py-5 border-b border-earth-dark/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setView("orders")}
                    className="w-10 h-10 rounded-full bg-white border border-earth-dark/10 flex items-center justify-center text-earth-dark hover:bg-earth-dark hover:text-white hover:border-earth-dark transition-all duration-300"
                    title="Back to Orders"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-earth-dark">
                      Manage Gallery
                    </h2>
                    <p className="text-sm text-muted">
                      {galleryImages.length}{" "}
                      {galleryImages.length === 1 ? "photo" : "photos"}{" "}
                      currently showing
                    </p>
                  </div>
                </div>

                {/* Main Action - Integrated & Balanced */}
                <label className="flex items-center gap-2.5 px-6 py-3 bg-pink text-white text-sm font-semibold rounded-full hover:bg-pink-dark transition-all shadow-md shadow-pink/10 cursor-pointer whitespace-nowrap">
                  <ImagePlus
                    size={18}
                    className={uploading ? "animate-spin" : ""}
                  />
                  {uploading ? "Uploading..." : "Add New Photos"}
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
            </div>

            {/* 2. Photo Content Area */}
            <div className="px-6 sm:px-8 py-8">
              {galleryLoading ? (
                <div className="text-center py-20 text-muted">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal mb-4" />
                  Refreshing library...
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-20 bg-earth-dark/2 rounded-2xl border-2 border-dashed border-earth-dark/10">
                  <ChefHat className="w-12 h-12 text-teal/40 mx-auto mb-4" />
                  <p className="text-lg text-earth-dark font-medium">
                    Your gallery is empty
                  </p>
                  <p className="text-sm text-muted/80 mt-1 max-w-sm mx-auto">
                    Add high-quality photos of your best dishes.{" "}
                    <span className="text-pink font-semibold">Tip:</span> Aim
                    for a mix of close-ups and table settings.
                  </p>
                </div>
              ) : (
                /* 3. Refined Photo Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {galleryImages.map((img) => (
                    <div
                      key={img.name}
                      className="relative group rounded-2xl overflow-hidden aspect-square bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 border border-earth-dark/5 transition-all duration-300"
                    >
                      <Image
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Subtle Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Professional Management Actions */}
                      <button
                        onClick={() => handleDeleteImage(img.name)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                        title="Delete photo"
                        aria-label="Delete photo"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Subtle File Name (Hidden until hover) */}
                      <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 truncate opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 font-medium">
                        {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                      className={`bg-[#FFFDF5] rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${
                        isClosed
                          ? "opacity-50 grayscale-[0.4] scale-[0.98]"
                          : "opacity-100"
                      }`}
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
                                  <span className="text-body">
                                    <span className="font-bold text-[#0A3A38]">
                                      {item.quantity}×
                                    </span>{" "}
                                    {item.name}
                                    {item.variantLabel && (
                                      <span className="text-muted text-xs">
                                        {" "}
                                        ({item.variantLabel})
                                      </span>
                                    )}
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
