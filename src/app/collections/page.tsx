"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, ArrowRight, Loader2, Sparkles, Camera, 
  MapPin, LayoutGrid, User, ShieldCheck, Mail
} from 'lucide-react';

export default function CollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Twitter = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC", 
    coolGray: "#94A3B8" 
  };

  useEffect(() => {
    const q = query(collection(db, "collections"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setCollections(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed h-20 top-0 w-full z-[80] px-6 md:px-12 py-8 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="https://res.cloudinary.com/dcdd8uuyl/image/upload/v1777393585/pixel_logo_png_i1scne.png" alt="DesiPixelio" className="h-18 w-auto transition-transform group-hover:scale-105" />
        </Link>
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
           <Link href="/about" className="hover:text-blue-500 transition">About Us</Link>
          <Link href="/categories" className="hover:text-blue-500 transition">Categories</Link>
          <Link href="/collections" className="text-blue-500 underline underline-offset-8 decoration-2">Collections</Link>
          <Link href="/pricing" className="hover:text-blue-500 transition">Pricing</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/cart" className="hover:text-blue-500 transition"><ShoppingCart size={24} /></Link>
          {user ? (
            <Link href="/profile" className="w-11 h-11 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden shadow-lg">
               <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} className="w-full h-full rounded-full object-cover" alt="" />
            </Link>
          ) : (
            <Link href="/login" style={{ backgroundColor: PALETTE.electric }} className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Login</Link>
          )}
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="pt-56 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Sparkles className="text-amber-500 mx-auto mb-6" size={32} />
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight tracking-tight">Visual <span className="italic text-blue-500">Stories</span></h1>
          <p style={{ color: PALETTE.coolGray }} className="text-[12px] font-black uppercase tracking-[0.5em] max-w-2xl mx-auto leading-relaxed">
            Expertly curated heritage narratives capturing the authentic essence of India.
          </p>
        </div>
      </section>

      {/* --- COLLECTIONS AREA --- */}
      <div style={{ backgroundColor: PALETTE.offWhite }} className="rounded-t-[5rem] text-slate-900 py-24 px-6 md:px-12 shadow-[0_-50px_100px_rgba(0,0,0,0.3)] min-h-[60vh]">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4"><Loader2 className="animate-spin text-blue-600" size={48}/><p className="text-[10px] font-black uppercase text-slate-400">Opening Archives...</p></div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {collections.map((col) => (
                <Link key={col.id} href={`/collections/${col.id}`} className="group relative flex flex-col gap-8">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[3.5rem] bg-slate-200 shadow-xl border border-slate-100">
                    <img src={col.coverImage || "https://images.unsplash.com/photo-1524492459422-869e58310029?q=80&w=1200"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={col.title} />
                    <div className="absolute top-10 left-10 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/50">
                      <Camera size={14} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{col.assetCount || 0} Assets</span>
                    </div>
                  </div>
                  <div className="px-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-4 font-black text-[10px] uppercase tracking-widest"><MapPin size={16} /> {col.location || "Heritage Site"}</div>
                    <h3 className="text-4xl md:text-5xl font-serif mb-6 group-hover:text-blue-600 transition-colors leading-tight">{col.title}</h3>
                    <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xl">{col.description}</p>
                    <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-6 transition-all underline underline-offset-8 decoration-2">Explore Full Series <ArrowRight size={20} /></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 flex flex-col items-center">
              <LayoutGrid size={64} className="text-slate-200 mb-8" /><h3 className="text-3xl font-serif mb-4">No Collections Yet</h3>
              <Link href="/" className="bg-blue-600 text-white px-12 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl">Browse New Assets</Link>
            </div>
          )}
        </div>
      </div>

  
    </div>
  );
}