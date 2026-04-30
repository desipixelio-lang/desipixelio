"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, orderBy, 
  addDoc, deleteDoc, doc, updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { 
  DollarSign, ImageIcon, Layers, Calendar, 
  ArrowUpRight, Loader2, ArrowLeft, Plus, Edit2, 
  X, Hash, TrendingUp, CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [catList, setCatList] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalAssets: 0,
    totalPortfolioValue: 0,
    sellToday: 0,
    sellMonth: 0,
    sellYear: 0,
    categoryCounts: {} as Record<string, number>
  });

  useEffect(() => {
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startOfToday = new Date(now.setHours(0,0,0,0));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      // 1. Fetch official categories from Firestore
      const catSnap = await getDocs(collection(db, "categories"));
      const officialCats = catSnap.docs.map(d => ({ 
        id: d.id, 
        name: d.data().name 
      }));
      setCatList(officialCats);

      // 2. Fetch all assets to process tags
      const assetSnap = await getDocs(collection(db, "assets"));
      let portfolioVal = 0;
      const allAssets: any[] = [];
      
      assetSnap.forEach(d => {
        const data = d.data();
        portfolioVal += Number(data.price || 0);
        allAssets.push(data);
      });

      // 3. MULTI-TAG COUNTING LOGIC (Tags = Categories)
      const counts: Record<string, number> = {};
      officialCats.forEach(cat => {
        const categoryLabel = cat.name.toLowerCase().trim();
        
        // Count how many images have this category name inside their 'tags' array
        const matches = allAssets.filter(asset => {
          const tagsArray = asset.tags || [];
          return tagsArray.some((t: string) => t.toLowerCase().trim() === categoryLabel);
        });
        
        counts[cat.id] = matches.length;
      });

      // 4. AUTOMATIC INCOME CALCULATION (From 'sales' collection)
      const salesSnap = await getDocs(collection(db, "sales"));
      let sToday = 0, sMonth = 0, sYear = 0;

      salesSnap.forEach(d => {
        const data = d.data();
        if (data.createdAt) {
          const saleDate = data.createdAt.toDate();
          const amount = Number(data.amount || 0);

          if (saleDate >= startOfToday) sToday += amount;
          if (saleDate >= startOfMonth) sMonth += amount;
          if (saleDate >= startOfYear) sYear += amount;
        }
      });

      setStats({
        totalAssets: assetSnap.size,
        totalPortfolioValue: portfolioVal,
        sellToday: sToday,
        sellMonth: sMonth,
        sellYear: sYear,
        categoryCounts: counts
      });
    } catch (e) { 
      console.error("Sync Error:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  const saveCategory = async () => {
    if (!newCatName) return;
    if (editingCatId) {
      await updateDoc(doc(db, "categories", editingCatId), { name: newCatName });
    } else {
      await addDoc(collection(db, "categories"), { name: newCatName, createdAt: serverTimestamp() });
    }
    setNewCatName(""); setEditingCatId(null); setShowCatModal(false);
    fetchEverything();
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Delete this category? Images with this tag will remain, but the category count will vanish.")) {
      await deleteDoc(doc(db, "categories", id));
      fetchEverything();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-amber-500 mr-3" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Analysing Library</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-amber-500 mb-10 text-sm transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
        </Link>

        {/* --- INCOME SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Today's Income" value={`₹${stats.sellToday}`} sub="Live sales data" icon={<TrendingUp color="#10b981" size={20}/>} color="emerald" />
          <StatCard title="Monthly Revenue" value={`₹${stats.sellMonth}`} sub="Current month" icon={<CreditCard color="#3b82f6" size={20}/>} color="blue" />
          <StatCard title="Total Earnings" value={`₹${stats.sellYear}`} sub="Year-to-date" icon={<DollarSign color="#f59e0b" size={20}/>} color="amber" />
        </div>

        {/* --- INVENTORY SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/admin/inventory" className="block">
            <div className="bg-[#0a0a0a] border border-gray-900 p-8 rounded-[2.5rem] hover:border-amber-500 transition-all cursor-pointer group relative overflow-hidden">
              <div className="flex justify-between mb-6">
                <ImageIcon className="text-amber-500" size={20}/>
                <ArrowUpRight size={16} className="text-gray-700 group-hover:text-amber-500" />
              </div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Active Inventory</p>
              <h2 className="text-3xl font-serif mt-2">{stats.totalAssets} Assets</h2>
              <p className="text-gray-700 text-[10px] mt-1 italic font-medium">Manage images & metadata</p>
            </div>
          </Link>

          <div className="bg-[#0a0a0a] border border-gray-900 p-8 rounded-[2.5rem]">
             <Layers className="text-purple-500 mb-6" size={20}/>
             <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Portfolio Value</p>
             <h2 className="text-3xl font-serif mt-2">₹{stats.totalPortfolioValue}</h2>
             <p className="text-gray-700 text-[10px] mt-1 italic font-medium">Sum of all listed prices</p>
          </div>
        </div>

        {/* --- CATEGORY MANAGER (TAGS LOGIC) --- */}
        <div className="bg-[#0a0a0a] border border-gray-900 rounded-[3rem] p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-2xl font-serif">Category & Tag Analytics</h3>
              <p className="text-gray-500 text-xs mt-1">Counts are based on image tags. One image can be in multiple categories.</p>
            </div>
            <button onClick={() => {setEditingCatId(null); setNewCatName(""); setShowCatModal(true);}} className="bg-amber-500 text-black px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-400">
              <Plus size={14} /> Add Global Category
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {catList.map((cat) => {
              const count = stats.categoryCounts[cat.id] || 0;
              const percentage = stats.totalAssets > 0 ? (count / stats.totalAssets) * 100 : 0;
              
              return (
                <div key={cat.id} className="bg-[#111] border border-gray-800 p-6 rounded-3xl group relative transition-all hover:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-200">{cat.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-medium">{count} Tagged Items</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => {setEditingCatId(cat.id); setNewCatName(cat.name); setShowCatModal(true);}} className="text-gray-600 hover:text-amber-500"><Edit2 size={14}/></button>
                      <button onClick={() => deleteCategory(cat.id)} className="text-gray-600 hover:text-red-500"><X size={14}/></button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-900 h-1 rounded-full">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-[#0f0f0f] border border-gray-800 w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-xl font-serif mb-6">{editingCatId ? 'Edit' : 'Create'} Category</h3>
            <input 
              autoFocus 
              className="w-full bg-[#111] border border-gray-800 p-4 rounded-2xl outline-none focus:border-amber-500 mb-6 text-white text-sm" 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)} 
              placeholder="e.g. Jewellery" 
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCatModal(false)} className="flex-1 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
              <button onClick={saveCategory} className="flex-1 bg-amber-500 text-black py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-colors">
                {editingCatId ? 'Update' : 'Add to Cloud'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, sub, icon, color }: any) {
  const colors: any = {
    emerald: 'bg-emerald-500/5 border-emerald-500/10',
    blue: 'bg-blue-500/5 border-blue-500/10',
    amber: 'bg-amber-500/5 border-amber-500/10'
  };
  return (
    <div className={`p-8 rounded-[2.5rem] border ${colors[color] || 'bg-[#0a0a0a] border-gray-900'}`}>
      <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-6">{icon}</div>
      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{title}</p>
      <h2 className="text-3xl font-serif mt-2">{value}</h2>
      <p className="text-gray-400 text-[10px] mt-1 font-medium">{sub}</p>
    </div>
  );
}