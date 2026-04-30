"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { ArrowLeft, Loader2, Download, X, Share2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Brand Palette to match your Concept 1 theme
  const PALETTE = { 
    midnight: "#0F172A", 
    slate: "#1E293B", 
    electric: "#2563EB", 
    amber: "#F59E0B", 
    offWhite: "#F8FAFC" 
  };

  useEffect(() => {
    async function fetchCategoryAssets() {
      if (!slug) return;
      setLoading(true);
      
      try {
        // Based on your screenshot, names are lowercase (e.g., "jewellery")
        // We decode the URL and force it to lowercase to match your DB
        const categoryTagName = decodeURIComponent(String(slug)).toLowerCase();
        
        const q = query(
          collection(db, "assets"),
          where("tags", "array-contains", categoryTagName),
          orderBy("createdAt", "desc"),
          limit(40)
        );
        
        const snap = await getDocs(q);
        const fetchedData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setImages(fetchedData);
      } catch (err) {
        console.error("Firestore Query Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryAssets();
  }, [slug]);

  const optimize = (url: string, w: number) => url?.replace('/upload/', `/upload/c_scale,w_${w},q_auto,f_auto/`);

  return (
    <div style={{ backgroundColor: PALETTE.midnight }} className="min-h-screen text-white font-sans selection:bg-blue-600">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 px-6 py-6 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition">
          <ArrowLeft size={16}/> Back
        </button>
        <div className="text-center">
          <h1 className="text-xl font-serif capitalize tracking-tight">{slug} Collection</h1>
          <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em]">{images.length} Assets Found</p>
        </div>
        <Link href="/" className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black shadow-lg">DP</Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-36 pb-20 px-6 md:px-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-6">
            <Loader2 className="animate-spin text-blue-500" size={40}/>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Library...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-4 space-y-4">
            {images.map(img => (
              <div 
                key={img.id} 
                onClick={() => setSelectedImage(img)} 
                className="relative rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid bg-[#1E293B] border border-white/5 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <img src={optimize(img.preview_url, 400)} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-5">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest truncate mb-1">{img.title}</p>
                   <p className="text-amber-500 text-[11px] font-black">₹{Number(img.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 max-w-xl mx-auto">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500"><X size={32}/></div>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-sm mb-4">No matching assets found</p>
             <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mb-10 leading-loose">Ensure your images in the "assets" collection have the tag "{slug ? String(slug).toLowerCase() : 'unknown'}" in their tags array.</p>
             <Link href="/" className="bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Return Home</Link>
          </div>
        )}
      </main>

      {/* IPHONE PREVIEW OVERLAY */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl transform-gpu" onClick={() => setSelectedImage(null)} />
          <div className="relative w-full max-w-lg transform-gpu animate-in zoom-in-95 duration-300">
            <div style={{ backgroundColor: PALETTE.slate }} className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              <img src={optimize(selectedImage.preview_url, 800)} className="w-full h-auto max-h-[55vh] object-cover" alt="" />
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-serif text-white">{selectedImage.title}</h2>
                    <p className="text-amber-500 text-2xl font-black mt-2">₹{Number(selectedImage.price).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">Tag: {slug}</div>
                </div>
                <div className="flex flex-col gap-3">
                  <button style={{ backgroundColor: PALETTE.electric }} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <Download size={18}/> Buy & Download
                  </button>
                  <button onClick={() => setSelectedImage(null)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}