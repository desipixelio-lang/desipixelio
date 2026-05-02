"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, collection, query, where, increment } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Download, ShieldCheck, Zap, Crown, Mail, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

// Define the structure to fix red underlines (TypeScript)
interface PurchasedAsset {
  id: string;
  assetId: string;
  url: string; // This should be the original/high-res URL from your DB
  title: string;
  userId: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [purchasedAssets, setPurchasedAssets] = useState<PurchasedAsset[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [topupAmount, setTopupAmount] = useState<string>("100");
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // 1. Listen to User Profile
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    // 2. Fetch Purchases from Firebase
    const q = query(collection(db, "purchases"), where("userId", "==", user.uid));
    const unsubPurchases = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      } as PurchasedAsset));
      setPurchasedAssets(docs);
      setLoadingData(false);
    }, (err) => {
      console.error("Purchase listener error:", err);
      setLoadingData(false);
    });

    return () => { unsub(); unsubPurchases(); };
  }, [user]);

  // UNIQUE LIBRARY LOGIC: Removes duplicate visual entries
  const uniqueLibrary = Array.from(
    purchasedAssets
      .filter((asset: PurchasedAsset) => userData?.purchasedAssets?.includes(asset.assetId))
      .reduce((map, asset: PurchasedAsset) => {
        if (!map.has(asset.assetId)) {
          map.set(asset.assetId, asset);
        }
        return map;
      }, new Map<string, PurchasedAsset>())
      .values()
  );

  /**
   * handleDownload
   * Triggers a browser download using the High-Quality URL from Firebase.
   */
  const handleDownload = async (url: string, title: string) => {
    try {
      // Fetch the actual file data (original quality)
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Forces the filename for the high-res download
      link.download = `${title.replace(/\s+/g, '_')}_Original.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to window.open:", error);
      // Fallback if fetch is blocked by CORS
      window.open(url, '_blank');
    }
  };

  const handleTopUp = async () => {
    const amount = parseInt(topupAmount);
    
    if (isNaN(amount) || amount < 50) {
        alert("Minimum wallet top-up amount is ₹50");
        return;
    }

    setIsTopUpLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "DesiPixelio",
        description: "Add funds to wallet",
        order_id: order.id,
        handler: async function (response: any) {
          await updateDoc(doc(db, "users", user!.uid), {
            walletBalance: increment(amount)
          });
          alert(`₹${amount} added successfully!`);
        },
        prefill: { email: user?.email || "" },
        theme: { color: "#fbbf24" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  if (!user || loadingData) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <main className="max-w-5xl mx-auto pt-32 md:pt-40">
        
        {/* USER PROFILE HEADER */}
        <section className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem]">
            <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500/30 p-1">
                    <img 
                        src={userData?.profileImage || `https://ui-avatars.com/api/?name=${userData?.name || "User"}`} 
                        className="w-full h-full rounded-full object-cover" 
                        alt="Profile" 
                    />
                </div>
                <div className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full border-4 border-[#050505]">
                    <ShieldCheck size={16} className="text-white" />
                </div>
            </div>
            <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl md:text-4xl font-serif mb-2">{userData?.name || "Member Name"}</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 text-zinc-500 text-sm font-medium">
                    <span className="flex items-center gap-2">
                        <Mail size={14} className="text-blue-500" /> {userData?.email}
                    </span>
                    <span className="hidden md:block text-zinc-800">|</span>
                    <span className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Verified Member
                    </span>
                </div>
            </div>
            <button 
                onClick={() => logout()} 
                className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
                Logout
            </button>
        </section>

        {/* STATS WIDGETS */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Plan</p>
                    <h3 className="text-xl md:text-2xl font-serif text-white">{userData?.currentPlan || "No Active Plan"}</h3>
                </div>
                <Crown className="text-amber-500 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between">
                <div>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Download Credits</p>
                    <h3 className="text-3xl md:text-4xl font-serif text-amber-500">{userData?.downloadBalance || 0} <span className="text-xs text-zinc-500">Left</span></h3>
                </div>
                <Zap className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* WALLET SECTION */}
          <section className="bg-zinc-900/50 border border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
            <p className="text-amber-500 text-[10px] font-black uppercase mb-4 tracking-widest">Wallet Balance</p>
            <h2 className="text-5xl md:text-6xl font-serif mb-8">₹{userData?.walletBalance || 0}</h2>
            <div className="flex flex-col gap-3">
               <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="number" 
                    value={topupAmount} 
                    placeholder="Min ₹50"
                    onChange={(e) => setTopupAmount(e.target.value)} 
                    className="bg-black border border-white/10 p-4 rounded-xl w-full focus:outline-none focus:border-amber-500 transition text-sm"
                  />
                  <button onClick={handleTopUp} disabled={isTopUpLoading} className="bg-amber-500 text-black px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all active:scale-95">
                    {isTopUpLoading ? <Loader2 className="animate-spin mx-auto"/> : "Topup"}
                  </button>
               </div>
               <p className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                  <AlertCircle size={12} /> Min top-up: ₹50
               </p>
            </div>
          </section>

          {/* LIBRARY SECTION */}
          <section className="bg-zinc-900/50 border border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
            <p className="text-zinc-500 text-[10px] font-black uppercase mb-6 tracking-widest">My Library ({uniqueLibrary.length})</p>
            {uniqueLibrary.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {uniqueLibrary.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    {/* Visual Preview */}
                    <img src={asset.url} className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0" alt="" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm truncate pr-2">{asset.title}</h4>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Original Quality Available</p>
                    </div>
                    
                    <button 
                      onClick={() => handleDownload(asset.url, asset.title)}
                      className="p-3 bg-zinc-800 rounded-xl hover:bg-amber-500 hover:text-black transition-all flex-shrink-0 active:scale-90"
                      title="Download Original Quality"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-50">
                <Zap size={32} className="mx-auto text-zinc-800 mb-4" />
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Library empty</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}