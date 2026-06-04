'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Authentication failed.");
      }

      const data = await response.json();

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.user.role);
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("user_email", data.user.email);

      toast.success(`Welcome back, ${data.user.name}!`);

      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-poppins overflow-hidden">

      {/* ── LEFT — brand panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1546500840-ae38253aba9b?auto=format&fit=crop&q=80&w=1200"
          alt="Sri Lanka"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#041d3c]/95 via-[#041d3c]/80 to-[#1a84ff]/30" />

        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#1a84ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-16 flex flex-col items-start max-w-[520px]">
          <div className="mb-12 h-12 w-auto relative">
             <img src="/simplifly-logo-new.png" alt="Simplifly Finland" className="h-12 w-auto opacity-90" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/8 text-white/60 text-[10px] font-extrabold tracking-[0.18em] uppercase mb-6">
            ✦ Travel Management Portal
          </div>

          <h1 className="text-white font-black text-[48px] leading-[1.1]  mb-5">
            Manage Your<br />
            <span className="text-[#1a84ff]">Travel</span> Empire
          </h1>
          <p className="text-white/50 text-[15px] leading-[1.8] font-medium mb-12">
            Your central hub for tours, resort packages, bookings, and team management — all in one powerful portal.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {[
              { value: '500+', label: 'Tours Managed' },
              { value: '120+', label: 'Resorts Listed' },
              { value: '3', label: 'Destinations' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-black text-[26px] leading-none">{value}</p>
                <p className="text-white/40 text-[11px] font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 bg-[#f8fafc] relative">

        {/* Subtle bg blob */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(26,132,255,0.06)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,_rgba(4,29,60,0.04)_0%,_transparent_65%)] pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#041d3c] flex items-center justify-center">
                <svg className="w-5 h-5 text-white -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
                </svg>
              </div>
              <span className="text-[#041d3c] font-black text-[18px]">Simplifly Finland</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[#041d3c] font-black text-[30px] leading-tight  mb-1.5">
              Welcome back
            </h2>
            <p className="text-gray-400 text-[14px] font-medium">
              Sign in to access the management portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@simplifly.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-[#041d3c] text-[13.5px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff] focus:ring-2 focus:ring-[#1a84ff]/10 transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-[#e2e8f0] rounded-[14px] text-[#041d3c] text-[13.5px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#1a84ff] focus:ring-2 focus:ring-[#1a84ff]/10 transition-all duration-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#041d3c] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#041d3c] hover:bg-[#1a84ff] disabled:opacity-60 text-white font-extrabold text-[13px] uppercase tracking-wider rounded-[14px] transition-all duration-300 shadow-[0_4px_20px_rgba(4,29,60,0.2)] hover:shadow-[0_8px_28px_rgba(26,132,255,0.3)] mt-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-[11.5px] text-gray-300 font-medium">
            Simplifly Finland Travel Management &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
