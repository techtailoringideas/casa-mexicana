"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("admin_token", data.token);
        sessionStorage.setItem("admin_name", data.admin.name);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email or PIN");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    // Updated background to the exact Brand Teal
    <div className="min-h-screen bg-[#0A3A38] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background glow to make it look premium */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-pink/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-pink/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/images/logo.avif"
            alt="Casa Mexicana Logo"
            width={200}
            height={150}
            className="w-28 h-28 object-contain mx-auto mb-4 drop-shadow-2xl"
          />

          <div className="flex items-baseline justify-center gap-1">
            <span
              className="font-caveat text-5xl text-pink"
              style={{ fontFamily: "var(--font-breathing)" }}
            >
              Casa
            </span>
            <span
              className="font-bebas text-2xl text-white uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Mexicana
            </span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
            Kitchen Admin Panel
          </p>
        </div>

        {/* Login form Card */}
        <div className="bg-[#FFFDF5] rounded-[2.5rem] p-8 shadow-2xl shadow-black/40 border border-white/5">
          <h2 className="font-playfair text-2xl font-bold text-[#0A3A38] mb-8 text-center">
            Staff Login
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-2xl p-4 mb-6 text-center border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#0A3A38]/60 mb-2 block font-bold px-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@casamexicana.com"
                className="w-full px-5 py-4 bg-white border border-[#0A3A38]/5 rounded-2xl text-sm text-[#0A3A38] placeholder:text-[#0A3A38]/30 outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink/30 transition-all"
                style={{ fontSize: "16px" }}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#0A3A38]/60 mb-2 block font-bold px-1">
                Security PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                maxLength={6}
                className="w-full px-5 py-4 bg-white border border-[#0A3A38]/5 rounded-2xl text-sm text-[#0A3A38] placeholder:text-[#0A3A38]/30 outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink/30 tracking-[0.5em] text-center transition-all"
                style={{ fontSize: "16px" }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !pin}
              className="w-full py-4 bg-pink text-white font-bold rounded-2xl hover:bg-pink-dark active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg shadow-pink/20 mt-2 text-sm uppercase tracking-widest"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </div>

          <p className="text-[10px] text-[#0A3A38]/40 text-center mt-6 leading-relaxed">
            Authorized staff only. <br /> Access is monitored for security.
          </p>
        </div>
      </div>
    </div>
  );
}
