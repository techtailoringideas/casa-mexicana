"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/useCart";
import { siteConfig } from "@/data/site";

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Reviews", href: "#reviews" },
  {
    label: "Find Us",
    href: siteConfig.googleMapsUrl,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.openCart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-earth-dark/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-baseline gap-1 group">
            <span className="font-caveat text-2xl text-pink font-semibold group-hover:text-pink-dark transition-colors">
              Casa
            </span>
            <span className="font-playfair text-sm text-white uppercase tracking-[0.2em] font-bold">
              Mexicana
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-sm text-white/80 hover:text-pink transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#menu"
              className="px-5 py-2.5 bg-pink text-white text-sm font-semibold rounded-full hover:bg-pink-dark transition-colors"
            >
              Order Now
            </a>
            <button
              onClick={openCart}
              className="relative text-white/80 hover:text-pink transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/80 hover:text-pink transition-colors font-medium"
            >
              Find Us
            </a>
            <button
              onClick={openCart}
              className="relative text-white/80 hover:text-pink transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-white p-1"
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-earth-dark z-50 md:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="font-caveat text-xl text-pink">Casa</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-white/60 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={() => setDrawerOpen(false)}
                    className="text-white/80 hover:text-pink py-3 text-lg font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#menu"
                  onClick={() => setDrawerOpen(false)}
                  className="mt-4 px-6 py-3 bg-pink text-white text-center font-semibold rounded-full hover:bg-pink-dark transition-colors"
                >
                  Order Now
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
