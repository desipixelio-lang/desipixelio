"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, orderBy, limit, onSnapshot 
} from 'firebase/firestore';
import { 
  LayoutDashboard, Upload, Image as ImageIcon, Users, 
  IndianRupee, TrendingUp, BarChart3, Clock, CheckCircle2,
  MoreVertical, Search, Bell, LogOut, Loader2, Menu, X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [stats, setStats] = useState({
    earnings: 0,
    assets: 0,
    downloads: 0,
    users: 0
  });
  const [recentUploads, setRecentUploads] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetSnap = await getDocs(collection(db, "assets"));
        const userSnap = await getDocs(collection(db, "users"));
        const salesSnap = await getDocs(collection(db, "sales"));
        
        let totalRev = 0;
        salesSnap.forEach(doc => {
          totalRev += Number(doc.data().amount || 0);
        });

        setStats({
          earnings: totalRev,
          assets: assetSnap.size,
          downloads: salesSnap.size,
          users: userSnap.size
        });

        const q = query(collection(db, "assets"), orderBy("createdAt", "desc"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const uploads = snapshot.docs.map(doc => {
            const data = doc.data();
            const dateStr = data.createdAt 
              ? new Date(data.createdAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) 
              : 'Just now';

            return {
              id: doc.id,
              ...data,
              dateString: dateStr
            };
          });
          setRecentUploads(uploads);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statItems = [
    { label: 'Total Earnings', value: `₹${stats.earnings.toLocaleString('en-IN')}`, icon: <IndianRupee className="w-5 h-5" />, trend: 'Live', color: 'text-emerald-500' },
    { label: 'Total Assets', value: stats.assets.toLocaleString(), icon: <ImageIcon className="w-5 h-5" />, trend: 'Stock', color: 'text-amber-500' },
    { label: 'Downloads', value: stats.downloads.toLocaleString(), icon: <TrendingUp className="w-5 h-5" />, trend: 'Sales', color: 'text-blue-500' },
    { label: 'Active Users', value: stats.users.toLocaleString(), icon: <Users className="w-5 h-5" />, trend: 'Clients', color: 'text-purple-500' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">Syncing DesiPixelio Data</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 overflow-x-hidden">
      
      {/* --- SIDEBAR (Desktop & Mobile Drawer) --- */}
      <aside className={`
        fixed h-full w-64 border-r border-gray-900 bg-[#080808] z-[100] transition-transform duration-300
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/20">DP</div>
            <span className="text-sm font-black tracking-widest text-white uppercase">Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 text-amber-500 rounded-xl font-bold text-xs uppercase tracking-widest">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/admin/upload" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">
            <Upload className="w-4 h-4" /> Upload Asset
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">
            <ImageIcon className="w-4 h-4" /> My Gallery
          </Link>
          <Link href="/admin/collections" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">
            <ImageIcon className="w-4 h-4" /> My Collections
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-900">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition font-bold text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 md:p-10 transition-all">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#111] border border-gray-900 rounded-lg lg:hidden">
              <Menu size={20} className="text-amber-500" />
            </button>
            <div>
              <h1 className="text-2xl md:text-4xl font-serif text-white tracking-tight">Executive Control</h1>
              <p className="text-gray-500 text-[10px] md:text-xs mt-1 uppercase tracking-widest font-medium">System Status: <span className="text-emerald-500">Operational</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-initial">
              <Search className="absolute left-4 top-3 w-4 h-4 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-[#111] border border-gray-900 rounded-2xl py-3 pl-12 pr-6 text-xs focus:outline-none focus:border-amber-500 w-full md:w-72 transition-all"
              />
            </div>
            <button className="p-3 bg-[#111] border border-gray-900 rounded-2xl hover:bg-white/5 transition relative group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-white" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#111]"></span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {statItems.map((item, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-gray-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:border-gray-700 transition duration-500 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white/[0.03] ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {item.trend}
                </span>
              </div>
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">{item.label}</p>
              <h3 className="text-2xl md:text-3xl font-serif text-white mt-2">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Uploads Table */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-gray-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8 border-b border-gray-900 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-lg md:text-xl font-serif text-white">Library Feed</h2>
              <Link href="/admin/inventory" className="text-amber-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Full Gallery</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="text-[10px] text-gray-500 uppercase bg-white/[0.02] tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Asset Detail</th>
                    <th className="px-8 py-5 text-center">Price</th>
                    <th className="px-8 py-5 text-center">Tag</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900">
                  {recentUploads.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-800 group-hover:border-amber-500/50 transition-colors flex-shrink-0">
                            <img src={asset.preview_url} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white truncate max-w-[150px] md:max-w-[180px]">{asset.title}</p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">{asset.dateString}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center font-bold text-white text-sm">₹{asset.price}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-medium px-3 py-1 bg-white/5 rounded-lg">
                          {asset.tags?.[0] || 'Visual'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Promo Card */}
            <div className="bg-amber-500 rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 text-black relative overflow-hidden group shadow-2xl shadow-amber-500/10 transition-all hover:-translate-y-1">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4">Scale your<br/>portfolio.</h3>
                <p className="text-[9px] md:text-[10px] font-black mb-8 md:mb-10 opacity-70 uppercase tracking-[0.2em]">Daily Growth Target: 5 Assets</p>
                <Link href="/admin/upload" className="inline-flex items-center gap-3 bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors">
                  <Upload className="w-4 h-4" /> New Asset
                </Link>
              </div>
              <ImageIcon className="absolute -right-8 -bottom-8 w-32 md:w-48 h-32 md:h-48 opacity-[0.07] rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            </div>

            {/* Health Metrics */}
            <div className="bg-[#0a0a0a] border border-gray-900 rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10">
              <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cloud Ecosystem
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest">
                    <span className="text-gray-600 font-medium">Library Saturation</span>
                    <span className="text-amber-500">{Math.min(stats.assets, 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${Math.min(stats.assets, 100)}%` }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-900">
                   <p className="text-[9px] text-gray-600 leading-relaxed font-medium uppercase tracking-widest">
                     Primary Node: <span className="text-white">Firestore-Mumbai-1</span>
                   </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}