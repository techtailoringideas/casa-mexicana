"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/store/useCart";
import { useOrderTrack } from "@/store/useOrderTrack";
import {
  createSession,
  submitOrder,
  isSessionActive,
  getActiveSessionForTable,
} from "@/lib/orders";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    clearCart,
  } = useCart();

  const {
    sessionId,
    customerName: savedName,
    tableNumber: savedTable,
    setSession,
    clearSession,
  } = useOrderTrack();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWaiterView, setShowWaiterView] = useState(false);
  const [tableConflict, setTableConflict] = useState<{
    id: string;
    customer_name: string;
  } | null>(null);

  const displayName = sessionId ? savedName || "" : customerName;
  const displayTable = sessionId ? savedTable || "" : tableNumber;

  const handlePlaceOrder = async () => {
    const name = sessionId ? savedName || "" : customerName;
    const table = sessionId ? savedTable || "" : tableNumber;

    if (!name.trim() || !table.trim()) return;
    setIsSubmitting(true);
    setTableConflict(null);

    let currentSessionId = sessionId;

    // If we have a session, verify it's still active
    if (currentSessionId) {
      const active = await isSessionActive(currentSessionId);
      if (!active) {
        // Session was closed by admin — clear and start fresh
        clearSession();
        currentSessionId = null;
      }
    }

    // If no active session, check if table already has one
    if (!currentSessionId) {
      const existing = await getActiveSessionForTable(table);
      if (existing) {
        // Table already has an active session from someone else
        setTableConflict(existing);
        setIsSubmitting(false);
        return;
      }

      // Create new session
      const session = await createSession(name, table);
      if (!session) {
        alert("Failed to create session. Please try again.");
        setIsSubmitting(false);
        return;
      }
      currentSessionId = session.id;
      setSession(currentSessionId, name, table);
    }

    // Submit the order
    const result = await submitOrder({
      session_id: currentSessionId,
      customer_name: name,
      table_number: table,
      items: items,
      total_price: total(),
    });

    if (result) {
      clearCart();
      closeCart();
      window.location.href = `/session/${currentSessionId}`;
    } else {
      // Session might have been closed between check and submit
      clearSession();
      alert("Session expired. Please try again.");
    }

    setIsSubmitting(false);
  };

  // Join existing table session
  const handleJoinSession = () => {
    if (tableConflict) {
      setSession(
        tableConflict.id,
        tableConflict.customer_name,
        sessionId ? savedTable || "" : tableNumber,
      );
      setTableConflict(null);
      handlePlaceOrder();
    }
  };

  // Start fresh for this table (ignore existing session)
  const handleStartFresh = () => {
    setTableConflict(null);
    // Customer chose not to join — they need to use a different table number
  };

  const handleCallWaiter = () => {
    setShowWaiterView(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Cart panel */}
          <motion.div
            className="fixed z-50 bg-white
              bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl
              lg:top-0 lg:right-0 lg:left-auto lg:bottom-0 lg:w-[420px] lg:max-h-full lg:rounded-t-none lg:rounded-l-3xl
              flex flex-col overflow-hidden"
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%", x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-playfair text-xl font-bold text-earth-dark">
                {sessionId ? "Add to Order" : "Your Order"}
                {itemCount() > 0 && (
                  <span className="text-pink text-base ml-1">
                    ({itemCount()})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Table conflict warning */}
            {tableConflict && (
              <div className="bg-yellow/10 p-4 mx-5 mt-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-yellow flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-earth-dark">
                      Table {displayTable} already has an active order
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {tableConflict.customer_name} is currently ordering at
                      this table.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleJoinSession}
                        className="px-4 py-2 bg-teal text-white text-xs font-semibold rounded-full hover:bg-teal/90 transition-colors"
                      >
                        Join Their Order
                      </button>
                      <button
                        onClick={handleStartFresh}
                        className="px-4 py-2 bg-gray-200 text-earth-dark text-xs font-semibold rounded-full hover:bg-gray-300 transition-colors"
                      >
                        Use Different Table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Call Waiter View */}
            {showWaiterView ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mb-6">
                  <Phone size={32} className="text-teal" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-earth-dark mb-2">
                  Waiter Notified
                </h3>
                <p className="text-muted mb-2">Table {displayTable || "—"}</p>
                <div className="bg-cream rounded-xl p-4 w-full mt-4 text-left text-sm">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantLabel}`}
                      className="flex justify-between py-1"
                    >
                      <span className="text-body">
                        {item.name}
                        {item.variantLabel && ` (${item.variantLabel})`} ×{" "}
                        {item.quantity}
                      </span>
                      <span className="text-earth-dark font-medium">
                        Rs {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold text-earth-dark">
                    <span>Total</span>
                    <span>Rs {total()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted mt-4">
                  Show this screen to your waiter
                </p>
                <button
                  onClick={() => {
                    setShowWaiterView(false);
                    clearCart();
                    closeCart();
                  }}
                  className="mt-6 text-pink text-sm font-medium hover:underline"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Active session banner */}
                {sessionId && items.length > 0 && (
                  <div className="bg-teal/10 px-5 py-3 text-sm text-teal font-medium">
                    Adding to {savedName}&apos;s order — Table {savedTable}
                  </div>
                )}

                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-5">
                  {items.length === 0 ? (
                    <div className="text-center py-12 text-muted">
                      <p className="text-lg mb-1">Your cart is empty</p>
                      <p className="text-sm">Browse the menu and add items</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => {
                        const key = `${item.id}-${item.variantLabel || ""}`;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 bg-cream rounded-xl p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-earth-dark truncate">
                                {item.name}
                                {item.variantLabel && (
                                  <span className="text-muted font-normal">
                                    {" "}
                                    ({item.variantLabel})
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-body mt-0.5">
                                <span className="currency-symbol">Rs</span>{" "}
                                {item.price * item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variantLabel,
                                    item.quantity - 1,
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-pink transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-medium w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.variantLabel,
                                    item.quantity + 1,
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-pink transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  removeItem(item.id, item.variantLabel)
                                }
                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-1"
                                aria-label="Remove item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-gray-100 p-5 space-y-4">
                    {/* Customer info — only show if no active session */}
                    {!sessionId && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted mb-1 block">
                            Your Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-pink/30"
                            style={{ fontSize: "16px" }}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted mb-1 block">
                            Table Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 7"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full px-3 py-2.5 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/60 outline-none focus:ring-2 focus:ring-pink/30"
                            style={{ fontSize: "16px" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">
                        {sessionId ? "This order" : "Total"}
                      </span>
                      <span className="text-xl font-playfair font-bold text-earth-dark">
                        <span className="currency-symbol">Rs</span> {total()}
                      </span>
                    </div>

                    {/* Order buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={handlePlaceOrder}
                        disabled={
                          (!sessionId &&
                            (!customerName.trim() || !tableNumber.trim())) ||
                          isSubmitting
                        }
                        className="col-span-2 flex items-center justify-center gap-2 py-3.5 bg-pink text-white font-semibold rounded-full hover:bg-pink-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Placing...
                          </>
                        ) : sessionId ? (
                          "Add to Order"
                        ) : (
                          "Place Order"
                        )}
                      </button>
                      <button
                        onClick={handleCallWaiter}
                        className="flex items-center justify-center gap-2 py-3.5 bg-earth-dark text-white font-semibold rounded-full hover:bg-earth-dark/90 transition-colors text-sm"
                      >
                        <Phone size={16} />
                        Waiter
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
