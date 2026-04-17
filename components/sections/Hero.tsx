"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// Small decorative bubbles — more quantity, bigger sizes
const bubbles = [
  { size: 60, top: "18%", left: "72%", delay: 1.8, duration: 5 },
  { size: 68, top: "18%", right: "62%", delay: 1.5, duration: 5 },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-linear-to-b from-[#0A3A38] to-[#121212]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/40" />
      </div>

      {/* ===== FLOATING FOOD IMAGES — LEFT SIDE (3) ===== */}
      {/* Hidden on mobile, forms the left arch on desktop */}
      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-37.5 h-37.5 top-[25%] left-[12%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 6,
          delay: 0,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg2.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="150px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-30 h-30 top-[50%] left-[8%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 7,
          delay: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg4.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="120px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-33.75 h-33.75 top-[75%] left-[14%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 5.5,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg5.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="135px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* ===== FLOATING FOOD IMAGES — RIGHT SIDE (3) ===== */}
      {/* Hidden on mobile, forms the right arch on desktop */}
      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-37.5 h-37.5 top-[25%] right-[12%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 6.5,
          delay: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg6.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="150px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-30 h-30 top-[50%] right-[8%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 5,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg8.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="120px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 hidden md:block w-33.75 h-33.75 top-[75%] right-[14%]"
        animate={{ opacity: [0.7, 0.9, 0.7], y: [0, -18, 0] }}
        transition={{
          duration: 7,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg9.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="135px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* ===== RESPONSIVE IMAGES (MOBILE & DESKTOP TOP ARCH) ===== */}
      {/* Image A: Mobile Left -> Desktop Top-Left */}
      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 w-17.5 h-17.5 top-[30%] left-[10%] md:w-27.5 md:h-27.5 md:top-[18%] md:left-[30%]"
        animate={{ opacity: [0.6, 0.85, 0.6], y: [0, -12, 0] }}
        transition={{
          duration: 7,
          delay: 0.3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg1.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="(max-width: 768px) 70px, 110px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Image B: Mobile Center -> Desktop Top-Center */}
      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 w-15 h-15 top-[15%] left-[42%] md:w-25 md:h-25 md:top-[15%] md:left-[46%]"
        animate={{ opacity: [0.6, 0.85, 0.6], y: [0, -12, 0] }}
        transition={{
          duration: 6,
          delay: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg3.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="(max-width: 768px) 60px, 100px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Image C: Mobile Right -> Desktop Top-Right */}
      <motion.div
        className="absolute z-5 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 w-17.5 h-17.5 top-[30%] left-[70%] md:w-27.5 md:h-27.5 md:top-[18%] md:left-auto md:right-[30%]"
        animate={{ opacity: [0.6, 0.85, 0.6], y: [0, -12, 0] }}
        transition={{
          duration: 5.5,
          delay: 2.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/images/bg7.avif"
          alt="Casa Mexicana Food"
          fill
          sizes="(max-width: 768px) 70px, 110px"
          className="object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* ===== SMALL FLOATING BUBBLES ===== */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute z-4 rounded-full border border-white/10"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), rgba(255,255,255,0.03))",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ===== CENTER CONTENT ===== */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center mt-auto mb-[15svh] sm:mb-[18svh]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <Image
            src="/images/logo.avif"
            alt="Casa Mexicana"
            width={200}
            height={160}
            className="w-40 h-30 sm:w-50 sm:h-40  mx-auto mb-4"
            priority
          />
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-5xl sm:text-6xl text-pink"
              style={{ fontFamily: "var(--font-breathing)" }}
            >
              Casa
            </span>
            <span
              className="text-2xl sm:text-3xl text-white uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Mexicana
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-caveat text-xl sm:text-2xl text-white/80 mb-10"
        >
          This is how México feels
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#menu"
            className="px-8 py-4 bg-pink text-white font-semibold text-base rounded-full hover:bg-pink-dark transition-all duration-300 hover:shadow-lg hover:shadow-pink/30 min-w-45 text-center"
          >
            View Menu
          </a>
          <button
            onClick={() => document.getElementById("open-reservation")?.click()}
            className="px-8 py-4 border-2 border-white/60 text-white font-semibold text-base rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 min-w-45 text-center"
          >
            Book a Table
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
