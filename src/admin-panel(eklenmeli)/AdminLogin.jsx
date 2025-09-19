import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import Logo from "../assets/Website/Logo.png";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";
  const { session, role } = useAuth() || {};

  useEffect(() => {
    // Already authenticated admin → go to admin panel
    if (session && role === "admin") {
      navigate(redirectTo, { replace: true });
    }
  }, [session, role, redirectTo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!supabase) {
      setError("Sunucu yapılandırma hatası: Supabase env değişkenleri eksik.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      // Navigate immediately; PrivateRoute will allow only admin
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="flex h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat relative"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517586979036-b7d1e86b3345?auto=format&fit=crop&w=1920&q=80')",
  }}
>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative rounded-2xl bg-white/10 dark:bg-white/10 px-8 sm:px-12 py-10 shadow-2xl backdrop-blur-md border border-white/20 max-w-md w-full">
        <div className="text-white">
          {/* Logo + Başlık */}
          <div className="mb-8 flex flex-col items-center text-center">
            {Logo && (
              <img
                src={Logo}
                width={80}
                height={80}
                alt="logo"
                className="mb-3 drop-shadow-md"
              />
            )}
            <h1 className="mb-1 text-2xl font-bold">Admin Girişi</h1>
            <span className="text-gray-200 text-sm">
              Lütfen email ve şifre giriniz
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1 inline-flex items-center gap-2 text-sm text-gray-200">
                <HiMail className="text-primary" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-3xl border-none bg-primary/30 px-6 py-3 text-center placeholder-gray-200 text-white shadow-lg outline-none backdrop-blur-md focus:ring-2 focus:ring-primary"
                autoFocus
                required
              />
            </div>

            {/* Şifre */}
            <div>
              <label className="mb-1 inline-flex items-center gap-2 text-sm text-gray-200">
                <HiLockClosed className="text-primary" />
                Şifre
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full rounded-3xl border-none bg-primary/30 px-6 py-3 text-center placeholder-gray-200 text-white shadow-lg outline-none backdrop-blur-md focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-white/80 hover:text-white"
                >
                  {show ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Hata mesajı */}
            {error && <p className="text-sm text-red-200">{error}</p>}

            {/* Buton */}
            <div className="mt-6 flex justify-center text-lg">
              <button
                type="submit"
                disabled={loading}
                className="rounded-3xl bg-primary/70 hover:bg-primary/90 px-10 py-2 text-white shadow-xl transition-colors duration-300 disabled:opacity-60"
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-between text-xs text-gray-200">
            <a href="/" className="hover:underline">
              Anasayfa
            </a>
            <span>Yetkisiz giriş yasaktır</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
