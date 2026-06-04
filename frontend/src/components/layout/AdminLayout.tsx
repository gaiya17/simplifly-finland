'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Hotel, CalendarCheck, FileText,
  Image, Shield, Bell, Search, LogOut, ChevronDown, User, X, MessageCircle, LayoutTemplate
} from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Homepage Manager", path: "/admin/homepage", icon: LayoutTemplate },
  { name: "Tour Packages", path: "/admin/tours", icon: Map },
  { name: "Maldives Resorts", path: "/admin/resorts", icon: Hotel },
  { name: "Category Manager", path: "/admin/categories", icon: CalendarCheck },
  { name: "Blog Hub", path: "/admin/blogs", icon: FileText },
  { name: "Gallery Manager", path: "/admin/gallery", icon: Image },
  { name: "Chatbot Manager", path: "/admin/chatbot", icon: MessageCircle },
  { name: "User Management", path: "/admin/users", icon: Shield },
];



export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("Simplifly Admin");
  const [adminEmail, setAdminEmail] = useState("admin@simplifly.com");


  useEffect(() => {
    const name = localStorage.getItem("user_name");
    const email = localStorage.getItem("user_email");
    if (name) setAdminName(name);
    if (email) setAdminEmail(email);
  }, []);

  const handleLogout = () => {
    ["auth_token", "user_role", "user_name", "user_email"].forEach(k => localStorage.removeItem(k));
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getPageTitle = () => {
    const p = pathname;
    if (p.includes("/admin/dashboard")) return "Dashboard";
    if (p.includes("/admin/homepage")) return "Homepage Manager";
    if (p.includes("/admin/tours")) return "Tour Packages";
    if (p.includes("/admin/resorts")) return "Maldives Resorts";
    if (p.includes("/admin/categories")) return "Category Manager";
    if (p.includes("/admin/blogs")) return "Blog Hub";
    if (p.includes("/admin/gallery")) return "Gallery Manager";
    if (p.includes("/admin/chatbot")) return "Chatbot Manager";
    if (p.includes("/admin/users")) return "User Management";
    return "Admin Panel";
  };

  const initials = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();


  return (
    <div className="flex h-screen bg-[#f0f4f9] text-[#041d3c] font-poppins antialiased overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className="w-[248px] bg-[#041d3c] flex flex-col shrink-0 h-full overflow-y-auto">

        {/* Brand */}
        <div className="h-[72px] flex items-center px-6 border-b border-white/5 relative z-10">
          <img src="/simplifly-logo.svg" alt="Simplifly Finland" className="h-7 w-auto opacity-90" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-white/25 px-3 mb-3">Main Menu</p>
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = pathname === path || pathname.startsWith(`${path}/`);
            return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[11px] text-[13px] font-semibold transition-all duration-150 group relative ${
                isActive
                  ? "bg-[#1a84ff] text-white shadow-[0_4px_16px_rgba(26,132,255,0.35)]"
                  : "text-white/45 hover:text-white hover:bg-white/6"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 w-[18px] h-[18px] shrink-0 transition-all ${isActive ? "text-white" : "text-white/40 group-hover:text-white"}`} />
              <span>{name}</span>
            </Link>
          )})}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/6 shrink-0 space-y-2">
          {/* System status */}
          <div className="px-3 py-3 rounded-[11px] bg-white/4 border border-white/6">
            <p className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-white/25 mb-2">System Status</p>
            <div className="space-y-1.5">
              {[
                { label: "Database", status: "Stable", color: "bg-emerald-400", text: "text-emerald-400" },
                { label: "Server", status: "Online", color: "bg-[#1a84ff]", text: "text-[#1a84ff]" },
              ].map(({ label, status, color, text }) => (
                <div key={label} className="flex items-center justify-between text-[11px]">
                  <span className="text-white/35 font-medium">{label}</span>
                  <span className={`flex items-center gap-1.5 font-bold ${text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[11px] text-white/35 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 text-[12.5px] font-semibold"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e8edf4] px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_1px_0_rgba(4,29,60,0.06)]">

          {/* Page title */}
          <div>
            <h1 className="text-[15px] font-extrabold text-[#041d3c] ">{getPageTitle()}</h1>
            <p className="text-[11px] text-gray-400 font-medium mt-px">Simplifly Finland — Admin Console</p>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {/* Profile */}
            <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-[11px] border border-[#e8edf4] bg-[#f4f7fb]">
              <div className="w-7 h-7 rounded-[8px] bg-[#041d3c] text-white flex items-center justify-center text-[11px] font-extrabold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-extrabold text-[#041d3c] leading-none">{adminName}</p>
                <p className="text-[9.5px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow p-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
