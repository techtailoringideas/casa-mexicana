"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-earth-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* 1. The Image on top */}
          <img
            src="/images/logo.webp"
            alt="Casa Mexicana Logo"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg shadow-black/20"
          />

          {/* 2. Casa Mexicana Text right below the image */}
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="font-caveat text-4xl text-pink">Casa</span>
            <span className="font-playfair text-lg text-white uppercase tracking-[0.2em] font-bold">
              Mexicana
            </span>
          </div>

          {/* 3. Subtitle */}
          <p className="text-white/50 text-sm">Kitchen Admin Panel</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="font-playfair text-xl font-bold text-earth-dark mb-6 text-center">
            Staff Login
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@casamexicana.com"
                className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-pink/30"
                style={{ fontSize: "16px" }}
              />
            </div>

            <div>
              <label className="text-xs text-muted mb-1 block font-medium">
                PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                maxLength={6}
                className="w-full px-4 py-3 bg-cream rounded-xl text-sm text-earth-dark placeholder:text-muted/50 outline-none focus:ring-2 focus:ring-pink/30 tracking-[0.3em] text-center"
                style={{ fontSize: "16px" }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !pin}
              className="w-full py-3.5 bg-pink text-white font-semibold rounded-full hover:bg-pink-dark transition-colors disabled:opacity-40 text-sm"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-xs text-muted text-center mt-4">
            Authorized staff only. Contact management for access.
          </p>
        </div>
      </div>
    </div>
  );
}
