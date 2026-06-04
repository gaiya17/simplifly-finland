'use client';

import { useState, useEffect } from "react";
import {
  Map, Hotel, Users, Image as ImageIcon, Plus, RefreshCw, Cpu, HardDrive, Database, ArrowRight, FileSpreadsheet, Clock
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  tours: { total: number; active: number };
  resorts: { total: number; active: number };
  users: { total: number };
  blogs: { total: number };
  recentActivity: Array<{
    id: string;
    title: string;
    createdAt: string;
    type: "tour" | "resort";
  }>;
}

const quickActions = [
  { label: "Add Tour Package", icon: Plus, accent: "#1a84ff", bg: "bg-[#eef5ff]", to: "/admin/tours" },
  { label: "Add Resort", icon: Hotel, accent: "#8b5cf6", bg: "bg-[#f5f3ff]", to: "/admin/resorts" },
  { label: "Manage Blog", icon: ImageIcon, accent: "#10b981", bg: "bg-[#edfaf4]", to: "/admin/blogs" },
  { label: "Manage Users", icon: Users, accent: "#D4AF37", bg: "bg-[#fdf8ec]", to: "/admin/users" },
];

export default function AdminDashboardHome() {
  const [greeting, setGreeting] = useState("Good Day");
  const [userName, setUserName] = useState("Admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // System Health Mock
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);

  const fetchStats = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch("/api/admin/dashboard-stats", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const name = localStorage.getItem("user_name");
    if (name) setUserName(name.split(" ")[0]);

    fetchStats();
  }, []);

  const handleRefresh = () => {
    toast.promise(
      fetchStats().then(() => {
        setCpuUsage(Math.floor(Math.random() * 30) + 20);
        setMemoryUsage(Math.floor(Math.random() * 20) + 50);
      }),
      {
        loading: "Syncing database...",
        success: "Dashboard metrics refreshed!",
        error: "Failed to sync data",
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── Greeting Banner ── */}
      <div className="bg-[#041d3c] rounded-[24px] px-8 py-7 flex items-center justify-between relative overflow-hidden shadow-xl">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[radial-gradient(circle,_rgba(26,132,255,0.15)_0%,_transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[200px] bg-[radial-gradient(circle,_rgba(212,175,55,0.06)_0%,_transparent_65%)] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-white/50 text-[13px] font-bold tracking-wide uppercase mb-1.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="text-white font-black text-3xl mb-2">
            {greeting}, <span className="text-[#1a84ff]">{userName}</span> 👋
          </h2>
          <p className="text-white/60 text-[15px] font-medium max-w-lg leading-relaxed">
            Welcome to the Simplifly admin console. Here is the latest overview of your travel catalog and platform metrics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] bg-[#1a84ff] hover:bg-[#1570d8] disabled:opacity-60 text-white text-[13.5px] font-bold transition-all shadow-[0_4px_20px_rgba(26,132,255,0.35)] hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
        </div>
      </div>

      {/* ── Real Data Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Tours */}
        <Link href="/admin/tours" className="bg-white rounded-[24px] p-6 border border-[#e8edf4] hover:shadow-[0_12px_40px_rgba(4,29,60,0.06)] hover:border-[#1a84ff]/20 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-[14px] bg-[#eef5ff] flex items-center justify-center">
              <Map className="w-6 h-6 text-[#1a84ff]" />
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {stats?.tours.active ?? 0} Active
            </div>
          </div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Tour Packages</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-[#041d3c] leading-none">{stats?.tours.total ?? "-"}</p>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#1a84ff] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Resorts */}
        <Link href="/admin/resorts" className="bg-white rounded-[24px] p-6 border border-[#e8edf4] hover:shadow-[0_12px_40px_rgba(4,29,60,0.06)] hover:border-[#8b5cf6]/20 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-[14px] bg-[#f5f3ff] flex items-center justify-center">
              <Hotel className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {stats?.resorts.active ?? 0} Active
            </div>
          </div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Maldives Resorts</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-[#041d3c] leading-none">{stats?.resorts.total ?? "-"}</p>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Blog & Media */}
        <Link href="/admin/blogs" className="bg-white rounded-[24px] p-6 border border-[#e8edf4] hover:shadow-[0_12px_40px_rgba(4,29,60,0.06)] hover:border-[#10b981]/20 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-[14px] bg-[#edfaf4] flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[#10b981]" />
            </div>
          </div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Blog Articles</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-[#041d3c] leading-none">{stats?.blogs.total ?? "-"}</p>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Users */}
        <Link href="/admin/users" className="bg-white rounded-[24px] p-6 border border-[#e8edf4] hover:shadow-[0_12px_40px_rgba(4,29,60,0.06)] hover:border-[#D4AF37]/20 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-[14px] bg-[#fdf8ec] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-1.5">Administrators</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-[#041d3c] leading-none">{stats?.users.total ?? "-"}</p>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* ── Recent Additions Feed ── */}
        <div className="bg-white rounded-[24px] p-7 border border-[#e8edf4] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0f4f9]">
            <div>
              <h3 className="text-[16px] font-black text-[#041d3c]">Recently Added</h3>
              <p className="text-[13px] text-slate-400 font-medium mt-0.5">The newest packages and resorts on your platform</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
              </div>
            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((item) => (
                <Link 
                  href={`/admin/${item.type}s`} 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'tour' ? 'bg-[#eef5ff] text-[#1a84ff]' : 'bg-[#f5f3ff] text-[#8b5cf6]'
                    }`}>
                      {item.type === 'tour' ? <Map className="w-5 h-5" /> : <Hotel className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#041d3c] leading-tight line-clamp-1">{item.title}</p>
                      <p className="text-[12px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                        {item.type} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[14px] font-semibold text-slate-400">No recent items found.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── System Health & Quick Actions ── */}
        <div className="space-y-6">
          
          {/* Quick actions */}
          <div className="bg-white rounded-[24px] p-7 border border-[#e8edf4] shadow-sm">
            <div className="mb-6">
              <h3 className="text-[16px] font-black text-[#041d3c]">Quick Actions</h3>
              <p className="text-[13px] text-slate-400 font-medium mt-0.5">Jump directly to management</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, icon: Icon, accent, bg, to }) => (
                <Link
                  key={label}
                  href={to}
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-[18px] border border-[#e8edf4] hover:border-transparent hover:shadow-[0_8px_24px_rgba(4,29,60,0.06)] transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-[14px] ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <span className="text-[12px] text-center font-bold text-[#041d3c] group-hover:text-[#1a84ff] transition-colors leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-[#041d3c] rounded-[24px] p-7 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_transparent_60%)] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-black text-white">System Status</h3>
                <p className="text-[13px] text-white/50 font-medium mt-0.5">Infrastructure metrics</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[11px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Stable
              </div>
            </div>
            
            <div className="space-y-5">
              {[
                { label: "CPU Usage", value: cpuUsage, icon: Cpu, color: "#1a84ff" },
                { label: "Memory Status", value: memoryUsage, icon: HardDrive, color: "#10b981" },
                { label: "Database Latency", value: 92, icon: Database, color: "#D4AF37", label2: "14ms" },
              ].map(({ label, value, icon: Icon, color, label2 }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[12px] font-bold text-white/80">
                      <Icon className="w-4 h-4" style={{ color }} />
                      {label}
                    </span>
                    <span className="text-[12px] font-bold text-white">{label2 ?? `${value}%`}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${value}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
