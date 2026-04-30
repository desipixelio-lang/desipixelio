"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Camera, Loader2, Wallet, LogOut, ArrowLeft, Download, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [purchasedAssets, setPurchasedAssets] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [topupAmount, setTopupAmount] = useState<string>("100");

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserData(data);
        if (data.purchasedAssets?.length > 0) {
          fetchDownloads(data.purchasedAssets);
        } else {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    }, (err) => {
      console.warn("Listener restricted:", err.message);
      setLoadingData(false);
    });

    return () => unsub();
  }, [user]);

  const fetchDownloads = async (ids: string[]) => {
    try {
      const q = query(collection(db, "assets"), where("id", "in", ids));
      const snap = await getDocs(q);
      setPurchasedAssets(snap.docs.map(d => d.data()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dqgstsvzk/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      await updateDoc(doc(db, "users", user.uid), { profileImage: data.secure_url });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user || loadingData) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  const nameToDisplay = userData?.name || user?.displayName || "Member";

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30">
      <nav className="max-w-7xl mx-auto p-6 md:p-10 flex justify-between items-center">
        <Link href="/" className="group flex items-center gap-3 text-zinc-500 hover:text-white transition">
          <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-amber-500 group-hover:text-black transition">
            <ArrowLeft size={18}/>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gallery</span>
        </Link>
        <button onClick={handleLogout} className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
          Sign Out
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-col items-center mb-16">
          <div className="relative">
            {/* FIXED SIZE CONTAINER: Prevents high-res image from taking over screen */}
            <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border border-amber-500/20 p-2 bg-zinc-900 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img 
                  src={userData?.profileImage || `https://ui-avatars.com/api/?name=${nameToDisplay}&background=111&color=fbbf24`} 
                  className="w-full h-full object-cover" 
                  alt="Profile" 
                />
              </div>
            </div>
            <label className="absolute bottom-1 right-2 bg-amber-500 p-3.5 rounded-full cursor-pointer shadow-2xl hover:bg-white transition text-black">
              {uploading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16}/>}
              <input type="file" className="hidden" onChange={handleImageUpload} disabled={uploading}/>
            </label>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mt-8 tracking-tight text-white">{nameToDisplay}</h1>
          <div className="flex items-center gap-2 mt-3 text-zinc-500">
             <ShieldCheck size={14} className="text-amber-500" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2.5rem]">
            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-10">Wallet Balance</div>
            <div className="text-7xl font-serif mb-10 text-white tracking-tighter">₹{userData?.walletBalance || 0}</div>
            <div className="space-y-4">
              <input type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} className="w-full bg-black/50 border border-white/5 py-4 pl-6 rounded-2xl outline-none focus:border-amber-500/50 transition font-bold" />
              <button className="w-full bg-amber-500 text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Deposit Funds</button>
            </div>
          </section>

          <section className="bg-zinc-900/50 border border-white/5 p-10 rounded-[2.5rem] flex flex-col">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-10">My Library</div>
            {purchasedAssets.length > 0 ? (
              <div className="flex-1 space-y-4 overflow-y-auto max-h-80 pr-2 custom-scrollbar">
                {purchasedAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 group">
                    <img src={asset.preview_url} className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition duration-500" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold truncate max-w-[150px]">{asset.title}</h4>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">ID: {asset.id.slice(-6)}</p>
                    </div>
                    <a href={asset.original_url} target="_blank" className="p-3 bg-zinc-800 rounded-full hover:bg-amber-500 hover:text-black transition">
                      <Download size={16}/>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 border border-dashed border-white/5 rounded-[2rem]">
                 <Zap size={32} className="text-zinc-800 mb-4" />
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Library empty</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}