"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import VegBadge from "@/components/ui/VegBadge";
import TagBadge from "@/components/ui/TagBadge";
import { useCart } from "@/store/useCart";

interface MenuItemCardProps {
  item: MenuItem;
  overrideImage?: string;
}

export default function MenuItemCard({
  item,
  overrideImage,
}: MenuItemCardProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [expanded, setExpanded] = useState(false);

  const handleAdd = (
    e: React.MouseEvent,
    price: number,
    variantLabel?: string,
  ) => {
    e.stopPropagation();
    addItem({ id: item.id, name: item.name, variantLabel, price });
    openCart();
  };

  const displayPrice = item.price ?? item.variants?.[0]?.price ?? 0;
  const imageToShow = overrideImage;

  return (
    <>
      <style>{`
      @keyframes fadeIn {
        from { opacity: 0; filter: blur(8px); }
        to { opacity: 1; filter: blur(0px); }
      }
    `}</style>
      {/* ── CARD ── */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group cursor-pointer flex flex-col h-full"
        style={{
          background: "#FFFEF9",
          borderRadius: "20px",
          border: "1px solid rgba(60,40,20,0.08)",
          boxShadow: "0 2px 16px rgba(60,40,20,0.07)",
          overflow: "hidden",
        }}
        onClick={() => setExpanded(true)}
      >
        {/* ── PORTRAIT IMAGE ── */}
        <div
          className="relative w-full shrink-0 overflow-hidden"
          style={{ aspectRatio: "3/4" }}
        >
          {imageToShow ? (
            <img
              src={imageToShow}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ animation: "fadeIn 0.5s ease-in-out" }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#fdf3e7,#f5dfc0)" }}
            >
              <span
                className="font-caveat text-4xl italic"
                style={{ color: "#3c2810", opacity: 0.35 }}
              >
                Casa
              </span>
            </div>
          )}

          <div
            className="absolute inset-x-0 bottom-0 z-10"
            style={{
              height: "60%",
              background:
                "linear-gradient(to top, rgba(15,7,2,0.88) 0%, rgba(15,7,2,0.4) 50%, transparent 100%)",
            }}
          />

          {item.badge && (
            <div className="absolute top-3 left-3 z-20">
              <TagBadge tag={item.badge} />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5">
            {item.isVeg && (
              <div style={{ marginBottom: "6px" }}>
                <VegBadge />
              </div>
            )}
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#FFFDF5",
                letterSpacing: "0.015em",
                lineHeight: 1.25,
                textShadow: "0 2px 10px rgba(0,0,0,0.65)",
                margin: 0,
              }}
            >
              {item.name}
            </h3>
          </div>
        </div>

        {/* ── CONTENT BELOW IMAGE ── */}
        <div
          className="flex flex-col flex-1"
          style={{ padding: "16px 18px 18px" }}
        >
          <p
            className="line-clamp-2 flex-1"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1rem",
              fontStyle: "italic",
              lineHeight: 1.65,
              color: "#7a5c48",
              letterSpacing: "0.01em",
              marginBottom: "14px",
              marginTop: 0,
            }}
          >
            {item.description}
          </p>

          {item.variants ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              {item.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={(e) => handleAdd(e, v.price, v.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 13px",
                    borderRadius: "10px",
                    border: "1px solid rgba(60,40,20,0.1)",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "rgba(60,40,20,0.04)";
                    el.style.borderColor = "rgba(60,40,20,0.28)";
                    el.style.transform = "translateX(2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "transparent";
                    el.style.borderColor = "rgba(60,40,20,0.1)";
                    el.style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontFamily: "inherit",
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                        color: "#a07858",
                        marginBottom: "2px",
                      }}
                    >
                      {v.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "inherit",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "#2a1a0a",
                        lineHeight: 1,
                      }}
                    >
                      Rs {v.price}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      border: "1.5px solid rgba(60,40,20,0.25)",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.18s ease",
                    }}
                  >
                    <Plus size={12} color="#2a1a0a" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                paddingTop: "10px",
                borderTop: "1px solid rgba(60,40,20,0.09)",
                marginTop: "auto",
              }}
            >
              <button
                onClick={(e) => handleAdd(e, displayPrice)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px 13px",
                  borderRadius: "10px",
                  border: "1px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(60,40,20,0.04)";
                  el.style.borderColor = "rgba(60,40,20,0.15)";
                  el.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "transparent";
                  el.style.transform = "translateX(0)";
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "inherit",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#a07858",
                      marginBottom: "2px",
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontFamily: "inherit",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#2a1a0a",
                      lineHeight: 1,
                    }}
                  >
                    Rs {displayPrice}
                  </div>
                </div>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(60,40,20,0.25)",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.18s ease",
                  }}
                >
                  <Plus size={12} color="#2a1a0a" />
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── EXPANDED MODAL ── */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="fixed inset-0 z-40 backdrop-blur-sm"
              style={{ background: "rgba(15,7,2,0.7)" }}
            />

            {/* ── MOBILE MODAL ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed z-50 flex sm:hidden flex-col overflow-hidden"
              style={{
                top: "50%",
                left: "50%",
                width: "90vw",
                maxHeight: "85vh",
                background: "#FFFEF9",
                borderRadius: "20px",
                boxShadow: "0 24px 80px rgba(15,7,2,0.35)",
              }}
            >
              <button
                onClick={() => setExpanded(false)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  zIndex: 60,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(20,10,5,0.5)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFDF5",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "240px",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {imageToShow ? (
                  <img
                    src={imageToShow}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 30%" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg,#fdf3e7,#f5dfc0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="font-caveat text-4xl"
                      style={{ color: "#3c2810", opacity: 0.25 }}
                    >
                      Casa
                    </span>
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(15,7,2,0.3) 0%, transparent 50%)",
                  }}
                />
              </div>

              <div
                style={{
                  overflowY: "auto",
                  padding: "22px 20px 36px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "3px",
                    borderRadius: "2px",
                    background: "#e2344a",
                    marginBottom: "14px",
                  }}
                />
                {item.isVeg && (
                  <div style={{ marginBottom: "8px" }}>
                    <VegBadge />
                  </div>
                )}
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.45rem",
                    fontWeight: 800,
                    color: "#1a0d05",
                    lineHeight: 1.2,
                    marginBottom: "10px",
                    marginTop: 0,
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    lineHeight: 1.75,
                    color: "#7a5c48",
                    marginBottom: "22px",
                    marginTop: 0,
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    height: "1px",
                    background: "rgba(60,40,20,0.1)",
                    marginBottom: "14px",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#a07858",
                    marginBottom: "10px",
                    marginTop: 0,
                  }}
                >
                  {item.variants ? "Choose your size" : "Add to your order"}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {item.variants ? (
                    item.variants.map((v) => (
                      <button
                        key={v.label}
                        onClick={(e) => {
                          handleAdd(e, v.price, v.label);
                          setExpanded(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "13px 16px",
                          borderRadius: "12px",
                          border: "1px solid rgba(60,40,20,0.12)",
                          background: "transparent",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(60,40,20,0.04)";
                          el.style.borderColor = "rgba(60,40,20,0.28)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "transparent";
                          el.style.borderColor = "rgba(60,40,20,0.12)";
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          <div
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              letterSpacing: "0.13em",
                              textTransform: "uppercase",
                              color: "#a07858",
                              marginBottom: "3px",
                            }}
                          >
                            {v.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "inherit",
                              fontWeight: 600,
                              fontSize: "1rem",
                              color: "#1a0d05",
                            }}
                          >
                            Rs {v.price}
                          </div>
                        </div>
                        <Plus size={14} color="#2a1a0a" strokeWidth={1.75} />
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={(e) => {
                        handleAdd(e, displayPrice);
                        setExpanded(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "15px 18px",
                        borderRadius: "12px",
                        border: "1.5px solid #2a1a0a",
                        background: "transparent",
                        color: "#2a1a0a",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "#2a1a0a";
                        el.style.color = "#FFFDF5";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "transparent";
                        el.style.color = "#2a1a0a";
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        Add to Order
                      </span>
                      <span
                        style={{
                          fontFamily: "inherit",
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                      >
                        Rs {displayPrice}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── DESKTOP MODAL ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.97, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="hidden sm:flex fixed z-50 flex-row overflow-hidden"
              style={{
                top: "50%",
                left: "50%",
                width: "800px",
                maxWidth: "90vw",
                height: "500px",
                maxHeight: "85vh",
                background: "#FFFEF9",
                borderRadius: "24px",
                boxShadow: "0 24px 80px rgba(15,7,2,0.35)",
              }}
            >
              <button
                onClick={() => setExpanded(false)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  zIndex: 60,
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,253,245,0.3)",
                  background: "rgba(20,10,5,0.55)",
                  backdropFilter: "blur(10px)",
                  color: "#FFFDF5",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(20,10,5,0.85)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(20,10,5,0.55)";
                }}
              >
                <X size={16} />
              </button>

              {/* desktop image */}
              <div className="w-1/2 h-full shrink-0 relative overflow-hidden">
                {imageToShow ? (
                  <img
                    src={imageToShow}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#fdf3e7,#f5dfc0)",
                    }}
                  >
                    <span
                      className="font-caveat text-5xl"
                      style={{ color: "#3c2810", opacity: 0.25 }}
                    >
                      Casa
                    </span>
                  </div>
                )}
              </div>

              {/* desktop info */}
              <div
                className="w-1/2 flex flex-col justify-between relative z-10 overflow-y-auto"
                style={{ padding: "44px 36px 36px", background: "#FFFEF9" }}
              >
                <div>
                  <div
                    style={{
                      width: "32px",
                      height: "3px",
                      borderRadius: "2px",
                      background: "#e2344a",
                      marginBottom: "22px",
                    }}
                  />
                  {item.isVeg && (
                    <div style={{ marginBottom: "12px" }}>
                      <VegBadge />
                    </div>
                  )}
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.9rem",
                      fontWeight: 800,
                      color: "#1a0d05",
                      lineHeight: 1.15,
                      marginBottom: "14px",
                      marginTop: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1rem",
                      fontStyle: "italic",
                      lineHeight: 1.8,
                      color: "#7a5c48",
                      letterSpacing: "0.012em",
                      marginBottom: "32px",
                      marginTop: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(60,40,20,0.1)",
                      marginBottom: "18px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#a07858",
                      marginBottom: "10px",
                      marginTop: 0,
                    }}
                  >
                    {item.variants ? "Choose your size" : "Add to your order"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {item.variants ? (
                      item.variants.map((v) => (
                        <button
                          key={v.label}
                          onClick={(e) => {
                            handleAdd(e, v.price, v.label);
                            setExpanded(false);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "15px 18px",
                            borderRadius: "12px",
                            border: "1px solid rgba(60,40,20,0.12)",
                            background: "transparent",
                            cursor: "pointer",
                            transition: "all 0.18s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.borderColor = "rgba(60,40,20,0.35)";
                            el.style.background = "rgba(60,40,20,0.03)";
                            el.style.transform = "translateX(3px)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.borderColor = "rgba(60,40,20,0.12)";
                            el.style.background = "transparent";
                            el.style.transform = "translateX(0)";
                          }}
                        >
                          <div style={{ textAlign: "left" }}>
                            <div
                              style={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#a07858",
                                marginBottom: "4px",
                              }}
                            >
                              {v.label}
                            </div>
                            <div
                              style={{
                                fontFamily: "inherit",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: "#1a0d05",
                                lineHeight: 1,
                              }}
                            >
                              Rs {v.price}
                            </div>
                          </div>
                          <Plus size={15} color="#2a1a0a" strokeWidth={1.75} />
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={(e) => {
                          handleAdd(e, displayPrice);
                          setExpanded(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          borderRadius: "12px",
                          border: "1.5px solid #2a1a0a",
                          background: "transparent",
                          color: "#2a1a0a",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "#2a1a0a";
                          el.style.color = "#FFFDF5";
                          el.style.transform = "scale(1.01)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "transparent";
                          el.style.color = "#2a1a0a";
                          el.style.transform = "scale(1)";
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          Add to Order
                        </span>
                        <span
                          style={{
                            fontFamily: "inherit",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          Rs {displayPrice}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
