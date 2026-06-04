'use client';

import { useState, useEffect } from "react";
import { 
  Users, Plus, X, Search, ShieldCheck, UserCheck, 
  Trash2, Mail, Calendar, Key, AlertCircle, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "admin";
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // New User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("auth_token");
    
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to load database users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user account");
      }

      toast.success(`Account for ${name} created successfully!`);
      setModalOpen(false);
      
      // Reset Form fields
      setName("");
      setEmail("");
      setPassword("");
      
      // Refresh database listings
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    const token = localStorage.getItem("auth_token");

    toast.promise(
      async () => {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete user account");
        }

        // Refresh database listings
        fetchUsers();
      },
      {
        loading: `Deleting ${userName}'s account...`,
        success: `Successfully removed ${userName}'s account!`,
        error: (err) => err.message || "Failed to delete user account"
      }
    );
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header and Add Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#041d3c] ">Portal Team Directory</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Manage operator accounts, roles, and console access logs</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#041d3c] text-white hover:bg-[#062c5b] text-xs font-bold transition-all shadow-[0_4px_12px_rgba(4,29,60,0.15)] hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-sm bg-white border border-[#eef2f8] rounded-2xl shadow-[0_8px_30px_rgba(4,29,60,0.01)] p-1.5 flex items-center shrink-0">
        <Search className="absolute left-4 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search team by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
        />
      </div>

      {/* Users table */}
      <div className="bg-white border border-[#eef2f8] rounded-[24px] shadow-[0_8px_30px_rgba(4,29,60,0.02)] overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-400 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <span>Fetching Supabase user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs font-semibold text-slate-400 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mb-3" />
            <span>No user accounts found matching your query.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Account Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-center">Assigned Role</th>
                  <th className="py-4 px-6">Registration Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#041d3c]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm bg-[#041d3c] text-[#00f0ff]`}>
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-extrabold text-[#041d3c]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono font-medium">{user.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase border bg-blue-50 text-blue-700 border-blue-100">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          Administrator
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString("fi-FI")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#eef2f8] shadow-[0_20px_50px_rgba(4,29,60,0.15)] max-w-md w-full p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm animate-pulse">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#041d3c]">Create Team Account</h3>
                <p className="text-[10px] font-semibold text-slate-400">Provision a secure portal operator account</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pekka Korhonen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. pekka@simplifly.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Access Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>



              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#041d3c] text-white hover:bg-[#062c5b] font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
